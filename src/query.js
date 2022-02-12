
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
