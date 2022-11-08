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
var user_lists = null;
const max_records = 5;

//Read all the required JSON files
const fs = require("fs");
const { lookup } = require('dns');

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

  fs.readFile("../../../resources/json/user_list.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      console.log("Reading user_list JSON file from disk:");
      user_lists = JSON.parse(jsonString);
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
    console.log('performing name validations on artist name: ' + name + typeof name);

    // once validation is done save the new item in the req
    req.name = name.toString().toLowerCase();

    // go to the next thing
    next();
});

// route middleware to validate :tack_id
router.param('track_id', function(req, res, next, name) {
  // do validation on name here
  // log something to know its working
  console.log('performing name validations on track id: ' + name + typeof name);

  // once validation is done save the new item in the req
  req.id = parseInt(name);

  // go to the next thing
  next();
});

// route middleware to validate :title 
router.param('title', function(req, res, next, name) {
  // do validation on name here
  // log something to know its working
  console.log('performing name validations on track title: ' + name + typeof name);

  // once validation is done save the new item in the req
  req.name = name.toString().toLowerCase();

  // go to the next thing
  next();
});

// route middleware to validate :listname for titles 
router.param('list_name', function(req, res, next, name) {
  // do validation on name here
  // log something to know its working
  console.log('performing name validations on track title: ' + name + typeof name);

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

// Display the list of Customers when URL consists of api genres
//#1.	Get all available genre names, IDs and parent IDs. 
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
//#2.	Get the artist details (at least 6 key attributes) given  an artist ID. 
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
//#3.	Get the following details for a given track ID: album_id, album_title, 
//artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration, 
//track_genres, track_number, track_title 
router.get('/api/tracks/:track_id', (req, res) => 
{
    let trackList="[";
    tracks.forEach(element => {

        if ( req.id === element.track_id )
        {
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
        }
    });

    //Remove any trailing comma
    let regex = /,$/g;
    trackList = trackList.replace(regex, "");

    //Close the JSON string
    trackList+="]";
    res.send(trackList);
});

// Display the list of Artists when URL consists of api artists
//#4.	Get the first n number of matching track IDs for a given search pattern matching the track title or album. 
//If the number of matches is less than n, then return all matches. Please feel free to pick a suitable value for n. 
router.get('/api/tracks/:title', (req, res) => 
{
    let trackList="[";
    let matching_records=0;

    tracks.every(element => {

    if( (element.track_title.toString().toLowerCase()).includes(req.name) || 
        (element.album_title.toString().toLowerCase()).includes(req.name))
    {
      let track = {};
      track.track_id = element.track_id;
      track = JSON.stringify(track);
      trackList+=track + ',';
      matching_records++;
    }

    if (matching_records == max_records)
    {
      return false;
      //return;
    }
    return true;
    });

    //Remove any trailing comma
    let regex = /,$/g;
    trackList = trackList.replace(regex, "");

    //Close the JSON string
    trackList+="]";
    res.send(trackList);
});

// Display the Information of Specific Artist id when you mention the artist name
//#5.	Get all the matching artist IDs for a given search pattern matching the artist's name.
router.get('/api/artists/:artist_name', (req, res) => 
{
    let artistList="[";
    let found = false;
    artists.forEach(element => {
        
        //console.log('Getting artist id from artist name: ' + typeof element.artist_name + typeof req.name);
        if ( (element.artist_name.toString().toLowerCase()).includes(req.name) )
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

//Create User List Information
//#6	Create a new list to save a list of tracks with a given list name. Return an error if name exists.
router.post('/api/list/', (req, res) =>
{
    const { error } = validateTrack(req.body);

    if (error)
    {
        res.status(400).send(error.details[0].message)
        return;
    }

    //Check if new list name is already present in the list
    var is_present = user_lists && user_lists.some(function (element) {
      return (element.list_name === req.body.listName);
    });

    if (is_present)
    {
      res.send("Oops list already exists");
    }
    else
    {
      console.log("inside");

      const list  = 
      {
        list_name: req.body.list_name
      };

      user_lists.push(list);

      writeFile ("user_list.json", JSON.stringify(list));
      res.send(list);
    }
});

//Create User List Information
//#7.	Save a list of track IDs to a given list name. Return an error if the list name does not exist.
// Replace existing track IDs with new values if the list exists.
router.post('/api/tracklist/:list_name', (req, res) =>
{
    const { error } = validateTrackList(req.body);

    if (error)
    {
        res.status(400).send(error.details[0].message)
        return;
    }

    //Check if new list name is already present in the list
    var is_present = user_lists && user_lists.some(function (element) {
      return (element.list_name === req.name);
    });

    if (!is_present)
    {
      res.status(400).send(`Oops! Listname ${req.name} not present`);
    }
    else
    {

      let user_track_ids = (req.body.track_ids);//.toString().split(',');
      let matching_track = [];
      let track_id_list = [];
      let total_runtime = 0;

      //For all the input tracks find the matching track in the tracks db
      user_track_ids.forEach(element =>{
        
        tracks.forEach(track =>{
          if(track.track_id.toString() === element.track_id.toString())
          {
            matching_track = 
            {
              "album_title": track.album_title,
              "artist_name": track.artist_name,
              "track_title": track.track_title,
              "track_id":    track.track_id,
              "track_duration": track.track_duration
            }
            let temp = track.track_duration.split(':');
            total_runtime += parseInt(temp[0])*60 + parseInt(temp[1]);

            console.log(track.track_duration);
          }
        })
        track_id_list.push(matching_track);
      })

      //console.log(track_id_list);
      console.log(req.name);
      //For all the input tracks find the matching track in the tracks db
      user_lists.forEach(element =>
      {
        if (element.list_name.toString() === req.name.toString())
        {
          console.log("inside finally");
          element.track_list = track_id_list;
          element.play_duration = total_runtime;
          writeFile ("user_list.json", JSON.stringify(user_lists));
        }
      })

      res.send(user_lists);
    }
});

//#8. Get the list of track IDs for a given list. 
router.get('/api/tracklist/:list_name', (req, res) =>
{
    const { error } = validateTrackList(req.body);

    if (error)
    {
        res.status(400).send(error.details[0].message)
        return;
    }

    //Check if new list name is already present in the list
    var is_present = user_lists && user_lists.some(function (element) {
      return (element.list_name === req.name);
    });

    if (!is_present)
    {
      res.status(400).send(`Oops! Listname ${req.name} not present`);
    }
    else
    {
      //console.log(track_id_list);
      console.log(req.name);
      let track_ids=[];

      //For all the input tracks find the matching track in the tracks db
      user_lists.forEach(element =>
      {
        if (element.list_name.toString() === req.name.toString())
        {
          element.track_list.forEach(track =>
          {
            let temp={};
            temp.track_id = track.track_id;
            track_ids.push(temp);
          });
          console.log("inside finallyyy");
        }
      })
      console.log(track_ids);

      res.send(track_ids);
    }
});

//#9.	Delete a list of tracks with a given name. Return an error if the given list doesn’t exist.
router.delete('/api/tracklist/:list_name', (req, res) =>
{
    const { error } = validateTrackList(req.body);

    if (error)
    {
        res.status(400).send(error.details[0].message)
        return;
    }

    //Check if new list name is already present in the list
    var is_present = user_lists && user_lists.some(function (element) {
      return (element.list_name === req.name);
    });

    if (!is_present)
    {
      res.status(400).send(`Oops! Listname ${req.name} not present`);
    }
    else
    {
      const customer = user_lists.find(c => c.list_name === req.name.toString());
      const index = user_lists.indexOf(customer);
      user_lists.splice(index, 1);

      writeFile ("user_list.json", JSON.stringify(user_lists));

      res.send(customer);

    }
});

//#10.	Get a list of list names, number of tracks that are saved in each list
//and the total play time of each list.
router.get('/api/listinfo', (req, res) =>
{
    const { error } = validateTrackList(req.body);

    if (error)
    {
        res.status(400).send(error.details[0].message)
        return;
    }

    //Check if new list name is already present in the list
    var is_present = user_lists;

    if (!is_present)
    {
      res.status(400).send("Oops! List is empty not present");
    }
    else
    {
      //console.log(track_id_list);
      console.log(req.name);
      let list_info=[];

      //For all the input tracks find the matching track in the tracks db
      user_lists.forEach(element =>
      {
        let temp={};
        temp.list_name = element.list_name.toString();
        let count = 0;
        for(let key in element.track_list) {
          count ++;
        }
        temp.num_of_tracks = count;
        temp.play_duration = element.play_duration;
        list_info.push(temp);
      })
      console.log(list_info);

      res.send(list_info);
    }
});

//Validate Information
function validateTrack(track)
{
    const schema = Joi.object(
    {
      list_name: Joi.string().min(2).required()
    });
    return schema.validate(track);
}

//Validate Information
function validateTrackList(playList)
{
    const schema = Joi.object(
    {
      list_name: Joi.string().min(2).required(),
      track_ids: Joi.array().min(1).required(),
    });
    return schema.validate(playList);
}

function writeFile (fileName, data)
{
    fs.open(`../../../resources/json/${fileName}`, 'w', (err, fd) => {
    if (err) {
      console.log(err.message);
    } else {
      fs.write(fd, data, (err, bytes) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log(bytes + ' bytes written');
        }
      });
    }
    fs.close(fd, (err) => {
      if (err) console.error('failed to close file', err);
      else {
        console.log('\n> file closed');
      }
    });
  });
}

app.use('/', router);

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));