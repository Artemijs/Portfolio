var jdata ;
function creat_this_shit(){
	//request the selected file intel
	var path = get_current_code_path();
	$.get("/get_intel", {"file_path" : path}, function(data){
		jdata  = JSON.parse(data)
		console.log(jdata);
	});
}
//this needs to be done recursively
function get_scope_data(){
	var lineNr = myCodeMirror.getCursor().line;
	//[i][0] = name		[i][1] = start line 	[i][2] = content 	[i][3] = end
	console.log(lineNr);
	//try to get the global only 
	for(var i =0; i < jdata.length; i++){
		console.log("gspace "+jdata[i][0]);
		if(jdata[i].length <3){
			//this is a var
		}
		else{
			//this is a func
			var obj = jdata[i];
			if(lineNr >= obj[1] &&  lineNr <= obj[3])
				//print out the contents that follow the same format 
			console.log(obj[2]);
				for( var j =0; j< obj[2].length; j++){
					var subObj = obj[2][j];
					console.log(subObj[0]);

				}
		}
	}
}