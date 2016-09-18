var myCodeMirror;
var intel_active = false;
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
	$("#intel_box").hide();
	$("#new_file").click(function(){
		var path = full_path(selected_element);
		console.log("creating a new file in " + path);
		new_file(path);
	});
	$("#new_folder").click(function(){
		var path = full_path(selected_element);
		console.log("creating a new folder in " + path);
		new_folder(path);
	});
	$("#rename").click(function(){rename();});
	$("#delete").click(function(){remove();});
	$("#input_box").hide();
	$("#input_box").css({
		left:$(window).width()/2 - $("#input_box").width()/2,
		top:$(window).height()/2 + $("#input_box").height()/2
	});
	$("#new_proj").click(function(){
		new_project();
	});
	$("#edit_proj").click(function(){ 

	});
	$("#run_proj").click(function(){
		run_mode();
	});
	
	$("#intel").click(function(){
		creat_this_shit();
	});
	myCodeMirror.setOption("extraKeys", {"Up":function(){
		if(intel_active) // logic to decide whether to move up or not
		{
			move_selection(-1);
			console.log("Key Up pressed");
			return CodeMirror.PASS;
		}
		else myCodeMirror.execCommand("goLineUp");
	},
	"Down":function(){
		if(intel_active) // logic to decide whether to move up or not
		{
			move_selection(1);
			console.log("Key D pressed");
			return CodeMirror.PASS;
		}
		else myCodeMirror.execCommand("goLineDown");
	},
	"Enter":function(){
		if(intel_active) // logic to decide whether to move up or not
		{
			return CodeMirror.PASS;
		}
		else myCodeMirror.execCommand("newlineAndIndent");
	}});
	/*myCodeMirror.setOption("extraKeys", {"Down":function()
	{
		
		if(intel_active) // logic to decide whether to move up or not
		{
			return CodeMirror.PASS;
		}
		else{
			move_selection(-1);
			console.log("Key down pressed");
		}
	}});*/
	/*$(".CodeMirror").keypress(function(event ){
		if(event.which  == 38){//up

		}
		else if (event.which == 40){//down

		}
	});*/
}
//i can change this to use jquery .post()
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

