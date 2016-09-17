var jdata ;
function creat_this_shit(){
	//request the selected file intel
	var path = get_current_code_path();
	$.get("/get_intel", {"file_path" : path}, function(data){
		jdata  = JSON.parse(data)
		console.log(jdata);
	});
}
//this needs to be done recursively
function get_scope_data(){
	var lineNr = myCodeMirror.getCursor().line + 1;
	console.log(lineNr);
	$("#intel_box").empty();
	get_scope(jdata, lineNr);
	display_UI();
}
/*
	get(obj){
		for
			log(obj[i][0])
			if obj.len >2
				get(obj[i][2])
	} is how it should roughly work
*/
//[i][0] = name		[i][1] = start line 	[i][2] = content 	[i][3] = end
function get_scope(obj, lineNr){
	for(var i =0; i < obj.length; i++){
		if(obj[i].length < 3){
			//var
			if(lineNr >= obj[i][1]){
				console.log("r        "+obj[i][0]);
				add_intel_option(obj[i][0]);
			}
		}
		else{
			//func
			console.log("r        "+obj[i][0]);
			add_intel_option(obj[i][0]);
			if(lineNr >= obj[i][1] &&  lineNr <= obj[i][3]){//your inside this scope
				get_scope(obj[i][2],lineNr);
			}
		}
	}
}
function add_intel_option(str){
	var opt = $("<p class='intel_opt'>"+str+"</p>");
	$("#intel_box").append(opt);
	opt.click(function(){
		insert_opt(this);
	});
}
function insert_opt(that){
	var word = $(that).text();
	console.log(word);
	 var cm = $('.CodeMirror')[0].CodeMirror;
    var doc = cm.getDoc();
    var cursor = doc.getCursor(); // gets the line number in the cursor position
    var line = doc.getLine(cursor.line); // get the line contents
    var pos = { // create a new object to avoid mutation of the original selection
        line: cursor.line,
        ch: line.length - 1 // set the character position to the end of the line
    }
    doc.replaceRange(word, pos); // adds a new line
    $("#intel_box").hide();
}
function display_UI(){
	//at  position
	//show an absolutelly positioned box
	//much like the context menu for the project view
	var line_h = myCodeMirror.defaultTextHeight();
	var char_w = myCodeMirror.defaultCharWidth();
	console.log("height "+line_h);
	console.log("width "+char_w);
	var pos_x = (myCodeMirror.getCursor().ch+1) * char_w + $(".CodeMirror").offset().left;
	var pos_y = (myCodeMirror.getCursor().line+1) * line_h + $(".CodeMirror").offset().top;
	console.log("posx = "+pos_x +"  y "+pos_y);
	$("#intel_box").css({
		"left":pos_x,
		"top": pos_y
	});
	$("#intel_box").show();
}