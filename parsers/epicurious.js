const path = require('path');
const htmlparser2 = require('htmlparser2');
const { inflate } = require('zlib');
const Values = require(path.join(__dirname + '/values.js'));
const utils = require(path.join(__dirname + '/utils.js'));

/**
 * Epicurious contains a data object that contains all the information but has no easily
 * searchable attributes or name. I also can't guarantee it appears consistently in the same
 * location on the page (that assumption is un-tested, however), so instead i'll parse
 * the div with class 'recipe-content'.
 * 
 * @param {HTMLElement} recipe object created by HTMLParser2
 * @returns {null}  null no return object 
 */
exports.parse = function(recipe) {
    const print = utils.printInfo;
    const findAttribute = utils.findAttribute;
    const findHtmlElement = utils.findHtmlElement;

    if (!recipe.dom) throw "Error: DOM property undefined.";
    else {
        let _content = findAttribute('class', 'recipe-content', recipe.dom)[0];
        recipe.name;
        recipe.author;
        recipe.yield = findAttribute('itemprop', 'recipeYield', _content)[0].children[0].data;
        recipe.description;
        recipe.ingredients = _getIngredients(_content[0]); 
        recipe.steps;
        console.log(recipe.yield);
    }
}

function _getIngredients(node) {
    
}