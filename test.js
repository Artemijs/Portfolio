var m_text = new Array();
var charIndex = 0;
var lineIndex = 0;
var time =0;
var m_blink_time =35;
function onLoad(){
	$("#l"+lineIndex).append("<p id='c0' class='c'></p>");
	var child = $("#Stick").remove();
	var parent = $("#l"+lineIndex);
	parent = parent.find("#c"+(charIndex));
	parent.append("<p id='Stick'>|</p>");
	update();
		//addChar(":");
}
function addChar(t){
	
	if (t == "/t"){
		tab();
	}
	else if(t == " ")t = ' ';
	if(t == "/n"){
		newLine();

	}
	else if(t != "/n" && t !="/t"){
		//char index here 
		m_text[lineIndex]+=t;
		printCharacter(t);
		charIndex++;
		drawIdex();
		
	}
	//testing
}
function tab(){
	m_text[lineIndex]+="\t";

	$("#l"+lineIndex).append("<p id='c"+(charIndex+1)+"' class='c'></p>");
	var c = $("#l"+lineIndex).find("#c"+charIndex);
	c.append("<p class = 'c'>&nbsp;</p>");
	charIndex++;
	
	$("#l"+lineIndex).append("<p id='c"+(charIndex+1)+"' class='c'></p>");
	var c = $("#l"+lineIndex).find("#c"+charIndex);
	c.append("<p class = 'c'>&nbsp;</p>");
	charIndex++;

	$("#l"+lineIndex).append("<p id='c"+(charIndex+1)+"' class='c'></p>");
	var c = $("#l"+lineIndex).find("#c"+charIndex);
	c.append("<p class = 'c'>&nbsp;</p>");
	charIndex++;

	$("#l"+lineIndex).append("<p id='c"+(charIndex+1)+"' class='c'></p>");
	var c = $("#l"+lineIndex).find("#c"+charIndex);
	c.append("<p class = 'c'>&nbsp;</p>");
	charIndex++;
	drawIdex();
}
function move_stickV(dir){
	lineIndex+=dir;
	drawIdex();
}
function move_stickH(dir){
	console.log("from "+"#c"+(charIndex));
	charIndex+=dir;
	drawIdex();
	console.log("to "+"#c"+(charIndex));

}
function drawIdex(){
	
	var child = $("#Stick").remove();
	var parent = $("#l"+lineIndex);
	parent = parent.find("#c"+(charIndex));
	console.log("parenting to c"+charIndex);
	//console.log(charIndex+1);
	parent.append("<p id='Stick'>|</p>");
	$("#Stick").css({
		top: ( parent.offset().top -  parent.height()),
		left:(parent.offset().left+  parent.width())*0.97
	});
}
function printCharacter(t){
	console.log(charIndex);
	
	var l = $("#l"+lineIndex);//.find("#c"+charIndex);
	var allChars = l.find(".c");
	if(charIndex < allChars.length){
		//this is replacing
		//allChars.eq(charIndex).text(t);
		//var len = (allChars.length-1) - charIndex;
		for( var i =charIndex+1; i<allChars.length; i++){
			console.log(allChars.eq(i).attr("id"));
			allChars.eq(i).attr('id','c'+(i+1));
		}
		if(t == ' '){
			$("<p id='c"+charIndex+1+"' class = 'c'>&nbsp;</p>").insertAfter(allChars.eq(charIndex));
		}
		else {
			$("<p id='c"+(charIndex+1)+"' class = 'c'>"+t+"</p>").insertAfter(allChars.eq(charIndex));
		}
		
		
	}
	else
		if(t == ' '){
			l.append("<p id='c"+charIndex+"' class = 'c'>&nbsp;</p>");
		}
		else {
			l.append("<p id='c"+charIndex+"' class = 'c'>"+t+"</p>");
			console.log("created c"+charIndex);
		}
}
function newLine(){
	
	t = "\n"
	m_text[lineIndex]+=t;
	lineIndex++;
	charIndex = 0;
	$("#main").append("<br style='clear:both'>");
	$("#main").append("<p id='l"+lineIndex+"' class = 'l'></p>");
	$("#l"+lineIndex).append("<p id='c0' class='c'></p>");
	var child = $("#Stick").remove();
	var parent = $("#l"+lineIndex);
	parent = parent.find("#c"+(charIndex));
	parent.append("<p id='Stick'>|</p>");
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