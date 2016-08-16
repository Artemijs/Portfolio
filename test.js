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
	if(t == "/n"){
		newLine();

	}
	else if(t == " ")t = ' ';

	else if( t=="up")lineIndex--;
	else if( t=="down")lineIndex++;
	else{
		m_text[lineIndex]+=t;
	}

	if(t != "/n"){
		printCharacter(t);
		drawIdex();
		charIndex++;
		
	}
	
}

function drawIdex(){
	//console.log(charIndex+" "+lineIndex);
	
	var child = $("#Stick").remove();
	//console.log(child);
	//parent.append("<p>|</p>");
	var parent = $("#l"+lineIndex);
	//console.log(parent);
	parent = parent.find("#c"+(charIndex+1));
	console.log(charIndex+1);
	parent.append("<p id='Stick'>|</p>");
	
	//parent.append("<p id='Stick'>|</p>");
	//console.log(child);	

}
function printCharacter(t){

	$("#l"+lineIndex).append("<p id='c"+(charIndex+1)+"' class='c'></p>");
	var c = $("#l"+lineIndex).find("#c"+charIndex);
	if(t == ' '){
		//$("#l"+lineIndex).append("<p id='c"+charIndex+"' class = 'space'></p>");
		c.append("<p>&nbsp;</p>");
	}
	else c.text(t);//append("<p id='c"+charIndex+"' class='c'>"+t+"</p>");
}
function newLine(){
	lineIndex++;
	charIndex = 0;
	t = "\n"
	m_text[lineIndex]+=t;
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
	console .log("time : "+time);
    window.requestAnimationFrame(update);
}