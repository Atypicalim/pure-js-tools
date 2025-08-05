
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
    let id = args.id != null ? `${args.id}` : `my_id_${_myNodeIdx}`;
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

let __tags_try_fresh = () => {
    for (let i = _listenArrays.length - 1; i >= 0; i--) {
        const element = _listenArrays[i];
        const node = element[0];
        const func = element[1];
        const rslt = func();
        const temp = __tags_new_child(rslt);
        node.replaceWith(temp);
        element[0] = temp;
    }
    _listenArrays = _listenArrays.filter((element) => element.length == 2 || element[0].parentNode != null)
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
            if (!is_str(key) || key == "id") {
                return;
            } else if (key == "text") {
                node.innerText = val;
            } else if (key == "html") {
                node.innerHTML = val;
            } else if (key == "class") {
                var cls = __tags_stringfy(val);
                node.setAttribute(key, cls);
            } else if (key == "style") {
                var sty = __tags_stringfy(val);
                node.setAttribute(key, sty);
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
    } else if (is_simple(arg0) && args.length == 1) {
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


let tags = {};
// let tags = new Proxy((name, ...args) => {
//     if (name == null) return __tags_try_fresh();
//     return __tags_new_tag(name, args);
// }, {
//     get: (target, name) => {
//         return target.bind(null, name);
//     }
// })

ALL_HTML_TAGA.forEach(function(tag) {
    function _tag() {
        return __tags_new_tag(tag, Array.prototype.slice.call(arguments))
    }
    tags[tag] = _tag;
    globalThis[tag] = _tag
});
