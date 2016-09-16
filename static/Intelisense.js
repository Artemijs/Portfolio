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
	/*var lineNr = myCodeMirror.getCursor().line;
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
	}*/
	var lineNr = myCodeMirror.getCursor().line + 1;
	//[i][0] = name		[i][1] = start line 	[i][2] = content 	[i][3] = end
	console.log(lineNr);
	get_scope(jdata, lineNr);
}
/*
	get(obj){
		for
			log(obj[i][0])
			if obj.len >2
				get(obj[i][2])
	}
*/
function get_scope(obj, lineNr){
	//var lineNr = myCodeMirror.getCursor().line;
	//[i][0] = name		[i][1] = start line 	[i][2] = content 	[i][3] = end
	//console.log(lineNr);
	//try to get the global only 
	for(var i =0; i < obj.length; i++){
		if(obj[i].length < 3){
			//var
			if(lineNr >= obj[i][1])
				console.log("r        "+obj[i][0]);
		}
		else{
			//func
			console.log("r        "+obj[i][0]);
			if(lineNr >= obj[i][1] &&  lineNr <= obj[i][3]){//your inside this scope
				get_scope(obj[i][2],lineNr);
			}
		}
	}
}