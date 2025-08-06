// file:constants 2025-08-06T15:05:24.994Z
'use strict';

var ALL_HTML_TAGA = ['head', 'title', 'base', 'link', 'meta', 'script', 'style', 'div', 'span', 'p', 'br', 'hr', 'b', 'strong', 'i', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup', 'code', 'kbd', 'samp', 'var', 'pre', 'abbr', 'address', 'bdo', 'blockquote', 'cite', 'q', 'a', 'button', 'img', 'map', 'area', 'picture', 'audio', 'video', 'source', 'track', 'canvas', 'svg', 'iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'tbody', 'tfoot', 'thead', 'th', 'tr', 'td', 'col', 'colgroup', 'caption', "form", "input", "output", "button", "label", "textarea", "select", "option", "fieldset", "legend", "optgroup", "datalist", "keygen"];

// file:javascript 2025-08-06T15:05:24.994Z
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var globalThis = function () {
    if ((typeof globalThis === 'undefined' ? 'undefined' : _typeof(globalThis)) === 'object') {
        return globalThis; // ES2020
    } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
        return window; // browser
    } else if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object') {
        return global; // Node.js
    } else {
        return {}; // invalid
    }
}();

var is_nil = function is_nil(val) {
    return val == null;
};

var is_num = function is_num(val) {
    return typeof val == 'number';
};

var is_bol = function is_bol(val) {
    return typeof val == 'boolean';
};

var is_str = function is_str(val) {
    return typeof val == 'string';
};

var is_fun = function is_fun(val) {
    return typeof val == 'function';
};

var is_dom = function is_dom(val) {
    return typeof Node != 'undefined' && val instanceof Node;
};

var is_arr = function is_arr(val) {
    return Array.isArray(val);
};

var is_object = function is_object(val) {
    return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) == 'object' && !is_arr(val) && !is_dom(val);
};

var is_simple = function is_simple(val) {
    return is_num(val) || is_bol(val) || is_str(val);
};

var assert = function assert(val, msg) {
    if (!val) throw new Error('' + msg);
};

var error = function error(msg) {
    throw new Error('' + msg);
};

var warn = function warn() {
    var _console;

    (_console = console).warn.apply(_console, arguments);
};

var log = function log() {
    var _console2;

    (_console2 = console).log.apply(_console2, arguments);
};

var to_str = function to_str(val) {
    return is_str(val) ? val : JSON.stringify(val);
};

var ar_str = function ar_str(val, separator) {
    return val.flat().join(separator);
};

var is_valid_text = function is_valid_text(val) {
    return typeof val === 'string' && val !== '';
};

var upper_first_char = function upper_first_char(val) {
    return val.charAt(0).toUpperCase() + val.slice(1);
};

var lower_first_char = function lower_first_char(val) {
    return val.charAt(0).toLowerCase() + val.slice(1);
};

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function value(search) {
            return this.lastIndexOf(search, 0) === 0;
        }
    });
}

if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        value: function value(search) {
            return this.indexOf(search, this.length - search.length) !== -1;
        }
    });
}

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (search, replacement) {
        var searchRegExp = new RegExp(search, 'g');
        return this.replace(searchRegExp, replacement);
    };
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        var mappy = args.length == 1 && is_object(args[0]);
        var opts = mappy ? args[0] : args;
        return this.replace(mappy ? /{([a-zA-Z_][0-9a-zA-Z_$]*)}/g : /{(\d+)}/g, function (match, key) {
            var arg = opts[key];
            return typeof arg == 'undefined' ? match : is_fun(arg) ? arg(key) : String(arg);
        });
    };
}

// file:query 2025-08-06T15:05:24.994Z
'use strict';

/**
 * simple node tool 
 * @returns selector func
 */

