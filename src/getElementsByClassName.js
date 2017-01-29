// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  // your code here
	var result = [];
	function auxFn (n) {
		var classes = n.className.split(' ');
		for (var i=0; i<classes.length; i++) {
			if (classes[i] === className) {
				result.push(n);
			}
		}
		var children = n.children;
		for (var j=0; j<children.length; j++) {
			auxFn(n.children[j]);
		}
	};
	auxFn(document.body);
	return result;
};