// file:constants 2025-08-06T12:19:35.805Z


let ALL_HTML_TAGA = [
    'head', 'title', 'base', 'link', 'meta', 'script', 'style',
    'div',
    'span',
    'p',
    'br', 'hr',
    'b', 'strong', 'i', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup',
    'code', 'kbd', 'samp', 'var', 'pre',
    'abbr', 'address', 'bdo', 'blockquote', 'cite', 'q',
    'a',
    'button',
    'img', 'map', 'area', 'picture',
    'audio', 'video', 'source', 'track',
    'canvas',
    'svg',
    'iframe',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'table', 'tbody', 'tfoot', 'thead', 'th', 'tr', 'td', 'col', 'colgroup', 'caption',
    "form", "input", "output", "button", "label", "textarea", "select", "option",
    "fieldset", "legend", "optgroup", "datalist", "keygen",
];
// file:javascript 2025-08-06T12:19:35.806Z

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

let is_dom = (val) => val instanceof Node;

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

// file:query 2025-08-06T12:19:35.806Z

/**
 * simple node tool 
 * @returns selector func
 */

 var query2selector = function() {
    "use strict";
    var parent = {};
    function _html2node(html) {
        if (html == undefined) return null;
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.firstChild;
    }
    function _nodes2obj(nodes) {
        var obj = {};
        obj._nodes = nodes;
        obj.__proto__ = parent;
        return obj;
    }
    parent.size = function() {
        return this._nodes.length;
    }
    parent.each = function(fn) {
        for(var i = 0 ;i< this._nodes.length; i++){
            fn(i, this._nodes[i]);
        }
        return this;
    }
    parent.class = function(name) {
        var results = [];
        this.each(function(i, node) {
            if(name != undefined) node.className = name;
            results.push(node.className);
        })
        return results;
    }
    parent.addClass = function(name) {
        name = name.replace(/ +/g, ' ');
        this.each(function(i, node) {
            var oldClass = node.className.replace(/ +/g, ' ');
            var newClass = oldClass + " " + name;
            node.className = newClass.replace(/ +/g, ' ');;
        })
    }
    parent.hasClass = function(name) {
        name = name.replace(/ +/g, ' ');
        var results = [];
        var reg = new RegExp("\\b" + name + "\\b", "gi");
        this.each(function(i, node) {
            var className = node.className;
            results.push(reg.test(className));
        })
        return results;
    }
    parent.delClass = function(name) {
        name = name.replace(/ +/g, ' ');
        var reg = new RegExp("\\b" + name + "\\b", "gi");
        this.each(function(i, node) {
            var oldClass = node.className.replace(/ +/g, ' ');
            var newClass = oldClass.replace(reg, " ");
            node.className = newClass.replace(/ +/g, ' ');
        })
    }
    parent.style = function(name, value, priority) {
        var results = [];
        this.each(function(i, node) {
            if (value === null) {
                node.style.removeProperty(name);
            } else if (value != undefined) {
                node.style.setProperty(name, value, priority);
            }
            results.push(node.style[name]);
        })
        return results;
    }
    parent.attr = function(name, value) {
        var results = [];
        this.each(function(i, node) {
            if (value === null) {
            node.removeAttribute(name);
            } else if (value != undefined) {
                node.setAttribute(name, value);
            }
            results.push(node.getAttribute(name));
        })
        return results;
    }
    parent.html = function(html) {
        var results = [];
        this.each(function(i, node) {
            if (html != undefined) node.innerHTML = html;
            results.push(node.innerHTML);
        })
        return results;
    }
    parent.append = function(html) {
        this.each(function(i, node) {
            const element = _html2node(html);
            if (element != null) node.appendChild(element);
        })
    }
    parent.prepend = function(html) {
        this.each(function(i, node) {
            const element = _html2node(html);
            if (element != null) node.insertBefore(element, node.firstChild);
        })
    }
    parent.after = function(html) {
        this.each(function(i, node) {
            const element = _html2node(html);
            if (element != null) node.parentNode.insertBefore(element, node.nextSibling);
        })
    }
    parent.before = function(html) {
        this.each(function(i, node) {
            const element = _html2node(html);
            if (element != null) node.parentNode.insertBefore(element, node);
        })
    }
    parent.nodes = function() {
        return this._nodes;
    }
    parent.delete = function() {
        this.each(function(i, node) {
            node.parentNode.removeChild(node);
        })
    }
    parent.text = function(text) {
        var results = [];
        this.each(function(i, node) {
            if (text != undefined) node.textContent = text;
            results.push(node.textContent);
        })
        return results;
    }
    parent.value = function(value) {
        return this.attr("value", value);
    }
    parent.listen = function(name, fn) {
        this.each(function(i, node) {
            var listenerTag = '__my_listener_for_' + name
            var oldListener = node[listenerTag]
            if (oldListener != undefined) {
                node.removeEventListener(name, oldListener);
                node[listenerTag] = undefined;
            }
            if (fn != undefined && fn != null) {
                var newListener = function(event) {
                    fn(i, node, event);
                };
                node[listenerTag] = newListener;
                node.addEventListener(name, newListener)
            }
        })
    }
    var selector = function() {
        var nodes = [];
        for(var i=0; i <arguments.length; i++) {
            var argument = arguments[i];
            var r = document.querySelectorAll(argument);
            for (var j = 0; j < r.length; j++) {
                nodes.push(r[j]);
            }
        }
        return _nodes2obj(nodes);
    }
    return selector;
}

