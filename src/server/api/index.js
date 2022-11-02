const express = require('express');     //import express
const res = require('express/lib/response');
const Joi = require('joi');     //Import joi
const app = express();          //Create Express Application on the app variable
app.use(express.json());        // Used the JSON file

// get an instance of router
const router = express.Router();

//Give data to the server
var genres = null;
var artists = null;
var tracks = null;

//Read all the required JSON files
const fs = require("fs");
fs.readFile("../../../resources/json/genres.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  try {
    console.log("Reading genres JSON file from disk:");
    genres = JSON.parse(jsonString);
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});

fs.readFile("../../../resources/json/raw_artists.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      console.log("Reading artists JSON file from disk:");
      artists = JSON.parse(jsonString);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });

  fs.readFile("../../../resources/json/raw_tracks.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      console.log("Reading tracks JSON file from disk:");
      tracks = JSON.parse(jsonString);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });

// route middleware that will happen on every request
router.use(function(req, res, next) {

    // log each request to the console
    console.log(req.method, req.url, req.body.title);

    // continue doing what we were doing and go to the route
    next();
});

// route middleware to validate :name
router.param('artist_name', function(req, res, next, name) {
    // do validation on name here
    // log something to know its working
    console.log('performing name validations on ' + name + typeof name);

    // once validation is done save the new item in the req
    req.name = name;

    // go to the next thing
    next();
});

// Read request Handlers
// Display the Message when the URL consists of '/'
router.get('/', (req, res) => 
{
    res.send('Welcome to server side processing!');
});

// Display the list of Customers when URL consists of api customers
router.get('/api/genres/', (req, res) => 
{
    let genreList="[";
    genres.forEach(element => {
        let genre = {};
        genre.title = element.title;
        genre.genre_id = element.genre_id;
        genre.parent = element.parent;
        genre = JSON.stringify(genre);
        genreList+=genre + ',';
    });

    //Remove any trailing comma
    let regex = /,$/g;
    genreList = genreList.replace(regex, "");

    //Close the JSON string
    genreList+="]";
    res.send(genreList);
});

// Display the list of Artists when URL consists of api artists
router.get('/api/artists/', (req, res) => 
{
    let artistList="[";
    artists.forEach(element => {
        let artist = {};
        artist.artist_id = element.artist_id;
        artist.artist_name = element.artist_name;
        artist.artist_location = element.artist_location;
        artist.artist_members = element.artist_members;
        artist.artist_url = element.artist_url;
        artist.artist_website = element.artist_website;

        artist = JSON.stringify(artist);
        artistList+=artist + ',';
    });

    //Remove any trailing comma
    let regex = /,$/g;
    artistList = artistList.replace(regex, "");

    //Close the JSON string
    artistList+="]";
    res.send(artistList);
});

// Display the list of Artists when URL consists of api artists
router.get('/api/tracks/', (req, res) => 
{
    let trackList="[";
    tracks.forEach(element => {
        let track = {};
        track.album_id = element.album_id;
        track.album_title = element.album_title;
        track.artist_id = element.artist_id;
        track.artist_name = element.artist_name;
        track.tags = element.tags;
        track.track_date_created = element.track_date_created;
        track.track_date_recorded = element.track_date_recorded;
        track.track_duration = element.track_duration;
        track.track_genres = element.track_genres;
        track.track_number = element.track_number;
        track.track_title = element.track_title;
        
        track = JSON.stringify(track);
        trackList+=track + ',';
    });

    //Remove any trailing comma
    let regex = /,$/g;
    trackList = trackList.replace(regex, "");

    //Close the JSON string
    trackList+="]";
    res.send(trackList);
});

// Display the Information of Specific Artist id when you mention the artist name
router.get('/api/artists/:artist_name', (req, res) => 
{
    let artistList="[";
    let found = false;
    artists.forEach(element => {
        
        console.log('Getting artist id from artist name: ' + typeof element.artist_name + typeof req.name);
        if ( element.artist_name === req.name )
        {
            let artist = {};
            artist.artist_id = element.artist_id;

            artist = JSON.stringify(artist);
            artistList+=artist + ',';

            found = true;
        }
    });
    /*
    let artistList = artists
      .filter( (artist) => {
        (artist.artist_name === req.name);
      }).map( (artist) => {
            let artist_temp = {};
            artist_temp.artist_id = element.artist_id;
            artist = JSON.stringify(artist_temp);
            return artist;
      }).reduce( (sum, artist) => {
            return sum + artist + ','; 
      })
    */

    //Remove any trailing comma
    let regex = /,$/g;
    artistList = artistList.replace(regex, "");

    //Close the JSON string
    artistList+="]";
    
    //If there is no valid customer ID, then discplay an error with foll msg
    if (!found)
    {
      res.status(404).send('<h2> Oops cant find</h2>');
      //return;
    }
    else
    {
      console.log('Getting artist id from artist name: ' + req.name);// + " " + artist.artist_id);  
      res.send(artistList);
    }
});

app.use('/', router);

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));