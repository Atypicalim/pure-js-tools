### Pure JS Tools

0. About

> there are some useful tools for js, u can link them with script tag and enjoy the tools ...

1. template

```javascript
var template = `template test, hello <% this.name %> ...`;
var renderer = template2renderer(template);
var html = renderer({name: "someone",});
console.log(html);
// template test, hello someone ...
```

2. query

```javascript
var $ = query2selector();
var obj = $("div");
obj.style("color", "blue");
```

3. markdown

```javascript
var mark = "## title text";
var html = markdown2html(mark);
console.log(html);
// <h2>title text</h2>
```

4. style

```javascript
var style = {
    color: "{0}",
    font_size: "{1}px",
}
let renderer = style2renderer(style);
let text = renderer("#00ff00", 16);
console.log(text);
// color: #00ff00; font-size: 16px
```

5. State

```javascript
let state = new State((prxy, isWrite, key) => {
    console.log("changed:", isWrite, key);
})
let proxy = state({
    a: "aaa",
    b: {c: "ccc"}
});
console.log("before:", proxy.b.c());
proxy.b.c = "c..."
console.log("after:", proxy.b.c());
// changed: false b.c
// before: ccc
// changed: true b.c
// changed: false b.c
// after: c...
```

---

> for more feture plz read the source code ...
