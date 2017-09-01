window.onload=(function(){


//The buildTracksFragment function builds the fragment to populate the tracks by Genre page

function buildTracksFragment(trackStoreObject,genTitle, loader){


//The trackStoreObject must be present in the database already and passed to this function

					trackStoreObject.onsuccess= event=>{
					  let trackListSpace=document.getElementById(`tracksByGenre`);
					  let trackListFragment=document.createDocumentFragment();

																
					  let tracks=document.createElement(`DIV`);
					  tracks.className=`tracks`;
					  let tracksHeader=document.createElement(`H2`);
					  let tracksHeaderText=document.createTextNode(genTitle);
					  tracksHeader.appendChild(tracksHeaderText);
					  tracks.appendChild(tracksHeader);
					  let table=document.createElement(`TABLE`);
					  let thead=document.createElement(`THEAD`);
					  let headRow=document.createElement(`TR`);
					  let head1=document.createElement(`TH`);
					  let head1Text=document.createTextNode(`Album Name`);
					  head1.appendChild(head1Text);
					  let head2=document.createElement(`TH`);
					  let head2Text=document.createTextNode(`Artist`);
					  head2.appendChild(head2Text);
					  let head3=document.createElement(`TH`);
					  let head3Text=document.createTextNode(`Track Name`);
					  head3.appendChild(head3Text);
					 let head4=document.createElement(`TH`);
					  let head4Text=document.createTextNode(`Track Duration`);
					  head4.appendChild(head4Text);
					  let head5=document.createElement(`TH`);
					  let head5Text=document.createTextNode(`Track Link`);
					  head5.appendChild(head5Text);
					  let head6=document.createElement(`TH`);
					  let head6Text=document.createTextNode(`Album Link`);
					  head6.appendChild(head6Text);

					  headRow.appendChild(head1);
					  headRow.appendChild(head2);
					  headRow.appendChild(head3);
					  headRow.appendChild(head4);
					  headRow.appendChild(head5);
					  headRow.appendChild(head6);

					  thead.appendChild(headRow);

					  table.appendChild(thead);


					  for(records in event.target.result){

					    let newTR=document.createElement(`TR`);
					    let tdAlbumName=document.createElement(`TD`);
					    let tdArtist=document.createElement(`TD`);
					    let tdTrack=document.createElement(`TD`);
					    let tdDuration=document.createElement(`TD`);
					    let tdTrackLink=document.createElement(`TD`);
					    let aLinkTrack=document.createElement(`A`);
					    let tdAlbumLink=document.createElement(`TD`);
					    let aLinkAlbum=document.createElement(`A`);
					    let albumName=document.createTextNode(event.target.result[records].album_title),
					    artist=document.createTextNode(event.target.result[records].artist_name),
					    track=document.createTextNode(event.target.result[records].track_title),
					    duration=document.createTextNode(event.target.result[records].track_duration),
																	    
					    trackLinkText=document.createTextNode(`Track Page`),
																	    
					    albumLinkText=document.createTextNode(`Album Page`);

					    tdAlbumName.appendChild(albumName);
					    tdArtist.appendChild(artist);
					    tdTrack.appendChild(track);
					    tdDuration.appendChild(duration);
					    aLinkTrack.setAttribute(`href`,event.target.result[records].track_url);
					    aLinkTrack.appendChild(trackLinkText);
					    tdTrackLink.appendChild(aLinkTrack);
					    aLinkAlbum.setAttribute(`href`,event.target.result[records].album_url);
					    aLinkAlbum.appendChild(albumLinkText);
					    tdAlbumLink.appendChild(aLinkAlbum);
					    newTR.appendChild(tdAlbumName);
					    newTR.appendChild(tdArtist);
					    newTR.appendChild(tdTrack);
					    newTR.appendChild(tdDuration);
					    newTR.appendChild(tdTrackLink);
					    newTR.appendChild(tdAlbumLink);


					    table.appendChild(newTR);
		    	

					  }; //for records


					  tracks.appendChild(table);

					  trackListFragment.appendChild(tracks);

															    
					  let serializer = new XMLSerializer();

					  let serializedFragment=serializer.serializeToString(trackListFragment);

					  localStorage.setItem('tracks',serializedFragment); //Fragment to populate tracks page
					  localStorage.setItem(genTitle,genTitle); //localStorage entry to determine if genre previously clicked

					  loader.style.display=`none`;


					  let opened = window.location.replace(`music_tracks.html`);
															   

					}  //trackStoreObject onsuccesss

}

/*********the buildTrackPage monitors for specific clicks on the home genres page to grab the desired tracks in order to populate new page******/

function buildTrackPage(){

    let genresSpace=document.getElementsByClassName(`genres`)[0];
	let links=genresSpace.getElementsByTagName(`A`);


	for(let l=0;l<links.length;l++){

	  links[l].addEventListener(`click`,event=>{


	  let gen=event.target.getAttribute(`id`);
	  let genTitle=event.target.className;
	  let loader=document.getElementsByClassName(`loaderScreen`)[0];
	  loader.style.display=`block`;

	  console.log(localStorage.length);

	/* If the genre has already been clicked, info will be grabbed from clicked genre's Store Object*******/										
	  if(localStorage.getItem(genTitle)){ 


	    		  let updateReq=indexedDB.open(`musicDB`);


				  updateReq.onsuccess=event=>{
												    	
					let db=event.target.result;
					let transaction=db.transaction(genTitle,`readonly`);
					let genreTrackStore=transaction.objectStore(genTitle);
					let getTracksByGenre=genreTrackStore.getAll();

/**************************************TRACKS FRAGMENT****************************************************/	
				
					buildTracksFragment(getTracksByGenre,genTitle,loader);

/*********************************************************************************************/					

					event.target.result.close();

				  } //updateReq onsuccesss

	  } else {  //Else,  the tracks will be requested from the freemusicarchive site and a new Store Object belonging to the clicked genre will be created in the DB 


			let tracksPromise = new Promise(function (resolve, reject) {

			  let xreq = new XMLHttpRequest();
											 
			  xreq.onload = () => {
											  
			    if (xreq.status === 200) {
											        
				  theJson=JSON.parse(xreq.response);
				  resolve(theJson);

			    };

			  };/***************GOES WITH XREQ.ONLOAD********************************************/
											  
			  xreq.onerror=() =>{

			  reject(error);

			  }; 	

			  //replace the urls with the track_url from the api results
			  xreq.open(`GET`, `https://freemusicarchive.org/api/get/tracks.json?api_key=B4YJ52TYA91MI910&limit=30&genre_id=${gen}&sort_by=album_id`);
			  xreq.setRequestHeader(`Accept`, `application/json`);
			  xreq.send();

										       
			});

			tracksPromise.then(
			  result => {

				let verReq=indexedDB.open(`musicDB`);
				verReq.onsuccess=(e)=>{
				let db=e.target.result;
				let ver=parseInt(db.version);
				let objStoresList=db.objectStoreNames;
				db.close();

				let i=0;
				let genTitleExists=false;

				while(i<objStoresList.length && !genTitleExists){
				  if(objStoresList[i]===genTitle){
					let genTitleExists=true;
				  };
				  i++;
				};

				if(!genTitleExists){ //make sure that the genre store object does not already exists, create it and then create tracks page

				  let updateReq=indexedDB.open(`musicDB`,ver+1);

				  updateReq.onupgradeneeded=event=>{
				    let db=event.target.result;
					let objectStore=db.createObjectStore(genTitle, {keyPath : `track_id`});

					objectStore.transaction.oncomplete = event=>{
					  let transaction = db.transaction(genTitle, `readwrite`),
					  objectStore = transaction.objectStore(genTitle),
					  genreTracks=tracksDataset;

					  for (let x in genreTracks) {

						//write to the object store

						objectStore.add(genreTracks[x]); 

					  } //for

					} // objecctStore.transaction.oncomplete

				  }  //updateReq.onupgradeneeded

				  updateReq.onsuccess=event=>{
												    	
					let db=event.target.result;
					let transaction=db.transaction(genTitle,`readonly`);
					let genreTrackStore=transaction.objectStore(genTitle);
					let getTracksByGenre=genreTrackStore.getAll();

/**************************************TRACKS FRAGMENT****************************************************/					
					buildTracksFragment(getTracksByGenre,genTitle,loader);

/*********************************************************************************************/					

					event.target.result.close();

				  } //updateReq onsuccesss

				//if !genTitleExists
				}  else {  //if the store Object exists already, just grab the requested information from there and create tracks page
					let updateReq=indexedDB.open(`musicDB`,ver);


				  updateReq.onsuccess=event=>{
												    	
					let db=event.target.result;
					let transaction=db.transaction(genTitle,`readonly`);
					let genreTrackStore=transaction.objectStore(genTitle);
					let getTracksByGenre=genreTrackStore.getAll();

/**************************************TRACKS FRAGMENT****************************************************/					
					buildTracksFragment(getTracksByGenre,genTitle,loader);

/*********************************************************************************************/					

					event.target.result.close();

				  } //updateReq onsuccesss
				}

	 
			  } /******verReq.onsuccess***************/	



			  let tracksDataset=result.dataset;
							


			  }, //result

			  error => {

				console.log(error); 

			  } //error

			) //trackpromise.then



											
	  } //else


	  }); //addlistener for the links

	} //for Loop

} //function buildTrackPage


/***On first time visit to catalogue get all genres and store in DB, build the DOM fragament to display and store in localStorage***/

if(!document.cookie){ 

    let genresPromise = new Promise(function (resolve, reject) {

		let xhr = new XMLHttpRequest();

				xhr.onload = () => {
				    // do something with the response
				    if (xhr.status === 200) {
				        //theString=xhr.responseText;
				        theJson=JSON.parse(xhr.response);
				        resolve(theJson);
				    }

				};

				xhr.onerror=() =>{
					reject(error);
				};
			                //replace the urls with the track_url from the api results
			xhr.open(`GET`, `https://freemusicarchive.org/api/get/genres.json?&api_key=B4YJ52TYA91MI910&limit=200`);
			xhr.setRequestHeader(`Accept`, `application/json`);
			xhr.send();

    });


    genresPromise.then(
    	result => {
    		let genreDataset=[];
    		genreDataset=result.dataset;

    		if (`indexedDB` in window) {
			  let openRequest = window.indexedDB.open(`musicDB`, 1);


			  openRequest.onsuccess = event =>{
								
				let db=event.target.result;
				let transaction=db.transaction(`genres`,`readonly`);
				let genreStore=transaction.objectStore(`genres`);
				let getGenres=genreStore.getAll();

				getGenres.onsuccess= event =>{
				  let genresSpace=document.getElementsByClassName(`genres`)[0];
				  let genresFragment=document.createDocumentFragment();

				  for(records in event.target.result){
					let genreDiv=document.createElement(`DIV`);
					let par=document.createElement(`A`);
					let genreText0=event.target.result[records].genre_title;
					let genreText=document.createTextNode(genreText0);

					par.setAttribute(`href`, `#tracks`);
					par.setAttribute(`id`,event.target.result[records].genre_id);
					par.className=event.target.result[records].genre_title;
									    
					par.appendChild(genreText);
					genreDiv.className=`genreDiv`;	
					genreDiv.appendChild(par);
			
					genresFragment.appendChild(genreDiv);
			    	

				  }; //for records loop

				  genresSpace.appendChild(genresFragment);	

				  let serializer = new XMLSerializer();

				  let serializedFragment=serializer.serializeToString(genresSpace);
			    
				  localStorage.setItem(`genresPage`,serializedFragment);

				  let links=genresSpace.getElementsByTagName(`A`);

				  buildTrackPage();  //Go to function to build tracks page when specific genres are clicked

				} //getGenres onsuccess


			  }; //openRequest onsuccess


			  openRequest.onerror = event => {

			    console.log("error");

			  }
					 
			  // create an object store

			  openRequest.onupgradeneeded = event => {

				let db = event.target.result,
					objectStore = db.createObjectStore(`genres`, { keyPath: `genre_id` }); // create an object store with a key path

				objectStore.transaction.oncomplete = event => {

				// start a new transaction

				  let transaction = db.transaction(`genres`, `readwrite`),
					  objectStore = transaction.objectStore(`genres`),
					  genres=genreDataset;

					 
				  for (let x in genres) {

				  //write to the object store

				    objectStore.add(genres[x]); 
				  }

				  document.cookie=`catalogue=visited`;

				}; //objectStore.transaction.oncomplete
					 
			  }; //openRequest

			} //if indexeddb

    	}, //then first function close

    	error => {
    	  console.log(error);
    	}

    ); //gneresPromise.then

} else {

	/*****After first visit to catalogue, build the page from the already built fragment in localStorage*******/

	let genresSpace=document.getElementsByClassName(`genres`)[0];

	let parser = new DOMParser();
	let fragmentString=localStorage.getItem(`genresPage`);
	let parsedDoc= parser.parseFromString(fragmentString, `text/html`);

	genresSpace.appendChild(parsedDoc.documentElement);

	let links=document.getElementsByTagName(`A`);


	buildTrackPage();  //Go to function to build tracks page when specific genres are clicked

}


}(window.console))