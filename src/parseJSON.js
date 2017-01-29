// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var JSONStack = function(json){
	var stack = [];
	var temp = [];
	function finalEle() {
		return temp[temp.length - 1];
	}
	var oneOrTwo = false;
	for (var i = 0; i < json.length; i++){
		var current = json[i]; 	
		if (current === '\\') { i++; }
		else if (current === '{') {
			if (finalEle() === 'sinQ'){
				stack.pop();
				temp.pop();
			}
			oneOrTwo = false; 
			stack.push(['obj', 'st', i])
			if (json[i + 1] === '}') {
				stack.push(['obj', 'end', i + 1]);
				i++;
			} else {
				temp.push('obj')
				oneOrTwo = true;
			}
		} else if (current === '[') {
			if (finalEle() === 'sinQ'){
				stack.pop();
				temp.pop();
			}
			oneOrTwo = false;
			stack.push(['arr', 'st', i])
			if (json[i + 1] === ']') {
				stack.push(['arr', 'end', i + 1]);
				i++;
			} else {
				temp.push('arr');
				oneOrTwo = true;
			}
		} else if (oneOrTwo) {
			if (current === '"') {
				stack.push(['doubleQ', 'st', i])
				temp.push('doubleQ');
			} else {
				stack.push(['sinQ', 'st', i])
				temp.push('sinQ');
			}				
			oneOrTwo = false;	
		} else if (current === '"') {
			if (finalEle() === 'doubleQ'){
				stack.push(['doubleQ', 'end', i])
				temp.pop();
			} else {
				if (finalEle() === 'sinQ'){
					stack.pop();
					temp.pop();
					stack.push(['doubleQ','st', i]);
					temp.push('doubleQ')
				}
			}
		} else if (current === ':'){
			if (finalEle() !== 'doubleQ'){
				oneOrTwo = true;
			}
		} else if (current === ','){
			if(finalEle() === 'sinQ'){
				stack.push(['sinQ', 'end', i - 1])
				temp.pop();
				oneOrTwo = true; 
			}
			if (finalEle() === 'obj' || finalEle() === 'arr'){
				oneOrTwo = true;
			}		
		} else if (current === '}'){		
			if (finalEle() === 'sinQ'){
				temp.pop();
				stack.push(['sinQ', 'end', i - 1]);
			}
			if (finalEle() === 'obj'){
				temp.pop();
				stack.push(['obj', 'end', i]);
			}
		} else if (current === ']'){
			if (finalEle() === 'sinQ'){
				temp.pop();
				stack.push(['sinQ', 'end', i - 1]);
			}
			if (finalEle() === 'arr'){
				temp.pop();
				stack.push(['arr', 'end', i]);
			}
		}
	} 
	if (temp.length > 0) { throw new SyntaxError('JSON not valid'); }
	return stack;
}
var processObj = {};
processObj.doubleQ = function(quote){
	var lit = '';
	for (var i = 1; i < quote.length - 1; i++){
		if (quote[i] === '\\'){
			if (quote[i + 1] === '\\'){
				lit += '\\';
				i++;
			}
		} else {
			lit += quote[i];
		}
		
	}
	return lit;
}
processObj.sinQ = function(quote){
	quote = quote.trim();
	if (quote === 'null') { return null; }
	else if (quote === 'false') { return false; }
	else if (quote === 'true') { return true; }
	else if (isNaN(quote) === false) { return Number(quote)}
	else { return 'ERROR'}
}
processObj.arr = function(arr){
	return arr.slice(1, arr.length - 1);	
}

processObj.obj = function(arr){	
	if (arr.length % 2 !== 0) { return 'ERROR'}
	var p = {};
	for (var i = 1; i < arr.length - 1; i += 2){
		var prop = arr[i];
		var value = arr[i + 1];
		p[prop] = value;
	}

	return p;
}
function parseJSON(json) {
	if (json === undefined) { return undefined; }
	if (json[0] === '"') { return processObj.dq(json); }
	else if (json[0] !== '{' && json[0] !== '[') {
		return processObj.sinQ(json); 
	} 
	var stack = JSONStack(json)
	function process(slice){
		var type = slice[0][0];
		if (type === 'doubleQ' || type === 'sinQ'){
			if (slice.length !== 2) { return 'ERROR'}
				var st = slice[0][2];
				var end = slice[1][2]
				var quote = json.slice(st, end + 1);
				return processObj[type](quote);
		} else {
			return processObj[type](slice)
		}
	}
	function checkStack(stack){
		for (var i = 0; i < stack.length; i++){
			if (stack[i][1] === 'end'){
				var find = stack[i][0];
				for (var j = i - 1; j >= 0; j--){
					if (Array.isArray(stack[j]) && stack[j][0] === find && stack[j][1] === 'st') {
						var next = process(stack.slice(j, i + 1));
						stack.splice(j, i - j + 1, next);	
						i = j;
						break;
					}
				}
			}
		}
	}
	checkStack(stack);
	return stack[0];
}
