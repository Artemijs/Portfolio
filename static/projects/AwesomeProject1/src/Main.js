var main_window;
function Start(){
	//init your vars here 
	main_window = $("#main_window");
    main_window.append('<script type="text/javascript">function rofl(){console.log("ROFLING LIKE THERES NO TOMORROW.");}</script> ');
}
function Update(){
	//this is your game loop
	console.log("looping");
	main_window.append("<p>ass</p>");
    rofl();
	window.requestAnimationFrame(Update);
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