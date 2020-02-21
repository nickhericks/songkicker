
let user = 'nhericks';
let trackedArtists = [];

let eventsUl = document.querySelector('#events');
let artistUl = document.querySelector('#artists');


// printArtists = () => {
// 	// For each artist in array
// 	trackedArtists.forEach(artist => {
// 		// List artists on page
// 		artistUl.innerHTML += `<li>${artist.name}</li>`;

// 		// Use artist list to get events for each artist
// 		// getArtistEvents(artist.id);
// 	});
// };

removeNotPlayingArtists = () => {
	trackedArtists = trackedArtists.filter(artist => artist.events !== undefined);
	console.log(trackedArtists);
	console.log('non-playing artists complete');
};



printEvents = () => {
	// For each artist in array
	trackedArtists.forEach(artist => {

		if(artist.events !== undefined) {
			artist.events.forEach(event => {
				// List artists on page
				eventsUl.innerHTML += `
					<li>
						${artist.name} ----- ${event.venue.metroArea.displayName} ----- ${event.displayName}
					</li>
				`;
			});

		}
	});
	console.log('printEvents completed');
};


const getMoreEvents = async (artistId, pageNumber) => {
	await fetch(
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
	console.log(`Completed MoreEvents for ${artistId}`);
};



const getEvents = async () => {
	await trackedArtists.forEach( artist => {
		// console.log(artist);

		fetch(
			`https://api.songkick.com/api/3.0/artists/${artist.id}/calendar.json?apikey=WsvDSgM98wiuOncG`
		)
			.then(response => response.json())
			.then( async (data) => {

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

					artist.totalEvents = totalEvents;
					artist.totalPages = totalPages;

					// Add first 50 events to artist object
					artist.events = data.resultsPage.results.event;

					// // Loop through totalPages until done
					// for(var i = 2; i <= totalPages; i++) {
					// 	await getMoreEvents(artist.id, i);
					// 	console.log(`Running MoreEvents for ${artist.id} ${artist.name}`);
					// }

				}
			});
	});

	console.log(trackedArtists);
	console.log("getEvents completed");

};



// Get all user's tracked artists
const getTrackedArtists = async (query) => {
	await fetch(
		`https://api.songkick.com/api/3.0/users/${query}/artists/tracked.json?apikey=WsvDSgM98wiuOncG&per_page=all`
	)
		.then(response => response.json())
		.then(data => {

			console.log(data.resultsPage.results.artist.length);

			data.resultsPage.results.artist.forEach(artist => {
				let artistObject = {};
				artistObject.id = artist.id;
				artistObject.name = artist.displayName;

				trackedArtists.push(artistObject);
			});

			console.log("getTrackedArtists completed");

		})
		.catch(error => console.log('Error fetching or parsing data', error));
};




let artistPromise = new Promise(function(resolve, reject) {

});

const runProgram = async () => {
	await getTrackedArtists(user);
	console.log('confirmed artist list complete');
	await getEvents();
	console.log('confirmed event list complete');
	await removeNotPlayingArtists();
	console.log('confirmed remove non-playing artists complete');

	


// TODO: All the async/awaits in the functions in this file may not be necessary. Can't figure out how to get these all to wait until the moreEvents function has completed running and all events are in before we print events to the page.
// Still need to figure out async/await and/or chaining promises

	// TODO: why isnt this printing?
	await printEvents();
	console.log("confirmed printEvents complete");
	
	console.log('runProgram completed');


}