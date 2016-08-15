var m_text = new Array();
var charIndex = 0;
var lineIndex = 0;
function onLoad(){
		addChar(":");
}
function addChar(t){
	if(t == "/n"){
		lineIndex++;
		t = "\n"
		m_text[lineIndex]+=t;
		$("#main").append("<br>");
		$("#main").append("<div id='l"+lineIndex+"'></div>");
	}

	else if( t=="up")lineIndex--;
	else if( t=="down")lineIndex++;
	else
		m_text[lineIndex]+=t;
	$("#l"+lineIndex).append("<p  class='c'>"+t+"</p>");
}

