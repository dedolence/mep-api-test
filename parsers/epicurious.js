const path = require('path');
const { printInfo } = require('./utils');
const utils = require(path.join(__dirname + '/utils.js'));

const print = utils.printInfo;
const findAttribute = utils.findAttribute;
const findHtmlElement = utils.findHtmlElement;
const findAttr = utils.findAttr;

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
    if (!recipe.dom) throw "Error: DOM property undefined.";
    else {
        let _content = findAttribute('class', 'recipe-content', recipe.dom)[0];
        let _meta = findHtmlElement(['name', 'meta'], recipe.dom, true, Infinity);
        recipe.name = _getTitle(recipe.dom);
        recipe.author = findAttribute('itemprop', 'author', recipe.dom)[0].attribs.content;
        recipe.yield = findAttribute('itemprop', 'recipeYield', _content)[0].children[0].data;
        recipe.description = _getDescription(recipe.dom);
        recipe.ingredients = _getIngredients(_content); 
        recipe.steps;

        /*
        console.log("Name: " + recipe.name);
        console.log("Author: " + recipe.author);
        console.log("Yield: " + recipe.yield);
        console.log("Description:");
        console.log("Ingredients: " + recipe.ingredients);
        console.log("Steps: " + recipe.steps);
        */

    }
}

function _getTitle(node) {
    let _title = findHtmlElement(['name', 'title'], node, true, 1)[0].children[0].data;
    let _a = ['|', 'Epicurious.com', 'recipe'];
    return _title.split(/\s+/).filter(_w => !_a.includes(_w)).join(' ');
}

function _getDescription(node) {
    let n = findAttribute('itemprop', 'description', node)[0];
    console.log(n.type);
    console.log(n.children.length);
    console.log(n.name);
    console.log("Children:")
    for (let i = 0; i < n.children.length; i++) {
        if (n.children[i].name == 'p') {
            console.log(n.children[i].children);
        }
    }
    /*
    let n = findAttribute('itemprop', 'description', node)[0].children
    for (let i = 0; i < n.length; i++) {
        console.log("----------------------------------");
        console.log("Type: " + n[i].type);
        console.log("Name: " + n[i].name);
        console.log("Attribs: " + n[i].attribs);
        if (n[i].type === 'tag' && n[i].name === 'p'&& n[i].children) {
            for (let j = 0; j < n[i].children.length; j++) {
                console.log("---------");
                console.log(n[i].children[j].type);
                console.log(n[i].children[j].data);
            }
        }
    }
    */
}

function _getIngredients(node) {
    let _a = findAttribute('itemprop', 'ingredients', node);
    return _a
        .map(_i => _i.children[0].data)
        .map(_i => utils.convertFractions(_i))
        .map(_i => utils.extractUnit(_i));
}