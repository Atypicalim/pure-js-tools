
/**
 * simple state tool 
 * @returns selector func
 */


 let State = function() {

    const nilptr = {};
    const SMPLKY = "__";
    const protoPrx = {p: true};
    const protoRcd = {r: true};
   
   let __state = (listener) => {
       // 
       if (!listener) listener = () => {};
       // 
       let is_func = (val) => typeof val == "function";
       let is_bool = (val) => typeof val == "boolean";
       let is_nill = (val) => val == null;
       let assert = (val, msg) => { if (!val) throw new Error(msg) };
       // 
       return (initial, plain, callback) => {
           //
           assert(is_nill(plain) || is_bool(plain), 'invalid plain for State');
           assert(is_nill(callback) || is_func(callback), 'invalid callback for State');
           //
           let record = null;
           const target = () => {};
           const triggr = (isWrite, key) => callback != null ? callback(isWrite, key) : listener(proxy, isWrite, key);
           const isObj = (val) => !Array.isArray(val) && typeof val == 'object';
           const isPrx = (val) => Object.getPrototypeOf(val) == protoPrx;
           const isRcd = (val) => Object.getPrototypeOf(val) == protoRcd;
           //
           const read = (key, pure) => {
               let val = key != SMPLKY ? record[key] : record;
               return pure ? encode(val) : val;
           }
           const write = (key, value) => {
               if (key == SMPLKY) {
                   record[SMPLKY] = value;
               } else if (plain) {
                   record[key] = value;
               } else {
                   record[key] = __state()(value, null, (b, k) => triggr(b, k != SMPLKY ? key + "." + k : key));
               }
           }
           const decode = (data) => {
               record = {[SMPLKY]: nilptr};
               Object.setPrototypeOf(record, protoRcd);
               if (!isObj(data)) {
                   write(SMPLKY, data);
               } else {
                   Object.keys(data).forEach(key => write(key, data[key]));
               }
           }
           const encode = (value) => {
               if (isPrx(value)) return value();
               if (!isRcd(value)) return value;
               if (value[SMPLKY] != nilptr) return value[SMPLKY];
               let data = {};
               Object.keys(value).forEach((key) => {
                   let val = value[key];
                   if (key != SMPLKY) data[key] = (isPrx(val) ? val(null, true) : val);
               });
               return data;
           }
           // 
           const handler = {
               has(_, key) {
                   return key in target;
               },
               get(_, key, receiver) {
                   let val = read(key, false);
                   if (plain) triggr(false, key);
                   return val;
               },
               set(_, key, value) {
                   write(key, value);
                   triggr(true, key);
               },
               apply(_, thisArg, arguments) {
                   if (arguments[0] != null) {
                       decode(arguments[0]);
                       triggr(true, SMPLKY);
                   } else {
                       let val = read(SMPLKY, true);
                       if (!arguments[1]) triggr(false, SMPLKY);
                       return val;
                   }
               },
           };
           // 
           const proxy = new Proxy(target, handler);
           Object.setPrototypeOf(proxy, protoPrx);
           decode(initial);
           return proxy;
       }
   }

   return new Proxy(function() {}, {
       apply(_, thisArg, args) {
           return __state(null)(...args);
       },
       construct(target, args) {
           if (args.length != 1 || typeof args[0] != 'function') throw new Error('invalid listener for State');
           return __state(args[0]);
       },
   });
   
}()
