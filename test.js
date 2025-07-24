
const fs = require('fs');
const { exec } = require('child_process');

let FOLDER_SOURCE = "./src/";
let FOLDER_BUILD = "./build/";

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
//     const path = `src/${folder}${name}.js`
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
    var output = await _execute(`npm install ${name}`);
    _print(`installed!\n`);
    return output;
}

async function _compile(name) {
    _print(`compiling ${name} ...`);
    var preset = `--presets babel-preset-es2015`;
    var outfile = `--out-file ./build/${name}.js`;
    var output = await _execute(`npx babel ./src/${name}.js ${outfile} ${preset}`);
    _print(`compiled!\n`);
    return output;
}

async function initialize() {
    var version = await _execute("node -v");
    _print(`node:${version}`);
    fs.mkdirSync("./build", { recursive: true });
    await _install("axios");
    await _execute("npm uninstall babel");
    await _install("babel-cli");
    await _install("babel-preset-es2015");
}

async function compile() {
    for (let i = 0; i < orders.length; i++) {
        const name = orders[i];
        await _compile(name);
    }
}

async function merge(folder, target) {
    _print(`merging ${target} ...`);
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
    fs.writeFileSync(target, _text, 'utf8');
    _print(`merged!\n`);
}

async function _start() {
    await initialize()
    await compile()
    await merge(FOLDER_SOURCE, "./tools.js")
    await merge(FOLDER_BUILD, "./tool5.js")
    _print(`Finish!\n`);
}
_start()
