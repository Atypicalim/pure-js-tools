
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
    }
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
