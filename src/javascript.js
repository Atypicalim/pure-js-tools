
var globalThis = (function() {
    if (typeof globalThis === 'object') {
        return globalThis; // ES2020
    } else if (typeof window === 'object') {
        return window; // browser
    } else if (typeof global === 'object') {
        return global; // Node.js
    } else {
        return {}; // invalid
    }
})();

let is_nil = (val) => val == null;

let is_num = (val) => typeof val == 'number';

let is_bol = (val) => typeof val == 'boolean';

let is_str = (val) => typeof val == 'string';

let is_fun = (val) => typeof val == 'function';

let is_dom = (val) => typeof Node != 'undefined' && val instanceof Node;

let is_arr = (val) => Array.isArray(val);

let is_object = (val) => typeof val == 'object' && !is_arr(val) && !is_dom(val);

let is_simple = (val) => is_num(val) || is_bol(val) || is_str(val);

let assert = (val, msg) => { if (!val) throw new Error(`${msg}`); }

let error = (msg) => {throw new Error(`${msg}`)};

let warn = (...args) => {console.warn(...args)};

let log = (...args) => {console.log(...args)};

let to_str = (val) => is_str(val) ? val : JSON.stringify(val);

let ar_str =(val, separator) => val.flat().join(separator);

let is_valid_text = (val) => typeof val === 'string' && val !== '';

let upper_first_char = (val) =>  val.charAt(0).toUpperCase() + val.slice(1);

let lower_first_char = (val) =>  val.charAt(0).toLowerCase() + val.slice(1);

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search) {
            return this.lastIndexOf(search, 0) === 0;
        }
    });
}

if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        value: function(search) {
            return this.indexOf(search, this.length - search.length) !== -1;
        }
    });
}

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(search, replacement) {
        var searchRegExp = new RegExp(search, 'g');
        return this.replace(searchRegExp, replacement);
    };
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        var mappy = args.length == 1 && is_object(args[0]);
        var opts = mappy ? args[0] : args;
        return this.replace(mappy ? /{([a-zA-Z_][0-9a-zA-Z_$]*)}/g : /{(\d+)}/g, function(match, key) {
            var arg = opts[key];
            return typeof arg == 'undefined' ? match : (is_fun(arg) ? arg(key) : String(arg));
        });
    };
}