// file:state 2025-08-06T12:19:35.806Z

/**
 * simple state tool 
 * @returns selector func
 */


let State = function() {

    const nilptr = {};
    const SMPLKY = "__";
    const protoPrx = {p: true};
    const protoRcd = {r: true};

    let __state = (listener) => {
        // 
        if (!listener) listener = () => {};
        // 
        let is_func = (val) => typeof val == "function";
        let is_bool = (val) => typeof val == "boolean";
        let is_nill = (val) => val == null;
        let assert = (val, msg) => { if (!val) throw new Error(msg) };
        // 
        return (initial, callback) => {
            //
            assert(is_nill(callback) || is_func(callback), 'invalid callback for State');
            //
            let record = null;
            const target = () => {};
            const triggr = (isWrite, key) => callback != null ? callback(isWrite, key) : listener(proxy, isWrite, key);
            const isPrx = (val) => val != null && Object.getPrototypeOf(val) == protoPrx;
            const isRcd = (val) => val != null && Object.getPrototypeOf(val) == protoRcd;
            //
            const read = (key, pure) => {
                let val = key != SMPLKY ? record[key] : record;
                return pure ? encode(val) : val;
            }
            const write = (key, value) => {
                if (key == SMPLKY) {
                    record[SMPLKY] = value;
                } else if (is_simple(value) && isPrx(record[key])) {
                    record[key][SMPLKY] = value;
                } else {
                    record[key] = __state()(value, null, (b, k) => triggr(b, k != SMPLKY ? key + "." + k : key));
                }
            }
            const decode = (data) => {
                record = {[SMPLKY]: nilptr};
                Object.setPrototypeOf(record, protoRcd);
                if (!is_object(data)) {
                    write(SMPLKY, data);
                } else {
                    Object.keys(data).forEach(key => write(key, data[key]));
                }
            }
            const encode = (value) => {
                if (isPrx(value)) return value();
                if (!isRcd(value)) return value;
                if (value[SMPLKY] != nilptr) return value[SMPLKY];
                let data = {};
                Object.keys(value).forEach((key) => {
                    let val = value[key];
                    if (key != SMPLKY) data[key] = (isPrx(val) ? val(null, true) : val);
                });
                return data;
            }
            // 
            const handler = {
                has(_, key) {
                    return key in target;
                },
                get(_, key, receiver) {
                    let val = read(key, false);
                    return val;
                },
                set(_, key, value) {
                    write(key, value);
                    triggr(true, key);
                },
                apply(_, thisArg, args) {
                    if (args[0] != null) {
                        decode(args[0]);
                        triggr(true, SMPLKY);
                    } else {
                        let val = read(SMPLKY, true);
                        if (!arguments[1]) triggr(false, SMPLKY);
                        return val;
                    }
                },
            };
            //
            const proxy = new Proxy(target, handler);
            Object.setPrototypeOf(proxy, protoPrx);
            decode(initial);
            return proxy;
        }
    }

    return new Proxy(function() {}, {
        apply(_, thisArg, args) {
            return __state(null)(...args);
        },
        construct(target, args) {
            if (args.length != 1 || typeof args[0] != 'function') throw new Error('invalid listener for State');
            return __state(args[0]);
        },
    });

}()