var query2selector = function query2selector() {
    "use strict";

    var parent = {};
    function _html2node(html) {
        if (html == undefined) return null;
        var div = document.createElement('div');
        div.innerHTML = html;
        return div.firstChild;
    }
    function _nodes2obj(nodes) {
        var obj = {};
        obj._nodes = nodes;
        obj.__proto__ = parent;
        return obj;
    }
    parent.size = function () {
        return this._nodes.length;
    };
    parent.each = function (fn) {
        for (var i = 0; i < this._nodes.length; i++) {
            fn(i, this._nodes[i]);
        }
        return this;
    };
    parent.class = function (name) {
        var results = [];
        this.each(function (i, node) {
            if (name != undefined) node.className = name;
            results.push(node.className);
        });
        return results;
    };
    parent.addClass = function (name) {
        name = name.replace(/ +/g, ' ');
        this.each(function (i, node) {
            var oldClass = node.className.replace(/ +/g, ' ');
            var newClass = oldClass + " " + name;
            node.className = newClass.replace(/ +/g, ' ');;
        });
    };
    parent.hasClass = function (name) {
        name = name.replace(/ +/g, ' ');
        var results = [];
        var reg = new RegExp("\\b" + name + "\\b", "gi");
        this.each(function (i, node) {
            var className = node.className;
            results.push(reg.test(className));
        });
        return results;
    };
    parent.delClass = function (name) {
        name = name.replace(/ +/g, ' ');
        var reg = new RegExp("\\b" + name + "\\b", "gi");
        this.each(function (i, node) {
            var oldClass = node.className.replace(/ +/g, ' ');
            var newClass = oldClass.replace(reg, " ");
            node.className = newClass.replace(/ +/g, ' ');
        });
    };
    parent.style = function (name, value, priority) {
        var results = [];
        this.each(function (i, node) {
            if (value === null) {
                node.style.removeProperty(name);
            } else if (value != undefined) {
                node.style.setProperty(name, value, priority);
            }
            results.push(node.style[name]);
        });
        return results;
    };
    parent.attr = function (name, value) {
        var results = [];
        this.each(function (i, node) {
            if (value === null) {
                node.removeAttribute(name);
            } else if (value != undefined) {
                node.setAttribute(name, value);
            }
            results.push(node.getAttribute(name));
        });
        return results;
    };
    parent.html = function (html) {
        var results = [];
        this.each(function (i, node) {
            if (html != undefined) node.innerHTML = html;
            results.push(node.innerHTML);
        });
        return results;
    };
    parent.append = function (html) {
        this.each(function (i, node) {
            var element = _html2node(html);
            if (element != null) node.appendChild(element);
        });
    };
    parent.prepend = function (html) {
        this.each(function (i, node) {
            var element = _html2node(html);
            if (element != null) node.insertBefore(element, node.firstChild);
        });
    };
    parent.after = function (html) {
        this.each(function (i, node) {
            var element = _html2node(html);
            if (element != null) node.parentNode.insertBefore(element, node.nextSibling);
        });
    };
    parent.before = function (html) {
        this.each(function (i, node) {
            var element = _html2node(html);
            if (element != null) node.parentNode.insertBefore(element, node);
        });
    };
    parent.nodes = function () {
        return this._nodes;
    };
    parent.delete = function () {
        this.each(function (i, node) {
            node.parentNode.removeChild(node);
        });
    };
    parent.text = function (text) {
        var results = [];
        this.each(function (i, node) {
            if (text != undefined) node.textContent = text;
            results.push(node.textContent);
        });
        return results;
    };
    parent.value = function (value) {
        return this.attr("value", value);
    };
    parent.listen = function (name, fn) {
        this.each(function (i, node) {
            var listenerTag = '__my_listener_for_' + name;
            var oldListener = node[listenerTag];
            if (oldListener != undefined) {
                node.removeEventListener(name, oldListener);
                node[listenerTag] = undefined;
            }
            if (fn != undefined && fn != null) {
                var newListener = function newListener(event) {
                    fn(i, node, event);
                };
                node[listenerTag] = newListener;
                node.addEventListener(name, newListener);
            }
        });
    };
    var selector = function selector() {
        var nodes = [];
        for (var i = 0; i < arguments.length; i++) {
            var argument = arguments[i];
            var r = document.querySelectorAll(argument);
            for (var j = 0; j < r.length; j++) {
                nodes.push(r[j]);
            }
        }
        return _nodes2obj(nodes);
    };
    return selector;
};

