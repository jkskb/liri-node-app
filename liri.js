// code to read and set any environment variables with the dotenv package
require('dotenv').config();
const request = require('request');
const Spotify = require('node-spotify-api');
const moment = require("moment");
// const db = require('db');
const fs = require('fs');

// import the keys.js file and store it in a variable
const keys = require('./keys.js');

// access keys information
const spotify = new Spotify(keys.spotify);

// Take 2 arguments. The first will be the command instruction to Liri and the second to what we want her to look up
const command = process.argv[2];
const quest = process.argv[3];

// combines previous 2 process.argv to log in log.txt
const text = command + ' ' + quest;

// The switch-case will direct which function gets run.
switch (command) {
	case 'concert-this':
	bandsInTown();                   
	break;                          

	case 'spotify-this-song':
	spotifyThisSong();
	break;

	case 'movie-this':
	movieThis();
	break;

	case 'do-what-it-says':
	doWhatItSays();
	break;

	default:                            
	console.log("Invalid command! Please try again.");
  break;
}

//concert-this command
function bandsInTown(){

	var artist = quest;

	if (artist == undefined) {
		artist = 'Swoon';
	}

	var queryUrl = "https://rest.bandsintown.com/artists/"+artist+"/events?app_id=codingbootcamp";
	
	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200);
		const result = JSON.parse(body)[0];
			
			console.log ("------------------------------------------------");
			console.log("Name of Artist: " + artist);
		  console.log("Name of Venue: " + result.venue.name);
		  console.log("Venue Location: " + result.venue.city);
			console.log("Date of Event: " +  moment(result.datetime).format("MM/DD/YYYY"));
		  console.log("------------------------------------------------");
	 });
}

//spotify-this-song-command
function spotifyThisSong(){
	
	var song = quest;

	if (song == undefined) {
		song = 'The Sign by Ace of Base';
	}

	spotify
  .search({
    type: 'track',
		query: song},
		function(error, data) {
    if (error) {
      console.log('Error occurred: ' + error);
      return;
    } else {
      console.log("------------------------------------------------");
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song: " + data.tracks.items[0].name);
      console.log("Preview: " + data.tracks.items[3].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);
      console.log("------------------------------------------------");
      
    }
  });
};

//movie-this command
function movieThis(){

	var movie = quest;

	if (movie == undefined) {
		movie = 'Mr. Nobody';
	}

	request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        
		var result  =  JSON.parse(body);
		console.log("------------------------------------------------");
		console.log("Title: " + result.Title);
		console.log("Release Year: " + result.Released);
		console.log("IMDB Rating: " + result.imdbRating );
		console.log("Rotten Tomatoes Rating: " + result.Ratings[1].value);
		console.log("Country of Origin: " +  result.Country);
		console.log("Language: " + result.Language);
		console.log("Movie Plot: " + result.Plot);
		console.log("Actors: " +  result.Actors);
		console.log("------------------------------------------------");
		});

}

//do-what-it-says command
function doWhatItSays() {

	fs.readFile('random.txt', 'utf8', function(error, data){

    if (error) {
        return console.log(error);
			}
			
			console.log(data);

  	const song = data.split(",");
			
				spotifyThisSong(song);
	})
}

// Next, we append the text into the "log.txt" file.
// If the file didn't exist, then it gets created on the fly.
fs.appendFile("log.txt", `${text}\n`, function(err) {

  // If an error was experienced we will log it.
  if (err) {
    console.log(err);
  }

  // If no error is experienced, we'll log the phrase "Content Added" to our node console.
  else {
    console.log("Content Added!");
  }

});