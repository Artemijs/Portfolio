/*
Created by: Artemijs Poznaks
Created on: 20/08/2016
Last Edit: 29/08/2016


	This file is responsible for accepting user input string from Input.js. It then proceses the string and does an appropriate action.
Each character is attached to the html page as a <p id = "c1" class = 'c'> D </p>. 

	* The space is drawn as a "_" with 0 opacity because it is the most convinient way of getting the "|" to align, the same as with other characters.
	* There is an uneditable space as character at index 0, this is so that the "|" starts in its proper position
		the space is uneditable through the editor, because of that you will often see magic +/-1 in for loops
*/

/*
KNOWN BUGS :
	- shift selecting and then going back does not deselect letters
	- shift and type auto selects the letter that you type
	- shift click looks like it selects the right thing but then doesnt deselect properly
*/
/*
TO DO LIST:
	CTRL+Z
	HOME button bringing the index to start of line
	END button bringing the index to end of line
	MOUSE click and drag to select (just like shift select)
*/



var m_text = new Array();

//index of which line and which position to insert a new character
var charIndex = 0;
var lineIndex = 0;

var time =0;//used for blinking the "|" 
var m_blink_time =35;

var m_s_sline =0; //start selection line index
var m_s_schar =0;//start selection character index
//use current character index and current line index for end selection
//and color all the characters as selected in between
var selecting = false;

