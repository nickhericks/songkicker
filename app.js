
let user = 'nhericks';
let trackedArtists = [];
let allArtistEvents = [];

let eventsUl = document.querySelector('#events');
let artistUl = document.querySelector('#artists');


printArtists = () => {
	// For each artist in array
	trackedArtists.forEach(artist => {
		// List artists on page
		artistUl.innerHTML += `<li>${artist.displayName}</li>`;

		// Use artist list to get events for each artist
		// getArtistEvents(artist.id);
	});
};



// Get all events for artist
// getArtistEvents = query => {
// 	fetch(`https://api.songkick.com/api/3.0/artists/${query}/calendar.json?apikey=WsvDSgM98wiuOncG`
// 	)
//     .then(response => response.json())
//     .then(data => {
// 			// console.log(data.resultsPage.results.event);
// 			let eventArray = data.resultsPage.results.event;
// 			//  If .event is not == 'undefined', then add it to the allArtistEvents array
// 			if (eventArray !== undefined) {
//         // TODO: Change this to not add .event but to instead merge the items in that .event array into the allArtistEvents array
// 				eventArray.forEach(event => {
// 	        allArtistEvents.push(event);
// 				});
//       }
// 		})
// 		.then( () => {

// 			allArtistEvents.forEach(event => {
// 				eventsUl.innerHTML += `<li>${event.displayName}</li>`;
				

// 			});
// 		})
// 		// .catch(error => console.log("Error fetching or parsing data", error));
// };





// getArtistEvents = artistId => {
// 	fetch(`https://api.songkick.com/api/3.0/artists/${artistId}/calendar.json?apikey=WsvDSgM98wiuOncG`
// 	)
// 		.then(response => response.json())
// 		.then(data => {

// 			let eventArray = [];
// 			// let eventData = data.resultsPage.results.event;
// 			console.log(data.resultsPage.results.event);

// 			if (data.resultsPage.results.event !== undefined) {
// 				data.resultsPage.results.event.forEach(event => {
// 					eventArray.push(event);
// 				});
// 			}
// 			console.log(eventArray);

// 			return eventArray;
// 		});
// 	// .catch(error => console.log("Error fetching or parsing data", error));
// };


getMoreEvents = (artistId, pageNumber) => {
	let events = [];

	fetch(
		`https://api.songkick.com/api/3.0/artists/${artistId}/calendar.json?apikey=WsvDSgM98wiuOncG&page=${pageNumber}`
	)
		.then(response => response.json())
		.then(data => { 
			events = data.resultsPage.results.event;
			console.log(events);

			// Find artist
			let popularArtist = trackedArtists.find(artist => artist.id == artistId);
			console.log(popularArtist.events);

			// For each additional event, add it to the artists event object
			events.forEach(event => {
				popularArtist.events.push(event);
			});

		});
			// console.log(events);

	return events;

};




getEvents = () => {
	trackedArtists.forEach(artist => {
		// console.log(artist);

		fetch(
			`https://api.songkick.com/api/3.0/artists/${artist.id}/calendar.json?apikey=WsvDSgM98wiuOncG`
		)
			.then(response => response.json())
			.then(data => {

				if (data.resultsPage.totalEntries > 0 
						&& data.resultsPage.totalEntries < 50) {
					
					// console.log(data);
					artist.events = data.resultsPage.results.event;
					// console.log(artist);
				}

				// Create further event collection for artists with more than 50 events
				// Example KT Tunstall has 109 events		id:			150590
				// Send additional fetch requests for other events
				else if (data.resultsPage.totalEntries > 50) {
					let totalEvents = data.resultsPage.totalEntries;
					let totalPages = Math.ceil(totalEvents / 50);

					artist.events = data.resultsPage.results.event;

					
					// Find out how many pages there are.
					// Loop through totalPages until done
					for(var i = 2; i <= totalPages; i++) {
						
						// Function takes artist id and page number as input and returns events
						getMoreEvents(artist.id, i);

					}

					
					
					
					
					



					console.log(totalEvents);
					console.log(totalPages);

					console.log(data);
					console.log(artist);

					artist.events = data.resultsPage.results.event;






					// fetch()
					// 	.then(response => response.json())
					// 	.then(data => {

					// 	})



				}


			});



	});


};



// Get all user's tracked artists
getTrackedArtists = query => {
	fetch(
		`https://api.songkick.com/api/3.0/users/${query}/artists/tracked.json?apikey=WsvDSgM98wiuOncG&per_page=all`
	)
		.then(response => response.json())
		.then(data => {
			console.log(data.resultsPage.results.artist);
			console.log(data.resultsPage.results.artist.length);

			data.resultsPage.results.artist.forEach(artist => {
				let artistObject = {};
				artistObject.id = artist.id;
				artistObject.name = artist.displayName;
				// console.log(artistObject.id);

				// artistObject.events = getArtistEvents(artist.id);


				trackedArtists.push(artistObject);

			});
		})
		.catch(error => console.log('Error fetching or parsing data', error));
};



/*  
Get all artists and assign to variable

Within all artists array, for each artist in array
	- pull their events
	- add to artist object within all artists array


Get all events and assign to variable

Push button to print all artists
Push button to print all events


*/