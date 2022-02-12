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

---

> for more feture plz read the source code ...
