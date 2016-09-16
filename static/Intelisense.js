var jdata ;
function creat_this_shit(){
	//request the selected file intel
	var path = get_current_code_path();
	$.get("/get_intel", {"file_path" : path}, function(data){
		jdata  = JSON.parse(data)
		console.log(jdata);
	});
}