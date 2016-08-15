
function onLoad(){
	for(var i =0; i < 10; i++){
		addChar("A");
	}

	
}
function addChar(t){

	$("#main").append("<p>"+t+"</p>");
}