// file:state 2025-08-06T15:05:24.994Z
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * simple state tool 
 * @returns selector func
 */

var State = function () {

    var nilptr = {};
    var SMPLKY = "__";
    var protoPrx = { p: true };
    var protoRcd = { r: true };

    var __state = function __state(listener) {
        // 
        if (!listener) listener = function listener() {};
        // 
        var is_func = function is_func(val) {
            return typeof val == "function";
        };
        var is_bool = function is_bool(val) {
            return typeof val == "boolean";
        };
        var is_nill = function is_nill(val) {
            return val == null;
        };
        var assert = function assert(val, msg) {
            if (!val) throw new Error(msg);
        };
        // 
        return function (initial, callback) {
            //
            assert(is_nill(callback) || is_func(callback), 'invalid callback for State');
            //
            var record = null;
            var target = function target() {};
            var triggr = function triggr(isWrite, key) {
                return callback != null ? callback(isWrite, key) : listener(proxy, isWrite, key);
            };
            var isPrx = function isPrx(val) {
                return val != null && Object.getPrototypeOf(val) == protoPrx;
            };
            var isRcd = function isRcd(val) {
                return val != null && Object.getPrototypeOf(val) == protoRcd;
            };
            //
            var read = function read(key, pure) {
                var val = key != SMPLKY ? record[key] : record;
                return pure ? encode(val) : val;
            };
            var write = function write(key, value) {
                if (key == SMPLKY) {
                    record[SMPLKY] = value;
                } else if (is_simple(value) && isPrx(record[key])) {
                    record[key][SMPLKY] = value;
                } else {
                    record[key] = __state()(value, null, function (b, k) {
                        return triggr(b, k != SMPLKY ? key + "." + k : key);
                    });
                }
            };
            var decode = function decode(data) {
                record = _defineProperty({}, SMPLKY, nilptr);
                Object.setPrototypeOf(record, protoRcd);
                if (!is_object(data)) {
                    write(SMPLKY, data);
                } else {
                    Object.keys(data).forEach(function (key) {
                        return write(key, data[key]);
                    });
                }
            };
            var encode = function encode(value) {
                if (isPrx(value)) return value();
                if (!isRcd(value)) return value;
                if (value[SMPLKY] != nilptr) return value[SMPLKY];
                var data = {};
                Object.keys(value).forEach(function (key) {
                    var val = value[key];
                    if (key != SMPLKY) data[key] = isPrx(val) ? val(null, true) : val;
                });
                return data;
            };
            // 
            var handler = {
                has: function has(_, key) {
                    return key in target;
                },
                get: function get(_, key, receiver) {
                    var val = read(key, false);
                    return val;
                },
                set: function set(_, key, value) {
                    write(key, value);
                    triggr(true, key);
                },
                apply: function apply(_, thisArg, args) {
                    if (args[0] != null) {
                        decode(args[0]);
                        triggr(true, SMPLKY);
                    } else {
                        var val = read(SMPLKY, true);
                        if (!arguments[1]) triggr(false, SMPLKY);
                        return val;
                    }
                }
            };
            //
            var proxy = new Proxy(target, handler);
            Object.setPrototypeOf(proxy, protoPrx);
            decode(initial);
            return proxy;
        };
    };

    return new Proxy(function () {}, {
        apply: function apply(_, thisArg, args) {
            return __state(null).apply(undefined, _toConsumableArray(args));
        },
        construct: function construct(target, args) {
            if (args.length != 1 || typeof args[0] != 'function') throw new Error('invalid listener for State');
            return __state(args[0]);
        }
    });
}();

// file:tags 2025-08-06T15:05:24.994Z
"use strict";

/**
 * simple tag tool
 */

var _myNodeIdx = 0;
var _usedIdsMap = {};
var _listenArrays = [];

