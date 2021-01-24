/* take a JSDOM object and return a JSON object containing only the relevant items
 *   {
 *       'name': 'string',
 *       'author': 'string',
 *       'originalUrl': 'string',
 *       'servings': 'string', 
 *       'description': 'string',
 *       'ingredients': [],
 *       'steps': [],
 *   }
 */

const htmlparser2 = require('htmlparser2');

exports.parse = function(recipe) {
    // make sure the dom exists
    if (!recipe.dom) throw "Error: DOM property undefined.";
    else {
        //const body = recipe.dom.children[4].children[3];
        for (let i = 0; i < recipe.dom.children.length; i++) {

            let e0 = recipe.dom.children[i];
            if (e0.name == 'html') {
            
                for (let j = 0; j < e0.children.length; j++) {

                    let e1 = e0.children[j];
                    if (e1.name == 'body') {
                        console.log(e1);
                        break;
                    }
                }
                break;
            }
        }
    }
}