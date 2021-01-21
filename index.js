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
// recipe object, R for short
const R = {};
var parser = {};
const parsers = {
    allrecipes: require(path.join(__dirname + '/parsers/allRecipes.js'))
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
    
    // set the parser based on the host
    R.host = new URL(R.url).hostname.split('.').filter(v => v.indexOf('www') == -1)[0];
    parser = parsers[R.host];
    
    // catch error if a parser can't be found
    if (parser === undefined) {
        res.status(404).send("Couldn't find a parser for that recipe.");
    } else {
        next();
    }

});

// get raw recipe data from server
app.use('/api', function(req, res, next) {
    
    let data = '';

    switch(R.url.charAt(4)) {
        case 's':
            // use https
            const request = https.get(R.url, response => {
                response.on('data', d => {
                    data += d.toString();
                })
                response.on('end', () => {
                    next();
                })

            });

            request.on('error', e => {
                console.error(e);
                // handle errors
            });

            request.end();
            break;

        case ':':
            // use http
            // TODO: implement http
            break;
        default:
            // maybe not a good URL
            return;
    }
});

// create server
app.listen(port, function () {
    console.log(`Node app is working! localhost:${port}/`);
});