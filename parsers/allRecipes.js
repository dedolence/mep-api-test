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

exports.parse = function(recipe) {
    if (!recipe.dom) throw "Error: DOM property undefined.";
    else {



    }
}