var __tag_boolean_targets = {
    button: ["disabled"]
};

var __tag_number_targets = {
    input: ["value"]
};

var __tag_string_targets = {
    a: ["href", "target"],
    link: ["href", "rel"],
    img: ["src"],
    video: ["src"],
    audio: ["src"],
    input: ["value"],
    textarea: ["value"]
};

// --------------------------------------------------------------------------

var __tags_stringfy = function __tags_stringfy(val, separator) {
    if (!is_str(separator)) {
        separator = " ";
    }
    if (is_fun(val)) {
        return val();
    } else if (is_arr(val)) {
        var str = "";
        for (var index = 0; index < val.length; index++) {
            var _val = val[index];
            _str = __tags_stringfy(_val, separator);
            _str = to_str(args.class);
            str = "" + str + separator + _str;
        }
        return str;
    } else {
        return to_str(val);
    }
};

var __tags_new_node = function __tags_new_node(tag, args) {
    _myNodeIdx++;
    var node = document.createElement(tag);
    var id = "my_id_" + _myNodeIdx;
    assert(_usedIdsMap[id] == null, "duplicated id for node: " + args);
    node.setAttribute('id', id);
    _usedIdsMap[id] = true;
    return node;
};

var __tags_new_child = function __tags_new_child(val) {
    if (is_dom(val)) {
        return val;
    } else if (is_num(val)) {
        var nod = document.createElement("span");
        nod.innerText = String(val);
        return nod;
    } else if (is_bol(val)) {
        var nod = document.createElement("mark");
        nod.innerText = String(val);
        return nod;
    } else if (is_str(val)) {
        var nod = document.createElement("p");
        nod.innerText = val;
        return nod;
    } else {
        var nod = document.createElement("div");
        nod.innerText = String(val);
        return nod;
    }
};

var __tags_try_fresh = function __tags_try_fresh(_func) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    for (var i = _listenArrays.length - 1; i >= 0; i--) {
        var element = _listenArrays[i];
        var node = element[0];
        var func = element[1];
        if (!is_fun(_func) || _func == func) {
            var rslt = func.apply(undefined, args);
            var temp = __tags_new_child(rslt);
            node.replaceWith(temp);
            element[0] = temp;
        }
    }
    _listenArrays = _listenArrays.filter(function (element) {
        return element.length == 2 || element[0].parentNode != null;
    });
};

// --------------------------------------------------------------------------

function __tags_new_tag(name, args) {
    var node = __tags_new_node(name, args);
    // 
    function __attribute(val, map) {
        var keys = map[name];
        if (!keys) {
            node.innerText = String(val);
            return;
        }
        for (var i = 0; i < keys.length; i++) {
            node.setAttribute(keys[i], val);
        }
    }
    //
    function __construct(val) {
        if (is_bol(val)) {
            __attribute(val, __tag_boolean_targets);
        } else if (is_num(val)) {
            __attribute(val, __tag_number_targets);
        } else if (is_str(val)) {
            __attribute(val, __tag_string_targets);
        }
    }
    //
    function __customize(args) {
        Object.keys(args).forEach(function (key) {
            var val = args[key];
            if (!is_str(key)) {
                return;
            } else if (key == "id") {
                node.setAttribute(key, val);
            } else if (key == "class") {
                var cls = __tags_stringfy(val);
                node.setAttribute(key, cls);
            } else if (key == "style") {
                var sty = __tags_stringfy(val);
                node.setAttribute(key, sty);
            } else if (key == "text") {
                node.innerText = val;
            } else if (key == "html") {
                node.innerHTML = val;
            } else if (key.toLowerCase().startsWith("on") && is_fun(val)) {
                node[key.toLowerCase()] = val;
            } else {
                node.setAttribute(key, val);
            }
        });
    }
    //
    function __append(arg) {
        if (is_fun(arg)) {
            var fun = arg;
            var rsp = fun(node);
            if (is_dom(rsp)) {
                var child = rsp;
                node.appendChild(child);
                _listenArrays.push([child, fun]);
            } else if (!is_nil(rsp)) {
                var child = __tags_new_child(rsp);
                node.appendChild(child);
                _listenArrays.push([child, fun]);
            }
        } else if (is_arr(arg)) {
            for (var index = 0; index < arg.length; index++) {
                var child = __tags_new_child(arg[index]);
                node.appendChild(child);
            }
        } else {
            var child = __tags_new_child(arg);
            node.appendChild(child);
        }
    }
    //
    var arg0 = args[0];
    var arg1 = args[1];
    if (is_simple(arg0) && is_object(arg1)) {
        __construct(args.shift());
        __customize(args.shift());
    } else if (is_simple(arg0)) {
        __construct(args.shift());
    } else if (is_object(arg0)) {
        __customize(args.shift());
    }
    for (var i = 0; i < args.length; i++) {
        __append(args[i]);
    }
    //
    return node;
}

