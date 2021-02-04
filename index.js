"use strict";

/*
 *  Dependencies
 */ 
const express = require('express');
const path = require('path');
const htmlparser2 = require('htmlparser2');
const https = require('https');
const http = require('http');

/*
 *  Instances
 */ 
const app  = express();
const port = process.env.PORT || 4000;
const R = { /* This is the main recipe object */ };
var parser = { /* This is the parser used for extracting the recipe information from raw HTML */ };
const parsers = {
    // add new parsers here. make sure the key is exactly as it appears in the URL of the recipe
    allrecipes: require(path.join(__dirname + '/parsers/allRecipes.js')),
    epicurious: require(path.join(__dirname + '/parsers/epicurious.js'))
};

/*
 *  Serve initial form
 */ 
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

/*
 *  Set up middleware for parsing response to initial form
 */

// assign basic properties to the Recipe object
app.use('/api', function(req, res, next) {

    // get the url of the recipe that we want to parse
    R.url = req.query.url;
    R.host = new URL(R.url).hostname.split('.').filter(v => v.indexOf('www') == -1)[0];

    // set the server request method
    R.http = R.url.charAt(4) == 's' ? https : http;
    
    // set the parser based on the host
    R.parser = parsers[R.host];
    
    // catch error if a parser can't be found
    if (parser === undefined) {
        console.error("Couldn't find a parser for that recipe.");
        res.status(404).send("Couldn't find a parser for that recipe.");
    } else {
        next();
    }

});

// get raw recipe data from server
app.use('/api', function(req, res, next) {

    let data = '';

    if (R.http == undefined) {
        console.error("HTTP method not set");
        res.status(404).send("HTTP method not set.");
    }
    else {
        // use https
        const request = R.http.get(R.url, response => {
            response.on('data', d => {
                data += d.toString();
            });
            response.on('end', () => {
                R.html = data;
                next();
            });
        });

        request.on('error', e => {
            console.error(e);
            // handle errors
        });

        // maybe not necessary: http.get() ends automatically, but unclear if https.get() does as well
        request.end();
    }
});

// parse the raw HTML
app.use('/api', function(req, res, next) {
    R.dom = htmlparser2.parseDocument(R.html);
    // log the html
    R.parser.parse(R);
    res.end();
})

// create server
app.listen(port, function () {
    console.log(`Node app is working! localhost:${port}/`);
});