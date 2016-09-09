var main_window;
function Start(){
	//init your vars here 
	main_window = $("#main_window");
    //start the game loop
    Update();
}
function Update(){
	//this is your game loop
	console.log("looping");
  lol();
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
Start();