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
	var lineNr = myCodeMirror.getCursor().line + 1;
	console.log(lineNr);
	get_scope(jdata, lineNr);
}
/*
	get(obj){
		for
			log(obj[i][0])
			if obj.len >2
				get(obj[i][2])
	} is how it should roughly work
*/
//[i][0] = name		[i][1] = start line 	[i][2] = content 	[i][3] = end
function get_scope(obj, lineNr){
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