var code_pages = new Array();
var current_page= -1;
var selected_element;//selected file or folder in the file tree
function loadDirs(dir){
	//var path  = "./static/"+dir;
	var path  = dir;
	console.log("loading projects from "+dir);

	$.post("/file_panel", path,
	function(data, status){
		display_file_tree(data);
	});
}
function file_tree_click_event(itm, file){
	if(!file){//if folder, expand
		itm.click(function(event){
			event.stopPropagation();
			if(selected_element == itm){
				if($(this).children().length <= 0)
					expand_project(this);
				else{
					close_expansion(this);
				}
			}
			else{
				if(selected_element != undefined)
					$(selected_element).removeClass("selected");
				selected_element = itm;
				$(selected_element).addClass("selected");
			}
		});
		itm.on('contextmenu', function(e) {
			e.stopPropagation();
			e.preventDefault();
			show_context_menu();
		});
	}else{//if file, open
		itm.click(function(event){
			event.stopPropagation();
			//open file
			if(selected_element == itm){
				open_file(this);
			}
			else{
				if(selected_element != undefined)
					$(selected_element).removeClass("selected");
				selected_element = itm;
				$(selected_element).addClass("selected");
			}
		});
		itm.on('contextmenu', function(e) {
			e.stopPropagation();
			e.preventDefault();
			show_context_menu();
		});
	}
}
function show_context_menu(){//display conetext menue at the position of the element
	var el = selected_element;
	console.log($(el).offset());
	var cMenu = $("#context_menu");
	cMenu.css({
		top : $(el).offset().top,
		left : $(el).offset().left,
	});
	cMenu.show();
}

function display_file_tree(response){
	console.log(response);
	var obj = $.parseJSON(response);
	for(var i =1; i < obj.length;i++){
		//gotta find if its file or folder
		var itm;
		if(obj[i].lastIndexOf(".") == -1){//folder{}
			itm = $("<li id='"+obj[i]+"' class = 'child folder'>"+ obj[i] +"</li>");
			file_tree_click_event(itm, false);
		}
		else{//file
			obj[i] = obj[i].replace(".", "_");
			itm = $("<li id='"+obj[i]+"' class = 'child file'>"+ obj[i] +"</li>");
			file_tree_click_event(itm, true);
		}
		
		$("#"+obj[0]).append(itm);
	}
}
function close_expansion(that){
	$(that).children('.child').remove();
}
function expand_project(that){
	console.log("clicked on "+$(that).attr("id"));
	var path = full_path(that);
	loadDirs(path);
}
function open_file(that){
	var id = 't_'+$(that).text();
	id = id.replace(".", "_");
	console.log("is "+$("#"+id).length );
	console.log("id "+id );
	if($("#"+id).length > 0){//exists
		//display the code page
	}
	else{
		var element = $('<span id="'+id+'" class = "name_tab">'+$(that).text()+'</span>');

		element.click(function(event){
				event.stopPropagation();
				show_code(this);
			});
		$("#file_name_nav").append(element);
		if(current_page != -1)
			code_pages[current_page+1] = myCodeMirror.getValue();
		current_page = code_pages.length;
		code_pages[code_pages.length] = id;
		var path = full_path(that);
		console.log("file_path " + path);

		$.get("/file", {"file_path" : path})
		.done(function(data){
			myCodeMirror.setValue(data);
			code_pages[code_pages.length] = data;
		});
	}
}
function show_code(that){
	code_pages[current_page+1] = myCodeMirror.getValue();
	for(var i =0; i < code_pages.length; i+=2){
		if($(that).attr("id") == code_pages[i]){
			myCodeMirror.setValue(code_pages[i+1]);
			current_page = i;
			break;
		}
	}
}
function full_path(element){
	var id= $(element).attr('id');
	var path ="";
	var count =0;
	while( id != "projects"){
		id= $(element).attr('id');
		path=id+"/"+path;
		element = $(element).parent();
		count++;
		if(count >10) return;
	}
	return path;
}
function save_file(){
	//current_page
	var id = code_pages[current_page];
	id=id.replace('t_','');
	//id=id.replace('_','.');
	console.log(id);
	var path = full_path($("#"+id));
	console.log("path "+path);
	code_pages[current_page+1] = myCodeMirror.getValue();
	var code = code_pages[current_page+1];
	$.post("/save_code",{
		"file_path": path,
		"code" : code
	}, function(data, status){
		console.log(data);
	});
}
function new_file(path){

}
function new_folder(path){

}
function rename(new_name){
	if(new_name == undefined){
		//display a pop up with a textbox 
		$("#input_box").show();
		$("#input_field").focus();
	}
	else{
		new_name = new_name.replace(".","_");
		$("#input_box").hide();
		var old_path = full_path(selected_element);
		$(selected_element).text(new_name);
		$(selected_element).attr("id", new_name);
		var new_path = full_path(selected_element);
		$.post("/rename",
		{
			"file_path": old_path,
			"new_file_path": new_path
		}
		, function(data, status){
			console.log(data);
		});
	}

}
var ctrl = false;
window.addEventListener('keydown',function(event){
	if(event.which == 17 && !ctrl){//ctrl
		ctrl = true;
		
	}
	else if (event.which == 83){//s
		if(ctrl){
			event.preventDefault();
			save_file();
		}
	}
},false);
window.addEventListener('keyup',function(event){
	
	if(event.which == 17){//ctrl
		ctrl = false;
	}
	if(event.which == 13){//enter
		//if(currently typing in a ne name)
		if($("#input_box").css('display') != 'none' ){//if its visible
			var new_name = $("#input_field").val();
			console.log("new name is "+new_name);
			$("#input_field").val("");
			rename(new_name);
		}
	}
},false);
window.addEventListener("click", function(){
	if($("#context_menu").css('display') != 'none' )//if its visible
		$("#context_menu").hide();
});