// file:tags 2025-08-06T12:19:35.807Z

/**
 * simple tag tool
 */

let _myNodeIdx = 0;
let _usedIdsMap = {};
let _listenArrays = [];

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
    textarea: ["value"],
};

// --------------------------------------------------------------------------

let __tags_stringfy = (val, separator) => {
    if (!is_str(separator)) {
        separator = " ";
    }
    if (is_fun(val)) {
        return val();
    } else if (is_arr(val)) {
        let str = "";
        for (let index = 0; index < val.length; index++) {
            const _val = val[index];
            _str = __tags_stringfy(_val, separator);
            _str = to_str(args.class);
            str = `${str}${separator}${_str}`;
        }
        return str;
    } else {
        return to_str(val);
    }
}

let __tags_new_node = (tag, args) => {
    _myNodeIdx++;
    let node = document.createElement(tag);
    let id = `my_id_${_myNodeIdx}`;
    assert(_usedIdsMap[id] == null, `duplicated id for node: ${args}`);
    node.setAttribute('id', id);
    _usedIdsMap[id] = true;
    return node;
}

let __tags_new_child = (val) => {
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
}

let __tags_try_fresh = (_func, ...args) => {
    for (let i = _listenArrays.length - 1; i >= 0; i--) {
        const element = _listenArrays[i];
        const node = element[0];
        const func = element[1];
        if (!is_fun(_func) || _func == func) {
            const rslt = func(...args);
            const temp = __tags_new_child(rslt);
            node.replaceWith(temp);
            element[0] = temp;
        }
    }
    _listenArrays = _listenArrays.filter((element) => {
        return element.length == 2 || element[0].parentNode != null;
    })
}

// --------------------------------------------------------------------------

