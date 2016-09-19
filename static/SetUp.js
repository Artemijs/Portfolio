var myCodeMirror; // the code window that you type in
var intel_active = false; // is intelisense pop up open 
function onLoad(){
	$("#project_panel").height($(window).height()*0.97);
	var myTextArea = document.getElementById('myText');
	myCodeMirror = CodeMirror.fromTextArea(myTextArea,{
		lineNumbers: true,
	    mode:  "javascript"
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
		//working on it
	});
	$("#run_proj").click(function(){
		run_mode();
	});
	
	myCodeMirror.setOption("extraKeys", {"Up":function(){
		if(intel_active) // logic to decide whether to move up or not
		{
			move_selection(-1);
			return CodeMirror.PASS;//prevent default action
		}
		else myCodeMirror.execCommand("goLineUp");
	},
	"Down":function(){
		if(intel_active) // logic to decide whether to move up or not
		{
			move_selection(1);
			return CodeMirror.PASS;//prevent default action
		}
		else myCodeMirror.execCommand("goLineDown");
	},
	"Enter":function(){
		if(intel_active) // logic to decide whether to move up or not
		{
			return CodeMirror.PASS;//prevent default action
		}
		else myCodeMirror.execCommand("newlineAndIndent");
	}});
}