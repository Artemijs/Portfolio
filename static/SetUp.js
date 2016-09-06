var myCodeMirror;
function onLoad(){
	$("#project_panel").height($(window).height()*0.97);
	var myTextArea = document.getElementById('myText');
	myCodeMirror = CodeMirror.fromTextArea(myTextArea,{
		lineNumbers: true,
	    mode:  "javascript"
	});
	$("#save_btn").click(function(){
		sendMessage();
	});
	myCodeMirror.setSize($(window).width() - myCodeMirror.left, $(window).height()*0.97);
	$("#context_menu").hide();
	$("#new_file").click(function(){
		var path = full_path(selected_element);
		console.log("creating a new file in " + path);
		new_file(path);
	});
	$("#new_folder").click(function(){
		console.log("creating a new folder in " + path);
		new_folder(path);
	});
	$("#rename").click(function(){rename();});
	$("#delete").click();
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
/*
	undeclared variable is a must have
	also cant live without auto complete
		what to auto complete:
			varibles written in that file
			functions in that file
			variables and functions of an object

*/