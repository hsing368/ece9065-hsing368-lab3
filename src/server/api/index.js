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

// Display the list of Genres when URL consists of api genres
router.get('/api/genres/', (req, res) => 
{
    let genreList="[";
    genres.forEach(element => {
        let gr = {};
        gr.title = element.title;
        gr.genre_id = element.genre_id;
        gr.parent = element.parent;
        gr = JSON.stringify(gr);
        genreList+=gr + ',';
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
        artist.artist_id = element.artist_id
        artist.artist_name = element.artist_name
        artist.artist_location = element.artist_location
        artist.artist_members = element.artist_members
        artist.artist_url = element.artist_url
        artist.artist_website = element.artist_website

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

app.use('/', router);

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));