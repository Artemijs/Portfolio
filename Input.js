var keys = new Array();
var caps =  false;
var shift =  false;
var ctrl =  false;
var alt =  false;
keys[8] = "backspace";
keys[9] = "/t";
keys[13] = "/n";
keys[16] = "shift";
keys[17] = "ctrl";
keys[18] = "alt";
keys[19] = "pause";
keys[20] = "caps";
keys[27] = "escape";
keys[32] = " ";//'&nbsp';
keys[33] = "page up";
keys[34] = "page down";
keys[35] = "end";
keys[36] = "home";
keys[37] = "left";
keys[38] = "up";
keys[39] = "right";
keys[40] = "down";
keys[45] = "insert";
keys[46] = "delete";

keys[48] = "0";
keys[49] = "1";
keys[50] = "2";
keys[51] = "3";
keys[52] = "4";
keys[53] = "5";
keys[54] = "6";
keys[55] = "7";
keys[56] = "8";
keys[57] = "9";
keys[59] = ";";
keys[61] = "=";
keys[65] = "a";
keys[66] = "b";
keys[67] = "c";
keys[68] = "d";
keys[69] = "e";
keys[70] = "f";
keys[71] = "g";
keys[72] = "h";
keys[73] = "i";
keys[74] = "j";
keys[75] = "k";
keys[76] = "l";
keys[77] = "m";
keys[78] = "n";
keys[79] = "o";
keys[80] = "p";
keys[81] = "q";
keys[82] = "r";
keys[83] = "s";
keys[84] = "t";
keys[85] = "u";
keys[86] = "v";
keys[87] = "w";
keys[88] = "x";
keys[89] = "y";
keys[90] = "z";
keys[91] = "left window key";
keys[92] = "right window key";
keys[93] = "select key";
keys[96] = "n_0";
keys[97] = "n_1";
keys[98] = "n_2";
keys[99] = "n_3";
keys[100] = "n_4";
keys[101] = "n_5";
keys[102] = "n_6";
keys[103] = "n_7";
keys[104] = "n_8";
keys[105] = "n_9";
keys[106] = "*";
keys[107] = "+";
keys[109] = "-";
keys[110] = ".";
keys[111] = "/";
keys[112] = "f1";
keys[113] = "f2";
keys[114] = "f3";
keys[115] = "f4";
keys[116] = "f5";
keys[117] = "f6";
keys[118] = "f7";
keys[119] = "f8";
keys[120] = "f9";
keys[121] = "f10";
keys[122] = "f11";
keys[123] = "f12";
keys[144] = "num lock";
keys[145] = "scroll lock";
keys[163] = "#";
keys[173] = "-";
keys[186] = ";";
keys[187] = "=";
keys[188] = ",";
keys[189] = "-";
keys[190] = ".";
keys[191] = "/";
keys[192] = "";
keys[193] = "~";
keys[219] = "[";
keys[220] = "/";
keys[221] = "]";
keys[222] = "'";
//[] {} caps and numlock
window.addEventListener('keydown',function(event){
	var keyString = keys[event.which];
	
	if (event.keyCode === 8) {
        event.preventDefault();
    }
    if (event.keyCode === 9) {
        event.preventDefault();
    }

	if(keyString == keys[20] && caps == false)//caps
		caps = true;
	else if(keyString == keys[20] && caps == true)
		caps = false;
	else if(keyString == keys[16]){//shift
		shift = true;
		shiftSelect();
	}
	else if(keyString == keys[17])//ctrl
		ctrl = true;
	else if(keyString == keys[37]){//left
		move_stickH(-1);
	}
	else if(keyString == keys[39]){ //right
		move_stickH(1);
	}
	else if(keyString == keys[38]){ //up
		move_stickV(-1);
	}
	else if(keyString == keys[40]){ //down
		move_stickV(1);
	}
	else
		print(keyString, event.which);

},false);

window.addEventListener('keyup',function(event){
	var keyString = keys[event.which];
	if(keyString == keys[16]){//shift
		shift = false;
		cancelSelection();
	}
	else if(keyString == keys[17])//ctrl
		ctrl = false;
	//print(keyString);

},false);

function print(keyString, keyCode){
	if(caps){
		//console.log(shift + " , " + keyString.toUpperCase());
		keyString= keyString.toUpperCase();
	}
	else if( !caps){
		//console.log(shift + " , " + keyString);
	}
	if(shift){
		keyString = shiftSort(keyCode, keyString);
	}
	//console.log(keyCode);
	addChar(keyString);
}
function shiftSort(keyCode, keyString){

	if(keyString == "1") keyString = "!";
	if(keyString == "2") keyString = '"';
	if(keyString == "3") keyString = "£";
	if(keyString == "4") keyString = "$";
	if(keyString == "5") keyString = "%";
	if(keyString == "6") keyString = "^";
	if(keyString == "7") keyString = "&";
	if(keyString == "8") keyString = "*";
	if(keyString == "9") keyString = "(";
	if(keyString == "0") keyString = ")";
	if(keyString == "=") keyString = "+";
	if(keyString == ";") keyString = ":";
	if(keyString == "-") keyString = "_";
	if(keyString == "[") keyString = "{";
	if(keyString == "]") keyString = "}";
	if(keyString == "'") keyString = "@";
	if(keyString == "#") keyString = "~";
	if(keyString == "/") keyString = "?";
	if(keyCode == 220) keyString = "|";
	if(keyString == ",") keyString = "<";
	if(keyString == ".") keyString = ">";
	if(keyCode >= 65 && keyCode<=90)
		keyString = keyString.toUpperCase();
	return keyString;
}