
const fs = require('fs');

let folder = "./src/"
let orders = [
    "constants",
    "javascript",
    "query",
    "state",
    "template",
    "markdown",
    "html",
]

// for (let i = 0; i < orders.length; i++) {
//     const name = orders[i];
//     const path = `${folder}${name}.js`
//     const module = require(path);
//     console.log(path, module);
// }

function build() {
    let texts = []
    for (let i = 0; i < orders.length; i++) {
        const name = orders[i];
        const path = `${folder}${name}.js`
        console.log("contain:", path);
        const date = new Date().toISOString();
        const head = `// file:${name} ${date}`
        const data = fs.readFileSync(path, 'utf8');
        texts.push(head + "\n" + data);
    }
    let _text = texts.join("\n");
    fs.writeFileSync('./tools.js', _text, 'utf8');
}
build()