window.onload=(function(event){


var current=localStorage.getItem('currentGenre');

	var contentSpace=document.getElementsByClassName('content')[0];

	var parser = new DOMParser();
	var fragmentString=localStorage.getItem(current);
	var parsedDoc= parser.parseFromString(fragmentString, 'text/html');

	contentSpace.appendChild(parsedDoc.documentElement);
	

}(window.console))