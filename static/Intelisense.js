var jdata ;
var selected_opt = 0;
var typing_str="";
function creat_this_shit(){
	//request the selected file intel
	var path = get_current_code_path();
	$.get("/get_intel", {"file_path" : path}, function(data){
		jdata  = JSON.parse(data);
		console.log(jdata);
	});
}
function update_intel(data){
	jdata  = JSON.parse(data);
}
//this needs to be done recursively
function get_scope_data(){
	var lineNr = myCodeMirror.getCursor().line + 1;
	console.log(lineNr);
	$("#intel_box").empty();
	//get the current word
	var word = myCodeMirror.findWordAt(myCodeMirror.getCursor()); 
	var inptStr = myCodeMirror.getRange(word.anchor, word.head);
	inptStr = inptStr.replace(/ /g,'');
	inptStr = inptStr.replace("\t",'');
	console.log("inptStr ="+inptStr+".");
	typing_str = inptStr;
	get_scope(jdata, lineNr, inptStr);
	display_UI();
}
/*
	get(obj){
		for
			log(obj[i][0])
			if obj[i][2].len >2
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

				if(typing_str.length > 0 ){
					if(check_match(typing_str, obj[i][0]))//check is the ame starts with inptStr 
						add_intel_option(obj[i][0]);
				}
				else//if your not typing, print everything available
					add_intel_option(obj[i][0]);
			}
		}
		else{
			//func
			console.log("r        "+obj[i][0]);
			if(typing_str.length > 0 ){
				if(check_match(typing_str, obj[i][0]))//check is the ame starts with inptStr 
					add_intel_option(obj[i][0]);
			}
			else//if your not typing, print everything available
				add_intel_option(obj[i][0]);
			if(lineNr >= obj[i][1] &&  lineNr <= obj[i][3]){//your inside this scope
				get_scope(obj[i][2],lineNr);
			}
		}
	}
}

function check_match(str, word){
	var i =0;
	var match = false;
	this.check= function(i){//this is a pretty cool way to do recursiveness
		if(str[i] == word[i]){
			//console.log("str i "+str[i]+"  word i "+word[i]);
			match = true;
			i++;
			if(i < str.length){
				
				check(i);
			}
		}
		else{
			//console.log("i "+i);
			match = false;
			return;
		}
	}
	this.check(i);
	return match;
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
    //to
    var pos = { // create a new object to avoid mutation of the original selection
        line: cursor.line,
        ch: line.length - typing_str.length +word.length // set the character position to the end of the line
    }
    //from
    var pos2 = { // create a new object to avoid mutation of the original selection
        line: cursor.line,
        ch: line.length -typing_str.length  // set the character position to the end of the line
    }
    doc.replaceRange(word, pos2, pos); 
    close_intel_box();
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
	selected_opt = 0;
	move_selection(0);
	$("#intel_box").show();
	intel_active = true;//var from setup
}
function close_intel_box(){
	$("#intel_box").hide();
	intel_active = false;//var from setup
}
function move_selection(dir){
	if(dir < 0 && selected_opt <1) return;
	var sweet_children = $("#intel_box").find("p.intel_opt");
	if(dir>0 && selected_opt >= sweet_children.length) return;
	$(sweet_children[selected_opt]).removeClass("selected");
	selected_opt+=dir;
	$(sweet_children[selected_opt]).addClass("selected");
}
function on_enter(){
	var sweet_children = $("#intel_box").find("p.intel_opt");
	insert_opt(sweet_children[selected_opt]);
}