
/**
 * simple tag tool
 * @returns selector func
 */


var tags = {};

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

function __tag(name, args) {
    var node = document.createElement(name);
    // 
    function __attribute(val, map) {
        var keys = map[name];
        if (keys) {
            for (var i = 0; i < keys.length; i++) {
                node.setAttribute(keys[i], val);
            }
        } else {
            node.innerText = String(val);
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
    function __customize(params) {
        for (var key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                var val = params[key];
                node.setAttribute(key, val);
            }
        }
    }
    //
    function __create(val) {
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
    //
    function __append(arg) {
        if (is_fun(arg)) {
            var rsp = arg(node)
            if (is_dom(rsp)) {
                node.appendChild(child);
            } else if (!is_nil(rsp)) {
                var child = __create(rsp);
                node.appendChild(child);
            }
        } else if (is_arr(arg)) {
            for (var index = 0; index < arg.length; index++) {
                var child = __create(arg[index]);
                node.appendChild(child);
            }
        } else {
            var child = __create(arg);
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
    return node;
}


ALL_HTML_TAGA.forEach(function(tag) {
    function _tag() {
        return __tag(tag, Array.prototype.slice.call(arguments))
    }
    globalThis[tag] = _tag
    tags[tag] = _tag
});
