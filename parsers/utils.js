function findAttribute(key, value, node) {
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
            let _c = findAttribute(_k, _v, _node.children[_i]);
            _results.push.apply(_results, _c);
        }
    }

    return _results;
}
exports.findAttribute = findAttribute;


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
function findHtmlElement(searchProp, node, recurse, limit) {
    var _k = searchProp[0];
    var _v = searchProp[1];
    var _node = node;
    
    var _result = [];

    for (let _prop in _node) {

        if (_prop == _k && _node[_prop] == _v) {
            _result.push(_node);
            if (--limit <= 0)
                break;
        }

        if (recurse && _prop == 'children') {
            for (let _i = 0; _i < _node.children.length; _i++) {
                let children = findHtmlElement(searchProp, _node.children[_i], recurse, limit);
                _result.push.apply(_result, children);
                limit -= children.length;
                if (limit <= 0)
                    break;
            }
        }
    }

    return _result;
}
exports.findHtmlElement = findHtmlElement;