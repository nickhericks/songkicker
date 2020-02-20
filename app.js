
let user = 'nhericks';
let trackedArtists = [];
let allArtistEvents = [];

let eventsUl = document.querySelector('#events');
let artistUl = document.querySelector('#artists');


printArtists = () => {
	// For each artist in array
	trackedArtists.forEach(artist => {
		// List artists on page
		artistUl.innerHTML += `<li>${artist.name}</li>`;

		// Use artist list to get events for each artist
		// getArtistEvents(artist.id);
	});
};


printEvents = () => {
	// For each artist in array
	trackedArtists.forEach(artist => {

		if(artist.events !== undefined) {
			artist.events.forEach(event => {
				// List artists on page
				eventsUl.innerHTML += `<li>${event.displayName}</li>`;
			});


			// Use artist list to get events for each artist
			// getArtistEvents(artist.id);
		}
	});
};



getMoreEvents = (artistId, pageNumber) => {
	fetch(
		`https://api.songkick.com/api/3.0/artists/${artistId}/calendar.json?apikey=WsvDSgM98wiuOncG&page=${pageNumber}`
	)
		.then(response => response.json())
		.then(data => { 
			events = data.resultsPage.results.event;
			// console.log(events);

			// Find artist
			let popularArtist = trackedArtists.find(artist => artist.id == artistId);
			console.log(popularArtist.events);

			// For each additional event, add it to the artists event object
			events.forEach(event => {
				popularArtist.events.push(event);
			});
		});
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

				// Only 50 events are returned per request
				// Send additional fetch requests for other events
				// Example KT Tunstall has 109 events		id:	150590
				else if (data.resultsPage.totalEntries > 50) {
					let totalEvents = data.resultsPage.totalEntries;

					// Find out how many pages there are.
					let totalPages = Math.ceil(totalEvents / 50);

					// Add first 50 events to artist object
					artist.events = data.resultsPage.results.event;

					// Loop through totalPages until done
					for(var i = 2; i <= totalPages; i++) {
						getMoreEvents(artist.id, i);
					}

				}
			});
	});

	console.log(trackedArtists);

};



// Get all user's tracked artists
getTrackedArtists = query => {
	fetch(
		`https://api.songkick.com/api/3.0/users/${query}/artists/tracked.json?apikey=WsvDSgM98wiuOncG&per_page=all`
	)
		.then(response => response.json())
		.then(data => {
			// console.log(data.resultsPage.results.artist);
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