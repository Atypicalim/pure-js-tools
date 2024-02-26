
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

// node

let _myNodeIdx = 0;
let _usedIdsMap = {};
let _listenArrays = [];
let _myNodeAct = {
    img(node, args) {
        node.setAttribute('src', args.src || "");
        node.setAttribute('alt', args.src || "...");
    },
    button(node, args) {
        node.setAttribute('type', args.type || "button")
    }
}

let __fresh = () => {
    for (let i = _listenArrays.length - 1; i >= 0; i--) {
        const element = _listenArrays[i];
        const node = element[0];
        const func = element[1];
        const rslt = func();
        const temp = is_dom(rslt) ? rslt : document.createTextNode(rslt);
        node.replaceWith(temp);
        element[0] = temp;
    }
    _listenArrays = _listenArrays.filter((element) => element.length == 2 || element[0].parentNode != null)
}

let __node = (tag, arg1, arg2, arg3, ...children) => {
    // 
    let args = {};
    let styl = {};
    let childs = [];
    if (is_object(arg1) && is_object(arg2)) {
        args = arg1;
        styl = arg2;
        childs = (is_arr(arg3) ? arg3 : [arg3]); childs.push(...children);
    } else if (is_object(arg1)) {
        args = arg1;
        childs = (is_arr(arg2) ? arg2 : [arg2]); childs.push(arg3, ...children);
    } else {
        childs = (is_arr(arg1) ? arg1 : [arg1]); childs.push(arg2, arg3, ...children);
    }
    // 
    _myNodeIdx++;
    let node = document.createElement(tag);
    let id = args.id != null ? `${args.id}` : `my_id_${_myNodeIdx}`;
    let cls = is_arr(args.class) ? ar_str(args.class, " ") : to_str(args.class);
    assert(_usedIdsMap[id] == null, `duplicated id for node: ${args}`);
    node.setAttribute('id', id);
    node.setAttribute('class', cls);
    // 
    let styArgs = is_str(args.style) ? args.style : style2text(args.style);
    let styStyl = style2text(styl);
    let styAlll = styArgs + ";" + styStyl;
    node.setAttribute('style', styAlll);
    //
    childs.forEach((child) => {
        if (is_nil(child)) return;
        if (is_str(child)) child = document.createTextNode(child);
        if (is_fun(child)) {
            let func = child;
            let rslt = func();
            let node = is_dom(rslt) ? rslt : document.createTextNode(rslt);
            _listenArrays.push([node, func]);
            child = node;
        }
        node.appendChild(child)
    })
    //
    Object.keys(args).forEach((key) => {
        let val = args[key];
        if (!is_str(key)) {
            return;
        } else if (key.toLowerCase().startsWith("on") && is_fun(val)) {
            node[key.toLowerCase()] = val;
        } else if (!['id', 'class', 'style'].includes(key)) {
            node.setAttribute(key, val);
        }
    })
    //
    if (_myNodeAct[tag]) _myNodeAct[tag](node, args);
    _usedIdsMap[id] = true;
    return node;
}

let tags = new Proxy((name, ...args) => {
    if (name == null) return __fresh();
    return __node(name, ...args);
}, {
    get: (target, name) => {
        return target.bind(null, name);
    }
})

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


