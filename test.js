var m_text = new Array();
var charIndex = 0;
var lineIndex = 0;
var time =0;
var m_blink_time =35;
var m_s_sline =0; //start selection line index
var m_s_schar =0;//start selection character index
//use current character index and current line index for end selection
//and color all the characters as selected in between
var selecting = false;

function onLoad(){
	$("#l"+lineIndex).append("<p id='c0' class='c space'>_</p>");
	//var child = $("#Stick").remove();
	//var parent = $("#l"+lineIndex);
	//parent = parent.find("#c"+(charIndex));
	//parent.append("<p id='Stick'>|</p>");
	update();
	drawIdex();
		//addChar(":");
}
function addChar(t){
	if( m_s_schar != 0 && !selecting){
		highlightSelection(false);
	}
	if(t == "backspace"){
		backspace();
		drawIdex();
	}
	else if (t == "/t"){
		tab();
	}
	else if(t == " ")t = ' ';
	
	if(t == "/n"){
		newLine();

	}
	else if(t != "/n" && t !="/t" && t != "backspace"){
		//char index here 
		m_text[lineIndex]+=t;
		printCharacter(t);
		charIndex++;
		drawIdex();
		
	}
	$(".c").click(function(){
		var id = $(this).attr("id");
		charIndex = parseInt(id.substr(1,id.length));
		id = $(this).parent().attr("id");
		lineIndex = parseInt(id.substr(1,id.length));
		drawIdex();
	});
	//testing
}
function tab(){
	m_text[lineIndex]+="\t";

	addChar(" ");
	console.log("tab");
	//charIndex++;
	addChar(" ");
	console.log("tab");
	//charIndex++;
	addChar(" ");
	console.log("tab");
	//charIndex++;
	addChar(" ");
	console.log("tab");
	//charIndex++;
	//drawIdex();
}
function move_stickV(dir){
	if( m_s_schar != 0 && !selecting){
		highlightSelection(false);
	}
	time = m_blink_time;
	if(dir < 0 && lineIndex ==0) return;
	var all_lines = $(".l");
	if(dir > 0 && lineIndex >= all_lines.length-1) return;

	var nextLineLen = all_lines.eq(lineIndex+dir).find(".c").length;
	console.log(nextLineLen);
	if (nextLineLen < charIndex) charIndex = nextLineLen-1;
	lineIndex+=dir;
	drawIdex();
}
function move_stickH(dir){
	//console.log("dir " + dir+" len "+);
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
	//console.log("to "+"#c"+(charIndex));

}
function drawIdex(){
	
	//var child = $("#Stick").remove();
	var l = $("#l"+lineIndex);
	var parent = l.find("#c"+(charIndex));
	
	//console.log(charIndex+1);
	//parent.append("<p id='Stick'>|</p>");
	$("#Stick").css({
		top: ( parent.offset().top -  parent.height()),
		left:(parent.offset().left+  parent.width())
	});
	if(selecting){
		highlightSelection(true);
	}
	/*else if( m_s_schar != 0){
		highlightSelection(false);
	}*/
}
function printCharacter(t){
	//console.log(charIndex);
	
	var l = $("#l"+lineIndex);//.find("#c"+charIndex);
	var allChars = l.find(".c");
	if(charIndex < allChars.length){
		//this is replacing
		//allChars.eq(charIndex).text(t);
		//var len = (allChars.length-1) - charIndex;
		for( var i =charIndex+1; i<allChars.length; i++){
			//console.log(allChars.eq(i).attr("id"));
			allChars.eq(i).attr('id','c'+(i+1));
		}
		if(t == ' '){
			var space = $("<p id='c"+(charIndex+1)+"' class = 'c space'>_</p>");
			//$('[class*="OtherFeatur"]').css("opacity", 0.5);
			//space.css("opacity", 0);
			space.insertAfter(allChars.eq(charIndex));
		}
		else {
			$("<p id='c"+(charIndex+1)+"' class = 'c'>"+t+"</p>").insertAfter(allChars.eq(charIndex));
		}
		
		
	}
	else
		if(t == ' '){
			l.append("<p id='c"+charIndex+"' class = 'c space'>_</p>");
			//$('[class*="OtherFeatur"]').css("opacity", 0.5);
			//$("#c"+(charIndex)).css("opacity", 0);
		}
		else {
			l.append("<p id='c"+charIndex+"' class = 'c'>"+t+"</p>");
			console.log("created c"+charIndex);
		}
}
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
function newLine(){


	var l = $("#l"+lineIndex);//.find("#c"+charIndex);
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
	//$("<p id='c"+(lineIndex)+"' class = 'c'>"+t+"</p>").insertAfter(allChars.eq(charIndex));
	var br = $("<br style='clear:both'>");
	var line = $("<p id='l"+lineIndex+"' class = 'l'></p>");
	line = line.append(br);
	//br.insertAfter(all_lines.eq(lineIndex));
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
function highlightSelection(show){
	//find the line of start selection
	var sline = $("#l"+m_s_sline);
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

	}
	//else
		//idk yet
}
function shiftSelect(){
	/*var l = $("#l"+lineIndex);//.find("#c"+charIndex);
	l.find("#c"+charIndex).addClass("selected");
	charIndex+=dir;*/
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
	//console .log("time : "+time);
    window.requestAnimationFrame(update);
}



//home+end keys