function __tags_new_tag(name, args) {
    var node = __tags_new_node(name, args);
    // 
    function __attribute(val, map) {
        var keys = map[name];
        if (!keys) {
            node.innerText = String(val);
            return
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
            var rsp = fun(node)
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


let tags = (option, ...args) => {
    if (is_str(option)) {
        return __tags_new_tag(option, Array.prototype.slice.call(args));
    } else if (is_fun(option)) {
        return __tags_try_fresh(option, ...args);
    } else {
        return __tags_try_fresh(option, ...args);
    }
}

ALL_HTML_TAGA.forEach((tag) => {
    let _tag = (...args) => {
        return __tags_new_tag(tag, Array.prototype.slice.call(args));
    }
    tags[tag] = _tag;
    globalThis[tag] = _tag
});

// file:template 2025-08-06T12:19:35.807Z

/**
 * https://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
 * simple template renderer
 * @param {*} html 
 * @returns renderer func
 */

var template2renderer = function(html) {
    var re = /<%([^%>]+)?%>/g;
    var reExp = /(^( )+(if|for|else|switch|case|break|{|}))(.*)?/g;
    var code = 'var r=[];\\n';
    var cursor = 0;
    var match;
    var add = function(line, js) {
        line = line.replace(/\n/g, " \\\n");
        if (js) {
            code += line.match(reExp) ? line + '\\n' : 'r.push(' + line + ');\\n';
        } else {
            line = line.replace(/\'/g, "\\'");
            code += line != '' ? 'r.push(\'' + line.replace(/"/g, '\\"') + '\');\\n' : '';
        }
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor), false);
    code += 'return r.join("");';
    code = code.replace(/\\t+|\\r\\n+|\\n+/g, '');
    var fun = new Function(code);
    var renderer = function(args) {
        return fun.apply(args);
    }
    return renderer;
}

// file:html 2025-08-06T12:19:35.807Z

/**
 * simple html tools
 * @param {*} map 
 * @returns renderer func
 */

 var style2renderer = function(map, ...args) { 
    map = map || {}
    let lines = [];
    Object.keys(map).forEach((it) => {
        let val = map[it];
        let key = it.replace('_', '-');
        lines.push(`${key}: ${val}`);
    });
    let text = lines.join(';');
    let renderer = (..._args) => {
        let out = text;
        for (let i = 0; i < _args.length; i++) {
            const arg = _args[i];
            const reg = new RegExp(`\\{${i}\\}`, 'g');
            out = out.replace(reg, arg);
        }
        return out;
    }
    return args.length != 0 ? renderer(...args) : renderer;
}

var style2text = (style, ...args) => {
    return style2renderer(style)(...args);
}

var text2style = (text) => {
    let lines = text.split(";");
    let style = {};
    lines.forEach((line) => {
        let parts = line.split(":");
        if (parts.length != 2) return;
        let [left, right] = parts;
        let key = left.replace('-', '_');
        style[key] = right;
    })
    return style;
}

let _node_attribute = (node, key, ...args) => {
    let words = key.split(/(?=[A-Z])/);
    let op = words.shift();
    let nm = words.join("");
    let at = nm.toLowerCase() == 'attribute';
    let fn = `${op}Attribute`;
    assert(fn != null && node[fn] != null, `oparation ${key} not found for node`);
    return at ? node[fn](...args) : node[fn](nm, ...args);
}

let _class_functions = {
    getClass: (node) => node.classList.value,
    hasClass: (node) =>  node.classList.contains(text),
    setClass: (node, text) => node.classList = text,
    addClass: (node, text) => node.classList.add(text),
    delClass: (node, text) => node.classList.remove(text),
    togClass: (node, text) => node.classList.toggle(text),
}

let _style_functions = {
    setStyle: (node, style, ...args) => {
        assert(is_object(style), 'invalid style to node')
        // proxy: listen style change and update node
        let text = style2text(style, ...args);
        assert(is_object(style), 'invalid style for node');
        node.style = text;
    },
    getStyle: (node) => {
        let text = node.style;
        let style = text2style(text);
        // proxy: listen style change and update node
        return style;
    },
    delStyle: (node) => {
        node.style += "all: initial;";
    },
}

var node2proxy = function(node) {
    let proxy = new Proxy(node, {
        get(target, key) {
            if (key == 'node') return node;
            return (...args) => _node_attribute(node, key, ...args);
        },
    });
    Object.keys(_class_functions).forEach((name) => {
        let func = _class_functions[name];
        node[name] = (...args) => func(node, ...args);
    });
    Object.keys(_style_functions).forEach((name) => {
        let func = _style_functions[name];
        node[name] = (...args) => func(node, ...args);
    });
    node.proxy = proxy;
    return proxy;
}

////////////////////////////////////////////////////////////////////////////

let _myStyleId = "my_style";
let _html_function = (args, func) => {
    let _obj = {}
    _obj.addStyle = (selector, info) => {
        let style = style2text(info);
        let text = `${name} {\n${style}\n}`;
        document.getElementById(_myStyleId).innerHTML += text;
    }
    _obj.getStyle = (selector, key) => {
        const element = document.querySelector(selector);
        const style = window.getComputedStyle(element);
        return key != undefined ? style.getPropertyValue(key) : style;
    }
    _obj.delStyle = (selector) => {
        let text = `${name} {\nall: initial;\n}`;
        document.getElementById(_myStyleId).innerHTML += text;
    }
    _obj.addStyles = (map) => {
        Object.keys(map).forEach((key) => _obj.addStyle(key, map[key]));
    }
    _obj.setStyles = (map) => {
        document.querySelectorAll(`style[id="${_myStyleId}"]`).forEach(e => e.remove());
        document.head.insertAdjacentHTML("beforeend", `<style id="${_myStyleId}"></style>`);
        _obj.addStyles(map);
    }
    return _obj;
}



// file:markdown 2025-08-06T12:19:35.808Z

/**
 * simple markdown to html converter
 * @param {*} content 
 * @returns html text
 */

function markdown2html(content)
{
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