// let tags = new Proxy((name, ...args) => {
//     if (name == null) return 
//     return __tags_new_tag(name, args);
// }, {
//     get: (target, name) => {
//         return target.bind(null, name);
//     }
// })


var tags = function tags(option) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
    }

    if (is_str(option)) {
        return __tags_new_tag(option, Array.prototype.slice.call(args));
    } else if (is_fun(option)) {
        return __tags_try_fresh.apply(undefined, [option].concat(args));
    } else {
        return __tags_try_fresh.apply(undefined, [option].concat(args));
    }
};

ALL_HTML_TAGA.forEach(function (tag) {
    var _tag = function _tag() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        return __tags_new_tag(tag, Array.prototype.slice.call(args));
    };
    tags[tag] = _tag;
    globalThis[tag] = _tag;
});

// file:template 2025-08-06T15:05:24.994Z
'use strict';

/**
 * https://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
 * simple template renderer
 * @param {*} html 
 * @returns renderer func
 */

var template2renderer = function template2renderer(html) {
    var re = /<%([^%>]+)?%>/g;
    var reExp = /(^( )+(if|for|else|switch|case|break|{|}))(.*)?/g;
    var code = 'var r=[];\\n';
    var cursor = 0;
    var match;
    var add = function add(line, js) {
        line = line.replace(/\n/g, " \\\n");
        if (js) {
            code += line.match(reExp) ? line + '\\n' : 'r.push(' + line + ');\\n';
        } else {
            line = line.replace(/\'/g, "\\'");
            code += line != '' ? 'r.push(\'' + line.replace(/"/g, '\\"') + '\');\\n' : '';
        }
        return add;
    };
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor), false);
    code += 'return r.join("");';
    code = code.replace(/\\t+|\\r\\n+|\\n+/g, '');
    var fun = new Function(code);
    var renderer = function renderer(args) {
        return fun.apply(args);
    };
    return renderer;
};

// file:html 2025-08-06T15:05:24.995Z
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * simple html tools
 * @param {*} map 
 * @returns renderer func
 */

var style2renderer = function style2renderer(map) {
    map = map || {};
    var lines = [];
    Object.keys(map).forEach(function (it) {
        var val = map[it];
        var key = it.replace('_', '-');
        lines.push(key + ': ' + val);
    });
    var text = lines.join(';');
    var renderer = function renderer() {
        for (var _len2 = arguments.length, _args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            _args[_key2] = arguments[_key2];
        }

        var out = text;
        for (var i = 0; i < _args.length; i++) {
            var arg = _args[i];
            var reg = new RegExp('\\{' + i + '\\}', 'g');
            out = out.replace(reg, arg);
        }
        return out;
    };

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return args.length != 0 ? renderer.apply(undefined, args) : renderer;
};

var style2text = function style2text(style) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
    }

    return style2renderer(style).apply(undefined, args);
};

var text2style = function text2style(text) {
    var lines = text.split(";");
    var style = {};
    lines.forEach(function (line) {
        var parts = line.split(":");
        if (parts.length != 2) return;

        var _parts = _slicedToArray(parts, 2),
            left = _parts[0],
            right = _parts[1];

        var key = left.replace('-', '_');
        style[key] = right;
    });
    return style;
};

