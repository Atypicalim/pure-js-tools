
/**
//  * https://vanjs.org/
 * simple van tools
 * @param {*} map 
 * @returns renderer func
 */

assert(window.van != null, 'van.js not found in the scope!')
let _ = new Proxy({}, {
    get: (target, key) => (...args) => {
        let node = van.tags[key](...args);
        node2proxy(node);
        return node;
    },
});
ALL_HTML_TAGA.forEach((tag) => globalThis[tag] = _[tag]);

van.style = (map, ...args) => {
    if (Array.isArray(args[0])) args = args[0];
    let fill = style2renderer(map);
    let work = (..._args) => {
        if (_args.length == 0) _args = args; 
        return fill(_args.map(arg => van.val(arg)))
    }; 
    return args.length != 0 ? work(...args) : work;
}
