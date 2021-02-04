const path = require('path');
const htmlparser2 = require('htmlparser2');
const { inflate } = require('zlib');
const Values = require(path.join(__dirname + '/values.js'));
const utils = require(path.join(__dirname + '/utils.js'));

/**
 * 
 * @param {HTMLElement} recipe object created by HTMLParser2
 * @returns {null}  null no return object 
 */
exports.parse = function(recipe) {
    if (!recipe.dom) throw "Error: DOM property undefined.";
    else {
        let _div = utils.findAttribute('class', 'recipe-content', recipe.dom);
        console.log(_div);
    }
}