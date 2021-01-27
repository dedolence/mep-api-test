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
const _units = [
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
        recipe.ingredients = _getIngredients(recipe.dom);
        console.log(recipe.ingredients)
    }
}

// TODO: figure out why symbols like ½ and punctuation aren't being included
function _getIngredients(node) {    
    // array of strings representing ingredients
    return _findClass(_classKeys.ingredients, node)
        .map(_i => _i.children[0].data.trim())  // remove newlines and whitespace
        .map(_i => {
            // extract quantity; i'm sure there's a pithy one-liner that could do this, oh well
            let _a = _i.split(/\W/);
            let _b = {}
            if (!isNaN(_a[0])) {
                _b.quantity = _a[0];
                _a.shift();
            }
            _b.name = _a.join(' ');
            return _b;
        })
        .map(_i => {
            // extract unit of measurement
            let _a = _i.name.split(' ');
            let _u = _a.shift().toString().toLowerCase();
            if (_units.includes(_u) || _units.includes(_u.slice(0, -1))) {
                _i.unit = _u;
                _i.name = _a.join(' ');
            }
            return _i;
        });
}

// TODO: add this to a generic library, make pull request
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


// rewrote the DomUtils find function to handle searching objects for properties
// and their children as arrays.
// search through all properties of this node to find a name
// return it if it matches the search term, search children
function _findHtmlElement(searchProp, node, recurse, limit) {
    var _k = searchProp[0];
    var _v = searchProp[1];
    var _node = node;
    
    var result = [];

    // iterate through each property of _node object
    for (let prop in _node) {
        // see if the key and value matches this property
        if (prop == _k && _node[prop] == _v) {

            // store the entire node in results
            result.push(_node);

            // make sure limit hasn't been reached
            if (--limit <= 0)
                break;
        }

        // check children
        if (recurse && prop == 'children') {
            for (let _i = 0; _i < _node.children.length; _i++) {
                let children = _findHtmlElement(searchProp, _node.children[_i], recurse, limit);
                result.push.apply(result, children);
                limit -= children.length;
                if (limit <= 0)
                    break;
            }
        }
    }
    return result;
}
/* Mine the depths of the DOM looking for gold

exports.parse = function(recipe) {
    // make sure the dom exists
    if (!recipe.dom) throw "Error: DOM property undefined.";
    else {
        //const body = recipe.dom.children[4].children[3];
        for (let i = 0; i < recipe.dom.children.length; i++) {

            let e0 = recipe.dom.children[i];
            if (e0.name == 'html') {
                console.log(e0.name, e0.type, e0.attribs);

                for (let j = 0; j < e0.children.length; j++) {

                    let e1 = e0.children[j];
                    if (e1.name == 'body') {
                        console.log(e1.name, e1.type, e1.attribs);

                        for (let i = 0; i < e1.children.length; i++) {
                            if (e1.children[i].name != undefined && e1.children[i].attribs != undefined) {
                                printInfo(e1.children[i]);
                            }
                        }

                        break;
                    }
                }
                break;
            }
        }
    }
}
*/