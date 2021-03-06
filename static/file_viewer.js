var code_pages = new Array();//this right here stores ID and VALUE, so [1] is the text from the file, [0] is the name of the file,
//to traverse this array itterate in 2 rather than 1
var current_page= -1;//current index in the code_pages array
var selected_element;//selected file or folder in the file tree
function loadDirs(dir){//aka load projects into project view
	//var path  = "./static/"+dir;
	var path  = dir;
	console.log("loading projects from "+dir);

	$.post("/file_panel", path,
	function(data, status){
		display_file_tree(data);
	});
}
//as you can see there is alot of logic and callbacks on each item in the project view
function file_tree_click_event(itm, file){
	if(!file){//if folder, expand
		itm.click(function(event){
			event.stopPropagation();
			if(selected_element == itm){//if its selected
				if($(this).children().length <= 0)
					expand_project(this);
				else{
					close_expansion(this);
				}
			}
			else{//if its not make it selected
				if(selected_element != undefined)
					$(selected_element).removeClass("selected");
				selected_element = itm;
				$(selected_element).addClass("selected");
			}
		});
		itm.on('contextmenu', function(e) {//when right clicked
			e.stopPropagation();//dont click on parents or children
			e.preventDefault();
			show_context_menu();
		});
	}else{//if file, open
		itm.click(function(event){
			event.stopPropagation();
			//open file
			if(selected_element == itm){//if selected
				open_file(this);
			}
			else{//select if not selected
				if(selected_element != undefined)
					$(selected_element).removeClass("selected");
				selected_element = itm;
				$(selected_element).addClass("selected");
			}
		});
		itm.on('contextmenu', function(e) {//when right clicked
			e.stopPropagation();
			e.preventDefault();
			show_context_menu();
		});
	}
}
function show_context_menu(){//display conetext menue at the position of the element
	var el = selected_element;
	var cMenu = $("#context_menu");
	//position it to where the word you clicked on is
	cMenu.css({
		top : $(el).offset().top,
		left : $(el).offset().left,
	});

	//file or folder ?
	if((el).hasClass("file")){
		//file, dont display any new file or new folder option
		$("#new_file").hide();
		$("#new_folder").hide();
	}else if ((el).hasClass("folder")){
		//folder display new file and new folder option
		$("#new_file").show();
		$("#new_folder").show();
	}
	cMenu.show();
}

