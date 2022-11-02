const express = require('express');     //import express
const res = require('express/lib/response');
const Joi = require('joi');     //Import joi
const app = express();          //Create Express Application on the app variable
app.use(express.json());        // Used the JSON file

// get an instance of router
const router = express.Router();

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

app.use('/', router);

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));