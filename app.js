
let user = "nhericks";
let trackedArtists = [];
let allArtistEvents = [];

let artistUl = document.querySelector('#artists');

// Get all events for artist
getArtistEvents = query => {
	fetch(`https://api.songkick.com/api/3.0/artists/${query}/calendar.json?apikey=WsvDSgM98wiuOncG`
	)
    .then(response => response.json())
    .then(data => {
			// console.log(data.resultsPage.results.event);

			//  If .event is not == 'undefined', then add it to the allArtistEvents array
			if(data.resultsPage.results.event !== undefined) {

				// TODO: Change this to not add .event but to instead merge the items in that .event array into the allArtistEvents array
				allArtistEvents.push(data.resultsPage.results.event);
			}
		})
    .catch(error => console.log("Error fetching or parsing data", error));
};

// Get all user's tracked artists
getTrackedArtists = query => {
	fetch(
		`https://api.songkick.com/api/3.0/users/${query}/artists/tracked.json?apikey=WsvDSgM98wiuOncG&per_page=all`
	)
		.then(response => response.json())
		.then(data => {
			console.log(data.resultsPage.results.artist);
			trackedArtists = data.resultsPage.results.artist;



			// For each artist in array
			trackedArtists.forEach(artist => {
				// List artists on page
				artistUl.innerHTML += `<li>${artist.displayName}</li>`;

			// Use artist list to get events for each artist
			getArtistEvents(artist.id);



			});

		})
		.catch(error => console.log('Error fetching or parsing data', error));
};

// Begin search for artist events
begin = () => {
	getTrackedArtists(user);
};


// begin();