var _node_attribute = function _node_attribute(node, key) {
    for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
    }

    var words = key.split(/(?=[A-Z])/);
    var op = words.shift();
    var nm = words.join("");
    var at = nm.toLowerCase() == 'attribute';
    var fn = op + 'Attribute';
    assert(fn != null && node[fn] != null, 'oparation ' + key + ' not found for node');
    return at ? node[fn].apply(node, args) : node[fn].apply(node, [nm].concat(args));
};

var _class_functions = {
    getClass: function getClass(node) {
        return node.classList.value;
    },
    hasClass: function hasClass(node) {
        return node.classList.contains(text);
    },
    setClass: function setClass(node, text) {
        return node.classList = text;
    },
    addClass: function addClass(node, text) {
        return node.classList.add(text);
    },
    delClass: function delClass(node, text) {
        return node.classList.remove(text);
    },
    togClass: function togClass(node, text) {
        return node.classList.toggle(text);
    }
};

var _style_functions = {
    setStyle: function setStyle(node, style) {
        for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
            args[_key5 - 2] = arguments[_key5];
        }

        assert(is_object(style), 'invalid style to node');
        // proxy: listen style change and update node
        var text = style2text.apply(undefined, [style].concat(args));
        assert(is_object(style), 'invalid style for node');
        node.style = text;
    },
    getStyle: function getStyle(node) {
        var text = node.style;
        var style = text2style(text);
        // proxy: listen style change and update node
        return style;
    },
    delStyle: function delStyle(node) {
        node.style += "all: initial;";
    }
};

var node2proxy = function node2proxy(node) {
    var proxy = new Proxy(node, {
        get: function get(target, key) {
            if (key == 'node') return node;
            return function () {
                for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                    args[_key6] = arguments[_key6];
                }

                return _node_attribute.apply(undefined, [node, key].concat(args));
            };
        }
    });
    Object.keys(_class_functions).forEach(function (name) {
        var func = _class_functions[name];
        node[name] = function () {
            for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                args[_key7] = arguments[_key7];
            }

            return func.apply(undefined, [node].concat(args));
        };
    });
    Object.keys(_style_functions).forEach(function (name) {
        var func = _style_functions[name];
        node[name] = function () {
            for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                args[_key8] = arguments[_key8];
            }

            return func.apply(undefined, [node].concat(args));
        };
    });
    node.proxy = proxy;
    return proxy;
};

////////////////////////////////////////////////////////////////////////////

var _myStyleId = "my_style";
var _html_function = function _html_function(args, func) {
    var _obj = {};
    _obj.addStyle = function (selector, info) {
        var style = style2text(info);
        var text = name + ' {\n' + style + '\n}';
        document.getElementById(_myStyleId).innerHTML += text;
    };
    _obj.getStyle = function (selector, key) {
        var element = document.querySelector(selector);
        var style = window.getComputedStyle(element);
        return key != undefined ? style.getPropertyValue(key) : style;
    };
    _obj.delStyle = function (selector) {
        var text = name + ' {\nall: initial;\n}';
        document.getElementById(_myStyleId).innerHTML += text;
    };
    _obj.addStyles = function (map) {
        Object.keys(map).forEach(function (key) {
            return _obj.addStyle(key, map[key]);
        });
    };
    _obj.setStyles = function (map) {
        document.querySelectorAll('style[id="' + _myStyleId + '"]').forEach(function (e) {
            return e.remove();
        });
        document.head.insertAdjacentHTML("beforeend", '<style id="' + _myStyleId + '"></style>');
        _obj.addStyles(map);
    };
    return _obj;
};

// file:markdown 2025-08-06T15:05:24.995Z
"use strict";

/**
 * simple markdown to html converter
 * @param {*} content 
 * @returns html text
 */

