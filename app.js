
let user = "nhericks";
let trackedArtists = [];

let artistUl = document.querySelector('#artists');


// Get all user's tracked artists
getTrackedArtists = query => {
	fetch(
		`https://api.songkick.com/api/3.0/users/${query}/artists/tracked.json?apikey=WsvDSgM98wiuOncG&per_page=all`
	)
		.then(response => response.json())
		.then(data => {
			console.log(data.resultsPage.results.artist);
			trackedArtists = data.resultsPage.results.artist;

			

			// List artists on page
			trackedArtists.forEach(artist => {
				let artistName = artist.displayName;
				artistUl.innerHTML += `<li>${artistName}</li>`;
			});

		})
		.catch(error => console.log('Error fetching or parsing data', error));
};

// Begin search for artist events
begin = () => {
	getTrackedArtists(user);
};


// begin();