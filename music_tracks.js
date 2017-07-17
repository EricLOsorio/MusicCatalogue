window.onload=(function(event){


//let current=localStorage.getItem('currentGenre');

	let contentSpace=document.getElementsByClassName('content')[0];

	let parser = new DOMParser();
	let fragmentString=localStorage.getItem('tracks');
	let parsedDoc= parser.parseFromString(fragmentString, 'text/html');

	contentSpace.appendChild(parsedDoc.documentElement);




	

}(window.console))