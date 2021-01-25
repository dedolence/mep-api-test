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