
const fs = require('fs');
const { exec } = require('child_process');

let folder = "./src/"
let orders = [
    "constants",
    "javascript",
    "query",
    "state",
    "tags",
    "template",
    "html",
    "markdown",
]

// for (let i = 0; i < orders.length; i++) {
//     const name = orders[i];
//     const path = `${folder}${name}.js`
//     const module = require(path);
//     console.log(path, module);
// }

const TAG = "[PACKER]";

function _print(...args) {
    console.log(TAG, ...args);
}

function _error(...args) {
    console.warn(TAG, ...args);
}

function _execute(command) {
    _print("Executing:", command);
    return new Promise((resolve, reject) => {
        exec(`${command}`, (error, stdout, stderr) => {
            if (error) {
                _error(`Error: ${stderr}`);
                resolve(undefined);
            } else {
                // _print("Executed:", stdout);
                resolve(stdout);
            }
        });
    });
}

async function _install(name) {
    _print(`installing ${name} ...`);
    var output = await _execute(`npm install -g ${name}`);
    _print(`installed!\n`);
    return output;
}

async function _compile(name) {
    _print(`compiling ${name} ...`);
    var output = await _execute(`npx babel ./src/${name}.js --out-file ./build/${name}.js`);
    _print(`compiled!\n`);
    return output;
}

async function initialize() {
    var version = await _execute("node -v");
    _print(`node:${version}`);
    fs.mkdirSync("./build", { recursive: true });
    await _install("axios");
    await _execute("npm uninstall -g babel");
    await _install("babel-cli");
}

async function compile() {
    for (let i = 0; i < orders.length; i++) {
        const name = orders[i];
        await _compile(name);
    }
}

async function merge() {
    _print(`merging ...`);
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
    _print(`merged ...`);
}

async function _start() {
    await initialize()
    await compile()
    // await merge()
}
_start()
