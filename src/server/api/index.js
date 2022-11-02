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

// Display the list of Customers when URL consists of api customers
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

app.use('/', router);

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));