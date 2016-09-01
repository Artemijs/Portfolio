/*
Created by: Artemijs Poznaks
Created on: 30/08/2016
Last Edit: 29/08/2016
*/
//lets start by identifying words
function onLoad(){
	var text = $("#text_main");
	new_line();
	/*$('[contenteditable]').on('focus', function() {
	    var $this = $(this);
	    $this.data('before', $this.html());
	    return $this;
	}).on('blur keyup paste', function() {
	    var $this = $(this);
	    if ($this.data('before') !== $this.html()) {
	        $this.data('before', $this.html());
	        console.log($this.html());
	       console.log($this.html()[$this.html().length-8]);
	    }
	    return $this;
	});*/
}
var last_space = 1;
var c_line;
var line_count =-1;
window.addEventListener('keyup',function(event){
	if(event.which == 13){
		//new line 
		new_line();
	}else
		find_word();
},false);
function find_word(){
	var text = $("#text_main").text();
	if(text[text.length-1] == " " && last_space == -1){
		//console.log("space 1");
		last_space = text.length;
	}
	else if(text[text.length-1] == " " && last_space != -1){
		var word = text.substr(last_space-1, text.length);
		
		//text = text.substr(0, last_space);
		last_space = text.length;
		//$("#text_main").text(text);
		console.log("word  ."+word+".");
		c_line.append("<span class='"+word+" c' id='"+word+"'>"+word+"</span>");
		
		//$("#text_main").click();
	}
}
function new_line(){
	var text = $("#text_main");
	line_count++;
	c_line = $("<p id = 'l"+line_count+"' class = 'l'></p>");
	var offset =0;
	if(line_count !=0){
		offset = text.height();
		offset= offset-offset/(line_count+1)
		console.log(offset +" "+text.height());
	}
	c_line.css({
		top: ( text.offset().top+offset ),
		left:(text.offset().left)
	});
	$("#main").append(c_line);
}
//stephen oneil 
//slavic.salajs@gmail.com