function markdown2html(content) {
    function parseSentence(sentence) {
        // code
        var r = /(.*)`(.*)`(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<code>" + r[2] + "</code>" + parseSentence(r[3]);
        // image
        r = /(.*)!\[(.*)\]\((.*)\)(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<img src='" + r[3] + "' alt='" + r[2] + "'>" + parseSentence(r[4]);
        // link
        r = /(.*)\[(.*)\]\((.*)\)(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<a href='" + r[3] + "'>" + r[2] + "</a>" + parseSentence(r[4]);
        // italic bold
        r = /(.*)[\_\*]{3,}(.*)[\_\*]{3,}(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<b><i>" + r[2] + "</i></b>" + parseSentence(r[3]);
        // bold
        r = /(.*)[\_\*]{2}(.*)[\_\*]{2}(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<b>" + r[2] + "</b>" + parseSentence(r[3]);
        // italic
        r = /(^|^\S+\s+)[\_\*]{1}(.*)[\_\*]{1}($|\s+\S*$)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<i>" + r[2] + "</i>" + parseSentence(r[3]);
        // delete
        r = /(.*)[~]{2,}(.*)[~]{2,}(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<del>" + r[2] + "</del>" + parseSentence(r[3]);
        // mark
        r = /(.*)\[\^(.*)\](.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<sup>" + r[2] + "</sup>" + parseSentence(r[3]);
        // not supported
        return sentence;
    }
    function parseLine(line) {
        // title
        var r = /^(#+)(.+)/g.exec(line);
        if (r) return "<h" + String(r[1].length) + ">" + parseSentence(r[2].trim()) + "</h" + String(r[1].length) + ">";
        // block
        var r = /^>(.*)/g.exec(line);
        if (r) return "<div>" + parseSentence(r[1]) + "</div>";
        // newline
        var r = /^([\*\_]{3,})/g.exec(line);
        if (r) return "<hr>";
        // paragraph
        if (line.length > 0) return "<p>" + parseSentence(line) + "</p>";
    }
    var lines = content.trim().split(/\r?\n\r?/);
    var cursor = 0;
    var results = [];
    while (cursor < lines.length) {
        var line = lines[cursor].trim();
        if (cursor == 0 && line.match(/^[\-]{3}/g)) {
            // comment
            while (lines[cursor + 1] != undefined && !lines[cursor + 1].match(/^[\-]{3}/g)) {
                cursor++;
            }
            cursor++;
        } else if (line.startsWith("```")) {
            // code
            results.push("<xmp>");
            cursor = cursor + 1;
            while (!lines[cursor].trim().startsWith("```")) {
                results.push(lines[cursor]);
                cursor++;
            }
            results.push("</xmp>");
        } else if (line.match(/^[\*\-\+] (.*)/g)) {
            // list
            results.push("<ul>");
            var r = /^[\*\-\+](.*)/g.exec(lines[cursor]);
            while (r) {
                results.push("<li>" + parseSentence(r[1]) + "</li>");
                cursor++;
                r = /^[\*\-\+](.*)/g.exec(lines[cursor]);
            }
            results.push("</ul>");
        } else if (line.startsWith("|")) {
            // table
            var row = 0;
            results.push("<table>");
            var r = /^[\|](.*)/g.exec(lines[cursor]);
            while (r) {
                row++;
                results.push("<tr>");
                var arr = r[0].split("|");
                for (var i = 1; i < arr.length - 1; i++) {
                    results.push(row == 1 ? "<th>" + parseSentence(arr[i].trim()) + "</th>" : "<td>" + parseSentence(arr[i].trim()) + "</td>");
                }
                results.push("<tr>");
                cursor++;
                r = /^[\|](.*)/g.exec(lines[cursor]);
            }
            results.push("</table>");
        } else if (line.length == 0) {
            // wrapline
            while (lines[cursor + 1] != undefined && lines[cursor + 1].length == 0) {
                cursor++;
                results.push("<br>");
            }
        } else {
            // inline
            var result = parseLine(line);
            if (result) results.push(result);
        }
        cursor = cursor + 1;
    }
    return results.join("\n");
}