function display_file_tree(response){
	var obj = $.parseJSON(response);
	for(var i =1; i < obj.length;i++){
		//gotta find if its file or folder
		var itm;
		//if the name of item does not contain a "." then it is a file
		if(obj[i].lastIndexOf(".") == -1){//folder{}
			var id = obj[0]+obj[i];
			itm = $("<li id='"+id+"' class = 'child folder'>"+ obj[i] +"</li>");
			file_tree_click_event(itm, false);
		}
		//if the name contains a "." (.js) then is a file
		else{//file
			obj[i] = obj[i].replace(".", "_");
			var id = obj[0]+obj[i];
			itm = $("<li id='"+id+"' class = 'child file'>"+ obj[i] +"</li>");
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
	//create a tab 
	//tab id is prefixed with t_ so its easy to find it 
	var id = 't_'+$(that).attr("id");
	id = id.replace(".", "_");//html doesnt do well with "."
	console.log("id "+id );
	if($("#"+id).length > 0){//exists, already opened
		//display the code page
		show_code($("#"+id));
	}
	else{//if its not already opened
		//create tab element
		var element = $('<span id="'+id+'" class = "name_tab">'+$(that).text()+'</span>');

		element.click(function(event){
			event.stopPropagation();
			show_code(this);

		});
		//middle mouse to close tab
		element.on("mousedown", function(e) {
			if( e.which == 2 ) {
				e.preventDefault();
				close_tab(this);
			}
		});
		//display tab
		$("#file_name_nav").append(element);
		if(current_page != -1)//store the text so its easy to show and hide when working with it 
			code_pages[current_page+1] = myCodeMirror.getValue();
		$("#"+code_pages[current_page]).removeClass("selected");
		current_page = code_pages.length;

		code_pages[code_pages.length] = id;//not gonna lie this is unexpected
		//looks like i only store the ID of the code ?
		//i get it now, i remember my madness, the code is stored in pairs, ID and then VALUE
		var path = full_path(that);
		console.log("file_path " + path);

		$.get("/file", {"file_path" : path})
		.done(function(data){
			myCodeMirror.setValue(data);
			code_pages[code_pages.length] = data;
			$("#"+code_pages[current_page]).addClass("selected");
		});
	}
}
function show_code(that){
	code_pages[current_page+1] = myCodeMirror.getValue();//text
	$("#"+code_pages[current_page]).removeClass("selected");//name
	for(var i =0; i < code_pages.length; i+=2){
		if($(that).attr("id") == code_pages[i]){
			myCodeMirror.setValue(code_pages[i+1]);
			current_page = i;
			$("#"+code_pages[current_page]).addClass("selected");
			break;
		}
	}
}
//the file path of the currently opened code tab
function get_current_code_path(){
	var id = $("#file_name_nav").find("span.selected").attr("id");
	id = id.replace("t_", "");
	return full_path($("#"+id));
}
function close_tab(that){
	//get id
	var id = $(that).attr("id");
	//find it in array
	var index = -1;
	for(var i =0; i < code_pages.length; i+=2){
		if(id == code_pages[i]){
			index = i;
			break;
		}
	}
	code_pages.splice(index, 2);
	$(that).remove();
}
function full_path(element){
	var id= $(element).text()
	var path ="";
	var count =0;
	while( $(element).attr("id") != "projects"){//begin the traversion of the file tree untill you are at the parent element
		//apperantly .text() returns all of the text including the text of the illegitemate children. what a good feature, 10/10 would use this feature again, everybody needs to know what your childrens text is 
		id= $(element).clone()	//clone the element
					.children()	//select all the children
					.remove()	//remove all the children
					.end()	//again go back to selected element
					.text();	//get the text of element
		console.log(id);
		path=id+"/"+path;
		element = $(element).parent();
		count++;
		if(count >10) return;
	}
	path = "projects/"+path;
	console.log("path "+path);
	return path;
}
function save_file(){
	//current_page
	var id = code_pages[current_page];
	id=id.replace('t_','');
	console.log("saving "+id);
	var path = full_path($("#"+id));
	console.log("path "+path);
	code_pages[current_page+1] = myCodeMirror.getValue();
	var code = code_pages[current_page+1];
	$.post("/save_code",{
		"file_path": path,
		"code" : code
	}, function(data, status){
		update_intel(data);
	});
}
function new_file(path){
	var name = "newFile.txt";
	itm = $("<li id='"+name+"' class = 'child file'>"+ name +"</li>");
	file_tree_click_event(itm, true);
	$(selected_element).append(itm);
	$.post("/new_file",{
		"file_path":full_path(itm)
	},function(){
		itm.click();
		rename();
	});
}
function new_folder(path){
	var name = "newFolder";
	itm = $("<li id='"+name+"' class = 'child folder'>"+ name +"</li>");
	file_tree_click_event(itm, false);
	$(selected_element).append(itm);
	$.post("/new_folder",{
		"file_path":full_path(itm)
	},function(){
		itm.click();
		rename();
	});
	
}
function rename(new_name){
	//easiest way to rename is just to open a pop up 
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
		$(selected_element).attr("id", "projects"+new_name);
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
function remove(){
	var file="no";
	console.log(selected_element);
	if( $(selected_element).hasClass("file") )file = "yes";
	var path = full_path(selected_element);
	$(selected_element).remove();
	$.post("/remove",
		{
			"file_path": path,
			"type" : file
		}
		, function(data, status){
			console.log(data);
		});
}
function new_project(){
	//send out a signal to create on the server
	var name = "newProject";
	$.post("/new_project",{"name":name}, function(data){
		console.log(data);
		if(data == "dobra"){
			itm = $("<li id='projects"+name+"' class = 'child folder'>"+ name +"</li>");
			file_tree_click_event(itm, false);
			$("#projects").append(itm);
			itm.click();
			rename();
		}
	});
}
function edit_mode(){
	//not yet
}

var ctrl = false;
window.addEventListener('keydown',function(event){
	if(ctrl && event.which == 32){
		get_scope_data();
	}
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
		if($("#intel_box").css('display') != 'none' ){//if its visible
			on_enter();//from intellisense.js
		}
	}
},false);
window.addEventListener("click", function(){
	if($("#context_menu").css('display') != 'none' )//if its visible
		$("#context_menu").hide();
	if($("#intel_box").css('display') != 'none' )//if its visible
		close_intel_box();
});
/*
	so that i dont forget
		check if newFolder or newFile already exists, if it does count how many and create it with a +1 (newFolder4)
		not create then rename
		midle mouse close file tabs
		f2 to rename files
		opening up folders in different projects with same subfolders causes strange behaviour
*/
// i will get back to this, using the argument passing in the url
//something like /run_project?project_name = "name"?project_path = "path"
function run_mode(){
	//get the path to the project
	var pat_arr = full_path(selected_element).split("/");
	var path = pat_arr[0]+"/"+pat_arr[1]+"/index.html";
	console.log(path);
	//window.location.href = "localhost:5555/run_project";
	/*$.get("/run_project", {"project_path" : path }, function(data){
		//window.location.href = data;
		document.write(data);
	});*/
	//send it to the server which will then self.render the index file
	var name = pat_arr[1];
	var btn = $("<input type='submit' value='Submit' >")
	var form = $("<form enctype='multipart/form-data' action='/run_project' method='post' >"+
		"<input type='text' name='project_path' value='"+path+"'>"+
		"<input type='text' name='project_name' value='"+name+"'>"+
		"<input id='submit' type='submit' value='Submit' ></form>");
	$("#code_window").append(form);
	$("#submit").click();


}