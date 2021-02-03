/* take a JSDOM object and return a JSON object containing only the relevant items
 *   {
 *       'name': 'string',
 *       'author': 'string',
 *       'originalUrl': 'string',
 *       'servings': 'string', 
 *       'description': 'string',
 *       'ingredients': [
 *              {
 *                  'quantity': '',
 *                  'unit': '',
 *                  'name': ''
 *              }
 *          ],
 *       'steps': [],
 *   }
 */

const htmlparser2 = require('htmlparser2');

// class selectors for extracting data
const _classKeys = {
    ingredients: 'ingredients-item-name'
}

// TODO: make a require()
// keep these lowercase and singular (no trailing 's')
const _Units = [
    'teaspoon',
    'tablespoon',
    'tsp',
    'tbs',
    'tb',
    'tbl',
    'tbsp',
    't',
    'cup',
    'pint',
    'pt',
    'quart',
    'q',
    'gallon',
    'milliliter',
    'ml',
    'liter',
    'l',
    'pound',
    'lb',
    'ounce',
    'oz',
    'milligram',
    'mg',
    'gram',
    'g',
    'kilogram',
    'kg',
    'kilo'
]

const _Fractions = {'¼': '1/4', '½': '1/2', '¾': '3/4', '⅓': '1/2', '⅔': '2/3'};

function printInfo(element) {
    console.log('{');
    console.log(`   Name: ${element.name}`);
    console.log(`   Type: ${element.type}`);
    console.log(`   Attributes: `);
    if (element.attribs != undefined) {
        console.log('   {');
        for (let a in element.attribs) {
            console.log(`       ${a}: ${element.attribs[a]},`);
        }
        console.log('   }')
    } else {
        console.log(`       none`);
    }
    console.log('}')
    console.log('-----------------------------------------');
}

exports.parse = function(recipe) {
    if (!recipe.dom) throw "Error: DOM property undefined.";
    else {
        let _meta = _getMeta(recipe.dom);
        recipe.ingredients = _getIngredients(_meta[1].recipeIngredient);
        console.log(recipe.ingredients);
    }
}


function _getMeta(_node) {
    let _head = _findHtmlElement(['name', 'head'], _node, true, 1)[0];
    let _m = _findAttribute('type', 'application/ld+json', _head);
    let _mData = _m[0].children[0].data;

    return JSON.parse(_mData);
}


function _findAttribute(key, value, node) {
    let _k = key;
    let _v = value;
    let _node = node;
    let _results = [];

    if (_node.attribs) {
        for (_a in _node.attribs) {
            if (_a === _k && _node.attribs[_a] === _v) {
                _results.push(_node);
            }
        }
    }

    if (_node.children) {
        for (let _i = 0; _i < _node.children.length; _i++) {
            let _c = _findAttribute(_k, _v, _node.children[_i]);
            _results.push.apply(_results, _c);
        }
    }

    return _results;
}

function _getIngredients(ingredientsArray) {
    return ingredientsArray.map(_i => {
        // extract quantity; i'm sure there's a pithy one-liner that could do this, oh well
        let _a = _i.split(/\s+/);
        let _b = {}
        if (!isNaN(_a[0]) || _Fractions[_a[0]]) {
            _b.quantity = _a.shift();
        }
        // TODO: clean up this conversion of fraction symbol to plain numeric
        if (_Fractions[_b.quantity]) {
            _b.quantity = _Fractions[_b.quantity];
        }
        _b.name = _a.join(' ');
        return _b;
    })
    .map(_i => {
        // extract unit of measurement. the slice is to account for plural 's', e.g. teaspoons
        let _a = _i.name.split(/\s+/);
        let _u = _a.shift().toString().toLowerCase();
        if (_Units.includes(_u) || _Units.includes(_u.slice(0, -1))) {
            _i.unit = _u;
            _i.name = _a.join(' ');
        }
        return _i;
    });
}

function _getIngredients1(node) {
    // array of strings representing ingredients
    return _findClass(_classKeys.ingredients, node)
        .map(_i => _i.children[0].data.trim())  // remove newlines and whitespace
        .map(_i => {
            // extract quantity; i'm sure there's a pithy one-liner that could do this, oh well
            let _a = _i.split(/\s+/);
            let _b = {}
            if (!isNaN(_a[0]) || _Fractions[_a[0]]) {
                _b.quantity = _a.shift();
            }
            // TODO: clean up this conversion of fraction symbol to plain numeric
            if (_Fractions[_b.quantity]) {
                _b.quantity = _Fractions[_b.quantity];
            }
            _b.name = _a.join(' ');
            return _b;
        })
        .map(_i => {
            // extract unit of measurement. the slice is to account for plural 's', e.g. teaspoons
            let _a = _i.name.split(/\s+/);
            let _u = _a.shift().toString().toLowerCase();
            if (_Units.includes(_u) || _Units.includes(_u.slice(0, -1))) {
                _i.unit = _u;
                _i.name = _a.join(' ');
            }
            return _i;
        });
}

































function _getTitle(node) {
    let _e = _findHtmlElement(['name', 'title'], node, true, 1)[0]
        .children[0]
        .data;

    // filter helper
    let _rList = ["recipe", "|", "allrecipes"];
    let _rFilter = function(_w) {
        return !_rList.includes(_w.toLowerCase());
    }

    // split string, filter out irrelevant title decoration, reformat to string
    return _e.split(/\s+/)
        .filter(_rFilter)
        .join(' ');
}

// TODO: add this to a generic library, make pull request
/**
 * 
 * @param {string} className name of the class, without CSS selectors (i.e. no '.')
 * @param {HTMLElement} node parent object to search within
 * @returns {Array<HTMLElement>} array of matching objects
 */
function _findClass(className, node) {
    let _c = className;
    let _n = node;
    let _results = [];

    // check to see if node has attributes/class attribute
    if (_n.attribs && _n.attribs.class) {
        if (_n.attribs.class.split(" ").includes(_c)) {
            _results.push(_n);
        }
    }

    // check children
    if (_n.children) {
        for (let _i = 0; _i < _n.children.length; _i++) {
            let _children = _findClass(className, _n.children[_i]);
            _results.push.apply(_results, _children);
        }
    }

    return _results;
}

/** 
 * rewrote the DomUtils find() function to handle searching objects,
 * not just arrays.
 * 
 * @param {Array<string>} searchProp an array containing a key (_k) and value (_v)
 * @param {HTMLElement} node the parent node as an HTMLElement to search within
 * @param {boolean} recurse boolean whether to search children as well
 * @param {number} limit integer number of results to return
 * 
 * @return {Array<HTMLElement>} an array containing matching HTMLElement objects.
 */
function _findHtmlElement(searchProp, node, recurse, limit) {
    var _k = searchProp[0];
    var _v = searchProp[1];
    var _node = node;
    
    var _result = [];

    // iterate through each property of _node object
    for (let _prop in _node) {

        if (_prop == _k && _node[_prop] == _v) {
            _result.push(_node);
            if (--limit <= 0)
                break;
        }

        if (recurse && _prop == 'children') {
            for (let _i = 0; _i < _node.children.length; _i++) {
                let children = _findHtmlElement(searchProp, _node.children[_i], recurse, limit);
                _result.push.apply(_result, children);
                limit -= children.length;
                if (limit <= 0)
                    break;
            }
        }
    }

    return _result;
}