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

exports.parse = function(html) {
    // make sure the dom exists
    if (!html) throw "Error: no input HTML.";
    else {
        // remove newlines
        html.replace(/\r?\n|\r/g, "");

        // this is the landmark tag. not exactly what we're looking for but it marks the approximate area to begin searching
        let l = `<ul class="ingredients-section" data-tracking-label="ingredients section">`;
        // index of where that tag appears
        let i = html.search(l);

        let d = '';                 // a chunk of data we'll extract
        let tagOpen = false;        // for tracking when tags are open/closed
        let tag = '';
        for (i; i < html.length; i++) {
            d += html[i];
            if (html[i] == '<') {
                tagOpen = true;
                tag += html[i];
            }
            else if (html[i]) {}
        }
    }
}
