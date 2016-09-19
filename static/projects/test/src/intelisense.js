var myTextArea = document.getElementById('myText');
	myCodeMirror = CodeMirror.fromTextArea(myTextArea,{
		lineNumbers: true,
	    mode:  "javascript"
	});
	myCodeMirror.setSize($(window).width() - myCodeMirror.left, $(window).height()*0.97);