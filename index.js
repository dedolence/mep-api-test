"use strict";

/*
 *  Dependencies
 */ 
const express = require('express');
const path = require('path');
const jsdom = require('jsdom');

/*
 *  Instances
 */ 
const app  = express();
const port = process.env.PORT || 4000;
const recipe = {};
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

// assign a parser according to the host
app.use('/api', function(req, res, next) {

    // get the url of the recipe that we want to parse
    recipe.url = req.query.url;
    
    // set the parser based on the host
    let host = new URL(recipe.url).hostname.split('.').filter(v => v.indexOf('www') == -1)[0];
    parser = parsers[host];
    
    // catch error if a parser can't be found
    if (parser === undefined) {
        res.status(404).send("Couldn't find a parser for that recipe.");
    }

    next();
});

// create a DOM object to parse with
app.use('/api', function(req, res, next){

    jsdom.JSDOM.fromURL(recipe.url).then(dom => {
        recipe.dom = dom.window;
        next();
    });

});

// send DOM for parsing
app.use('/api', function(req, res, next) {
    console.log(recipe.dom.window);
});

// create server
app.listen(port, function () {
    console.log(`Node app is working! localhost:${port}/`);
});