
<p> I'll try to implement the intelisense </p>
<p>This is a website that will have the following features: </p>
	* Text Editor 
	* Code saving on the server side 
	* Running your code 
	* Project view and other editor UI 
<p>Text editor is now implemented using CodeMirror, awesome api.</p>
<p> Tornado web server seems to load all the files into memory and serve them on request. </p>
<p> Another words, if i were to change a file through an online editor i would have to restart the server for the changes to take effect </p>
<p> Because of that i manually send back .js files when you run a project</p>
