// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
	var arr = []; 
	var	values = [];
	var	props = [];
  if( typeof obj === 'boolean' || typeof obj === 'number' || obj === null)
  	return '' + obj;
  else if (typeof obj === 'string')
  	return '"' + obj + '"';
  else if (Array.isArray(obj)){
  	if(obj[0] === undefined)
		return '[]';
	else {
		obj.forEach(function(element){
			values.push(stringifyJSON(element));
		});
		return '[' + values + ']'
	}  
  }
  else if (obj instanceof Object){
  	props = Object.keys(obj);
  	props.forEach(function(key){
  		var strKey = '"' + key + '":';
  		var value = obj[key];
  		if(value instanceof Function || typeof value === undefined)
  			arr.push('');
  		else if(typeof value === 'string')
  			arr.push(strKey + '"' + value + '"');
  		else if(typeof value === 'number' || typeof value === 'boolean' ||  value === null)
  			arr.push(strKey + value);
  		else if (value instanceof Object){
  			arr.push(strKey + stringifyJSON(value));	
  		}
  	});
  	return '{' + arr + '}';
  }
};
