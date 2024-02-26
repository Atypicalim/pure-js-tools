
let is_nil = (val) => val == null;

let is_num = (val) => typeof val == 'number';

let is_bol = (val) => typeof val == 'boolean';

let is_str = (val) => typeof val == 'string';

let is_fun = (val) => typeof val == 'function';

let is_dom = (val) => val instanceof Node;

let is_arr = (val) => Array.isArray(val);

let is_object = (val) => typeof val == 'object' && !is_arr(val) && !is_dom(val);

let is_simple = (val) => is_nil(val) || is_num(val) || is_bol(val) || is_str(val);

let assert = (val, msg) => { if (!val) throw new Error(`${msg}`); }

let error = (msg) => {throw new Error(`${msg}`)};

let warn = (...args) => {console.warn(...args)};

let log = (...args) => {console.log(...args)};

let to_str = (val) => is_str(val) ? val : JSON.stringify(val);

let ar_str =(val, separator) => val.flat().join(separator);

let is_valid_text = (val) => typeof val === 'string' && val !== '';

let upper_first_char = (val) =>  val.charAt(0).toUpperCase() + val.slice(1);

let lower_first_char = (val) =>  val.charAt(0).toLowerCase() + val.slice(1);
