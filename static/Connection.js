var myCodeMirror;
function onLoad(){
	var myTextArea = document.getElementById('myText');
	myCodeMirror = CodeMirror.fromTextArea(myTextArea,{
		lineNumbers: true,
	    mode:  "javascript"
	});
	$("#save_btn").click(function(){
		sendMessage();
	});
	myCodeMirror.setSize(500, 300);

}

function sendMessage(){
	console.log("sending ");
	var msg = myCodeMirror.getValue();
	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("POST","/save",true);
	xmlhttp.send(msg);
	xmlhttp.onreadystatechange = function () {
	    if (xmlhttp.readyState === 4) {                // 4 = Response from server has been completely loaded.
	        if (xmlhttp.status == 200 && xmlhttp.status < 300){  // http status between 200 to 299 are all successful
					var response = xmlhttp.responseText;
					if(response == "ok")
						console.log("message sent");
			}
	    }
	}
}