/*
	creates the first character of the first line
	begins the update loop
	draws "|"
*/
function onLoad(){
	$("#l"+lineIndex).append("<p id='c0' class='c space'>_</p>");
	update();
	drawIdex();
}
/*
	Analyzes user input and selects appropriate action
*/
function processChar(t){
	//shift select
	if( m_s_schar != 0 && !selecting){
		highlightSelection(false);
	}
	//erase a char
	if(t == "backspace"){
		backspace();
		drawIdex();
	}
	//tab
	else if (t == "/t"){
		tab();
	}
	//space
	else if(t == " ")t = ' ';
	
	if(t == "/n"){
		newLine();
	}
	else if(t != "/n" && t !="/t" && t != "backspace"){
		//if its just a number or a letter
		m_text[lineIndex]+=t;
		//display it
		printCharacter(t);
		//move the index forward
		charIndex++;
		//draw the "|"
		drawIdex();
		
	}
	//i re add  the callback to all characters because im not very smart
	$(".c").click(function(){
		//position the "|" where clicked
		var id = $(this).attr("id");
		charIndex = parseInt(id.substr(1,id.length));
		id = $(this).parent().attr("id");
		lineIndex = parseInt(id.substr(1,id.length));
		drawIdex();
	});
}
function tab(){
	m_text[lineIndex]+="\t";

	addChar(" ");
	console.log("tab");
	addChar(" ");
	console.log("tab");
	addChar(" ");
	console.log("tab");
	addChar(" ");
	console.log("tab");
}
/*
	moves the "|" up or down
	prevents from going to far up or too far down
	automatically deselects any selected text
*/
function move_stickV(dir){
	if( m_s_schar != 0 && !selecting){//deselect selected text
		highlightSelection(false);
	}
	time = m_blink_time;
	if(dir < 0 && lineIndex ==0) return;//do nothing if very first char of first line
	var all_lines = $(".l");
	if(dir > 0 && lineIndex >= all_lines.length-1) return;//do nothing if last char of last line

	var nextLineLen = all_lines.eq(lineIndex+dir).find(".c").length;
	console.log(nextLineLen);
	if (nextLineLen <= charIndex) charIndex = nextLineLen-1;
	lineIndex+=dir;
	drawIdex();
}
/*
	same as move_stickV but horizontally
*/
function move_stickH(dir){
	if( m_s_schar != 0 && !selecting){
		highlightSelection(false);
	}
	time = m_blink_time;
	var lineCount = $(".l").length;
	if(dir < 0 && charIndex ==0){
		if(lineIndex <=0)return;
		else{
			charIndex= $("#l"+(lineIndex-1)).find(".c").length;
			lineIndex--;
		}
	}
	var l = $("#l"+lineIndex);
	var all_chars = l.find(".c");
	if(dir > 0 && charIndex >= all_chars.length-1){
		
		if(lineIndex >= lineCount-1)return;
		else{
			charIndex=-1;
			lineIndex++;
		}
	}
	charIndex+=dir;
	drawIdex();
}
/*
	draws the "|"
*/
function drawIdex(){
	var l = $("#l"+lineIndex);
	var parent = l.find("#c"+(charIndex));
	$("#Stick").css({
		top: ( parent.offset().top -  parent.height()),
		left:(parent.offset().left+  parent.width())
	});
	if(selecting){
		highlightSelection(true);
	}
}
/*
	display character on screen
	spaces are shown as "_" with 0 opacity
*/
function printCharacter(t){
	var l = $("#l"+lineIndex);
	var allChars = l.find(".c");
	if(charIndex < allChars.length){
		for( var i =charIndex+1; i<allChars.length; i++){
			allChars.eq(i).attr('id','c'+(i+1));
		}
		if(t == ' '){
			var space = $("<p id='c"+(charIndex+1)+"' class = 'c space'>_</p>");
			space.insertAfter(allChars.eq(charIndex));
		}
		else {
			$("<p id='c"+(charIndex+1)+"' class = 'c'>"+t+"</p>").insertAfter(allChars.eq(charIndex));
		}
		
		
	}
	else
		if(t == ' '){
			l.append("<p id='c"+charIndex+"' class = 'c space'>_</p>");
		}
		else {
			l.append("<p id='c"+charIndex+"' class = 'c'>"+t+"</p>");
			console.log("created c"+charIndex);
		}
}
/*
	erase a char
	erase the line if erased the last character
	move index to previous line if erased the last character
*/
function backspace(){
	if(charIndex<=0 && lineIndex <=0)return;
	if(charIndex <= 0){
		var charlen = $("#l"+lineIndex).find(".c").length;
		if(charlen <= 1){
			$("#l"+lineIndex).remove();
		}
		else{
			var chars = $("#l"+lineIndex).find(".c");
			move_stickH(-1);
			for( var i=1; i < chars.length; i++){
				var element = chars.eq(i);
				if(element.hasClass("space"))
					addChar(" ");
				else
					addChar(element.text());
			}
			$("#l"+(lineIndex+1)).remove();
		}
		
		return;
	} 
	$("#l"+lineIndex).find("#c"+(charIndex)).remove();
	charIndex--;
}
/*
	create a new element line
	add the default first character
	draw index
	move any lines under it down by 1
	move any text on previous line to new line 
*/
function newLine(){


	var l = $("#l"+lineIndex);
	var allChars = l.find(".c");
	
	
	t = "\n"
	m_text[lineIndex]+=t;
	
	/*
	i need to somehow push all existing L's down after this new L
	like what i did with inserting a character in the middle of the line 
	*/
	var all_lines = $(".l");
	lineIndex++;
	for(var i = lineIndex; i < all_lines.length+1; i++){
		all_lines.eq(i).attr('id','l'+ (i+1));
	}
	var br = $("<br style='clear:both'>");
	var line = $("<p id='l"+lineIndex+"' class = 'l'></p>");
	line = line.append(br);
	line.insertAfter(all_lines.eq(lineIndex-1));
	line.append("<p id='c0' class='c space'>_</p>");
	var id =1;
	for( var i =charIndex+1; i<allChars.length; i++){
		$("#l"+lineIndex).append(allChars.eq(i).attr("id","c"+id));
		id++;
	}
	charIndex = 0;
	drawIdex();

}
/*
	this is just to make the highlightSelection function smaller
	adds or removes chunks of characters to selection
	show = bool
	first = index where to start selecting
	last = index where to end selecting
	allChars = array of characters
*/
function go_throuhg_line(show, first, last, allChars){
	first+=1;
	for(var j = first; j <= last; j++){
		if(show)
			allChars.eq(j ).addClass("selected");
		else{
			allChars.eq(j).removeClass("selected");
			m_s_sline = 0;
			m_s_schar = 0;
		}
	}
}
function highlightSelection(show){
	//check if end selection is on the same line
	if(m_s_sline == lineIndex){
		//select chars on that line between start and end
		var selected_chars = $("#l"+m_s_sline).find(".c");
		//highlight chars
		var i = m_s_schar;
		var end = charIndex;
		if(i>charIndex) {i=charIndex; end = m_s_schar;}
		i+=1;
		for(; i <= end; i++){
			if(show)
				selected_chars.eq(i).addClass("selected");
			else{
				selected_chars.eq(i).removeClass("selected");
				m_s_sline = 0;
				m_s_schar = 0;
			}
		}
	}
	else{
		//when adding line from down to up it adds in the reverse order
		var begin = m_s_sline; 
		var last = lineIndex;
		if(begin>last) {begin=last; last = m_s_sline;}
		for(var i = begin; i <= last; i++){
			//for each line 
			var allChars = $("#l"+i).find(".c");
			if(i == m_s_sline){
				//the first line
				console.log("first");
				var s1 = m_s_schar; 
				var e1 = allChars.length;
				if(m_s_sline > lineIndex){s1 =0; e1 = m_s_schar;}
				go_throuhg_line(show, s1, e1, allChars);
			}
			else if( i == lineIndex ){
				//the last line
				console.log("last");
				var s1 = 0; 
				var e1 = charIndex;
				if(m_s_sline > lineIndex){s1 =charIndex; e1 = allChars.length;}
				go_throuhg_line(show, s1, e1, allChars);
			}
			else{
				//all lines inbetween
				console.log("full");
				go_throuhg_line(show, 0, allChars.length, allChars);
			}
		}
	}
}
function shiftSelect(){
	m_s_sline = lineIndex;
	m_s_schar = charIndex;
	selecting = true;
}
function cancelSelection(){
	selecting = false;
	
}



window.requestAnimationFrame = (function(callback){
    return  window.requestAnimationFrame       ||  //Chromium
            window.webkitRequestAnimationFrame ||  //Webkit
            window.mozRequestAnimationFrame    || //Mozilla Geko
            window.oRequestAnimationFrame      || //Opera Presto
            window.msRequestAnimationFrame     || //IE Trident?
            function(callback, element){ //Fallback function
                window.setTimeout(callback, 500/60);               
            }
     
})();
function update()
{
	time++;
	if(time <=m_blink_time )
		$("#Stick").hide();
	else if(time >=m_blink_time && time <=m_blink_time*2){
		$("#Stick").show();
		
	}
	else{time =0;}
    window.requestAnimationFrame(update);
}