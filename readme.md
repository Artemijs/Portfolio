This is a website that will have the following features: 
	<p>* Text Editor </p>
	<p>* Code saving on the server side </p>
	<p>* Running your code </p>
	<p>* Project view and other editor UI </p>
<p>Text editor is now implemented using CodeMirror, awesome api.</p>
<p> Tornado web server seems to load all the files into memory and serve them on request. </p>
<p> Another words, if i were to change a file through an online editor i would have to restart the server for the changes to take effect </p>
<p> Because of that i manually send back .js files when you run a project</p>
