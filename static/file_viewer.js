function loadDirs(dir){
	var path  = "./static/"+dir;
	console.log("loading projects from "+dir);

	$.post("/file_panel", path,
	function(data, status){
		display(data);
	});
}
function display(response){
	console.log(response);
	var obj = $.parseJSON(response);
	for(var i =1; i < obj.length;i++){
		//gotta find if its file or folder
		var itm;
		if(obj[i].lastIndexOf(".") == -1){//folder{}
			itm = $("<li id='"+obj[i]+"' class = 'child folder'>"+ obj[i] +"</li>");
			itm.click(function(event){
				event.stopPropagation();
				if($(this).children().length <= 0)
					expand_project(this);
				else{
					close_expansion(this);
				}
			});
		}
		else{//file
			itm = $("<li id='"+obj[i]+"' class = 'child file'>"+ obj[i] +"</li>");
			itm.click(function(event){
				event.stopPropagation();
				//open file later
			});
		}
		
		$("#"+obj[0]).append(itm);
	}
}
function close_expansion(that){
	$(that).children('.child').remove();
}
function expand_project(that){
	console.log("clicked on "+$(that).attr("id"));
	//.parent().text+that.text()
	//.parent().text()+.parent().parent().text()+that.text()
	var id= $(that).text();
	var path ="";
	var count =0;
	while( id != "projects"){
		id= $(that).attr('id');
		path=id+"/"+path;
		that = $(that).parent();
		count++;
		if(count >10) return;
	}
	loadDirs(path);
}