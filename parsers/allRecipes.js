const path = require('path');
const htmlparser2 = require('htmlparser2');
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
        let _meta = _getMeta(recipe.dom);
        recipe.name = _meta[1].name;
        recipe.author = _meta[1].author[0].name;
        recipe.yield = _meta[1].recipeYield;
        recipe.description = _meta[1].description;
        recipe.ingredients = _getIngredients(_meta[1].recipeIngredient);
        recipe.steps = _getSteps(_meta[1].recipeInstructions);
    }
}

/**
 * 
 * @param {HTMLElement} node parent node to search within
 * @returns {JSON} object that includes all the relevant recipe information.
 * luckily AllRecipes conveniently packages this into a data object that makes
 * it really easy to extract.
 */
function _getMeta(node) {
    let _head = utils.findHtmlElement(['name', 'head'], node, true, 1)[0];
    let _m = utils.findAttribute('type', 'application/ld+json', _head);
    let _mData = _m[0].children[0].data;

    return JSON.parse(_mData);
}


function _getIngredients(ingredientsArray) {
    return ingredientsArray
        .map(_i => utils.convertFractions(_i))
        .map(_i => {
            // extract unit of measurement. the slice is to account for plural 's', e.g. teaspoons
            let _a = _i.name.split(/\s+/);
            let _u = _a.shift().toString().toLowerCase();
            if (Values.Units.includes(_u) || Values.Units.includes(_u.slice(0, -1))) {
                _i.unit = _u;
                _i.name = _a.join(' ');
            }
            return _i;
        });
}

function _getSteps(stepsArray) {
    return stepsArray.map(_i => _i.text);
}