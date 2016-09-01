/*
Created by: Artemijs Poznaks
Created on: 30/08/2016
Last Edit: 29/08/2016
*/
//lets start by identifying words
function onLoad(){
	var text = $("#text_main");
	$("#l0").css({
		top: ( text.offset().top ),
		left:(text.offset().left)
	});
	$( "#l0").unbind( "click" );
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
var last_space = -1;
window.addEventListener('keyup',function(event){
	find_word();
},false);
function find_word(){
	//console.log($("#text_main").text());
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
		$("#l0").append("<span class='"+word+" c' id='"+word+"'>"+word+"</span>");
		
		//$("#text_main").click();
	}
}
//stephen oneil 
//slavic.salajs@gmail.com