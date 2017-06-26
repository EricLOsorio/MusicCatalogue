window.onload=(function(){

	var genreDataset=[];


function buildTrackPage(){
    var genresSpace=document.getElementsByClassName('genres')[0];
	var links=genresSpace.getElementsByTagName('A');


									for(var l=0;l<links.length;l++){
										links[l].addEventListener('click',function(event){

											var genres=document.getElementsByClassName('genres')[0];

											var gen=event.target.getAttribute('id');
											var genTitle=event.target.className;
											var loader=document.getElementsByClassName('loaderScreen')[0];
											loader.style.display='block';


											
										if(localStorage.getItem(genTitle)){
										  localStorage.setItem('currentGenre',genTitle);
										  var opened = window.open("music_tracks.html");
										} else {




											localStorage.setItem(gen, gen);

/***************************************************************************************************************/
											var xreq = new XMLHttpRequest();
											 
											xreq.onload = function () {
											  
											    if (xreq.status === 200) {
											        
											        theJson=JSON.parse(xreq.response);

											    	var verReq=indexedDB.open('musicDB');
											    	verReq.onsuccess=function(e){
												    	var db=e.target.result;
												    	var ver=parseInt(db.version);
												    	var objStoresList=db.objectStoreNames;
												    	db.close();


												    	var i=0;
												    	var genTitleExists=false;

												    	while(i<objStoresList.length && !genTitleExists){
												    		if(objStoresList[i]===genTitle){
												    			var genTitleExists=true;
												    		};
												    		i++;
											    	};

											    	if(!genTitleExists){

											    		var updateReq=indexedDB.open('musicDB',ver+1);

												    	updateReq.onupgradeneeded=function(event){
												    		var db=event.target.result;
												    		var objectStore=db.createObjectStore(genTitle, {keyPath : 'track_id'});

												    		objectStore.transaction.oncomplete = function (event) {
												    			var transaction = db.transaction(genTitle, 'readwrite'),
											                    objectStore = transaction.objectStore(genTitle),
											                    genreTracks=tracksDataset;


											                    for (var x in genreTracks) {
												                    //write to the object store
												                    objectStore.add(genreTracks[x]); // 'name' is the key
												                }
												    		}
												    	}

												    	updateReq.onsuccess=function(event){
												    	
												    		var db=event.target.result;
															var transaction=db.transaction(genTitle,'readonly');
															var genreTrackStore=transaction.objectStore(genTitle);
															var getTracksByGenre=genreTrackStore.getAll();

															getTracksByGenre.onsuccess= function(event){
																var trackListSpace=document.getElementById('tracksByGenre');
																var trackListFragment=document.createDocumentFragment();

																
																var tracks=document.createElement('DIV');
																tracks.className='tracks';
																var tracksHeader=document.createElement('H2');
																var tracksHeaderText=document.createTextNode(genTitle);
																tracksHeader.appendChild(tracksHeaderText);
																tracks.appendChild(tracksHeader);
																var table=document.createElement('TABLE');
																var thead=document.createElement('THEAD');
																var headRow=document.createElement('TR');
																var head1=document.createElement('TH');
																var head1Text=document.createTextNode('Album Name');
																head1.appendChild(head1Text);
																var head2=document.createElement('TH');
																var head2Text=document.createTextNode('Artist');
																head2.appendChild(head2Text);
																var head3=document.createElement('TH');
																var head3Text=document.createTextNode('Track Name');
																head3.appendChild(head3Text);
																var head4=document.createElement('TH');
																var head4Text=document.createTextNode('Track Duration');
																head4.appendChild(head4Text);
																var head5=document.createElement('TH');
																var head5Text=document.createTextNode('Track Link');
																head5.appendChild(head5Text);
																var head6=document.createElement('TH');
																var head6Text=document.createTextNode('Album Link');
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

																	var newTR=document.createElement('TR');
																	var tdAlbumName=document.createElement('TD');
																	var tdArtist=document.createElement('TD');
																	var tdTrack=document.createElement('TD');
																	var tdDuration=document.createElement('TD');
																	var tdTrackLink=document.createElement('TD');
																	var aLinkTrack=document.createElement('A');
																	var tdAlbumLink=document.createElement('TD');
																	var aLinkAlbum=document.createElement('A');
																	var albumName=document.createTextNode(event.target.result[records].album_title),
																	    artist=document.createTextNode(event.target.result[records].artist_name),
																	    track=document.createTextNode(event.target.result[records].track_title),
																	    duration=document.createTextNode(event.target.result[records].track_duration),
																	    
																	    trackLinkText=document.createTextNode("Track Page"),
																	    
																	    albumLinkText=document.createTextNode("Album Page");



																	tdAlbumName.appendChild(albumName);
																	tdArtist.appendChild(artist);
																	tdTrack.appendChild(track);
																	tdDuration.appendChild(duration);
																	aLinkTrack.setAttribute('href',event.target.result[records].track_url);
																	aLinkTrack.appendChild(trackLinkText);
																	tdTrackLink.appendChild(aLinkTrack);
																	aLinkAlbum.setAttribute('href',event.target.result[records].album_url);
																	aLinkAlbum.appendChild(albumLinkText);
																	tdAlbumLink.appendChild(aLinkAlbum);
																	newTR.appendChild(tdAlbumName);
																	newTR.appendChild(tdArtist);
																	newTR.appendChild(tdTrack);
																	newTR.appendChild(tdDuration);
																	newTR.appendChild(tdTrackLink);
																	newTR.appendChild(tdAlbumLink);


																	table.appendChild(newTR);

									    	

															    };


															    tracks.appendChild(table);

															    trackListFragment.appendChild(tracks);

															    
																var serializer = new XMLSerializer();

															    var serializedFragment=serializer.serializeToString(trackListFragment);

															   localStorage.setItem(genTitle,serializedFragment);
															   localStorage.setItem('currentGenre',genTitle);
															   var opened = window.open("music_tracks.html");
															   loader.style.display='none';

															}

												    		event.target.result.close();
												    	}

											    	} 

	 
											    } /******verReq.onsuccess***************/	




											    }; /*****************************GOES WITH XREQ.STATUS===200********************/


											    var tracksDataset=theJson.dataset;
											    

											};/***************GOES WITH XREQ.ONLOAD********************************************/


											                //replace the urls with the track_url from the api results
											xreq.open('GET', 'https://freemusicarchive.org/api/get/tracks.json?api_key=B4YJ52TYA91MI910&limit=3000&genre_id='+gen+'&sort_by=album_id');
											xreq.setRequestHeader('Accept', 'application/json');
											xreq.send();

											
										} 


/***************************************************************************************************************/
										})
									}

}


if(!document.cookie){
 
		var xhr = new XMLHttpRequest();

				xhr.onload = function () {
				    // do something with the response
				    if (xhr.status === 200) {
				        //theString=xhr.responseText;
				        theJson=JSON.parse(xhr.response);


					if ('indexedDB' in window) {
					        var openRequest = window.indexedDB.open('musicDB', 1);


							openRequest.onsuccess = function(event){
								
								var db=event.target.result;
								var transaction=db.transaction('genres','readonly');
								var genreStore=transaction.objectStore('genres');
								var getGenres=genreStore.getAll();

								getGenres.onsuccess= function(event){
									var genresSpace=document.getElementsByClassName('genres')[0];
									var genresFragment=document.createDocumentFragment();

									

								    for(records in event.target.result){
									    var genreDiv=document.createElement('DIV');
									    var par=document.createElement('A');
									    var genreText0=event.target.result[records].genre_title;
									    var genreText=document.createTextNode(genreText0);

									    par.setAttribute('href', '#tracks');
									    par.setAttribute('id',event.target.result[records].genre_id);
									    par.className=event.target.result[records].genre_title;
									    
									    par.appendChild(genreText);
									    genreDiv.className='genreDiv';	
									    genreDiv.appendChild(par);
			
									    genresFragment.appendChild(genreDiv);
			    	

								    };

								    genresSpace.appendChild(genresFragment);	

								    var serializer = new XMLSerializer();

								    var serializedFragment=serializer.serializeToString(genresSpace);

								    
								    localStorage.setItem('genresPage',serializedFragment);

									var links=genresSpace.getElementsByTagName('A');

									buildTrackPage();

								} 



							};


							openRequest.onerror = function(event){
								console.log("error");
							}
					 
					        // create an object store
					        openRequest.onupgradeneeded = function (event) {
					            var db = event.target.result,
					                objectStore = db.createObjectStore('genres', { keyPath: 'genre_id' }); // create an object store with a key path
					            objectStore.transaction.oncomplete = function (event) {
					                // start a new transaction
					                var transaction = db.transaction('genres', 'readwrite'),
					                    objectStore = transaction.objectStore('genres'),
					                    genres=genreDataset;

					 
					                for (var x in genres) {
					                    //write to the object store
					                    objectStore.add(genres[x]); 
					                }

					                document.cookie='display=block';
					            };
					 
					        };

					    } //if indexeddb


				    }

				    genreDataset=theJson.dataset;

				};
			                //replace the urls with the track_url from the api results
			xhr.open('GET', 'https://freemusicarchive.org/api/get/genres.json?&api_key=B4YJ52TYA91MI910&limit=200');
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.send();
} else {
	var genresSpace=document.getElementsByClassName('genres')[0];

	var parser = new DOMParser();
	var fragmentString=localStorage.getItem('genresPage');
	var parsedDoc= parser.parseFromString(fragmentString, 'text/html');

	genresSpace.appendChild(parsedDoc.documentElement);

	var links=document.getElementsByTagName('A');


	buildTrackPage();

}


}(window.console))