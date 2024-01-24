
let assert = (val, msg) => {if (!val) throw new Error(`${msg}`)};

let error = (msg) => {throw new Error(`${msg}`)};

let warn = (...args) => {console.warn(...args)};

let log = (...args) => {console.log(...args)};

let is_function = (val) => typeof val === "function";

let is_array = (val) => Array.isArray(val);

let is_object = (val) => typeof val === "object" && val.constructor === Object;

let is_null = (val) => val === null || val == undefined;

let is_number = (val) => !isNaN(val);

let is_string = (val) => typeof val === 'string';

let is_valid_text = (val) => typeof val === 'string' && val !== '';

let upper_first_char = (val) =>  val.charAt(0).toUpperCase() + val.slice(1);

let lower_first_char = (val) =>  val.charAt(0).toLowerCase() + val.slice(1);
