//import type { BigNumber, BigNumberish } from "./big-number";
//import type { Bytes, BytesLike } from "./bytes";
//import type { Signature, SignatureLike } from "./signature";
/*
export type Loose<T> = T extends BigNumber ? BigNumberish:
                       T extends number ? BigNumberish:
                       T extends Bytes ? BytesLike:
                       T extends Signature ? SignatureLike:
                       T;
export type LooseObject<T> = { [P in keyof T]?: Loose<T[P]>; };
*/
//export type Deferrable<T> = T | Promise<T>;
/*
export type DeferrableObject<T> = {
    [ P in keyof T ]: Deferrable<T[P]>
};
*/
/*
export type Frozen<T> = Readonly<{
    [ P in keyof T ]: T[P] extends Freezable<any> ? Frozen<T[P]>: T[P];
}>;

export interface Freezable<T> {
    clone(): T;
    freeze(): Frozen<T>;
    isFrozen(): boolean;
}
*/
/*
const _data: WeakMap<Data, Uint8Array> = new WeakMap();

export class Data implements Freezable<Data> {
    #props: {
        data: Uint8Array
    };

    [ index: number ]: number;

    constructor(lengthOrData: number | Uint8Array) {
        if (typeof(lengthOrData) === "number") {
            _data[this] = new Uint8Array(lengthOrData);
        } else {
            _data[this] = lengthOrData;
        }

        return new Proxy(this, {
            get: (target, prop, receiver) => {
                const index = parseInt(String(prop));
                if (String(index) !== prop) { return Reflect.get(target, prop, receiver); }

                const data = _data[this];
                if (index < 0 || index > data.length || index % 1) {
                    throw new Error("");
                }
                return data[index];
            },

            set: (target, prop, value, receiver) => {
                const index = parseInt(String(prop));
                if (String(index) !== prop) { return false; }

                if (value < 0 || value > 255 || value % 1) { return false; }

                const data = _data[this];
                if (index < 0 || index > data.length || index % 1) {
                    return false;
                }

                data[index] = value;

                return true;
            },
        });
    }

    toString(): string {
        return this.slice().toString();
    }

    slice(): Uint8Array {
        return _data.get(this).slice();
    }

    clone(): Data {
        return new Data(this.slice());
    }

    freeze(): Frozen<Data> {
        //Object.freeze(this.#props);
        return this;
    }

    isFrozen(): boolean {
        return Object.isFrozen(this.#props);
    }
}
const d = new Data(4);
console.log(d.toString());
d[0] = 45;
console.log(d.toString());
*/
/*
export type DeferrableObject<T> = {
    [ P in keyof T ]: Deferrable<T[P]>
};
*/
async function resolveProperties(value) {
    const keys = Object.keys(value);
    const results = await Promise.all(keys.map((k) => Promise.resolve(value[k])));
    return results.reduce((accum, v, index) => {
        accum[keys[index]] = v;
        return accum;
    }, {});
}
/*
export type IsCancelled = () => Promise<boolean>;

export function createPromise<T>(resolve: (isCancelled: IsCancelled, (result: T) => void) => void, reject: (error: Error) => void, isCancelled: IsCancelled): CancellablePromise<T> {
    let cancelled = false;

    const promise = new Promise((resolve, reject) => {
        
    });

    (<CancellablePromise<T>>promise).cancel = function() {
        cancelled = true;
    };

    return (<CancellablePromise<T>>promise);
}
*/
/*
export class A implements Freezable<A> {
    foo: number;
    constructor(foo: number) {
        this.foo = foo;
    }
    freeze(): Frozen<A> {
        Object.freeze(this);
        return this;
    }
    clone(): A {
        return new A(this.foo);
    }
}

export class B implements Freezable<B> {
    a: A;
    constructor(a: A) {
        this.a = a;
    }
    freeze(): Frozen<B> {
        this.a.freeze();
        Object.freeze(this);
        return this;
    }
    clone(): B {
        return new B(this.a);
    }
}

export function test() {
    const a = new A(123);
    const b = new B(a);
    b.a = new A(234);
    const b2 = b.freeze();
    b2.a.foo = 123; // = a;
}
*/
function checkType(value, type) {
    const types = type.split("|").map(t => t.trim());
    for (let i = 0; i < types.length; i++) {
        switch (type) {
            case "any":
                return;
            case "boolean":
            case "number":
            case "string":
                if (typeof (value) === type) {
                    return;
                }
        }
    }
    throw new Error("invalid value for type");
}
function defineProperties(target, values, types, defaults) {
    for (let key in values) {
        let value = values[key];
        const fallback = (defaults ? defaults[key] : undefined);
        if (fallback !== undefined) {
            value = fallback;
        }
        else {
            const type = (types ? types[key] : null);
            if (type) {
                checkType(value, type);
            }
        }
        Object.defineProperty(target, key, { enumerable: true, value, writable: false });
    }
}

var __classPrivateFieldSet$x = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$z = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EventPayload_listener;
class EventPayload {
    constructor(emitter, listener, filter) {
        _EventPayload_listener.set(this, void 0);
        __classPrivateFieldSet$x(this, _EventPayload_listener, listener, "f");
        defineProperties(this, { emitter, filter });
    }
    async removeListener() {
        if (__classPrivateFieldGet$z(this, _EventPayload_listener, "f") == null) {
            return;
        }
        await this.emitter.off(this.filter, __classPrivateFieldGet$z(this, _EventPayload_listener, "f"));
    }
}
_EventPayload_listener = new WeakMap();

function getStore(store, key) {
    return store[key];
}
function setStore(store, key, value) {
    if (Object.isFrozen(store)) {
        throw new Error("frozen object is immuatable; cannot set " + key);
    }
    store[key] = value;
}

//export type TransactionReceipt {
//}
/**
 *  try {
 *      // code....
 *  } catch (e) {
 *      if (isError(e, errors.CALL_EXCEPTION)) {
 *          console.log(e.data);
 *      }
 *  }
 */
function isError(error, code) {
    return (error && error.code === code);
}
function isCallException(error) {
    return isError(error, "CALL_EXCEPTION");
}

const version$g = "@ethersproject/logger@6.0.0-beta.7";

var __classPrivateFieldGet$y = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Logger_instances, _Logger_getBytes, _Logger_log;
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARNING"] = "WARNING";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["OFF"] = "OFF";
})(LogLevel || (LogLevel = {}));
const LogLevels = { debug: 1, "default": 2, info: 2, warning: 3, error: 4, off: 5 };
let _logLevel = LogLevels["default"];
let _globalLogger = null;
const _normalizeForms = ["NFD", "NFC", "NFKD", "NFKC"].reduce((accum, form) => {
    try {
        // General test for normalize
        /* c8 ignore start */
        if ("test".normalize(form) !== "test") {
            throw new Error("bad");
        }
        ;
        /* c8 ignore stop */
        if (form === "NFD") {
            const check = String.fromCharCode(0xe9).normalize("NFD");
            const expected = String.fromCharCode(0x65, 0x0301);
            /* c8 ignore start */
            if (check !== expected) {
                throw new Error("broken");
            }
            /* c8 ignore stop */
        }
        accum.push(form);
    }
    catch (error) { }
    return accum;
}, []);
function defineReadOnly(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: true, writable: false, value,
    });
}
// IEEE 754 support 53-bits of mantissa
const maxValue$1 = 0x1fffffffffffff;
// The type of error to use for various error codes
const ErrorConstructors = {};
ErrorConstructors.INVALID_ARGUMENT = TypeError;
ErrorConstructors.NUMERIC_FAULT = RangeError;
ErrorConstructors.BUFFER_OVERRUN = RangeError;
class Logger {
    constructor(version) {
        _Logger_instances.add(this);
        defineReadOnly(this, "version", version || "_");
    }
    makeError(message, code, info) {
        {
            const details = [];
            if (info) {
                for (const key in info) {
                    const value = (info[key]);
                    try {
                        details.push(key + "=" + JSON.stringify(value));
                    }
                    catch (error) {
                        details.push(key + "=[could not serialize object]");
                    }
                }
            }
            details.push(`code=${code}`);
            details.push(`version=${this.version}`);
            if (details.length) {
                message += " (" + details.join(", ") + ")";
            }
        }
        const create = ErrorConstructors[code] || Error;
        const error = (new create(message));
        defineReadOnly(error, "code", code);
        if (info) {
            for (const key in info) {
                defineReadOnly(error, key, (info[key]));
            }
        }
        return error;
    }
    throwError(message, code, info) {
        throw this.makeError(message, code, info);
    }
    throwArgumentError(message, name, value) {
        return this.throwError(message, "INVALID_ARGUMENT", {
            argument: name,
            value: value
        });
    }
    assert(condition, message, code, info) {
        if (!!condition) {
            return;
        }
        this.throwError(message, code || "UNKNOWN_ERROR", info);
    }
    assertArgument(condition, message, name, value) {
        return this.assert(condition, message, "INVALID_ARGUMENT", {
            argument: name,
            value
        });
    }
    assertIntegerArgument(name, value, lower, upper) {
        let message = null;
        if (typeof (value) !== "number") {
            message = "expected a number";
        }
        else if (!Number.isInteger(value)) {
            message = "invalid integer";
        }
        else if ((lower != null && value < lower) || (upper != null && value > upper)) {
            message = "value is out of range";
        }
        if (message) {
            this.throwArgumentError(message, name, value);
        }
    }
    assertSafeUint53(value, message) {
        this.assertArgument((typeof (value) === "number"), "invalid number", "value", value);
        if (message == null) {
            message = "value not safe";
        }
        const operation = "assertSafeInteger";
        this.assert((value >= 0 && value < 0x1fffffffffffff), message, "NUMERIC_FAULT", {
            operation, fault: "out-of-safe-range", value
        });
        this.assert((value % 1) === 0, message, "NUMERIC_FAULT", {
            operation, fault: "non-integer", value
        });
    }
    assertNormalize(form) {
        if (_normalizeForms.indexOf(form) === -1) {
            this.throwError("platform missing String.prototype.normalize", "UNSUPPORTED_OPERATION", {
                operation: "String.prototype.normalize", info: { form }
            });
        }
    }
    assertPrivate(givenGuard, guard, className = "") {
        if (givenGuard !== guard) {
            let method = className, operation = "new";
            if (className) {
                method += ".";
                operation += " " + className;
            }
            this.throwError(`private constructor; use ${method}from* methods`, "UNSUPPORTED_OPERATION", {
                operation
            });
        }
    }
    assertArgumentCount(count, expectedCount, message = "") {
        if (message) {
            message = ": " + message;
        }
        this.assert((count >= expectedCount), "missing arguemnt" + message, "MISSING_ARGUMENT", {
            count: count,
            expectedCount: expectedCount
        });
        this.assert((count >= expectedCount), "too many arguemnts" + message, "UNEXPECTED_ARGUMENT", {
            count: count,
            expectedCount: expectedCount
        });
    }
    getBytes(value, name) {
        return __classPrivateFieldGet$y(this, _Logger_instances, "m", _Logger_getBytes).call(this, value, name, false);
    }
    getBytesCopy(value, name) {
        return __classPrivateFieldGet$y(this, _Logger_instances, "m", _Logger_getBytes).call(this, value, name, true);
    }
    getNumber(value, name) {
        switch (typeof (value)) {
            case "bigint":
                if (value < -maxValue$1 || value > maxValue$1) {
                    this.throwArgumentError("overflow", name || "value", value);
                }
                return Number(value);
            case "number":
                if (!Number.isInteger(value)) {
                    this.throwArgumentError("underflow", name || "value", value);
                }
                else if (value < -maxValue$1 || value > maxValue$1) {
                    this.throwArgumentError("overflow", name || "value", value);
                }
                return value;
            case "string":
                try {
                    return this.getNumber(BigInt(value), name);
                }
                catch (e) {
                    this.throwArgumentError(`invalid numeric string: ${e.message}`, name || "value", value);
                }
        }
        return this.throwArgumentError("invalid numeric value", name || "value", value);
    }
    getBigInt(value, name) {
        switch (typeof (value)) {
            case "bigint": return value;
            case "number":
                if (!Number.isInteger(value)) {
                    this.throwArgumentError("underflow", name || "value", value);
                }
                else if (value < -maxValue$1 || value > maxValue$1) {
                    this.throwArgumentError("overflow", name || "value", value);
                }
                return BigInt(value);
            case "string":
                try {
                    return BigInt(value);
                }
                catch (e) {
                    this.throwArgumentError(`invalid BigNumberish string: ${e.message}`, name || "value", value);
                }
        }
        return this.throwArgumentError("invalid BigNumberish value", name || "value", value);
    }
    debug(...args) {
        __classPrivateFieldGet$y(this, _Logger_instances, "m", _Logger_log).call(this, LogLevel.DEBUG, args);
    }
    info(...args) {
        __classPrivateFieldGet$y(this, _Logger_instances, "m", _Logger_log).call(this, LogLevel.INFO, args);
    }
    warn(...args) {
        __classPrivateFieldGet$y(this, _Logger_instances, "m", _Logger_log).call(this, LogLevel.WARNING, args);
    }
    static globalLogger() {
        if (!_globalLogger) {
            _globalLogger = new Logger(version$g);
        }
        return _globalLogger;
    }
    static setLogLevel(logLevel) {
        const level = LogLevels[logLevel.toLowerCase()];
        if (level == null) {
            Logger.globalLogger().warn("invalid log level - " + logLevel);
            return;
        }
        _logLevel = level;
    }
}
_Logger_instances = new WeakSet(), _Logger_getBytes = function _Logger_getBytes(value, name, copy) {
    if (value instanceof Uint8Array) {
        if (copy) {
            return new Uint8Array(value);
        }
        return value;
    }
    if (typeof (value) === "string" && value.match(/^0x([0-9a-f][0-9a-f])*$/i)) {
        const result = new Uint8Array((value.length - 2) / 2);
        let offset = 2;
        for (let i = 0; i < result.length; i++) {
            result[i] = parseInt(value.substring(offset, offset + 2), 16);
            offset += 2;
        }
        return result;
    }
    return this.throwArgumentError("invalid BytesLike value", name || "value", value);
}, _Logger_log = function _Logger_log(logLevel, args) {
    const level = logLevel.toLowerCase();
    if (LogLevels[level] == null) {
        this.throwArgumentError("invalid log level name", "logLevel", logLevel);
    }
    if (_logLevel > LogLevels[level]) {
        return;
    }
    console.log.apply(console, args);
};
Logger.LogLevels = LogLevel;

const version$f = "@ethersproject/abi@6.0.0-beta.3";

const logger$e = new Logger(version$f);

var __classPrivateFieldSet$w = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$x = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TokenString_instances, _TokenString_offset, _TokenString_tokens, _TokenString_subTokenString, _ParamType_instances, _ParamType_walkAsync;
var FormatType;
(function (FormatType) {
    // Bare formatting, as is needed for computing a sighash of an event or function
    FormatType["sighash"] = "sighash";
    // Human-Readable with Minimal spacing and without names (compact human-readable)
    FormatType["minimal"] = "minimal";
    // Human-Readable with nice spacing, including all names
    FormatType["full"] = "full";
    // JSON-format a la Solidity
    FormatType["json"] = "json";
})(FormatType || (FormatType = {}));
// [ "a", "b" ] => { "a": 1, "b": 1 }
function setify(items) {
    const result = new Set();
    items.forEach((k) => result.add(k));
    return Object.freeze(result);
}
// Visibility Keywords
const _kwVisib = "constant external internal payable private public pure view";
const KwVisib = setify(_kwVisib.split(" "));
const _kwTypes = "constructor error event function struct";
const KwTypes = setify(_kwTypes.split(" "));
const _kwModifiers = "calldata memory storage payable indexed";
const KwModifiers = setify(_kwModifiers.split(" "));
const _kwOther = "tuple returns";
// All Keywords
const _keywords = [_kwTypes, _kwModifiers, _kwOther, _kwVisib].join(" ");
const Keywords = setify(_keywords.split(" "));
// Single character tokens
const SimpleTokens = {
    "(": "OPEN_PAREN", ")": "CLOSE_PAREN",
    "[": "OPEN_BRACKET", "]": "CLOSE_BRACKET",
    ",": "COMMA", "@": "AT"
};
// Parser regexes to consume the next token
const regexWhitespace = new RegExp("^(\\s*)");
const regexNumber$1 = new RegExp("^([0-9]+)");
const regexIdentifier = new RegExp("^([a-zA-Z$_][a-zA-Z0-9$_]*)");
const regexType = new RegExp("^(address|bool|bytes([0-9]*)|string|u?int([0-9]*))");
class TokenString {
    constructor(tokens) {
        _TokenString_instances.add(this);
        _TokenString_offset.set(this, void 0);
        _TokenString_tokens.set(this, void 0);
        __classPrivateFieldSet$w(this, _TokenString_offset, 0, "f");
        __classPrivateFieldSet$w(this, _TokenString_tokens, tokens.slice(), "f");
    }
    get offset() { return __classPrivateFieldGet$x(this, _TokenString_offset, "f"); }
    get length() { return __classPrivateFieldGet$x(this, _TokenString_tokens, "f").length - __classPrivateFieldGet$x(this, _TokenString_offset, "f"); }
    clone() { return new TokenString(__classPrivateFieldGet$x(this, _TokenString_tokens, "f")); }
    reset() { __classPrivateFieldSet$w(this, _TokenString_offset, 0, "f"); }
    // Pops and returns the value of the next token, if it is a keyword in allowed; throws if out of tokens
    popKeyword(allowed) {
        const top = this.peek();
        if (top.type !== "KEYWORD" || !allowed.has(top.text)) {
            throw new Error(`expected keyword ${top.text}`);
        }
        return this.pop().text;
    }
    // Pops and returns the value of the next token if it is `type`; throws if out of tokens
    popType(type) {
        if (this.peek().type !== type) {
            throw new Error(`expected ${type}; got ${JSON.stringify(this.peek())}`);
        }
        return this.pop().text;
    }
    // Pops and returns a "(" TOKENS ")"
    popParen() {
        const top = this.peek();
        if (top.type !== "OPEN_PAREN") {
            throw new Error("bad start");
        }
        const result = __classPrivateFieldGet$x(this, _TokenString_instances, "m", _TokenString_subTokenString).call(this, __classPrivateFieldGet$x(this, _TokenString_offset, "f") + 1, top.match + 1);
        __classPrivateFieldSet$w(this, _TokenString_offset, top.match + 1, "f");
        return result;
    }
    // Pops and returns the items within "(" ITEM1 "," ITEM2 "," ... ")"
    popParams() {
        const top = this.peek();
        if (top.type !== "OPEN_PAREN") {
            throw new Error("bad start");
        }
        const result = [];
        while (__classPrivateFieldGet$x(this, _TokenString_offset, "f") < top.match - 1) {
            const link = this.peek().linkNext;
            result.push(__classPrivateFieldGet$x(this, _TokenString_instances, "m", _TokenString_subTokenString).call(this, __classPrivateFieldGet$x(this, _TokenString_offset, "f") + 1, link));
            __classPrivateFieldSet$w(this, _TokenString_offset, link, "f");
        }
        __classPrivateFieldSet$w(this, _TokenString_offset, top.match + 1, "f");
        return result;
    }
    // Returns the top Token, throwing if out of tokens
    peek() {
        if (__classPrivateFieldGet$x(this, _TokenString_offset, "f") >= __classPrivateFieldGet$x(this, _TokenString_tokens, "f").length) {
            throw new Error("out-of-bounds");
        }
        return __classPrivateFieldGet$x(this, _TokenString_tokens, "f")[__classPrivateFieldGet$x(this, _TokenString_offset, "f")];
    }
    // Returns the next value, if it is a keyword in `allowed`
    peekKeyword(allowed) {
        const top = this.peekType("KEYWORD");
        return (top != null && allowed.has(top)) ? top : null;
    }
    // Returns the value of the next token if it is `type`
    peekType(type) {
        if (this.length === 0) {
            return null;
        }
        const top = this.peek();
        return (top.type === type) ? top.text : null;
    }
    // Returns the next token; throws if out of tokens
    pop() {
        var _a;
        const result = this.peek();
        __classPrivateFieldSet$w(this, _TokenString_offset, (_a = __classPrivateFieldGet$x(this, _TokenString_offset, "f"), _a++, _a), "f");
        return result;
    }
    toString() {
        const tokens = [];
        for (let i = __classPrivateFieldGet$x(this, _TokenString_offset, "f"); i < __classPrivateFieldGet$x(this, _TokenString_tokens, "f").length; i++) {
            const token = __classPrivateFieldGet$x(this, _TokenString_tokens, "f")[i];
            tokens.push(`${token.type}:${token.text}`);
        }
        return `<TokenString ${tokens.join(" ")}>`;
    }
}
_TokenString_offset = new WeakMap(), _TokenString_tokens = new WeakMap(), _TokenString_instances = new WeakSet(), _TokenString_subTokenString = function _TokenString_subTokenString(from = 0, to = 0) {
    return new TokenString(__classPrivateFieldGet$x(this, _TokenString_tokens, "f").slice(from, to).map((t) => {
        return Object.freeze(Object.assign({}, t, {
            match: (t.match - from),
            linkBack: (t.linkBack - from),
            linkNext: (t.linkNext - from),
        }));
    }));
};
function lex(text) {
    const tokens = [];
    const throwError = (message) => {
        const token = (offset < text.length) ? JSON.stringify(text[offset]) : "$EOI";
        throw new Error(`invalid token ${token} at ${offset}: ${message}`);
    };
    let brackets = [];
    let commas = [];
    let offset = 0;
    while (offset < text.length) {
        // Strip off any leading whitespace
        let cur = text.substring(offset);
        let match = cur.match(regexWhitespace);
        if (match) {
            offset += match[1].length;
            cur = text.substring(offset);
        }
        const token = { depth: brackets.length, linkBack: -1, linkNext: -1, match: -1, type: "", text: "", offset, value: -1 };
        tokens.push(token);
        let type = (SimpleTokens[cur[0]] || "");
        if (type) {
            token.type = type;
            token.text = cur[0];
            offset++;
            if (type === "OPEN_PAREN") {
                brackets.push(tokens.length - 1);
                commas.push(tokens.length - 1);
            }
            else if (type == "CLOSE_PAREN") {
                if (brackets.length === 0) {
                    throwError("no matching open bracket");
                }
                token.match = brackets.pop();
                (tokens[token.match]).match = tokens.length - 1;
                token.depth--;
                token.linkBack = commas.pop();
                (tokens[token.linkBack]).linkNext = tokens.length - 1;
            }
            else if (type === "COMMA") {
                token.linkBack = commas.pop();
                (tokens[token.linkBack]).linkNext = tokens.length - 1;
                commas.push(tokens.length - 1);
            }
            else if (type === "OPEN_BRACKET") {
                token.type = "BRACKET";
            }
            else if (type === "CLOSE_BRACKET") {
                // Remove the CLOSE_BRACKET
                let suffix = tokens.pop().text;
                if (tokens.length > 0 && tokens[tokens.length - 1].type === "NUMBER") {
                    const value = tokens.pop().text;
                    suffix = value + suffix;
                    (tokens[tokens.length - 1]).value = logger$e.getNumber(value);
                }
                if (tokens.length === 0 || tokens[tokens.length - 1].type !== "BRACKET") {
                    throw new Error("missing opening bracket");
                }
                (tokens[tokens.length - 1]).text += suffix;
            }
            continue;
        }
        match = cur.match(regexIdentifier);
        if (match) {
            token.text = match[1];
            offset += token.text.length;
            if (Keywords.has(token.text)) {
                token.type = "KEYWORD";
                continue;
            }
            if (token.text.match(regexType)) {
                token.type = "TYPE";
                continue;
            }
            token.type = "ID";
            continue;
        }
        match = cur.match(regexNumber$1);
        if (match) {
            token.text = match[1];
            token.type = "NUMBER";
            offset += token.text.length;
            continue;
        }
        throw new Error(`unexpected token ${JSON.stringify(cur[0])} at position ${offset}`);
    }
    return new TokenString(tokens.map((t) => Object.freeze(t)));
}
// Check only one of `allowed` is in `set`
function allowSingle(set, allowed) {
    let included = [];
    for (const key in allowed.keys()) {
        if (set.has(key)) {
            included.push(key);
        }
    }
    if (included.length > 1) {
        throw new Error(`conflicting types: ${included.join(", ")}`);
    }
}
// Functions to process a Solidity Signature TokenString from left-to-right for...
// ...the name with an optional type, returning the name
function consumeName(type, tokens) {
    if (tokens.peekKeyword(KwTypes)) {
        const keyword = tokens.pop().text;
        if (keyword !== type) {
            throw new Error(`expected ${type}, got ${keyword}`);
        }
    }
    return tokens.popType("ID");
}
// ...all keywords matching allowed, returning the keywords
function consumeKeywords(tokens, allowed) {
    const keywords = new Set();
    while (true) {
        const keyword = tokens.peekType("KEYWORD");
        if (keyword == null || (allowed && !allowed.has(keyword))) {
            break;
        }
        tokens.pop();
        if (keywords.has(keyword)) {
            throw new Error(`duplicate keywords: ${JSON.stringify(keyword)}`);
        }
        keywords.add(keyword);
    }
    return Object.freeze(keywords);
}
// ...all visibility keywords, returning the coalesced mutability
function consumeMutability(tokens) {
    let modifiers = consumeKeywords(tokens, KwVisib);
    // Detect conflicting modifiers
    allowSingle(modifiers, setify("constant payable nonpayable".split(" ")));
    allowSingle(modifiers, setify("pure view payable nonpayable".split(" ")));
    // Process mutability states
    if (modifiers.has("view")) {
        return "view";
    }
    if (modifiers.has("pure")) {
        return "pure";
    }
    if (modifiers.has("payable")) {
        return "payable";
    }
    if (modifiers.has("nonpayable")) {
        return "nonpayable";
    }
    // Process legacy `constant` last
    if (modifiers.has("constant")) {
        return "view";
    }
    return "nonpayable";
}
// ...a parameter list, returning the ParamType list
function consumeParams(tokens, allowIndexed) {
    return tokens.popParams().map((t) => ParamType.fromTokens(t, allowIndexed));
}
// ...a gas limit, returning a BigNumber or null if none
function consumeGas(tokens) {
    if (tokens.peekType("AT")) {
        tokens.pop();
        if (tokens.peekType("NUMBER")) {
            return logger$e.getBigInt(tokens.pop().text);
        }
        throw new Error("invalid gas");
    }
    return null;
}
function consumeEoi(tokens) {
    if (tokens.length) {
        throw new Error(`unexpected tokens: ${tokens.toString()}`);
    }
}
const regexArrayType = new RegExp(/^(.*)\[([0-9]*)\]$/);
function verifyBasicType(type) {
    const match = type.match(regexType);
    if (!match) {
        return logger$e.throwArgumentError("invalid type", "type", type);
    }
    if (type === "uint") {
        return "uint256";
    }
    if (type === "int") {
        return "int256";
    }
    if (match[2]) {
        // bytesXX
        const length = parseInt(match[2]);
        if (length === 0 || length > 32) {
            logger$e.throwArgumentError("invalid bytes length", "type", type);
        }
    }
    else if (match[3]) {
        // intXX or uintXX
        const size = parseInt(match[3]);
        if (size === 0 || size > 256 || size % 8) {
            logger$e.throwArgumentError("invalid numeric width", "type", type);
        }
    }
    return type;
}
// Make the Fragment constructors effectively private
const _guard$4 = {};
const internal$1 = Symbol.for("_ethers_internal");
const ParamTypeInternal = "_ParamTypeInternal";
class ParamType {
    constructor(guard, name, type, baseType, indexed, components, arrayLength, arrayChildren) {
        _ParamType_instances.add(this);
        logger$e.assertPrivate(guard, _guard$4, "ParamType");
        Object.defineProperty(this, internal$1, { value: ParamTypeInternal });
        if (components) {
            components = Object.freeze(components.slice());
        }
        if (baseType === "array") {
            if (arrayLength == null || arrayChildren == null) {
                throw new Error("");
            }
        }
        else if (arrayLength != null || arrayChildren != null) {
            throw new Error("");
        }
        if (baseType === "tuple") {
            if (components == null) {
                throw new Error("");
            }
        }
        else if (components != null) {
            throw new Error("");
        }
        defineProperties(this, {
            name, type, baseType, indexed, components, arrayLength, arrayChildren
        });
    }
    // Format the parameter fragment
    //   - sighash: "(uint256,address)"
    //   - minimal: "tuple(uint256,address) indexed"
    //   - full:    "tuple(uint256 foo, address bar) indexed baz"
    format(format = FormatType.sighash) {
        if (!FormatType[format]) {
            logger$e.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatType.json) {
            let result = {
                type: ((this.baseType === "tuple") ? "tuple" : this.type),
                name: (this.name || undefined)
            };
            if (typeof (this.indexed) === "boolean") {
                result.indexed = this.indexed;
            }
            if (this.isTuple()) {
                result.components = this.components.map((c) => JSON.parse(c.format(format)));
            }
            return JSON.stringify(result);
        }
        let result = "";
        // Array
        if (this.isArray()) {
            result += this.arrayChildren.format(format);
            result += `[${(this.arrayLength < 0 ? "" : String(this.arrayLength))}]`;
        }
        else {
            if (this.isTuple()) {
                if (format !== FormatType.sighash) {
                    result += this.type;
                }
                result += "(" + this.components.map((comp) => comp.format(format)).join((format === FormatType.full) ? ", " : ",") + ")";
            }
            else {
                result += this.type;
            }
        }
        if (format !== FormatType.sighash) {
            if (this.indexed === true) {
                result += " indexed";
            }
            if (format === FormatType.full && this.name) {
                result += " " + this.name;
            }
        }
        return result;
    }
    static isArray(value) {
        return value && (value.baseType === "array");
    }
    isArray() {
        return (this.baseType === "array");
    }
    isTuple() {
        return (this.baseType === "tuple");
    }
    isIndexable() {
        return (this.indexed != null);
    }
    walk(value, process) {
        if (this.isArray()) {
            if (!Array.isArray(value)) {
                throw new Error("invlaid array value");
            }
            if (this.arrayLength !== -1 && value.length !== this.arrayLength) {
                throw new Error("array is wrong length");
            }
            return value.map((v) => (this.arrayChildren.walk(v, process)));
        }
        if (this.isTuple()) {
            if (!Array.isArray(value)) {
                throw new Error("invlaid tuple value");
            }
            if (value.length !== this.components.length) {
                throw new Error("array is wrong length");
            }
            return value.map((v, i) => (this.components[i].walk(v, process)));
        }
        return process(this.type, value);
    }
    async walkAsync(value, process) {
        const promises = [];
        const result = [value];
        __classPrivateFieldGet$x(this, _ParamType_instances, "m", _ParamType_walkAsync).call(this, promises, value, process, (value) => {
            result[0] = value;
        });
        if (promises.length) {
            await Promise.all(promises);
        }
        return result[0];
    }
    static from(obj, allowIndexed) {
        if (ParamType.isParamType(obj)) {
            return obj;
        }
        if (typeof (obj) === "string") {
            return ParamType.fromTokens(lex(obj), allowIndexed);
        }
        if (obj instanceof TokenString) {
            return ParamType.fromTokens(obj, allowIndexed);
        }
        const name = obj.name;
        if (name && (typeof (name) !== "string" || !name.match(regexIdentifier))) {
            logger$e.throwArgumentError("invalid name", "obj.name", name);
        }
        let indexed = obj.indexed;
        if (indexed != null) {
            if (!allowIndexed) {
                logger$e.throwArgumentError("parameter cannot be indexed", "obj.indexed", obj.indexed);
            }
            indexed = !!indexed;
        }
        let type = obj.type;
        let arrayMatch = type.match(regexArrayType);
        if (arrayMatch) {
            const arrayLength = arrayMatch[2];
            const arrayChildren = ParamType.from({
                type: arrayMatch[1],
                components: obj.components
            });
            return new ParamType(_guard$4, name, type, "array", indexed, null, arrayLength, arrayChildren);
        }
        if (type.substring(0, 5) === "tuple(" || type[0] === "(") {
            const comps = (obj.components != null) ? obj.components.map((c) => ParamType.from(c)) : null;
            const tuple = new ParamType(_guard$4, name, type, "tuple", indexed, comps, null, null);
            // @TODO: use lexer to validate and normalize type
            return tuple;
        }
        type = verifyBasicType(obj.type);
        return new ParamType(_guard$4, name, type, type, indexed, null, null, null);
    }
    static fromObject(obj, allowIndexed) {
        throw new Error("@TODO");
    }
    static fromTokens(tokens, allowIndexed) {
        let type = "", baseType = "";
        let comps = null;
        if (consumeKeywords(tokens, setify(["tuple"])).has("tuple") || tokens.peekType("OPEN_PAREN")) {
            // Tuple
            baseType = "tuple";
            comps = tokens.popParams().map((t) => ParamType.from(t));
            type = `tuple(${comps.map((c) => c.format()).join(",")})`;
        }
        else {
            // Normal
            type = verifyBasicType(tokens.popType("TYPE"));
            baseType = type;
        }
        // Check for Array
        let arrayChildren = null;
        let arrayLength = null;
        while (tokens.length && tokens.peekType("BRACKET")) {
            const bracket = tokens.pop(); //arrays[i];
            arrayChildren = new ParamType(_guard$4, "", type, baseType, null, comps, arrayLength, arrayChildren);
            arrayLength = bracket.value;
            type += bracket.text;
            baseType = "array";
            comps = null;
        }
        let indexed = null;
        const keywords = consumeKeywords(tokens, KwModifiers);
        if (keywords.has("indexed")) {
            if (!allowIndexed) {
                throw new Error("");
            }
            indexed = true;
        }
        const name = (tokens.peekType("ID") ? tokens.pop().text : "");
        if (tokens.length) {
            throw new Error("leftover tokens");
        }
        return new ParamType(_guard$4, name, type, baseType, indexed, comps, arrayLength, arrayChildren);
    }
    static isParamType(value) {
        return (value && value[internal$1] === ParamTypeInternal);
    }
}
_ParamType_instances = new WeakSet(), _ParamType_walkAsync = function _ParamType_walkAsync(promises, value, process, setValue) {
    if (this.isArray()) {
        if (!Array.isArray(value)) {
            throw new Error("invlaid array value");
        }
        if (this.arrayLength !== -1 && value.length !== this.arrayLength) {
            throw new Error("array is wrong length");
        }
        const childType = this.arrayChildren;
        const result = value.slice();
        result.forEach((value, index) => {
            __classPrivateFieldGet$x(childType, _ParamType_instances, "m", _ParamType_walkAsync).call(childType, promises, value, process, (value) => {
                result[index] = value;
            });
        });
        setValue(result);
        return;
    }
    if (this.isTuple()) {
        const components = this.components;
        // Convert the object into an array
        let result;
        if (Array.isArray(value)) {
            result = value.slice();
        }
        else {
            if (value == null || typeof (value) !== "object") {
                throw new Error("invlaid tuple value");
            }
            result = components.map((param) => {
                if (!param.name) {
                    throw new Error("cannot use object value with unnamed components");
                }
                if (!(param.name in value)) {
                    throw new Error(`missing value for component ${param.name}`);
                }
                return value[param.name];
            });
        }
        if (value.length !== this.components.length) {
            throw new Error("array is wrong length");
        }
        result.forEach((value, index) => {
            var _a;
            __classPrivateFieldGet$x((_a = components[index]), _ParamType_instances, "m", _ParamType_walkAsync).call(_a, promises, value, process, (value) => {
                result[index] = value;
            });
        });
        setValue(result);
        return;
    }
    const result = process(this.type, value);
    if (result.then) {
        promises.push((async function () { setValue(await result); })());
    }
    else {
        setValue(result);
    }
};
var FragmentType;
(function (FragmentType) {
    FragmentType["constructor"] = "constructor";
    FragmentType["error"] = "error";
    FragmentType["event"] = "event";
    FragmentType["function"] = "function";
    FragmentType["struct"] = "struct";
})(FragmentType || (FragmentType = {}));
class Fragment {
    constructor(guard, type, inputs) {
        logger$e.assertPrivate(guard, _guard$4, "Fragment");
        inputs = Object.freeze(inputs.slice());
        defineProperties(this, { type, inputs });
    }
    static from(obj) {
        if (typeof (obj) === "string") {
            return this.fromString(obj);
        }
        if (obj instanceof TokenString) {
            return this.fromTokens(obj);
        }
        if (typeof (obj) === "object") {
            return this.fromObject(obj);
        }
        throw new Error(`unsupported type: ${obj}`);
    }
    static fromObject(obj) {
        switch (obj.type) {
            case "constructor": return ConstructorFragment.fromObject(obj);
            case "error": return ErrorFragment.fromObject(obj);
            case "event": return EventFragment.fromObject(obj);
            case "function": return FunctionFragment.fromObject(obj);
            case "struct": return StructFragment.fromObject(obj);
        }
        throw new Error("not implemented yet");
    }
    static fromString(text) {
        try {
            Fragment.from(JSON.parse(text));
        }
        catch (e) { }
        return Fragment.fromTokens(lex(text));
    }
    static fromTokens(tokens) {
        const type = tokens.popKeyword(KwTypes);
        switch (type) {
            case "constructor": return ConstructorFragment.fromTokens(tokens);
            case "error": return ErrorFragment.fromTokens(tokens);
            case "event": return EventFragment.fromTokens(tokens);
            case "function": return FunctionFragment.fromTokens(tokens);
            case "struct": return StructFragment.fromTokens(tokens);
        }
        throw new Error(`unsupported type: ${type}`);
    }
    /*
    static fromTokens(tokens: TokenString): Fragment {
        const assertDone = () => {
            if (tokens.length) { throw new Error(`unexpected tokens: ${ tokens.toString() }`); }
        });

        const type = (tokens.length && tokens.peek().type === "KEYWORD") ? tokens.peek().text: "unknown";

        const name = consumeName("error", tokens);
        const inputs = consumeParams(tokens, type === "event");

        switch (type) {
            case "event": case "struct":
                assertDone();
        }

    }
    */
    static isConstructor(value) {
        return (value && value.type === "constructor");
    }
    static isError(value) {
        return (value && value.type === "error");
    }
    static isEvent(value) {
        return (value && value.type === "event");
    }
    static isFunction(value) {
        return (value && value.type === "function");
    }
    static isStruct(value) {
        return (value && value.type === "struct");
    }
}
class NamedFragment extends Fragment {
    constructor(guard, type, name, inputs) {
        super(guard, type, inputs);
        inputs = Object.freeze(inputs.slice());
        defineProperties(this, { name });
    }
}
function joinParams(format, params) {
    return "(" + params.map((p) => p.format(format)).join((format === FormatType.full) ? ", " : ",") + ")";
}
class ErrorFragment extends NamedFragment {
    constructor(guard, name, inputs) {
        super(guard, FragmentType.error, name, inputs);
    }
    format(format = FormatType.sighash) {
        if (!FormatType[format]) {
            logger$e.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatType.json) {
            return JSON.stringify({
                type: "error",
                name: this.name,
                inputs: this.inputs.map((input) => JSON.parse(input.format(format))),
            });
        }
        const result = [];
        if (format !== FormatType.sighash) {
            result.push("error");
        }
        result.push(this.name + joinParams(format, this.inputs));
        return result.join(" ");
    }
    static fromString(text) {
        return ErrorFragment.fromTokens(lex(text));
    }
    static fromTokens(tokens) {
        const name = consumeName("error", tokens);
        const inputs = consumeParams(tokens);
        consumeEoi(tokens);
        return new ErrorFragment(_guard$4, name, inputs);
    }
}
class EventFragment extends NamedFragment {
    constructor(guard, name, inputs, anonymous) {
        super(guard, FragmentType.event, name, inputs);
        defineProperties(this, { anonymous });
    }
    format(format = FormatType.sighash) {
        if (!FormatType[format]) {
            logger$e.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatType.json) {
            return JSON.stringify({
                type: "event",
                anonymous: this.anonymous,
                name: this.name,
                inputs: this.inputs.map((i) => JSON.parse(i.format(format)))
            });
        }
        const result = [];
        if (format !== FormatType.sighash) {
            result.push("event");
        }
        result.push(this.name + joinParams(format, this.inputs));
        if (format !== FormatType.sighash && this.anonymous) {
            result.push("anonymous");
        }
        return result.join(" ");
    }
    static fromString(text) {
        return EventFragment.fromTokens(lex(text));
    }
    static fromTokens(tokens) {
        const name = consumeName("event", tokens);
        const inputs = consumeParams(tokens, true);
        const anonymous = !!consumeKeywords(tokens, setify(["anonymous"])).has("anonymous");
        consumeEoi(tokens);
        return new EventFragment(_guard$4, name, inputs, anonymous);
    }
}
class ConstructorFragment extends Fragment {
    constructor(guard, type, inputs, payable, gas) {
        super(guard, type, inputs);
        defineProperties(this, { payable, gas });
    }
    format(format = FormatType.sighash) {
        if (!FormatType[format]) {
            logger$e.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatType.sighash) {
            logger$e.throwError("cannot format a constructor for sighash", "UNSUPPORTED_OPERATION", {
                operation: "format(sighash)"
            });
        }
        if (format === FormatType.json) {
            return JSON.stringify({
                type: "constructor",
                stateMutability: (this.payable ? "payable" : "undefined"),
                payable: this.payable,
                gas: ((this.gas != null) ? this.gas : undefined),
                inputs: this.inputs.map((i) => JSON.parse(i.format(format)))
            });
        }
        const result = [`constructor${joinParams(format, this.inputs)}`];
        result.push((this.payable) ? "payable" : "nonpayable");
        if (this.gas != null) {
            result.push(`@${this.gas.toString()}`);
        }
        return result.join(" ");
    }
    static fromString(text) {
        return ConstructorFragment.fromTokens(lex(text));
    }
    static fromObject(obj) {
        throw new Error("TODO");
    }
    static fromTokens(tokens) {
        consumeKeywords(tokens, setify(["constructor"]));
        const inputs = consumeParams(tokens);
        const payable = !!consumeKeywords(tokens, setify(["payable"])).has("payable");
        const gas = consumeGas(tokens);
        consumeEoi(tokens);
        return new ConstructorFragment(_guard$4, FragmentType.constructor, inputs, payable, gas);
    }
}
class FunctionFragment extends NamedFragment {
    constructor(guard, name, stateMutability, inputs, outputs, gas) {
        super(guard, FragmentType.function, name, inputs);
        outputs = Object.freeze(outputs.slice());
        const constant = (stateMutability === "view" || stateMutability === "pure");
        const payable = (stateMutability === "payable");
        defineProperties(this, { constant, gas, outputs, payable, stateMutability });
    }
    format(format = FormatType.sighash) {
        if (!FormatType[format]) {
            logger$e.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatType.json) {
            return JSON.stringify({
                type: "function",
                name: this.name,
                constant: this.constant,
                stateMutability: ((this.stateMutability !== "nonpayable") ? this.stateMutability : undefined),
                payable: this.payable,
                gas: ((this.gas != null) ? this.gas : undefined),
                inputs: this.inputs.map((i) => JSON.parse(i.format(format))),
                outputs: this.outputs.map((o) => JSON.parse(o.format(format))),
            });
        }
        const result = [];
        if (format !== FormatType.sighash) {
            result.push("function");
        }
        result.push(this.name + joinParams(format, this.inputs));
        if (format !== FormatType.sighash) {
            if (this.stateMutability !== "nonpayable") {
                result.push(this.stateMutability);
            }
            if (this.outputs && this.outputs.length) {
                result.push("returns");
                result.push(joinParams(format, this.outputs));
            }
            if (this.gas != null) {
                result.push(`@${this.gas.toString()}`);
            }
        }
        return result.join(" ");
    }
    static fromString(text) {
        return FunctionFragment.fromTokens(lex(text));
    }
    static fromTokens(tokens) {
        const name = consumeName("function", tokens);
        const inputs = consumeParams(tokens);
        const mutability = consumeMutability(tokens);
        let outputs = [];
        if (consumeKeywords(tokens, setify(["returns"])).has("returns")) {
            outputs = consumeParams(tokens);
        }
        const gas = consumeGas(tokens);
        consumeEoi(tokens);
        return new FunctionFragment(_guard$4, name, mutability, inputs, outputs, gas);
    }
}
class StructFragment extends NamedFragment {
    format() {
        throw new Error("@TODO");
    }
    static fromString(text) {
        return StructFragment.fromTokens(lex(text));
    }
    static fromTokens(tokens) {
        const name = consumeName("struct", tokens);
        const inputs = consumeParams(tokens);
        consumeEoi(tokens);
        return new StructFragment(_guard$4, FragmentType.struct, name, inputs);
    }
}

const version$e = "@ethersproject/math@6.0.0-beta.3";

const logger$d = new Logger(version$e);

// IEEE 754 support 53-bits of mantissa
const maxValue = 0x1fffffffffffff;
const nibbles$1 = "0123456789abcdef";
const BN_0$7 = BigInt(0);
// Converts a value to a BigInt, including big endian data
function toBigInt(_value) {
    if (_value instanceof Uint8Array) {
        let result = "0x0";
        for (const v of _value) {
            result += nibbles$1[v >> 4];
            result += nibbles$1[v & 0x0f];
        }
        return BigInt(result);
    }
    return logger$d.getBigInt(_value, "value");
}
function toNumber(_value) {
    const value = toBigInt(_value);
    if (value < -maxValue || value > maxValue) {
        logger$d.throwArgumentError("overflow", "value", _value);
    }
    return Number(value);
}
// Converts value to hex, optionally padding on the left to width bytes
function toHex(_value, _width) {
    const value = logger$d.getBigInt(_value, "value");
    if (value < 0) {
        throw new Error("cannot convert negative value to hex");
    }
    let result = value.toString(16);
    if (_width == null) {
        // Ensure the value is of even length
        if (result.length % 2) {
            result = "0" + result;
        }
    }
    else {
        const width = logger$d.getNumber(_width, "width");
        if (width * 2 < result.length) {
            throw new Error(`value ${value} exceeds width ${width}`);
        }
        // Pad the value to the required width
        while (result.length < (width * 2)) {
            result = "0" + result;
        }
    }
    return "0x" + result;
}
function toArray(_value) {
    const value = logger$d.getBigInt(_value, "value");
    if (value < 0) {
        throw new Error("cannot convert negative value to hex");
    }
    if (value === BN_0$7) {
        return new Uint8Array([]);
    }
    let hex = value.toString(16);
    if (hex.length % 2) {
        hex = "0" + hex;
    }
    const result = new Uint8Array(hex.length / 2);
    for (let i = 0; i < result.length; i++) {
        const offset = i * 2;
        result[i] = parseInt(hex.substring(offset, offset + 2), 16);
    }
    return result;
}

const BN_0$6 = BigInt(0);
const BN_1$5 = BigInt(1);
// Convert a value from a twos-compliment value
function fromTwos(_value, _width) {
    const value = logger$d.getBigInt(_value, "value");
    const width = BigInt(logger$d.getNumber(_width, "width"));
    // Top bit set; treat as a negative value
    if (value >> (width - BN_1$5)) {
        const mask = (BN_1$5 << width) - BN_1$5;
        return -(((~value) & mask) + BN_1$5);
    }
    return value;
}
// Convert value to a twos-compliment value
function toTwos(_value, _width) {
    const value = logger$d.getBigInt(_value, "value");
    const width = BigInt(logger$d.getNumber(_width, "width"));
    if (value < BN_0$6) {
        const mask = (BN_1$5 << width) - BN_1$5;
        return ((~(-value)) & mask) + BN_1$5;
    }
    return value;
}
function mask(_value, _bits) {
    const value = logger$d.getBigInt(_value, "value");
    const bits = logger$d.getBigInt(_bits, "bits");
    return value & ((BN_1$5 << bits) - BN_1$5);
}

var __classPrivateFieldSet$v = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$w = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FixedNumber_instances, _FixedNumber_value, _FixedNumber_checkFormat;
const _constructorGuard = {};
//const Zero = BigInt(0);
const NegativeOne = BigInt(-1);
function throwFault(message, fault, operation, value) {
    const params = { fault: fault, operation: operation };
    if (value !== undefined) {
        params.value = value;
    }
    return logger$d.throwError(message, "NUMERIC_FAULT", params);
}
// Constant to pull zeros from for multipliers
let zeros$1 = "0";
while (zeros$1.length < 256) {
    zeros$1 += zeros$1;
}
// Returns a string "1" followed by decimal "0"s
function getMultiplier(decimals) {
    if (typeof (decimals) !== "number" || decimals < 0 || decimals > 256 || decimals % 1) {
        logger$d.throwArgumentError("invalid decimal length", "decimals", decimals);
    }
    return BigInt("1" + zeros$1.substring(0, decimals));
}
function formatFixed(_value, _decimals) {
    if (_decimals == null) {
        _decimals = 18;
    }
    let value = logger$d.getBigInt(_value, "value");
    const decimals = logger$d.getNumber(_decimals, "decimals");
    const multiplier = getMultiplier(decimals);
    const multiplierStr = String(multiplier);
    const negative = (value < 0);
    if (negative) {
        value *= NegativeOne;
    }
    let fraction = String(value % multiplier);
    // Make sure there are enough place-holders
    while (fraction.length < multiplierStr.length - 1) {
        fraction = "0" + fraction;
    }
    // Strip training 0
    while (fraction.length > 1 && fraction.substring(fraction.length - 1) === "0") {
        fraction = fraction.substring(0, fraction.length - 1);
    }
    let result = String(value / multiplier);
    if (multiplierStr.length !== 1) {
        result += "." + fraction;
    }
    if (negative) {
        result = "-" + result;
    }
    return result;
}
function parseFixed(value, _decimals) {
    if (_decimals == null) {
        _decimals = 18;
    }
    const decimals = logger$d.getNumber(_decimals, "decimals");
    const multiplier = getMultiplier(decimals);
    if (typeof (value) !== "string" || !value.match(/^-?[0-9.]+$/)) {
        logger$d.throwArgumentError("invalid decimal value", "value", value);
    }
    // Is it negative?
    const negative = (value.substring(0, 1) === "-");
    if (negative) {
        value = value.substring(1);
    }
    if (value === ".") {
        logger$d.throwArgumentError("missing value", "value", value);
    }
    // Split it into a whole and fractional part
    const comps = value.split(".");
    if (comps.length > 2) {
        logger$d.throwArgumentError("too many decimal points", "value", value);
    }
    let whole = (comps[0] || "0"), fraction = (comps[1] || "0");
    // Trim trialing zeros
    while (fraction[fraction.length - 1] === "0") {
        fraction = fraction.substring(0, fraction.length - 1);
    }
    // Check the fraction doesn't exceed our decimals size
    if (fraction.length > String(multiplier).length - 1) {
        throwFault("fractional component exceeds decimals", "underflow", "parseFixed");
    }
    // If decimals is 0, we have an empty string for fraction
    if (fraction === "") {
        fraction = "0";
    }
    // Fully pad the string with zeros to get to wei
    while (fraction.length < String(multiplier).length - 1) {
        fraction += "0";
    }
    const wholeValue = BigInt(whole);
    const fractionValue = BigInt(fraction);
    let wei = (wholeValue * multiplier) + fractionValue;
    if (negative) {
        wei *= NegativeOne;
    }
    return wei;
}
class FixedFormat {
    constructor(constructorGuard, signed, width, decimals) {
        if (constructorGuard !== _constructorGuard) {
            logger$d.throwError("cannot use FixedFormat constructor; use FixedFormat.from", "UNSUPPORTED_OPERATION", {
                operation: "new FixedFormat"
            });
        }
        this.signed = signed;
        this.width = width;
        this.decimals = decimals;
        this.name = (signed ? "" : "u") + "fixed" + String(width) + "x" + String(decimals);
        this._multiplier = getMultiplier(decimals);
        Object.freeze(this);
    }
    static from(value) {
        if (value instanceof FixedFormat) {
            return value;
        }
        if (typeof (value) === "number") {
            value = `fixed128x${value}`;
        }
        let signed = true;
        let width = 128;
        let decimals = 18;
        if (typeof (value) === "string") {
            if (value === "fixed") ;
            else if (value === "ufixed") {
                signed = false;
            }
            else {
                const match = value.match(/^(u?)fixed([0-9]+)x([0-9]+)$/);
                if (!match) {
                    return logger$d.throwArgumentError("invalid fixed format", "format", value);
                }
                signed = (match[1] !== "u");
                width = parseInt(match[2]);
                decimals = parseInt(match[3]);
            }
        }
        else if (value) {
            const check = (key, type, defaultValue) => {
                if (value[key] == null) {
                    return defaultValue;
                }
                if (typeof (value[key]) !== type) {
                    logger$d.throwArgumentError("invalid fixed format (" + key + " not " + type + ")", "format." + key, value[key]);
                }
                return value[key];
            };
            signed = check("signed", "boolean", signed);
            width = check("width", "number", width);
            decimals = check("decimals", "number", decimals);
        }
        if (width % 8) {
            logger$d.throwArgumentError("invalid fixed format width (not byte aligned)", "format.width", width);
        }
        if (decimals > 80) {
            logger$d.throwArgumentError("invalid fixed format (decimals too large)", "format.decimals", decimals);
        }
        return new FixedFormat(_constructorGuard, signed, width, decimals);
    }
}
class FixedNumber {
    constructor(constructorGuard, hex, value, format) {
        _FixedNumber_instances.add(this);
        //#hex: string;
        _FixedNumber_value.set(this, void 0);
        if (constructorGuard !== _constructorGuard) {
            logger$d.throwError("cannot use FixedNumber constructor; use FixedNumber.from", "UNSUPPORTED_OPERATION", {
                operation: "new FixedFormat"
            });
        }
        this.format = FixedFormat.from(format);
        //this.#hex = hex;
        __classPrivateFieldSet$v(this, _FixedNumber_value, value, "f");
        this._isFixedNumber = true;
        Object.freeze(this);
    }
    addUnsafe(other) {
        __classPrivateFieldGet$w(this, _FixedNumber_instances, "m", _FixedNumber_checkFormat).call(this, other);
        const a = parseFixed(__classPrivateFieldGet$w(this, _FixedNumber_value, "f"), this.format.decimals);
        const b = parseFixed(__classPrivateFieldGet$w(other, _FixedNumber_value, "f"), other.format.decimals);
        return FixedNumber.fromValue(a + b, this.format.decimals, this.format);
    }
    subUnsafe(other) {
        __classPrivateFieldGet$w(this, _FixedNumber_instances, "m", _FixedNumber_checkFormat).call(this, other);
        const a = parseFixed(__classPrivateFieldGet$w(this, _FixedNumber_value, "f"), this.format.decimals);
        const b = parseFixed(__classPrivateFieldGet$w(other, _FixedNumber_value, "f"), other.format.decimals);
        return FixedNumber.fromValue(a - b, this.format.decimals, this.format);
    }
    mulUnsafe(other) {
        __classPrivateFieldGet$w(this, _FixedNumber_instances, "m", _FixedNumber_checkFormat).call(this, other);
        const a = parseFixed(__classPrivateFieldGet$w(this, _FixedNumber_value, "f"), this.format.decimals);
        const b = parseFixed(__classPrivateFieldGet$w(other, _FixedNumber_value, "f"), other.format.decimals);
        return FixedNumber.fromValue((a * b) / this.format._multiplier, this.format.decimals, this.format);
    }
    divUnsafe(other) {
        __classPrivateFieldGet$w(this, _FixedNumber_instances, "m", _FixedNumber_checkFormat).call(this, other);
        const a = parseFixed(__classPrivateFieldGet$w(this, _FixedNumber_value, "f"), this.format.decimals);
        const b = parseFixed(__classPrivateFieldGet$w(other, _FixedNumber_value, "f"), other.format.decimals);
        return FixedNumber.fromValue((a * this.format._multiplier) / b, this.format.decimals, this.format);
    }
    floor() {
        const comps = this.toString().split(".");
        if (comps.length === 1) {
            comps.push("0");
        }
        let result = FixedNumber.from(comps[0], this.format);
        const hasFraction = !comps[1].match(/^(0*)$/);
        if (this.isNegative() && hasFraction) {
            result = result.subUnsafe(ONE.toFormat(result.format));
        }
        return result;
    }
    ceiling() {
        const comps = this.toString().split(".");
        if (comps.length === 1) {
            comps.push("0");
        }
        let result = FixedNumber.from(comps[0], this.format);
        const hasFraction = !comps[1].match(/^(0*)$/);
        if (!this.isNegative() && hasFraction) {
            result = result.addUnsafe(ONE.toFormat(result.format));
        }
        return result;
    }
    // @TODO: Support other rounding algorithms
    round(decimals) {
        if (decimals == null) {
            decimals = 0;
        }
        // If we are already in range, we're done
        const comps = this.toString().split(".");
        if (comps.length === 1) {
            comps.push("0");
        }
        if (decimals < 0 || decimals > 80 || (decimals % 1)) {
            logger$d.throwArgumentError("invalid decimal count", "decimals", decimals);
        }
        if (comps[1].length <= decimals) {
            return this;
        }
        const factor = FixedNumber.from("1" + zeros$1.substring(0, decimals), this.format);
        const bump = BUMP.toFormat(this.format);
        return this.mulUnsafe(factor).addUnsafe(bump).floor().divUnsafe(factor);
    }
    isZero() {
        return (__classPrivateFieldGet$w(this, _FixedNumber_value, "f") === "0.0" || __classPrivateFieldGet$w(this, _FixedNumber_value, "f") === "0");
    }
    isNegative() {
        return (__classPrivateFieldGet$w(this, _FixedNumber_value, "f")[0] === "-");
    }
    toString() { return __classPrivateFieldGet$w(this, _FixedNumber_value, "f"); }
    toHexString(_width) {
        throw new Error("TODO");
        /*
        return toHex();
        if (width == null) { return this.#hex; }

        const width = logger.getNumeric(_width);
        if (width % 8) { logger.throwArgumentError("invalid byte width", "width", width); }

        const hex = BigNumber.from(this.#hex).fromTwos(this.format.width).toTwos(width).toHexString();
        return zeroPadLeft(hex, width / 8);
        */
    }
    toUnsafeFloat() { return parseFloat(this.toString()); }
    toFormat(format) {
        return FixedNumber.fromString(__classPrivateFieldGet$w(this, _FixedNumber_value, "f"), format);
    }
    static fromValue(value, decimals = 0, format = "fixed") {
        return FixedNumber.fromString(formatFixed(value, decimals), FixedFormat.from(format));
    }
    static fromString(value, format = "fixed") {
        const fixedFormat = FixedFormat.from(format);
        const numeric = parseFixed(value, fixedFormat.decimals);
        if (!fixedFormat.signed && numeric < 0) {
            throwFault("unsigned value cannot be negative", "overflow", "value", value);
        }
        const hex = (function () {
            if (fixedFormat.signed) {
                return toHex(toTwos(numeric, fixedFormat.width));
            }
            return toHex(numeric, fixedFormat.width / 8);
        })();
        const decimal = formatFixed(numeric, fixedFormat.decimals);
        return new FixedNumber(_constructorGuard, hex, decimal, fixedFormat);
    }
    static fromBytes(_value, format = "fixed") {
        const value = logger$d.getBytes(_value, "value");
        const fixedFormat = FixedFormat.from(format);
        if (value.length > fixedFormat.width / 8) {
            throw new Error("overflow");
        }
        let numeric = toBigInt(value);
        if (fixedFormat.signed) {
            numeric = fromTwos(numeric, fixedFormat.width);
        }
        const hex = toHex(toTwos(numeric, (fixedFormat.signed ? 0 : 1) + fixedFormat.width));
        const decimal = formatFixed(numeric, fixedFormat.decimals);
        return new FixedNumber(_constructorGuard, hex, decimal, fixedFormat);
    }
    static from(value, format) {
        if (typeof (value) === "string") {
            return FixedNumber.fromString(value, format);
        }
        if (value instanceof Uint8Array) {
            return FixedNumber.fromBytes(value, format);
        }
        try {
            return FixedNumber.fromValue(value, 0, format);
        }
        catch (error) {
            // Allow NUMERIC_FAULT to bubble up
            if (error.code !== "INVALID_ARGUMENT") {
                throw error;
            }
        }
        return logger$d.throwArgumentError("invalid FixedNumber value", "value", value);
    }
    static isFixedNumber(value) {
        return !!(value && value._isFixedNumber);
    }
}
_FixedNumber_value = new WeakMap(), _FixedNumber_instances = new WeakSet(), _FixedNumber_checkFormat = function _FixedNumber_checkFormat(other) {
    if (this.format.name !== other.format.name) {
        logger$d.throwArgumentError("incompatible format; use fixedNumber.toFormat", "other", other);
    }
};
const ONE = FixedNumber.from(1);
const BUMP = FixedNumber.from("0.5");

const Alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
let Lookup = null;
function getAlpha(letter) {
    if (Lookup == null) {
        Lookup = {};
        for (let i = 0; i < Alphabet.length; i++) {
            Lookup[Alphabet[i]] = BigInt(i);
        }
    }
    const result = Lookup[letter];
    if (result == null) {
        logger$d.throwArgumentError(`invalid base58 value`, "letter", letter);
    }
    return result;
}
const BN_0$5 = BigInt(0);
const BN_58 = BigInt(58);
function encodeBase58(_value) {
    let value = toBigInt(logger$d.getBytes(_value));
    let result = "";
    while (value) {
        result = Alphabet[Number(value % BN_58)] + result;
        value /= BN_58;
    }
    return result;
}
function decodeBase58(value) {
    let result = BN_0$5;
    for (let i = 0; i < value.length; i++) {
        result *= BN_58;
        result += getAlpha(value[i]);
    }
    return toHex(result);
}

const names = [
    "wei",
    "kwei",
    "mwei",
    "gwei",
    "szabo",
    "finney",
    "ether",
];
function formatUnits(value, unit) {
    if (typeof (unit) === "string") {
        const index = names.indexOf(unit);
        if (index === -1) {
            logger$d.throwArgumentError("invalid unit", "unit", unit);
        }
        unit = 3 * index;
    }
    return formatFixed(value, (unit != null) ? unit : 18);
}
function parseUnits(value, unit) {
    if (typeof (value) !== "string") {
        logger$d.throwArgumentError("value must be a string", "value", value);
    }
    if (typeof (unit) === "string") {
        const index = names.indexOf(unit);
        if (index === -1) {
            logger$d.throwArgumentError("invalid unit", "unit", unit);
        }
        unit = 3 * index;
    }
    return parseFixed(value, (unit != null) ? unit : 18);
}
function formatEther(wei) {
    return formatUnits(wei, 18);
}
function parseEther(ether) {
    return parseUnits(ether, 18);
}

function isHexString(value, length) {
    if (typeof (value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (typeof (length) === "number" && value.length !== 2 + 2 * length) {
        return false;
    }
    if (length === true && (value.length % 2) !== 0) {
        return false;
    }
    return true;
}
function isBytesLike(value) {
    return (isHexString(value, true) || (value instanceof Uint8Array));
}

const version$d = "@ethersproject/bytes@6.0.0-beta.3";

const logger$c = new Logger(version$d);

let BN_8 = null;
let BN_255 = null;
try {
    BN_8 = BigInt("8");
    BN_255 = BigInt("255");
}
catch (error) {
    console.log("Unsupported bigint", error);
}
function isHexable(value) {
    return (value && typeof (value.toHexString) === "function");
}
function arrayify(data) {
    if (data == null) {
        logger$c.throwArgumentError("cannot arrayify nullish", "data", data);
    }
    if (typeof (data) === "number") {
        let v = logger$c.getNumber(data, "data");
        const result = [];
        while (v) {
            result.unshift(v & 0xff);
            v = parseInt(String(v / 256));
        }
        if (result.length === 0) {
            result.push(0);
        }
        return new Uint8Array(result);
    }
    if (BN_8 && typeof (data) === "bigint") {
        const result = [];
        while (data) {
            result.unshift(Number(data & BN_255));
            data >>= BN_8;
        }
        if (result.length === 0) {
            result.push(0);
        }
        return new Uint8Array(result);
    }
    if (isHexable(data)) {
        return arrayify(data.toHexString());
    }
    if (typeof (data) === "string") {
        let hex = data;
        //if (options.allowMissingPrefix && hex.substring(0, 2) !== "0x") {
        //    hex = "0x" + hex;
        //}
        if (!hex.match(/^0x[0-9a-f]*$/i)) {
            throw new RangeError(`invalid hex data string (${JSON.stringify(data)})`);
        }
        const result = [];
        for (let i = 2; i < hex.length; i += 2) {
            result.push(parseInt(hex.substring(i, i + 2), 16));
        }
        return new Uint8Array(result);
    }
    if (data instanceof Uint8Array) {
        return new Uint8Array(data);
    }
    throw new TypeError(`cannot arrayify ${JSON.stringify(data)}`);
}
function _noCopyArrayify(data) {
    if (!isBytesLike(data)) {
        logger$c.throwArgumentError("invalid BytesLike value", "data", data);
    } // @TODO: ArgumentE>
    if (data instanceof Uint8Array) {
        return data;
    }
    return arrayify(data);
}

function decodeBase64(textData) {
    return new Uint8Array(Buffer.from(textData, "base64"));
}
function encodeBase64(data) {
    return Buffer.from(logger$c.getBytes(data, "data")).toString("base64");
}

const HexCharacters = "0123456789abcdef";
function hexlify(data) {
    const bytes = _noCopyArrayify(data);
    let result = "0x";
    for (let i = 0; i < bytes.length; i++) {
        const v = bytes[i];
        result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
    }
    return result;
}
function quantity(value) {
    let result = hexlify(arrayify(value)).substring(2);
    while (result.substring(0, 1) === "0") {
        result = result.substring(1);
    }
    if (result === "") {
        result = "0";
    }
    return "0x" + result;
}

function concat(datas) {
    return "0x" + datas.map((d) => hexlify(d).substring(2)).join("");
}
function dataLength(data) {
    if (isHexString(data, true)) {
        return (data.length - 2) / 2;
    }
    return _noCopyArrayify(data).length;
}
function dataSlice(data, start, end) {
    const bytes = _noCopyArrayify(data);
    if (end != null && end > bytes.length) {
        logger$c.throwError("cannot slice beyond data bounds", "BUFFER_OVERRUN", {
            buffer: bytes, length: bytes.length, offset: end
        });
    }
    return hexlify(bytes.slice((start == null) ? 0 : start, (end == null) ? bytes.length : end));
}
function stripZerosLeft(data) {
    let bytes = hexlify(data).substring(2);
    while (bytes.substring(0, 2) == "00") {
        bytes = bytes.substring(2);
    }
    return "0x" + bytes;
}

function zeroPad(data, length, left) {
    const bytes = _noCopyArrayify(data);
    if (length < bytes.length) {
        logger$c.throwError("padding exceeds data length", "BUFFER_OVERRUN", {
            buffer: new Uint8Array(bytes),
            length: length,
            offset: length + 1
        });
    }
    const result = new Uint8Array(length);
    result.fill(0);
    if (left) {
        result.set(bytes, length - bytes.length);
    }
    else {
        result.set(bytes, 0);
    }
    return hexlify(result);
}
function zeroPadValue(data, length) {
    return zeroPad(data, length, true);
}
function zeroPadBytes(data, length) {
    return zeroPad(data, length, false);
}

var __classPrivateFieldSet$u = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$v = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Result_instances, _Result_indices, _Result_throwError, _Writer_instances, _Writer_data, _Writer_dataLength, _Writer_writeData, _Reader_instances, _Reader_data, _Reader_offset, _Reader_peekBytes;
const WordSize = 32;
const Padding = new Uint8Array(WordSize);
// Properties used to immediate pass through to the underlying object
// - `then` is used to detect if an object is a Promise for await
const passProperties$1 = ["then"];
const _guard$3 = {};
class Result extends Array {
    constructor(guard, items, keys) {
        logger$e.assertPrivate(guard, _guard$3, "Result");
        super(...items);
        _Result_instances.add(this);
        _Result_indices.set(this, void 0);
        // Name lookup table
        __classPrivateFieldSet$u(this, _Result_indices, new Map(), "f");
        if (keys) {
            keys.forEach((key, index) => {
                if (key == null) {
                    return;
                }
                if (__classPrivateFieldGet$v(this, _Result_indices, "f").has(key)) {
                    (__classPrivateFieldGet$v(this, _Result_indices, "f").get(key)).push(index);
                }
                else {
                    __classPrivateFieldGet$v(this, _Result_indices, "f").set(key, [index]);
                }
            });
        }
        Object.freeze(this);
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                if (typeof (prop) === "string") {
                    if (prop.match(/^[0-9]+$/)) {
                        const index = logger$e.getNumber(prop, "%index");
                        if (index < 0 || index >= this.length) {
                            throw new RangeError("out of result range");
                        }
                        const item = target[index];
                        if (item instanceof Error) {
                            __classPrivateFieldGet$v(this, _Result_instances, "m", _Result_throwError).call(this, `index ${index}`, item);
                        }
                        return item;
                    }
                    // Pass important checks (like `then` for Promise) through
                    if (prop in target || passProperties$1.indexOf(prop) >= 0) {
                        return Reflect.get(target, prop, receiver);
                    }
                    // Something that could be a result keyword value
                    if (!(prop in target)) {
                        return target.getValue(prop);
                    }
                }
                return Reflect.get(target, prop, receiver);
            }
        });
    }
    slice(start, end) {
        if (start == null) {
            start = 0;
        }
        if (end == null) {
            end = this.length;
        }
        const result = [];
        for (let i = start; i < end; i++) {
            let value;
            try {
                value = this[i];
            }
            catch (error) {
                value = error.error;
            }
            result.push(value);
        }
        return result;
    }
    getValue(name) {
        const index = __classPrivateFieldGet$v(this, _Result_indices, "f").get(name);
        if (index != null && index.length === 1) {
            const item = this[index[0]];
            if (item instanceof Error) {
                __classPrivateFieldGet$v(this, _Result_instances, "m", _Result_throwError).call(this, `property ${JSON.stringify(name)}`, item);
            }
            return item;
        }
        throw new Error(`no named parameter: ${JSON.stringify(name)}`);
    }
    static fromItems(items, keys) {
        return new Result(_guard$3, items, keys);
    }
}
_Result_indices = new WeakMap(), _Result_instances = new WeakSet(), _Result_throwError = function _Result_throwError(name, error) {
    const wrapped = new Error(`deferred error during ABI decoding triggered accessing ${name}`);
    wrapped.error = error;
    throw wrapped;
};
function getValue$1(value) {
    let bytes = toArray(value);
    if (bytes.length > WordSize) {
        logger$e.throwError("value out-of-bounds", "BUFFER_OVERRUN", {
            buffer: bytes,
            length: WordSize,
            offset: bytes.length
        });
    }
    if (bytes.length !== WordSize) {
        bytes = arrayify(concat([Padding.slice(bytes.length % WordSize), bytes]));
    }
    return bytes;
}
class Coder {
    constructor(name, type, localName, dynamic) {
        defineProperties(this, { name, type, localName, dynamic }, {
            name: "string", type: "string", localName: "string", dynamic: "boolean"
        });
    }
    _throwError(message, value) {
        return logger$e.throwArgumentError(message, this.localName, value);
    }
}
class Writer {
    constructor() {
        _Writer_instances.add(this);
        // An array of WordSize lengthed objects to concatenation
        _Writer_data.set(this, void 0);
        _Writer_dataLength.set(this, void 0);
        __classPrivateFieldSet$u(this, _Writer_data, [], "f");
        __classPrivateFieldSet$u(this, _Writer_dataLength, 0, "f");
    }
    get data() {
        return concat(__classPrivateFieldGet$v(this, _Writer_data, "f"));
    }
    get length() { return __classPrivateFieldGet$v(this, _Writer_dataLength, "f"); }
    appendWriter(writer) {
        return __classPrivateFieldGet$v(this, _Writer_instances, "m", _Writer_writeData).call(this, arrayify(writer.data));
    }
    // Arrayish item; pad on the right to *nearest* WordSize
    writeBytes(value) {
        let bytes = arrayify(value);
        const paddingOffset = bytes.length % WordSize;
        if (paddingOffset) {
            bytes = arrayify(concat([bytes, Padding.slice(paddingOffset)]));
        }
        return __classPrivateFieldGet$v(this, _Writer_instances, "m", _Writer_writeData).call(this, bytes);
    }
    // Numeric item; pad on the left *to* WordSize
    writeValue(value) {
        return __classPrivateFieldGet$v(this, _Writer_instances, "m", _Writer_writeData).call(this, getValue$1(value));
    }
    // Inserts a numeric place-holder, returning a callback that can
    // be used to asjust the value later
    writeUpdatableValue() {
        const offset = __classPrivateFieldGet$v(this, _Writer_data, "f").length;
        __classPrivateFieldGet$v(this, _Writer_data, "f").push(Padding);
        __classPrivateFieldSet$u(this, _Writer_dataLength, __classPrivateFieldGet$v(this, _Writer_dataLength, "f") + WordSize, "f");
        return (value) => {
            __classPrivateFieldGet$v(this, _Writer_data, "f")[offset] = getValue$1(value);
        };
    }
}
_Writer_data = new WeakMap(), _Writer_dataLength = new WeakMap(), _Writer_instances = new WeakSet(), _Writer_writeData = function _Writer_writeData(data) {
    __classPrivateFieldGet$v(this, _Writer_data, "f").push(data);
    __classPrivateFieldSet$u(this, _Writer_dataLength, __classPrivateFieldGet$v(this, _Writer_dataLength, "f") + data.length, "f");
    return data.length;
};
class Reader {
    constructor(data, allowLoose) {
        _Reader_instances.add(this);
        _Reader_data.set(this, void 0);
        _Reader_offset.set(this, void 0);
        defineProperties(this, { allowLoose: !!allowLoose });
        __classPrivateFieldSet$u(this, _Reader_data, arrayify(data), "f");
        __classPrivateFieldSet$u(this, _Reader_offset, 0, "f");
    }
    get data() { return hexlify(__classPrivateFieldGet$v(this, _Reader_data, "f")); }
    get dataLength() { return __classPrivateFieldGet$v(this, _Reader_data, "f").length; }
    get consumed() { return __classPrivateFieldGet$v(this, _Reader_offset, "f"); }
    get bytes() { return new Uint8Array(__classPrivateFieldGet$v(this, _Reader_data, "f")); }
    // Create a sub-reader with the same underlying data, but offset
    subReader(offset) {
        return new Reader(__classPrivateFieldGet$v(this, _Reader_data, "f").slice(__classPrivateFieldGet$v(this, _Reader_offset, "f") + offset), this.allowLoose);
    }
    // Read bytes
    readBytes(length, loose) {
        let bytes = __classPrivateFieldGet$v(this, _Reader_instances, "m", _Reader_peekBytes).call(this, 0, length, !!loose);
        __classPrivateFieldSet$u(this, _Reader_offset, __classPrivateFieldGet$v(this, _Reader_offset, "f") + bytes.length, "f");
        // @TODO: Make sure the length..end bytes are all 0?
        return bytes.slice(0, length);
    }
    // Read a numeric values
    readValue() {
        return toBigInt(this.readBytes(WordSize));
    }
    readIndex() {
        return toNumber(this.readBytes(WordSize));
    }
}
_Reader_data = new WeakMap(), _Reader_offset = new WeakMap(), _Reader_instances = new WeakSet(), _Reader_peekBytes = function _Reader_peekBytes(offset, length, loose) {
    let alignedLength = Math.ceil(length / WordSize) * WordSize;
    if (__classPrivateFieldGet$v(this, _Reader_offset, "f") + alignedLength > __classPrivateFieldGet$v(this, _Reader_data, "f").length) {
        if (this.allowLoose && loose && __classPrivateFieldGet$v(this, _Reader_offset, "f") + length <= __classPrivateFieldGet$v(this, _Reader_data, "f").length) {
            alignedLength = length;
        }
        else {
            logger$e.throwError("data out-of-bounds", "BUFFER_OVERRUN", {
                buffer: arrayify(__classPrivateFieldGet$v(this, _Reader_data, "f")),
                length: __classPrivateFieldGet$v(this, _Reader_data, "f").length,
                offset: __classPrivateFieldGet$v(this, _Reader_offset, "f") + alignedLength
            });
        }
    }
    return __classPrivateFieldGet$v(this, _Reader_data, "f").slice(__classPrivateFieldGet$v(this, _Reader_offset, "f"), __classPrivateFieldGet$v(this, _Reader_offset, "f") + alignedLength);
};

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
// Cast array to view
const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
// The rotate right (circular right shift) operation for uint32
const rotr = (word, shift) => (word << (32 - shift)) | (word >>> shift);
const isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
// There is almost no big endian hardware, but js typed arrays uses platform specific endianess.
// So, just to be sure not to corrupt anything.
if (!isLE)
    throw new Error('Non little-endian hardware is not supported');
Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
// Currently avoid insertion of polyfills with packers (browserify/webpack/etc)
// But setTimeout is pretty slow, maybe worth to investigate howto do minimal polyfill here
const nextTick = (() => {
    const nodeRequire = typeof module !== 'undefined' &&
        typeof module.require === 'function' &&
        module.require.bind(module);
    try {
        if (nodeRequire) {
            const { setImmediate } = nodeRequire('timers');
            return () => new Promise((resolve) => setImmediate(resolve));
        }
    }
    catch (e) { }
    return () => new Promise((resolve) => setTimeout(resolve, 0));
})();
// Returns control to thread each 'tick' ms to avoid blocking
async function asyncLoop(iters, tick, cb) {
    let ts = Date.now();
    for (let i = 0; i < iters; i++) {
        cb(i);
        // Date.now() is not monotonic, so in case if clock goes backwards we return return control too
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
            continue;
        await nextTick();
        ts += diff;
    }
}
function utf8ToBytes(str) {
    if (typeof str !== 'string') {
        throw new TypeError(`utf8ToBytes expected string, got ${typeof str}`);
    }
    return new TextEncoder().encode(str);
}
function toBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    if (!(data instanceof Uint8Array))
        throw new TypeError(`Expected input type is Uint8Array (got ${typeof data})`);
    return data;
}
function assertNumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
}
function assertHash(hash) {
    if (typeof hash !== 'function' || typeof hash.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    assertNumber(hash.outputLen);
    assertNumber(hash.blockLen);
}
// For runtime check if class implements interface
class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
}
// Check if object doens't have custom constructor (like Uint8Array/Array)
const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]' && obj.constructor === Object;
function checkOpts(def, _opts) {
    if (_opts !== undefined && (typeof _opts !== 'object' || !isPlainObject(_opts)))
        throw new TypeError('Options should be object or undefined');
    const opts = Object.assign(def, _opts);
    return opts;
}
function wrapConstructor(hashConstructor) {
    const hashC = (message) => hashConstructor().update(toBytes(message)).digest();
    const tmp = hashConstructor();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashConstructor();
    return hashC;
}
function wrapConstructorWithOpts(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
}

// HMAC (RFC 2104)
class HMAC extends Hash {
    constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        assertHash(hash);
        const key = toBytes(_key);
        this.iHash = hash.create();
        if (!(this.iHash instanceof Hash))
            throw new TypeError('Expected instance of class which extends utils.Hash');
        const blockLen = (this.blockLen = this.iHash.blockLen);
        this.outputLen = this.iHash.outputLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > this.iHash.blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash.create();
        // Undo internal XOR && apply outer XOR
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        pad.fill(0);
    }
    update(buf) {
        if (this.destroyed)
            throw new Error('instance is destroyed');
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        if (this.destroyed)
            throw new Error('instance is destroyed');
        if (!(out instanceof Uint8Array) || out.length !== this.outputLen)
            throw new Error('HMAC: Invalid output buffer');
        if (this.finished)
            throw new Error('digest() was already called');
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
}
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 */
const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);

// Common prologue and epilogue for sync/async functions
function pbkdf2Init(hash, _password, _salt, _opts) {
    assertHash(hash);
    const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
    const { c, dkLen, asyncTick } = opts;
    assertNumber(c);
    assertNumber(dkLen);
    assertNumber(asyncTick);
    if (c < 1)
        throw new Error('PBKDF2: iterations (c) should be >= 1');
    const password = toBytes(_password);
    const salt = toBytes(_salt);
    // DK = PBKDF2(PRF, Password, Salt, c, dkLen);
    const DK = new Uint8Array(dkLen);
    // U1 = PRF(Password, Salt + INT_32_BE(i))
    const PRF = hmac.create(hash, password);
    const PRFSalt = PRF._cloneInto().update(salt);
    return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
    PRF.destroy();
    PRFSalt.destroy();
    if (prfW)
        prfW.destroy();
    u.fill(0);
    return DK;
}
/**
 * PBKDF2-HMAC: RFC 2898 key derivation function
 * @param hash - hash function that would be used e.g. sha256
 * @param password - password from which a derived key is generated
 * @param salt - cryptographic salt
 * @param opts - {c, dkLen} where c is work factor and dkLen is output message size
 */
function pbkdf2$1(hash, password, salt, opts) {
    const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
    let prfW; // Working copy
    const arr = new Uint8Array(4);
    const view = createView(arr);
    const u = new Uint8Array(PRF.outputLen);
    // DK = T1 + T2 + ??? + Tdklen/hlen
    for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
        // Ti = F(Password, Salt, c, i)
        const Ti = DK.subarray(pos, pos + PRF.outputLen);
        view.setInt32(0, ti, false);
        // F(Password, Salt, c, i) = U1 ^ U2 ^ ??? ^ Uc
        // U1 = PRF(Password, Salt + INT_32_BE(i))
        (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
        Ti.set(u.subarray(0, Ti.length));
        for (let ui = 1; ui < c; ui++) {
            // Uc = PRF(Password, Uc???1)
            PRF._cloneInto(prfW).update(u).digestInto(u);
            for (let i = 0; i < Ti.length; i++)
                Ti[i] ^= u[i];
        }
    }
    return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}

// Polyfill for Safari 14
function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
// Base SHA2 class (RFC 6234)
class SHA2 extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView(this.buffer);
    }
    update(data) {
        if (this.destroyed)
            throw new Error('instance is destroyed');
        const { view, buffer, blockLen, finished } = this;
        if (finished)
            throw new Error('digest() was already called');
        data = toBytes(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = createView(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        if (this.destroyed)
            throw new Error('instance is destroyed');
        if (!(out instanceof Uint8Array) || out.length < this.outputLen)
            throw new Error('_Sha2: Invalid output buffer');
        if (this.finished)
            throw new Error('digest() was already called');
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        this.buffer.subarray(pos).fill(0);
        // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // NOTE: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64bit of that value.
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = createView(out);
        this.get().forEach((v, i) => oview.setUint32(4 * i, v, isLE));
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
}

// Choice: a ? b : c
const Chi = (a, b, c) => (a & b) ^ (~a & c);
// Majority function, true if any two inpust is true
const Maj = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
// Round constants:
// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
// prettier-ignore
const SHA256_K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
// Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
// prettier-ignore
const IV = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);
// Temporary buffer, not used to store anything between runs
// Named this way because it matches specification.
const SHA256_W = new Uint32Array(64);
class SHA256 extends SHA2 {
    constructor() {
        super(64, 32, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = IV[0] | 0;
        this.B = IV[1] | 0;
        this.C = IV[2] | 0;
        this.D = IV[3] | 0;
        this.E = IV[4] | 0;
        this.F = IV[5] | 0;
        this.G = IV[6] | 0;
        this.H = IV[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ (W15 >>> 3);
            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ (W2 >>> 10);
            SHA256_W[i] = (s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = (sigma0 + Maj(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        SHA256_W.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
    }
}
/**
 * SHA2-256 hash function
 * @param message - data that would be hashed
 */
const sha256$1 = wrapConstructor(() => new SHA256());

const U32_MASK64 = BigInt(2 ** 32 - 1);
const _32n = BigInt(32);
function fromBig(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
    return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
// for Shift in [0, 32)
const shrSH = (h, l, s) => h >>> s;
const shrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in [1, 32)
const rotrSH = (h, l, s) => (h >>> s) | (l << (32 - s));
const rotrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotrBH = (h, l, s) => (h << (64 - s)) | (l >>> (s - 32));
const rotrBL = (h, l, s) => (h >>> (s - 32)) | (l << (64 - s));
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => (h << s) | (l >>> (32 - s));
const rotlSL = (h, l, s) => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));
// JS uses 32-bit signed integers for bitwise operations which means we cannot
// simple take carry out of low bit sum by shift, we need to use division.
function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: (Ah + Bh + ((l / 2 ** 32) | 0)) | 0, l: l | 0 };
}
// Addition with more than 2 elements
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => (Ah + Bh + Ch + ((low / 2 ** 32) | 0)) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => (Ah + Bh + Ch + Dh + ((low / 2 ** 32) | 0)) | 0;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => (Ah + Bh + Ch + Dh + Eh + ((low / 2 ** 32) | 0)) | 0;

// Round contants (first 32 bits of the fractional parts of the cube roots of the first 80 primes 2..409):
// prettier-ignore
const [SHA512_Kh, SHA512_Kl] = split([
    '0x428a2f98d728ae22', '0x7137449123ef65cd', '0xb5c0fbcfec4d3b2f', '0xe9b5dba58189dbbc',
    '0x3956c25bf348b538', '0x59f111f1b605d019', '0x923f82a4af194f9b', '0xab1c5ed5da6d8118',
    '0xd807aa98a3030242', '0x12835b0145706fbe', '0x243185be4ee4b28c', '0x550c7dc3d5ffb4e2',
    '0x72be5d74f27b896f', '0x80deb1fe3b1696b1', '0x9bdc06a725c71235', '0xc19bf174cf692694',
    '0xe49b69c19ef14ad2', '0xefbe4786384f25e3', '0x0fc19dc68b8cd5b5', '0x240ca1cc77ac9c65',
    '0x2de92c6f592b0275', '0x4a7484aa6ea6e483', '0x5cb0a9dcbd41fbd4', '0x76f988da831153b5',
    '0x983e5152ee66dfab', '0xa831c66d2db43210', '0xb00327c898fb213f', '0xbf597fc7beef0ee4',
    '0xc6e00bf33da88fc2', '0xd5a79147930aa725', '0x06ca6351e003826f', '0x142929670a0e6e70',
    '0x27b70a8546d22ffc', '0x2e1b21385c26c926', '0x4d2c6dfc5ac42aed', '0x53380d139d95b3df',
    '0x650a73548baf63de', '0x766a0abb3c77b2a8', '0x81c2c92e47edaee6', '0x92722c851482353b',
    '0xa2bfe8a14cf10364', '0xa81a664bbc423001', '0xc24b8b70d0f89791', '0xc76c51a30654be30',
    '0xd192e819d6ef5218', '0xd69906245565a910', '0xf40e35855771202a', '0x106aa07032bbd1b8',
    '0x19a4c116b8d2d0c8', '0x1e376c085141ab53', '0x2748774cdf8eeb99', '0x34b0bcb5e19b48a8',
    '0x391c0cb3c5c95a63', '0x4ed8aa4ae3418acb', '0x5b9cca4f7763e373', '0x682e6ff3d6b2b8a3',
    '0x748f82ee5defb2fc', '0x78a5636f43172f60', '0x84c87814a1f0ab72', '0x8cc702081a6439ec',
    '0x90befffa23631e28', '0xa4506cebde82bde9', '0xbef9a3f7b2c67915', '0xc67178f2e372532b',
    '0xca273eceea26619c', '0xd186b8c721c0c207', '0xeada7dd6cde0eb1e', '0xf57d4f7fee6ed178',
    '0x06f067aa72176fba', '0x0a637dc5a2c898a6', '0x113f9804bef90dae', '0x1b710b35131c471b',
    '0x28db77f523047d84', '0x32caab7b40c72493', '0x3c9ebe0a15c9bebc', '0x431d67c49c100d4c',
    '0x4cc5d4becb3e42b6', '0x597f299cfc657e2a', '0x5fcb6fab3ad6faec', '0x6c44198c4a475817'
].map(n => BigInt(n)));
// Temporary buffer, not used to store anything between runs
const SHA512_W_H = new Uint32Array(80);
const SHA512_W_L = new Uint32Array(80);
class SHA512 extends SHA2 {
    constructor() {
        super(128, 64, 16, false);
        // We cannot use array here since array allows indexing by variable which means optimizer/compiler cannot use registers.
        // Also looks cleaner and easier to verify with spec.
        // Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0x6a09e667 | 0;
        this.Al = 0xf3bcc908 | 0;
        this.Bh = 0xbb67ae85 | 0;
        this.Bl = 0x84caa73b | 0;
        this.Ch = 0x3c6ef372 | 0;
        this.Cl = 0xfe94f82b | 0;
        this.Dh = 0xa54ff53a | 0;
        this.Dl = 0x5f1d36f1 | 0;
        this.Eh = 0x510e527f | 0;
        this.El = 0xade682d1 | 0;
        this.Fh = 0x9b05688c | 0;
        this.Fl = 0x2b3e6c1f | 0;
        this.Gh = 0x1f83d9ab | 0;
        this.Gl = 0xfb41bd6b | 0;
        this.Hh = 0x5be0cd19 | 0;
        this.Hl = 0x137e2179 | 0;
    }
    // prettier-ignore
    get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 64 words w[16..79] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32((offset += 4));
        }
        for (let i = 16; i < 80; i++) {
            // s0 := (w[i-15] rightrotate 1) xor (w[i-15] rightrotate 8) xor (w[i-15] rightshift 7)
            const W15h = SHA512_W_H[i - 15] | 0;
            const W15l = SHA512_W_L[i - 15] | 0;
            const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
            const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
            // s1 := (w[i-2] rightrotate 19) xor (w[i-2] rightrotate 61) xor (w[i-2] rightshift 6)
            const W2h = SHA512_W_H[i - 2] | 0;
            const W2l = SHA512_W_L[i - 2] | 0;
            const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
            const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
            // SHA256_W[i] = s0 + s1 + SHA256_W[i - 7] + SHA256_W[i - 16];
            const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
            const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
            SHA512_W_H[i] = SUMh | 0;
            SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        // Compression function main loop, 80 rounds
        for (let i = 0; i < 80; i++) {
            // S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
            const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
            const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
            //const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const CHIh = (Eh & Fh) ^ (~Eh & Gh);
            const CHIl = (El & Fl) ^ (~El & Gl);
            // T1 = H + sigma1 + Chi(E, F, G) + SHA512_K[i] + SHA512_W[i]
            // prettier-ignore
            const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
            const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
            const T1l = T1ll | 0;
            // S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
            const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
            const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
            const MAJh = (Ah & Bh) ^ (Ah & Ch) ^ (Bh & Ch);
            const MAJl = (Al & Bl) ^ (Al & Cl) ^ (Bl & Cl);
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = add3L(T1l, sigma0l, MAJl);
            Ah = add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
        }
        // Add the compressed chunk to the current hash value
        ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
        SHA512_W_H.fill(0);
        SHA512_W_L.fill(0);
    }
    destroy() {
        this.buffer.fill(0);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
}
class SHA512_256 extends SHA512 {
    constructor() {
        super();
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0x22312194 | 0;
        this.Al = 0xfc2bf72c | 0;
        this.Bh = 0x9f555fa3 | 0;
        this.Bl = 0xc84c64c2 | 0;
        this.Ch = 0x2393b86b | 0;
        this.Cl = 0x6f53b151 | 0;
        this.Dh = 0x96387719 | 0;
        this.Dl = 0x5940eabd | 0;
        this.Eh = 0x96283ee2 | 0;
        this.El = 0xa88effe3 | 0;
        this.Fh = 0xbe5e1e25 | 0;
        this.Fl = 0x53863992 | 0;
        this.Gh = 0x2b0199fc | 0;
        this.Gl = 0x2c85b8aa | 0;
        this.Hh = 0x0eb72ddc | 0;
        this.Hl = 0x81c52ca2 | 0;
        this.outputLen = 32;
    }
}
class SHA384 extends SHA512 {
    constructor() {
        super();
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0xcbbb9d5d | 0;
        this.Al = 0xc1059ed8 | 0;
        this.Bh = 0x629a292a | 0;
        this.Bl = 0x367cd507 | 0;
        this.Ch = 0x9159015a | 0;
        this.Cl = 0x3070dd17 | 0;
        this.Dh = 0x152fecd8 | 0;
        this.Dl = 0xf70e5939 | 0;
        this.Eh = 0x67332667 | 0;
        this.El = 0xffc00b31 | 0;
        this.Fh = 0x8eb44a87 | 0;
        this.Fl = 0x68581511 | 0;
        this.Gh = 0xdb0c2e0d | 0;
        this.Gl = 0x64f98fa7 | 0;
        this.Hh = 0x47b5481d | 0;
        this.Hl = 0xbefa4fa4 | 0;
        this.outputLen = 48;
    }
}
const sha512$1 = wrapConstructor(() => new SHA512());
wrapConstructor(() => new SHA512_256());
wrapConstructor(() => new SHA384());

const version$c = "@ethersproject/crypto@6.0.0-beta.2";

const logger$b = new Logger(version$c);

/* Browser Crypto Shims */
function getGlobal$1() {
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    throw new Error('unable to locate global object');
}
const anyGlobal = getGlobal$1();
let crypto$1 = anyGlobal.crypto || anyGlobal.msCrypto;
function createHash(algo) {
    switch (algo) {
        case "sha256": return sha256$1.create();
        case "sha512": return sha512$1.create();
    }
    return logger$b.throwArgumentError("invalid hashing algorithm name", "algorithm", algo);
}
function createHmac(_algo, key) {
    const algo = ({ sha256: sha256$1, sha512: sha512$1 }[_algo]);
    if (algo == null) {
        return logger$b.throwArgumentError("invalid hmac algorithm", "algorithm", _algo);
    }
    return hmac.create(algo, key);
}
function pbkdf2Sync(password, salt, iterations, keylen, _algo) {
    const algo = ({ sha256: sha256$1, sha512: sha512$1 }[_algo]);
    if (algo == null) {
        return logger$b.throwArgumentError("invalid pbkdf2 algorithm", "algorithm", _algo);
    }
    return pbkdf2$1(algo, password, salt, { c: iterations, dkLen: keylen });
}
function randomBytes$1(length) {
    if (crypto$1 == null) {
        return logger$b.throwError("platform does not support secure random numbers", "UNSUPPORTED_OPERATION", {
            operation: "randomBytes"
        });
    }
    if (length <= 0 || length > 1024 || (length % 1) || length != length) {
        logger$b.throwArgumentError("invalid length", "length", length);
    }
    const result = new Uint8Array(length);
    crypto$1.getRandomValues(result);
    return result;
}

let locked$4 = false;
const _computeHmac = function (algorithm, key, data) {
    return "0x" + createHmac(algorithm, key).update(data).digest("hex");
};
let __computeHmac = _computeHmac;
function computeHmac(algorithm, _key, _data) {
    const key = logger$b.getBytes(_key, "key");
    const data = logger$b.getBytes(_data, "data");
    return hexlify(__computeHmac(algorithm, key, data));
}
computeHmac._ = _computeHmac;
computeHmac.lock = function () { locked$4 = true; };
computeHmac.register = function (func) {
    if (locked$4) {
        throw new Error("computeHmac is locked");
    }
    __computeHmac = func;
};
Object.freeze(computeHmac);

// Various per round constants calculations
const [SHA3_PI, SHA3_ROTL, _SHA3_IOTA] = [[], [], []];
const _0n$1 = BigInt(0);
const _1n$1 = BigInt(1);
const _2n$1 = BigInt(2);
const _7n = BigInt(7);
const _256n = BigInt(256);
const _0x71n = BigInt(0x71);
for (let round = 0, R = _1n$1, x = 1, y = 0; round < 24; round++) {
    // Pi
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    // Rotational
    SHA3_ROTL.push((((round + 1) * (round + 2)) / 2) % 64);
    // Iota
    let t = _0n$1;
    for (let j = 0; j < 7; j++) {
        R = ((R << _1n$1) ^ ((R >> _7n) * _0x71n)) % _256n;
        if (R & _2n$1)
            t ^= _1n$1 << ((_1n$1 << BigInt(j)) - _1n$1);
    }
    _SHA3_IOTA.push(t);
}
const [SHA3_IOTA_H, SHA3_IOTA_L] = split(_SHA3_IOTA, true);
// Left rotation (without 0, 32, 64)
const rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
const rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
// Same as keccakf1600, but allows to skip some rounds
function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    // NOTE: all indices are x2 since we store state as u32 instead of u64 (bigints to slow in js)
    for (let round = 24 - rounds; round < 24; round++) {
        // Theta ??
        for (let x = 0; x < 10; x++)
            B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
        for (let x = 0; x < 10; x += 2) {
            const idx1 = (x + 8) % 10;
            const idx0 = (x + 2) % 10;
            const B0 = B[idx0];
            const B1 = B[idx0 + 1];
            const Th = rotlH(B0, B1, 1) ^ B[idx1];
            const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
            for (let y = 0; y < 50; y += 10) {
                s[x + y] ^= Th;
                s[x + y + 1] ^= Tl;
            }
        }
        // Rho (??) and Pi (??)
        let curH = s[2];
        let curL = s[3];
        for (let t = 0; t < 24; t++) {
            const shift = SHA3_ROTL[t];
            const Th = rotlH(curH, curL, shift);
            const Tl = rotlL(curH, curL, shift);
            const PI = SHA3_PI[t];
            curH = s[PI];
            curL = s[PI + 1];
            s[PI] = Th;
            s[PI + 1] = Tl;
        }
        // Chi (??)
        for (let y = 0; y < 50; y += 10) {
            for (let x = 0; x < 10; x++)
                B[x] = s[y + x];
            for (let x = 0; x < 10; x++)
                s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
        }
        // Iota (??)
        s[0] ^= SHA3_IOTA_H[round];
        s[1] ^= SHA3_IOTA_L[round];
    }
    B.fill(0);
}
class Keccak extends Hash {
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        // Can be passed from user as dkLen
        assertNumber(outputLen);
        // 1600 = 5x5 matrix of 64bit.  1600 bits === 200 bytes
        if (0 >= this.blockLen || this.blockLen >= 200)
            throw new Error('Sha3 supports only keccak-f1600 function');
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
    }
    keccak() {
        keccakP(this.state32, this.rounds);
        this.posOut = 0;
        this.pos = 0;
    }
    update(data) {
        if (this.destroyed)
            throw new Error('instance is destroyed');
        if (this.finished)
            throw new Error('digest() was already called');
        const { blockLen, state } = this;
        data = toBytes(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            for (let i = 0; i < take; i++)
                state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen)
                this.keccak();
        }
        return this;
    }
    finish() {
        if (this.finished)
            return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        // Do the padding
        state[pos] ^= suffix;
        if ((suffix & 0x80) !== 0 && pos === blockLen - 1)
            this.keccak();
        state[blockLen - 1] ^= 0x80;
        this.keccak();
    }
    writeInto(out) {
        if (this.destroyed)
            throw new Error('instance is destroyed');
        if (!(out instanceof Uint8Array))
            throw new Error('Keccak: invalid output buffer');
        this.finish();
        for (let pos = 0, len = out.length; pos < len;) {
            if (this.posOut >= this.blockLen)
                this.keccak();
            const take = Math.min(this.blockLen - this.posOut, len - pos);
            out.set(this.state.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
        }
        return out;
    }
    xofInto(out) {
        // Sha3/Keccak usage with XOF is probably mistake, only SHAKE instances can do XOF
        if (!this.enableXOF)
            throw new Error('XOF is not possible for this instance');
        return this.writeInto(out);
    }
    xof(bytes) {
        assertNumber(bytes);
        return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
        if (out.length < this.outputLen)
            throw new Error('Keccak: invalid output buffer');
        if (this.finished)
            throw new Error('digest() was already called');
        this.finish();
        this.writeInto(out);
        this.destroy();
        return out;
    }
    digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
        this.destroyed = true;
        this.state.fill(0);
    }
    _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        // Suffix can change in cSHAKE
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
    }
}
const gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
gen(0x06, 144, 224 / 8);
/**
 * SHA3-256 hash function
 * @param message - that would be hashed
 */
gen(0x06, 136, 256 / 8);
gen(0x06, 104, 384 / 8);
gen(0x06, 72, 512 / 8);
gen(0x01, 144, 224 / 8);
/**
 * keccak-256 hash function. Different from SHA3-256.
 * @param message - that would be hashed
 */
const keccak_256 = gen(0x01, 136, 256 / 8);
gen(0x01, 104, 384 / 8);
gen(0x01, 72, 512 / 8);
const genShake = (suffix, blockLen, outputLen) => wrapConstructorWithOpts((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen !== undefined ? opts.dkLen : outputLen, true));
genShake(0x1f, 168, 128 / 8);
genShake(0x1f, 136, 256 / 8);

let locked$3 = false;
const _keccak256 = function (data) {
    return keccak_256(data);
};
let __keccak256 = _keccak256;
function keccak256(_data) {
    const data = logger$b.getBytes(_data, "data");
    return hexlify(__keccak256(data));
}
keccak256._ = _keccak256;
keccak256.lock = function () { locked$3 = true; };
keccak256.register = function (func) {
    if (locked$3) {
        throw new TypeError("keccak256 is locked");
    }
    __keccak256 = func;
};
Object.freeze(keccak256);

// https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
// https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf
const Rho = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]);
const Id = Uint8Array.from({ length: 16 }, (_, i) => i);
const Pi = Id.map((i) => (9 * i + 5) % 16);
let idxL = [Id];
let idxR = [Pi];
for (let i = 0; i < 4; i++)
    for (let j of [idxL, idxR])
        j.push(j[i].map((k) => Rho[k]));
const shifts = [
    [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
    [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
    [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
    [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
    [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5],
].map((i) => new Uint8Array(i));
const shiftsL = idxL.map((idx, i) => idx.map((j) => shifts[i][j]));
const shiftsR = idxR.map((idx, i) => idx.map((j) => shifts[i][j]));
const Kl = new Uint32Array([0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e]);
const Kr = new Uint32Array([0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000]);
// The rotate left (circular left shift) operation for uint32
const rotl$1 = (word, shift) => (word << shift) | (word >>> (32 - shift));
// It's called f() in spec.
function f(group, x, y, z) {
    if (group === 0)
        return x ^ y ^ z;
    else if (group === 1)
        return (x & y) | (~x & z);
    else if (group === 2)
        return (x | ~y) ^ z;
    else if (group === 3)
        return (x & z) | (y & ~z);
    else
        return x ^ (y | ~z);
}
// Temporary buffer, not used to store anything between runs
const BUF = new Uint32Array(16);
class RIPEMD160 extends SHA2 {
    constructor() {
        super(64, 20, 8, true);
        this.h0 = 0x67452301 | 0;
        this.h1 = 0xefcdab89 | 0;
        this.h2 = 0x98badcfe | 0;
        this.h3 = 0x10325476 | 0;
        this.h4 = 0xc3d2e1f0 | 0;
    }
    get() {
        const { h0, h1, h2, h3, h4 } = this;
        return [h0, h1, h2, h3, h4];
    }
    set(h0, h1, h2, h3, h4) {
        this.h0 = h0 | 0;
        this.h1 = h1 | 0;
        this.h2 = h2 | 0;
        this.h3 = h3 | 0;
        this.h4 = h4 | 0;
    }
    process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
            BUF[i] = view.getUint32(offset, true);
        // prettier-ignore
        let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
        // Instead of iterating 0 to 80, we split it into 5 groups
        // And use the groups in constants, functions, etc. Much simpler
        for (let group = 0; group < 5; group++) {
            const rGroup = 4 - group;
            const hbl = Kl[group], hbr = Kr[group]; // prettier-ignore
            const rl = idxL[group], rr = idxR[group]; // prettier-ignore
            const sl = shiftsL[group], sr = shiftsR[group]; // prettier-ignore
            for (let i = 0; i < 16; i++) {
                const tl = (rotl$1(al + f(group, bl, cl, dl) + BUF[rl[i]] + hbl, sl[i]) + el) | 0;
                al = el, el = dl, dl = rotl$1(cl, 10) | 0, cl = bl, bl = tl; // prettier-ignore
            }
            // 2 loops are 10% faster
            for (let i = 0; i < 16; i++) {
                const tr = (rotl$1(ar + f(rGroup, br, cr, dr) + BUF[rr[i]] + hbr, sr[i]) + er) | 0;
                ar = er, er = dr, dr = rotl$1(cr, 10) | 0, cr = br, br = tr; // prettier-ignore
            }
        }
        // Add the compressed chunk to the current hash value
        this.set((this.h1 + cl + dr) | 0, (this.h2 + dl + er) | 0, (this.h3 + el + ar) | 0, (this.h4 + al + br) | 0, (this.h0 + bl + cr) | 0);
    }
    roundClean() {
        BUF.fill(0);
    }
    destroy() {
        this.destroyed = true;
        this.buffer.fill(0);
        this.set(0, 0, 0, 0, 0);
    }
}
/**
 * RIPEMD-160 - a hash function from 1990s.
 * @param message - msg that would be hashed
 */
const ripemd160$1 = wrapConstructor(() => new RIPEMD160());

let locked$2 = false;
const _ripemd160 = function (data) {
    return ripemd160$1(data);
};
let __ripemd160 = _ripemd160;
function ripemd160(_data) {
    const data = logger$b.getBytes(_data, "data");
    return hexlify(__ripemd160(data));
}
ripemd160._ = _ripemd160;
ripemd160.lock = function () { locked$2 = true; };
ripemd160.register = function (func) {
    if (locked$2) {
        throw new TypeError("ripemd160 is locked");
    }
    __ripemd160 = func;
};
Object.freeze(ripemd160);

let locked$1 = false;
const _pbkdf2 = function (password, salt, iterations, keylen, algo) {
    return pbkdf2Sync(password, salt, iterations, keylen, algo);
};
let __pbkdf2 = _pbkdf2;
function pbkdf2(_password, _salt, iterations, keylen, algo) {
    const password = logger$b.getBytes(_password, "password");
    const salt = logger$b.getBytes(_salt, "salt");
    return hexlify(__pbkdf2(password, salt, iterations, keylen, algo));
}
pbkdf2._ = _pbkdf2;
pbkdf2.lock = function () { locked$1 = true; };
pbkdf2.register = function (func) {
    if (locked$1) {
        throw new Error("pbkdf2 is locked");
    }
    __pbkdf2 = func;
};
Object.freeze(pbkdf2);

let locked = false;
const _randomBytes = function (length) {
    return new Uint8Array(randomBytes$1(length));
};
let __randomBytes = _randomBytes;
function randomBytes(length) {
    return __randomBytes(length);
}
randomBytes._ = _randomBytes;
randomBytes.lock = function () { locked = true; };
randomBytes.register = function (func) {
    if (locked) {
        throw new Error("random is locked");
    }
    __randomBytes = func;
};
Object.freeze(randomBytes);

// RFC 7914 Scrypt KDF
// Left rotate for uint32
const rotl = (a, b) => (a << b) | (a >>> (32 - b));
// The main Scrypt loop: uses Salsa extensively.
// Six versions of the function were tried, this is the fastest one.
// prettier-ignore
function XorAndSalsa(prev, pi, input, ii, out, oi) {
    // Based on https://cr.yp.to/salsa20.html
    // Xor blocks
    let y00 = prev[pi++] ^ input[ii++], y01 = prev[pi++] ^ input[ii++];
    let y02 = prev[pi++] ^ input[ii++], y03 = prev[pi++] ^ input[ii++];
    let y04 = prev[pi++] ^ input[ii++], y05 = prev[pi++] ^ input[ii++];
    let y06 = prev[pi++] ^ input[ii++], y07 = prev[pi++] ^ input[ii++];
    let y08 = prev[pi++] ^ input[ii++], y09 = prev[pi++] ^ input[ii++];
    let y10 = prev[pi++] ^ input[ii++], y11 = prev[pi++] ^ input[ii++];
    let y12 = prev[pi++] ^ input[ii++], y13 = prev[pi++] ^ input[ii++];
    let y14 = prev[pi++] ^ input[ii++], y15 = prev[pi++] ^ input[ii++];
    // Save state to temporary variables (salsa)
    let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
    // Main loop (salsa)
    for (let i = 0; i < 8; i += 2) {
        x04 ^= rotl(x00 + x12 | 0, 7);
        x08 ^= rotl(x04 + x00 | 0, 9);
        x12 ^= rotl(x08 + x04 | 0, 13);
        x00 ^= rotl(x12 + x08 | 0, 18);
        x09 ^= rotl(x05 + x01 | 0, 7);
        x13 ^= rotl(x09 + x05 | 0, 9);
        x01 ^= rotl(x13 + x09 | 0, 13);
        x05 ^= rotl(x01 + x13 | 0, 18);
        x14 ^= rotl(x10 + x06 | 0, 7);
        x02 ^= rotl(x14 + x10 | 0, 9);
        x06 ^= rotl(x02 + x14 | 0, 13);
        x10 ^= rotl(x06 + x02 | 0, 18);
        x03 ^= rotl(x15 + x11 | 0, 7);
        x07 ^= rotl(x03 + x15 | 0, 9);
        x11 ^= rotl(x07 + x03 | 0, 13);
        x15 ^= rotl(x11 + x07 | 0, 18);
        x01 ^= rotl(x00 + x03 | 0, 7);
        x02 ^= rotl(x01 + x00 | 0, 9);
        x03 ^= rotl(x02 + x01 | 0, 13);
        x00 ^= rotl(x03 + x02 | 0, 18);
        x06 ^= rotl(x05 + x04 | 0, 7);
        x07 ^= rotl(x06 + x05 | 0, 9);
        x04 ^= rotl(x07 + x06 | 0, 13);
        x05 ^= rotl(x04 + x07 | 0, 18);
        x11 ^= rotl(x10 + x09 | 0, 7);
        x08 ^= rotl(x11 + x10 | 0, 9);
        x09 ^= rotl(x08 + x11 | 0, 13);
        x10 ^= rotl(x09 + x08 | 0, 18);
        x12 ^= rotl(x15 + x14 | 0, 7);
        x13 ^= rotl(x12 + x15 | 0, 9);
        x14 ^= rotl(x13 + x12 | 0, 13);
        x15 ^= rotl(x14 + x13 | 0, 18);
    }
    // Write output (salsa)
    out[oi++] = (y00 + x00) | 0;
    out[oi++] = (y01 + x01) | 0;
    out[oi++] = (y02 + x02) | 0;
    out[oi++] = (y03 + x03) | 0;
    out[oi++] = (y04 + x04) | 0;
    out[oi++] = (y05 + x05) | 0;
    out[oi++] = (y06 + x06) | 0;
    out[oi++] = (y07 + x07) | 0;
    out[oi++] = (y08 + x08) | 0;
    out[oi++] = (y09 + x09) | 0;
    out[oi++] = (y10 + x10) | 0;
    out[oi++] = (y11 + x11) | 0;
    out[oi++] = (y12 + x12) | 0;
    out[oi++] = (y13 + x13) | 0;
    out[oi++] = (y14 + x14) | 0;
    out[oi++] = (y15 + x15) | 0;
}
function BlockMix(input, ii, out, oi, r) {
    // The block B is r 128-byte chunks (which is equivalent of 2r 64-byte chunks)
    let head = oi + 0;
    let tail = oi + 16 * r;
    for (let i = 0; i < 16; i++)
        out[tail + i] = input[ii + (2 * r - 1) * 16 + i]; // X ??? B[2r???1]
    for (let i = 0; i < r; i++, head += 16, ii += 16) {
        // We write odd & even Yi at same time. Even: 0bXXXXX0 Odd:  0bXXXXX1
        XorAndSalsa(out, tail, input, ii, out, head); // head[i] = Salsa(blockIn[2*i] ^ tail[i-1])
        if (i > 0)
            tail += 16; // First iteration overwrites tmp value in tail
        XorAndSalsa(out, head, input, (ii += 16), out, tail); // tail[i] = Salsa(blockIn[2*i+1] ^ head[i])
    }
}
// Common prologue and epilogue for sync/async functions
function scryptInit(password, salt, _opts) {
    // Maxmem - 1GB+1KB by default
    const opts = checkOpts({
        dkLen: 32,
        asyncTick: 10,
        maxmem: 1024 ** 3 + 1024,
    }, _opts);
    const { N, r, p, dkLen, asyncTick, maxmem, onProgress } = opts;
    assertNumber(N);
    assertNumber(r);
    assertNumber(p);
    assertNumber(dkLen);
    assertNumber(asyncTick);
    assertNumber(maxmem);
    if (onProgress !== undefined && typeof onProgress !== 'function')
        throw new Error('progressCb should be function');
    const blockSize = 128 * r;
    const blockSize32 = blockSize / 4;
    if (N <= 1 || (N & (N - 1)) !== 0 || N >= 2 ** (blockSize / 8) || N > 2 ** 32) {
        // NOTE: we limit N to be less than 2**32 because of 32 bit variant of Integrify function
        // There is no JS engines that allows alocate more than 4GB per single Uint8Array for now, but can change in future.
        throw new Error('Scrypt: N must be larger than 1, a power of 2, less than 2^(128 * r / 8) and less than 2^32');
    }
    if (p < 0 || p > ((2 ** 32 - 1) * 32) / blockSize) {
        throw new Error('Scrypt: p must be a positive integer less than or equal to ((2^32 - 1) * 32) / (128 * r)');
    }
    if (dkLen < 0 || dkLen > (2 ** 32 - 1) * 32) {
        throw new Error('Scrypt: dkLen should be positive integer less than or equal to (2^32 - 1) * 32');
    }
    const memUsed = blockSize * (N + p);
    if (memUsed > maxmem) {
        throw new Error(`Scrypt: parameters too large, ${memUsed} (128 * r * (N + p)) > ${maxmem} (maxmem)`);
    }
    // [B0...Bp???1] ??? PBKDF2HMAC-SHA256(Passphrase, Salt, 1, blockSize*ParallelizationFactor)
    // Since it has only one iteration there is no reason to use async variant
    const B = pbkdf2$1(sha256$1, password, salt, { c: 1, dkLen: blockSize * p });
    const B32 = u32(B);
    // Re-used between parallel iterations. Array(iterations) of B
    const V = u32(new Uint8Array(blockSize * N));
    const tmp = u32(new Uint8Array(blockSize));
    let blockMixCb = () => { };
    if (onProgress) {
        const totalBlockMix = 2 * N * p;
        // Invoke callback if progress changes from 10.01 to 10.02
        // Allows to draw smooth progress bar on up to 8K screen
        const callbackPer = Math.max(Math.floor(totalBlockMix / 10000), 1);
        let blockMixCnt = 0;
        blockMixCb = () => {
            blockMixCnt++;
            if (onProgress && (!(blockMixCnt % callbackPer) || blockMixCnt === totalBlockMix))
                onProgress(blockMixCnt / totalBlockMix);
        };
    }
    return { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb, asyncTick };
}
function scryptOutput(password, dkLen, B, V, tmp) {
    const res = pbkdf2$1(sha256$1, password, B, { c: 1, dkLen });
    B.fill(0);
    V.fill(0);
    tmp.fill(0);
    return res;
}
/**
 * Scrypt KDF from RFC 7914.
 * @param password - pass
 * @param salt - salt
 * @param opts - parameters
 * - `N` is cpu/mem work factor (power of 2 e.g. 2**18)
 * - `r` is block size (8 is common), fine-tunes sequential memory read size and performance
 * - `p` is parallelization factor (1 is common)
 * - `dkLen` is output key length in bytes e.g. 32.
 * - `asyncTick` - (default: 10) max time in ms for which async function can block execution
 * - `maxmem` - (default: `1024 ** 3 + 1024` aka 1GB+1KB). A limit that the app could use for scrypt
 * - `onProgress` - callback function that would be executed for progress report
 * @returns Derived key
 */
function scrypt$1(password, salt, opts) {
    const { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb } = scryptInit(password, salt, opts);
    for (let pi = 0; pi < p; pi++) {
        const Pi = blockSize32 * pi;
        for (let i = 0; i < blockSize32; i++)
            V[i] = B32[Pi + i]; // V[0] = B[i]
        for (let i = 0, pos = 0; i < N - 1; i++) {
            BlockMix(V, pos, V, (pos += blockSize32), r); // V[i] = BlockMix(V[i-1]);
            blockMixCb();
        }
        BlockMix(V, (N - 1) * blockSize32, B32, Pi, r); // Process last element
        blockMixCb();
        for (let i = 0; i < N; i++) {
            // First u32 of the last 64-byte block (u32 is LE)
            const j = B32[Pi + blockSize32 - 16] % N; // j = Integrify(X) % iterations
            for (let k = 0; k < blockSize32; k++)
                tmp[k] = B32[Pi + k] ^ V[j * blockSize32 + k]; // tmp = B ^ V[j]
            BlockMix(tmp, 0, B32, Pi, r); // B = BlockMix(B ^ V[j])
            blockMixCb();
        }
    }
    return scryptOutput(password, dkLen, B, V, tmp);
}
/**
 * Scrypt KDF from RFC 7914.
 */
async function scryptAsync(password, salt, opts) {
    const { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb, asyncTick } = scryptInit(password, salt, opts);
    for (let pi = 0; pi < p; pi++) {
        const Pi = blockSize32 * pi;
        for (let i = 0; i < blockSize32; i++)
            V[i] = B32[Pi + i]; // V[0] = B[i]
        let pos = 0;
        await asyncLoop(N - 1, asyncTick, (i) => {
            BlockMix(V, pos, V, (pos += blockSize32), r); // V[i] = BlockMix(V[i-1]);
            blockMixCb();
        });
        BlockMix(V, (N - 1) * blockSize32, B32, Pi, r); // Process last element
        blockMixCb();
        await asyncLoop(N, asyncTick, (i) => {
            // First u32 of the last 64-byte block (u32 is LE)
            const j = B32[Pi + blockSize32 - 16] % N; // j = Integrify(X) % iterations
            for (let k = 0; k < blockSize32; k++)
                tmp[k] = B32[Pi + k] ^ V[j * blockSize32 + k]; // tmp = B ^ V[j]
            BlockMix(tmp, 0, B32, Pi, r); // B = BlockMix(B ^ V[j])
            blockMixCb();
        });
    }
    return scryptOutput(password, dkLen, B, V, tmp);
}

let lockedSync = false, lockedAsync = false;
const _scryptAsync = async function (passwd, salt, N, r, p, dkLen, onProgress) {
    return await scryptAsync(passwd, salt, { N, r, p, dkLen, onProgress });
};
const _scryptSync = function (passwd, salt, N, r, p, dkLen) {
    return scrypt$1(passwd, salt, { N, r, p, dkLen });
};
let __scryptAsync = _scryptAsync;
let __scryptSync = _scryptSync;
async function scrypt(_passwd, _salt, N, r, p, dkLen, progress) {
    const passwd = logger$b.getBytes(_passwd, "passwd");
    const salt = logger$b.getBytes(_salt, "salt");
    return hexlify(await __scryptAsync(passwd, salt, N, r, p, dkLen, progress));
}
scrypt._ = _scryptAsync;
scrypt.lock = function () { lockedAsync = true; };
scrypt.register = function (func) {
    if (lockedAsync) {
        throw new Error("scrypt is locked");
    }
    __scryptAsync = func;
};
Object.freeze(scrypt);
function scryptSync(_passwd, _salt, N, r, p, dkLen) {
    const passwd = logger$b.getBytes(_passwd, "passwd");
    const salt = logger$b.getBytes(_salt, "salt");
    return hexlify(__scryptSync(passwd, salt, N, r, p, dkLen));
}
scryptSync._ = _scryptSync;
scryptSync.lock = function () { lockedSync = true; };
scryptSync.register = function (func) {
    if (lockedSync) {
        throw new Error("scryptSync is locked");
    }
    __scryptSync = func;
};
Object.freeze(scryptSync);

const _sha256 = function (data) {
    return createHash("sha256").update(data).digest();
};
const _sha512 = function (data) {
    return createHash("sha512").update(data).digest();
};
let __sha256 = _sha256;
let __sha512 = _sha512;
let locked256 = false, locked512 = false;
function sha256(_data) {
    const data = logger$b.getBytes(_data, "data");
    return hexlify(__sha256(data));
}
sha256._ = _sha256;
sha256.lock = function () { locked256 = true; };
sha256.register = function (func) {
    if (locked256) {
        throw new Error("sha256 is locked");
    }
    __sha256 = func;
};
Object.freeze(sha256);
function sha512(_data) {
    const data = logger$b.getBytes(_data, "data");
    return hexlify(__sha512(data));
}
sha512._ = _sha512;
sha512.lock = function () { locked512 = true; };
sha512.register = function (func) {
    if (locked512) {
        throw new Error("sha512 is locked");
    }
    __sha512 = func;
};
Object.freeze(sha256);

// We import all these so we can export lock()
function lock() {
    computeHmac.lock();
    keccak256.lock();
    pbkdf2.lock();
    randomBytes.lock();
    ripemd160.lock();
    scrypt.lock();
    scryptSync.lock();
    sha256.lock();
    sha512.lock();
}

const version$b = "@ethersproject/address@6.0.0-beta.2";

const logger$a = new Logger(version$b);

const BN_0$4 = BigInt(0);
const BN_36 = BigInt(36);
function getChecksumAddress(address) {
    //    if (!isHexString(address, 20)) {
    //        logger.throwArgumentError("invalid address", "address", address);
    //    }
    address = address.toLowerCase();
    const chars = address.substring(2).split("");
    const expanded = new Uint8Array(40);
    for (let i = 0; i < 40; i++) {
        expanded[i] = chars[i].charCodeAt(0);
    }
    const hashed = arrayify(keccak256(expanded));
    for (let i = 0; i < 40; i += 2) {
        if ((hashed[i >> 1] >> 4) >= 8) {
            chars[i] = chars[i].toUpperCase();
        }
        if ((hashed[i >> 1] & 0x0f) >= 8) {
            chars[i + 1] = chars[i + 1].toUpperCase();
        }
    }
    return "0x" + chars.join("");
}
// See: https://en.wikipedia.org/wiki/International_Bank_Account_Number
// Create lookup table
const ibanLookup = {};
for (let i = 0; i < 10; i++) {
    ibanLookup[String(i)] = String(i);
}
for (let i = 0; i < 26; i++) {
    ibanLookup[String.fromCharCode(65 + i)] = String(10 + i);
}
// How many decimal digits can we process? (for 64-bit float, this is 15)
// i.e. Math.floor(Math.log10(Number.MAX_SAFE_INTEGER));
const safeDigits = 15;
function ibanChecksum(address) {
    address = address.toUpperCase();
    address = address.substring(4) + address.substring(0, 2) + "00";
    let expanded = address.split("").map((c) => { return ibanLookup[c]; }).join("");
    // Javascript can handle integers safely up to 15 (decimal) digits
    while (expanded.length >= safeDigits) {
        let block = expanded.substring(0, safeDigits);
        expanded = parseInt(block, 10) % 97 + expanded.substring(block.length);
    }
    let checksum = String(98 - (parseInt(expanded, 10) % 97));
    while (checksum.length < 2) {
        checksum = "0" + checksum;
    }
    return checksum;
}
const Base36 = (function () {
    const result = {};
    for (let i = 0; i < 36; i++) {
        const key = "0123456789abcdefghijklmnopqrstuvwxyz"[i];
        result[key] = BigInt(i);
    }
    return result;
})();
function fromBase36(value) {
    value = value.toLowerCase();
    let result = BN_0$4;
    for (let i = 0; i < value.length; i++) {
        result = result * BN_36 + Base36[value[i]];
    }
    return result;
}
function getAddress(address) {
    if (typeof (address) !== "string") {
        logger$a.throwArgumentError("invalid address", "address", address);
    }
    if (address.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
        // Missing the 0x prefix
        if (address.substring(0, 2) !== "0x") {
            address = "0x" + address;
        }
        const result = getChecksumAddress(address);
        // It is a checksummed address with a bad checksum
        if (address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && result !== address) {
            logger$a.throwArgumentError("bad address checksum", "address", address);
        }
        return result;
    }
    // Maybe ICAP? (we only support direct mode)
    if (address.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
        // It is an ICAP address with a bad checksum
        if (address.substring(2, 4) !== ibanChecksum(address)) {
            logger$a.throwArgumentError("bad icap checksum", "address", address);
        }
        let result = fromBase36(address.substring(4)).toString(16);
        while (result.length < 40) {
            result = "0" + result;
        }
        return getChecksumAddress("0x" + result);
    }
    return logger$a.throwArgumentError("invalid address", "address", address);
}
function getIcapAddress(address) {
    //let base36 = _base16To36(getAddress(address).substring(2)).toUpperCase();
    let base36 = BigInt(getAddress(address)).toString(36).toUpperCase();
    while (base36.length < 30) {
        base36 = "0" + base36;
    }
    return "XE" + ibanChecksum("XE00" + base36) + base36;
}

const version$a = "@ethersproject/rlp@6.0.0-beta.2";

const logger$9 = new Logger(version$a);

//See: https://github.com/ethereum/wiki/wiki/RLP
function arrayifyInteger(value) {
    const result = [];
    while (value) {
        result.unshift(value & 0xff);
        value >>= 8;
    }
    return result;
}
function _encode(object) {
    if (Array.isArray(object)) {
        let payload = [];
        object.forEach(function (child) {
            payload = payload.concat(_encode(child));
        });
        if (payload.length <= 55) {
            payload.unshift(0xc0 + payload.length);
            return payload;
        }
        const length = arrayifyInteger(payload.length);
        length.unshift(0xf7 + length.length);
        return length.concat(payload);
    }
    const data = Array.prototype.slice.call(logger$9.getBytes(object, "object"));
    if (data.length === 1 && data[0] <= 0x7f) {
        return data;
    }
    else if (data.length <= 55) {
        data.unshift(0x80 + data.length);
        return data;
    }
    const length = arrayifyInteger(data.length);
    length.unshift(0xb7 + length.length);
    return length.concat(data);
}
const nibbles = "0123456789abcdef";
function encodeRlp(object) {
    let result = "0x";
    for (const v of _encode(object)) {
        result += nibbles[v >> 4];
        result += nibbles[v & 0xf];
    }
    return result;
}

//See: https://github.com/ethereum/wiki/wiki/RLP
function hexlifyByte(value) {
    let result = value.toString(16);
    while (result.length < 2) {
        result = "0" + result;
    }
    return "0x" + result;
}
function unarrayifyInteger(data, offset, length) {
    let result = 0;
    for (let i = 0; i < length; i++) {
        result = (result * 256) + data[offset + i];
    }
    return result;
}
function _decodeChildren(data, offset, childOffset, length) {
    const result = [];
    while (childOffset < offset + 1 + length) {
        const decoded = _decode(data, childOffset);
        result.push(decoded.result);
        childOffset += decoded.consumed;
        if (childOffset > offset + 1 + length) {
            logger$9.throwError("child data too short", "BUFFER_OVERRUN", {
                buffer: data, length, offset
            });
        }
    }
    return { consumed: (1 + length), result: result };
}
// returns { consumed: number, result: Object }
function _decode(data, offset) {
    if (data.length === 0) {
        logger$9.throwError("data too short", "BUFFER_OVERRUN", {
            buffer: data, length: 0, offset: 1
        });
    }
    const checkOffset = (offset) => {
        if (offset > data.length) {
            logger$9.throwError("data short segment too short", "BUFFER_OVERRUN", {
                buffer: data, length: data.length, offset
            });
        }
    };
    // Array with extra length prefix
    if (data[offset] >= 0xf8) {
        const lengthLength = data[offset] - 0xf7;
        checkOffset(offset + 1 + lengthLength);
        const length = unarrayifyInteger(data, offset + 1, lengthLength);
        checkOffset(offset + 1 + lengthLength + length);
        return _decodeChildren(data, offset, offset + 1 + lengthLength, lengthLength + length);
    }
    else if (data[offset] >= 0xc0) {
        const length = data[offset] - 0xc0;
        checkOffset(offset + 1 + length);
        return _decodeChildren(data, offset, offset + 1, length);
    }
    else if (data[offset] >= 0xb8) {
        const lengthLength = data[offset] - 0xb7;
        checkOffset(offset + 1 + lengthLength);
        const length = unarrayifyInteger(data, offset + 1, lengthLength);
        checkOffset(offset + 1 + lengthLength + length);
        const result = hexlify(data.slice(offset + 1 + lengthLength, offset + 1 + lengthLength + length));
        return { consumed: (1 + lengthLength + length), result: result };
    }
    else if (data[offset] >= 0x80) {
        const length = data[offset] - 0x80;
        checkOffset(offset + 1 + length);
        const result = hexlify(data.slice(offset + 1, offset + 1 + length));
        return { consumed: (1 + length), result: result };
    }
    return { consumed: 1, result: hexlifyByte(data[offset]) };
}
function decodeRlp(_data) {
    const data = logger$9.getBytes(_data, "data");
    const decoded = _decode(data, 0);
    if (decoded.consumed !== data.length) {
        logger$9.throwArgumentError("unexpected junk after rlp payload", "data", _data);
    }
    return decoded.result;
}

// http://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed
function getCreateAddress(tx) {
    const from = getAddress(tx.from);
    const nonce = logger$a.getBigInt(tx.nonce, "tx.nonce");
    let nonceHex = nonce.toString(16);
    if (nonceHex === "0") {
        nonceHex = "0x";
    }
    else if (nonceHex.length % 2) {
        nonceHex = "0x0" + nonceHex;
    }
    else {
        nonceHex = "0x" + nonceHex;
    }
    return getAddress(dataSlice(keccak256(encodeRlp([from, nonceHex])), 12));
}
function getCreate2Address(_from, _salt, _initCodeHash) {
    const from = getAddress(_from);
    const salt = logger$a.getBytes(_salt, "salt");
    const initCodeHash = logger$a.getBytes(_initCodeHash, "initCodeHash");
    if (salt.length !== 32) {
        logger$a.throwArgumentError("salt must be 32 bytes", "salt", _salt);
    }
    if (initCodeHash.length !== 32) {
        logger$a.throwArgumentError("initCodeHash must be 32 bytes", "initCodeHash", _initCodeHash);
    }
    return getAddress(dataSlice(keccak256(concat(["0xff", from, salt, initCodeHash])), 12));
}

function isAddressable(value) {
    return (value && typeof (value.getAddress) === "function");
}
function isAddress(value) {
    try {
        getAddress(value);
        return true;
    }
    catch (error) { }
    return false;
}
// Resolves an Ethereum address, ENS name or Addressable object,
// throwing if the result is null; an explicit null returns null
//export async function resolveAddress(target?: null, resolver?: null | NameResolver): Promise<null>;
//export async function resolveAddress(target: string | Addressable, resolver?: null | NameResolver): Promise<string>;
//export async function resolveAddress(target: null | undefined | string | Addressable, resolver?: null | NameResolver) {
async function resolveAddress(target, resolver) {
    //if (target == null) { return null; }
    if (typeof (target) === "string") {
        if (target.match(/^0x[0-9a-f]{40}$/i)) {
            return getAddress(target);
        }
        if (resolver == null) {
            return logger$a.throwError("ENS resolution requires a provider", "UNSUPPORTED_OPERATION", {
                operation: "resolveName",
            });
        }
        const result = await resolver.resolveName(target);
        if (result == null || result === "0x0000000000000000000000000000000000000000") {
            return logger$a.throwError("unconfigured name", "UNCONFIGURED_NAME", { value: target });
        }
        return getAddress(result);
    }
    else if (isAddressable(target)) {
        const result = await target.getAddress();
        if (result == null) {
            logger$a.throwArgumentError("addressable resolved to null", "target", target);
        }
        return getAddress(result);
    }
    return logger$a.throwArgumentError("unsupported addressable value", "target", target);
}

var __classPrivateFieldSet$t = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$u = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Typed_options;
const _gaurd = {};
function n(value, width) {
    let signed = false;
    if (width < 0) {
        signed = true;
        width *= -1;
    }
    // @TODO: Check range is valid for value
    return new Typed(_gaurd, `${signed ? "" : "u"}int${width}`, value, { signed, width });
}
function b(value, size) {
    // @TODO: Check range is valid for value
    return new Typed(_gaurd, `bytes${(size) ? size : ""}`, value, { size });
}
const _typedSymbol = Symbol.for("_ethers_typed");
class Typed {
    constructor(gaurd, type, value, options = null) {
        _Typed_options.set(this, void 0);
        if (gaurd !== _gaurd) {
            throw new Error("private constructor");
        }
        defineProperties(this, { _typedSymbol, type, value });
        __classPrivateFieldSet$t(this, _Typed_options, options, "f");
        // Check the value is valid
        this.format();
    }
    format() {
        if (this.type === "array") {
            throw new Error("");
        }
        else if (this.type === "dynamicArray") {
            throw new Error("");
        }
        else if (this.type === "tuple") {
            return `tuple(${this.value.map((v) => v.format()).join(",")})`;
        }
        return this.type;
    }
    defaultValue() {
        return 0;
    }
    minValue() {
        return 0;
    }
    maxValue() {
        return 0;
    }
    isBigInt() {
        return !!(this.type.match(/^u?int[0-9]+$/));
    }
    isData() {
        return (this.type.substring(0, 5) === "bytes");
    }
    isString() {
        return (this.type === "string");
    }
    get tupleName() {
        if (this.type !== "tuple") {
            throw TypeError("not a tuple");
        }
        return __classPrivateFieldGet$u(this, _Typed_options, "f");
    }
    // Returns the length of this type as an array
    // - `null` indicates the length is unforced, it could be dynamic
    // - `-1` indicates the length is dynamic
    // - any other value indicates it is a static array and is its length
    get arrayLength() {
        if (this.type !== "array") {
            throw TypeError("not an array");
        }
        if (__classPrivateFieldGet$u(this, _Typed_options, "f") === true) {
            return -1;
        }
        if (__classPrivateFieldGet$u(this, _Typed_options, "f") === false) {
            return (this.value).length;
        }
        return null;
    }
    static from(type, value) {
        return new Typed(_gaurd, type, value);
    }
    static uint8(v) { return n(v, 8); }
    static uint16(v) { return n(v, 16); }
    static uint24(v) { return n(v, 24); }
    static uint32(v) { return n(v, 32); }
    static uint40(v) { return n(v, 40); }
    static uint48(v) { return n(v, 46); }
    static uint56(v) { return n(v, 56); }
    static uint64(v) { return n(v, 64); }
    static uint72(v) { return n(v, 72); }
    static uint80(v) { return n(v, 80); }
    static uint88(v) { return n(v, 88); }
    static uint96(v) { return n(v, 96); }
    static uint104(v) { return n(v, 104); }
    static uint112(v) { return n(v, 112); }
    static uint120(v) { return n(v, 120); }
    static uint128(v) { return n(v, 128); }
    static uint136(v) { return n(v, 136); }
    static uint144(v) { return n(v, 144); }
    static uint152(v) { return n(v, 152); }
    static uint160(v) { return n(v, 160); }
    static uint168(v) { return n(v, 168); }
    static uint176(v) { return n(v, 176); }
    static uint184(v) { return n(v, 184); }
    static uint192(v) { return n(v, 192); }
    static uint200(v) { return n(v, 200); }
    static uint208(v) { return n(v, 208); }
    static uint216(v) { return n(v, 216); }
    static uint224(v) { return n(v, 224); }
    static uint232(v) { return n(v, 232); }
    static uint240(v) { return n(v, 240); }
    static uint248(v) { return n(v, 248); }
    static uint256(v) { return n(v, 256); }
    static uint(v) { return n(v, 256); }
    static int8(v) { return n(v, -8); }
    static int16(v) { return n(v, -16); }
    static int24(v) { return n(v, -24); }
    static int32(v) { return n(v, -32); }
    static int40(v) { return n(v, -40); }
    static int48(v) { return n(v, -46); }
    static int56(v) { return n(v, -56); }
    static int64(v) { return n(v, -64); }
    static int72(v) { return n(v, -72); }
    static int80(v) { return n(v, -80); }
    static int88(v) { return n(v, -88); }
    static int96(v) { return n(v, -96); }
    static int104(v) { return n(v, -104); }
    static int112(v) { return n(v, -112); }
    static int120(v) { return n(v, -120); }
    static int128(v) { return n(v, -128); }
    static int136(v) { return n(v, -136); }
    static int144(v) { return n(v, -144); }
    static int152(v) { return n(v, -152); }
    static int160(v) { return n(v, -160); }
    static int168(v) { return n(v, -168); }
    static int176(v) { return n(v, -176); }
    static int184(v) { return n(v, -184); }
    static int192(v) { return n(v, -192); }
    static int200(v) { return n(v, -200); }
    static int208(v) { return n(v, -208); }
    static int216(v) { return n(v, -216); }
    static int224(v) { return n(v, -224); }
    static int232(v) { return n(v, -232); }
    static int240(v) { return n(v, -240); }
    static int248(v) { return n(v, -248); }
    static int256(v) { return n(v, -256); }
    static int(v) { return n(v, -256); }
    static bytes(v) { return b(v); }
    static bytes1(v) { return b(v, 1); }
    static bytes2(v) { return b(v, 2); }
    static bytes3(v) { return b(v, 3); }
    static bytes4(v) { return b(v, 4); }
    static bytes5(v) { return b(v, 5); }
    static bytes6(v) { return b(v, 6); }
    static bytes7(v) { return b(v, 7); }
    static bytes8(v) { return b(v, 8); }
    static bytes9(v) { return b(v, 9); }
    static bytes10(v) { return b(v, 10); }
    static bytes11(v) { return b(v, 11); }
    static bytes12(v) { return b(v, 12); }
    static bytes13(v) { return b(v, 13); }
    static bytes14(v) { return b(v, 14); }
    static bytes15(v) { return b(v, 15); }
    static bytes16(v) { return b(v, 16); }
    static bytes17(v) { return b(v, 17); }
    static bytes18(v) { return b(v, 18); }
    static bytes19(v) { return b(v, 19); }
    static bytes20(v) { return b(v, 20); }
    static bytes21(v) { return b(v, 21); }
    static bytes22(v) { return b(v, 22); }
    static bytes23(v) { return b(v, 23); }
    static bytes24(v) { return b(v, 24); }
    static bytes25(v) { return b(v, 25); }
    static bytes26(v) { return b(v, 26); }
    static bytes27(v) { return b(v, 27); }
    static bytes28(v) { return b(v, 28); }
    static bytes29(v) { return b(v, 29); }
    static bytes30(v) { return b(v, 30); }
    static bytes31(v) { return b(v, 31); }
    static bytes32(v) { return b(v, 32); }
    static address(v) { return new Typed(_gaurd, "address", v); }
    static bool(v) { return new Typed(_gaurd, "bool", !!v); }
    static string(v) { return new Typed(_gaurd, "string", v); }
    static array(v, dynamic) {
        throw new Error("not implemented yet");
    }
    static tuple(v, name) {
        throw new Error("not implemented yet");
    }
    static overrides(v) {
        return new Typed(_gaurd, "overrides", Object.assign({}, v));
    }
    static isTyped(value) {
        return (value && value._typedSymbol === _typedSymbol);
    }
    static dereference(value, type) {
        if (Typed.isTyped(value)) {
            if (value.type !== type) {
                throw new Error(`invalid type: expecetd ${type}, got ${value.type}`);
            }
            return value.value;
        }
        return value;
    }
}
_Typed_options = new WeakMap();

class AddressCoder extends Coder {
    constructor(localName) {
        super("address", "address", localName, false);
    }
    defaultValue() {
        return "0x0000000000000000000000000000000000000000";
    }
    encode(writer, _value) {
        let value = Typed.dereference(_value, "string");
        try {
            value = getAddress(value);
        }
        catch (error) {
            return this._throwError(error.message, _value);
        }
        return writer.writeValue(value);
    }
    decode(reader) {
        return getAddress(toHex(reader.readValue(), 20));
    }
}

// Clones the functionality of an existing Coder, but without a localName
class AnonymousCoder extends Coder {
    constructor(coder) {
        super(coder.name, coder.type, "_", coder.dynamic);
        this.coder = coder;
    }
    defaultValue() {
        return this.coder.defaultValue();
    }
    encode(writer, value) {
        return this.coder.encode(writer, value);
    }
    decode(reader) {
        return this.coder.decode(reader);
    }
}

function pack(writer, coders, values) {
    let arrayValues = [];
    if (Array.isArray(values)) {
        arrayValues = values;
    }
    else if (values && typeof (values) === "object") {
        let unique = {};
        arrayValues = coders.map((coder) => {
            const name = coder.localName;
            if (!name) {
                logger$e.throwError("cannot encode object for signature with missing names", "INVALID_ARGUMENT", {
                    argument: "values",
                    info: { coder },
                    value: values
                });
            }
            if (unique[name]) {
                logger$e.throwError("cannot encode object for signature with duplicate names", "INVALID_ARGUMENT", {
                    argument: "values",
                    info: { coder },
                    value: values
                });
            }
            unique[name] = true;
            return values[name];
        });
    }
    else {
        logger$e.throwArgumentError("invalid tuple value", "tuple", values);
    }
    if (coders.length !== arrayValues.length) {
        logger$e.throwArgumentError("types/value length mismatch", "tuple", values);
    }
    let staticWriter = new Writer();
    let dynamicWriter = new Writer();
    let updateFuncs = [];
    coders.forEach((coder, index) => {
        let value = arrayValues[index];
        if (coder.dynamic) {
            // Get current dynamic offset (for the future pointer)
            let dynamicOffset = dynamicWriter.length;
            // Encode the dynamic value into the dynamicWriter
            coder.encode(dynamicWriter, value);
            // Prepare to populate the correct offset once we are done
            let updateFunc = staticWriter.writeUpdatableValue();
            updateFuncs.push((baseOffset) => {
                updateFunc(baseOffset + dynamicOffset);
            });
        }
        else {
            coder.encode(staticWriter, value);
        }
    });
    // Backfill all the dynamic offsets, now that we know the static length
    updateFuncs.forEach((func) => { func(staticWriter.length); });
    let length = writer.appendWriter(staticWriter);
    length += writer.appendWriter(dynamicWriter);
    return length;
}
function unpack(reader, coders) {
    let values = [];
    let keys = [];
    // A reader anchored to this base
    let baseReader = reader.subReader(0);
    coders.forEach((coder) => {
        let value = null;
        if (coder.dynamic) {
            let offset = reader.readIndex();
            let offsetReader = baseReader.subReader(offset);
            try {
                value = coder.decode(offsetReader);
            }
            catch (error) {
                // Cannot recover from this
                if (isError(error, "BUFFER_OVERRUN")) {
                    throw error;
                }
                value = error;
                value.baseType = coder.name;
                value.name = coder.localName;
                value.type = coder.type;
            }
        }
        else {
            try {
                value = coder.decode(reader);
            }
            catch (error) {
                // Cannot recover from this
                if (isError(error, "BUFFER_OVERRUN")) {
                    throw error;
                }
                value = error;
                value.baseType = coder.name;
                value.name = coder.localName;
                value.type = coder.type;
            }
        }
        if (value == undefined) {
            throw new Error("investigate");
        }
        values.push(value);
        keys.push(coder.localName || null);
    });
    return Result.fromItems(values, keys);
}
class ArrayCoder extends Coder {
    constructor(coder, length, localName) {
        const type = (coder.type + "[" + (length >= 0 ? length : "") + "]");
        const dynamic = (length === -1 || coder.dynamic);
        super("array", type, localName, dynamic);
        defineProperties(this, { coder, length });
    }
    defaultValue() {
        // Verifies the child coder is valid (even if the array is dynamic or 0-length)
        const defaultChild = this.coder.defaultValue();
        const result = [];
        for (let i = 0; i < this.length; i++) {
            result.push(defaultChild);
        }
        return result;
    }
    encode(writer, _value) {
        const value = Typed.dereference(_value, "array");
        if (!Array.isArray(value)) {
            this._throwError("expected array value", value);
        }
        let count = this.length;
        if (count === -1) {
            count = value.length;
            writer.writeValue(value.length);
        }
        logger$e.assertArgumentCount(value.length, count, "coder array" + (this.localName ? (" " + this.localName) : ""));
        let coders = [];
        for (let i = 0; i < value.length; i++) {
            coders.push(this.coder);
        }
        return pack(writer, coders, value);
    }
    decode(reader) {
        let count = this.length;
        if (count === -1) {
            count = reader.readIndex();
            // Check that there is *roughly* enough data to ensure
            // stray random data is not being read as a length. Each
            // slot requires at least 32 bytes for their value (or 32
            // bytes as a link to the data). This could use a much
            // tighter bound, but we are erroring on the side of safety.
            if (count * WordSize > reader.dataLength) {
                logger$e.throwError("insufficient data length", "BUFFER_OVERRUN", {
                    buffer: reader.bytes,
                    offset: count * WordSize,
                    length: reader.dataLength
                });
            }
        }
        let coders = [];
        for (let i = 0; i < count; i++) {
            coders.push(new AnonymousCoder(this.coder));
        }
        return unpack(reader, coders);
    }
}

class BooleanCoder extends Coder {
    constructor(localName) {
        super("bool", "bool", localName, false);
    }
    defaultValue() {
        return false;
    }
    encode(writer, _value) {
        const value = Typed.dereference(_value, "bool");
        return writer.writeValue(value ? 1 : 0);
    }
    decode(reader) {
        return !!reader.readValue();
    }
}

class DynamicBytesCoder extends Coder {
    constructor(type, localName) {
        super(type, type, localName, true);
    }
    defaultValue() {
        return "0x";
    }
    encode(writer, value) {
        value = arrayify(value);
        let length = writer.writeValue(value.length);
        length += writer.writeBytes(value);
        return length;
    }
    decode(reader) {
        return reader.readBytes(reader.readIndex(), true);
    }
}
class BytesCoder extends DynamicBytesCoder {
    constructor(localName) {
        super("bytes", localName);
    }
    decode(reader) {
        return hexlify(super.decode(reader));
    }
}

class FixedBytesCoder extends Coder {
    constructor(size, localName) {
        let name = "bytes" + String(size);
        super(name, name, localName, false);
        defineProperties(this, { size }, { size: "number" });
    }
    defaultValue() {
        return ("0x0000000000000000000000000000000000000000000000000000000000000000").substring(0, 2 + this.size * 2);
    }
    encode(writer, _value) {
        let data = arrayify(Typed.dereference(_value, this.type));
        if (data.length !== this.size) {
            this._throwError("incorrect data length", _value);
        }
        return writer.writeBytes(data);
    }
    decode(reader) {
        return hexlify(reader.readBytes(this.size));
    }
}

const Empty$1 = new Uint8Array([]);
class NullCoder extends Coder {
    constructor(localName) {
        super("null", "", localName, false);
    }
    defaultValue() {
        return null;
    }
    encode(writer, value) {
        if (value != null) {
            this._throwError("not null", value);
        }
        return writer.writeBytes(Empty$1);
    }
    decode(reader) {
        reader.readBytes(0);
        return null;
    }
}

const BN_0$3 = BigInt(0);
const BN_1$4 = BigInt(1);
const BN_MAX_UINT256$2 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
class NumberCoder extends Coder {
    constructor(size, signed, localName) {
        const name = ((signed ? "int" : "uint") + (size * 8));
        super(name, name, localName, false);
        defineProperties(this, { size, signed }, { size: "number", signed: "boolean" });
    }
    defaultValue() {
        return 0;
    }
    encode(writer, _value) {
        let value = logger$e.getBigInt(Typed.dereference(_value, this.type));
        // Check bounds are safe for encoding
        let maxUintValue = mask(BN_MAX_UINT256$2, WordSize * 8);
        if (this.signed) {
            let bounds = mask(maxUintValue, (this.size * 8) - 1);
            if (value > bounds || value < -(bounds + BN_1$4)) {
                this._throwError("value out-of-bounds", _value);
            }
        }
        else if (value < BN_0$3 || value > mask(maxUintValue, this.size * 8)) {
            this._throwError("value out-of-bounds", _value);
        }
        value = mask(toTwos(value, this.size * 8), this.size * 8);
        if (this.signed) {
            value = toTwos(fromTwos(value, this.size * 8), 8 * WordSize);
        }
        return writer.writeValue(value);
    }
    decode(reader) {
        let value = mask(reader.readValue(), this.size * 8);
        if (this.signed) {
            value = fromTwos(value, this.size * 8);
        }
        return value;
    }
}

const version$9 = "@ethersproject/strings@6.0.0-beta.2";

const logger$8 = new Logger(version$9);

///////////////////////////////
var UnicodeNormalizationForm;
(function (UnicodeNormalizationForm) {
    UnicodeNormalizationForm["current"] = "";
    UnicodeNormalizationForm["NFC"] = "NFC";
    UnicodeNormalizationForm["NFD"] = "NFD";
    UnicodeNormalizationForm["NFKC"] = "NFKC";
    UnicodeNormalizationForm["NFKD"] = "NFKD";
})(UnicodeNormalizationForm || (UnicodeNormalizationForm = {}));
var Utf8ErrorReason;
(function (Utf8ErrorReason) {
    // A continuation byte was present where there was nothing to continue
    // - offset = the index the codepoint began in
    Utf8ErrorReason["UNEXPECTED_CONTINUE"] = "unexpected continuation byte";
    // An invalid (non-continuation) byte to start a UTF-8 codepoint was found
    // - offset = the index the codepoint began in
    Utf8ErrorReason["BAD_PREFIX"] = "bad codepoint prefix";
    // The string is too short to process the expected codepoint
    // - offset = the index the codepoint began in
    Utf8ErrorReason["OVERRUN"] = "string overrun";
    // A missing continuation byte was expected but not found
    // - offset = the index the continuation byte was expected at
    Utf8ErrorReason["MISSING_CONTINUE"] = "missing continuation byte";
    // The computed code point is outside the range for UTF-8
    // - offset       = start of this codepoint
    // - badCodepoint = the computed codepoint; outside the UTF-8 range
    Utf8ErrorReason["OUT_OF_RANGE"] = "out of UTF-8 range";
    // UTF-8 strings may not contain UTF-16 surrogate pairs
    // - offset       = start of this codepoint
    // - badCodepoint = the computed codepoint; inside the UTF-16 surrogate range
    Utf8ErrorReason["UTF16_SURROGATE"] = "UTF-16 surrogate";
    // The string is an overlong representation
    // - offset       = start of this codepoint
    // - badCodepoint = the computed codepoint; already bounds checked
    Utf8ErrorReason["OVERLONG"] = "overlong representation";
})(Utf8ErrorReason || (Utf8ErrorReason = {}));
function errorFunc(reason, offset, bytes, output, badCodepoint) {
    return logger$8.throwArgumentError(`invalid codepoint at offset ${offset}; ${reason}`, "bytes", bytes);
}
function ignoreFunc(reason, offset, bytes, output, badCodepoint) {
    // If there is an invalid prefix (including stray continuation), skip any additional continuation bytes
    if (reason === Utf8ErrorReason.BAD_PREFIX || reason === Utf8ErrorReason.UNEXPECTED_CONTINUE) {
        let i = 0;
        for (let o = offset + 1; o < bytes.length; o++) {
            if (bytes[o] >> 6 !== 0x02) {
                break;
            }
            i++;
        }
        return i;
    }
    // This byte runs us past the end of the string, so just jump to the end
    // (but the first byte was read already read and therefore skipped)
    if (reason === Utf8ErrorReason.OVERRUN) {
        return bytes.length - offset - 1;
    }
    // Nothing to skip
    return 0;
}
function replaceFunc(reason, offset, bytes, output, badCodepoint) {
    // Overlong representations are otherwise "valid" code points; just non-deistingtished
    if (reason === Utf8ErrorReason.OVERLONG) {
        output.push((badCodepoint != null) ? badCodepoint : -1);
        return 0;
    }
    // Put the replacement character into the output
    output.push(0xfffd);
    // Otherwise, process as if ignoring errors
    return ignoreFunc(reason, offset, bytes);
}
// Common error handing strategies
const Utf8ErrorFuncs = Object.freeze({
    error: errorFunc,
    ignore: ignoreFunc,
    replace: replaceFunc
});
// http://stackoverflow.com/questions/13356493/decode-utf-8-with-javascript#13691499
function getUtf8CodePoints(_bytes, onError) {
    if (onError == null) {
        onError = Utf8ErrorFuncs.error;
    }
    const bytes = logger$8.getBytes(_bytes, "bytes");
    const result = [];
    let i = 0;
    // Invalid bytes are ignored
    while (i < bytes.length) {
        const c = bytes[i++];
        // 0xxx xxxx
        if (c >> 7 === 0) {
            result.push(c);
            continue;
        }
        // Multibyte; how many bytes left for this character?
        let extraLength = null;
        let overlongMask = null;
        // 110x xxxx 10xx xxxx
        if ((c & 0xe0) === 0xc0) {
            extraLength = 1;
            overlongMask = 0x7f;
            // 1110 xxxx 10xx xxxx 10xx xxxx
        }
        else if ((c & 0xf0) === 0xe0) {
            extraLength = 2;
            overlongMask = 0x7ff;
            // 1111 0xxx 10xx xxxx 10xx xxxx 10xx xxxx
        }
        else if ((c & 0xf8) === 0xf0) {
            extraLength = 3;
            overlongMask = 0xffff;
        }
        else {
            if ((c & 0xc0) === 0x80) {
                i += onError(Utf8ErrorReason.UNEXPECTED_CONTINUE, i - 1, bytes, result);
            }
            else {
                i += onError(Utf8ErrorReason.BAD_PREFIX, i - 1, bytes, result);
            }
            continue;
        }
        // Do we have enough bytes in our data?
        if (i - 1 + extraLength >= bytes.length) {
            i += onError(Utf8ErrorReason.OVERRUN, i - 1, bytes, result);
            continue;
        }
        // Remove the length prefix from the char
        let res = c & ((1 << (8 - extraLength - 1)) - 1);
        for (let j = 0; j < extraLength; j++) {
            let nextChar = bytes[i];
            // Invalid continuation byte
            if ((nextChar & 0xc0) != 0x80) {
                i += onError(Utf8ErrorReason.MISSING_CONTINUE, i, bytes, result);
                res = null;
                break;
            }
            res = (res << 6) | (nextChar & 0x3f);
            i++;
        }
        // See above loop for invalid continuation byte
        if (res === null) {
            continue;
        }
        // Maximum code point
        if (res > 0x10ffff) {
            i += onError(Utf8ErrorReason.OUT_OF_RANGE, i - 1 - extraLength, bytes, result, res);
            continue;
        }
        // Reserved for UTF-16 surrogate halves
        if (res >= 0xd800 && res <= 0xdfff) {
            i += onError(Utf8ErrorReason.UTF16_SURROGATE, i - 1 - extraLength, bytes, result, res);
            continue;
        }
        // Check for overlong sequences (more bytes than needed)
        if (res <= overlongMask) {
            i += onError(Utf8ErrorReason.OVERLONG, i - 1 - extraLength, bytes, result, res);
            continue;
        }
        result.push(res);
    }
    return result;
}
// http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
function toUtf8Bytes(str, form = UnicodeNormalizationForm.current) {
    if (form != UnicodeNormalizationForm.current) {
        logger$8.assertNormalize(form);
        str = str.normalize(form);
    }
    let result = [];
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c < 0x80) {
            result.push(c);
        }
        else if (c < 0x800) {
            result.push((c >> 6) | 0xc0);
            result.push((c & 0x3f) | 0x80);
        }
        else if ((c & 0xfc00) == 0xd800) {
            i++;
            const c2 = str.charCodeAt(i);
            if (i >= str.length || (c2 & 0xfc00) !== 0xdc00) {
                throw new Error("invalid utf-8 string");
            }
            // Surrogate Pair
            const pair = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
            result.push((pair >> 18) | 0xf0);
            result.push(((pair >> 12) & 0x3f) | 0x80);
            result.push(((pair >> 6) & 0x3f) | 0x80);
            result.push((pair & 0x3f) | 0x80);
        }
        else {
            result.push((c >> 12) | 0xe0);
            result.push(((c >> 6) & 0x3f) | 0x80);
            result.push((c & 0x3f) | 0x80);
        }
    }
    return new Uint8Array(result);
}
function escapeChar(value) {
    const hex = ("0000" + value.toString(16));
    return "\\u" + hex.substring(hex.length - 4);
}
function _toEscapedUtf8String(bytes, onError) {
    return '"' + getUtf8CodePoints(bytes, onError).map((codePoint) => {
        if (codePoint < 256) {
            switch (codePoint) {
                case 8: return "\\b";
                case 9: return "\\t";
                case 10: return "\\n";
                case 13: return "\\r";
                case 34: return "\\\"";
                case 92: return "\\\\";
            }
            if (codePoint >= 32 && codePoint < 127) {
                return String.fromCharCode(codePoint);
            }
        }
        if (codePoint <= 0xffff) {
            return escapeChar(codePoint);
        }
        codePoint -= 0x10000;
        return escapeChar(((codePoint >> 10) & 0x3ff) + 0xd800) + escapeChar((codePoint & 0x3ff) + 0xdc00);
    }).join("") + '"';
}
function _toUtf8String(codePoints) {
    return codePoints.map((codePoint) => {
        if (codePoint <= 0xffff) {
            return String.fromCharCode(codePoint);
        }
        codePoint -= 0x10000;
        return String.fromCharCode((((codePoint >> 10) & 0x3ff) + 0xd800), ((codePoint & 0x3ff) + 0xdc00));
    }).join("");
}
function toUtf8String(bytes, onError) {
    return _toUtf8String(getUtf8CodePoints(bytes, onError));
}
function toUtf8CodePoints(str, form = UnicodeNormalizationForm.current) {
    return getUtf8CodePoints(toUtf8Bytes(str, form));
}

function formatBytes32String(text) {
    // Get the bytes
    const bytes = toUtf8Bytes(text);
    // Check we have room for null-termination
    if (bytes.length > 31) {
        throw new Error("bytes32 string must be less than 32 bytes");
    }
    // Zero-pad (implicitly null-terminates)
    return zeroPadBytes(bytes, 32);
}
function parseBytes32String(_bytes) {
    const data = logger$8.getBytes(_bytes, "bytes");
    // Must be 32 bytes with a null-termination
    if (data.length !== 32) {
        throw new Error("invalid bytes32 - not 32 bytes long");
    }
    if (data[31] !== 0) {
        throw new Error("invalid bytes32 string - no null terminator");
    }
    // Find the null termination
    let length = 31;
    while (data[length - 1] === 0) {
        length--;
    }
    // Determine the string value
    return toUtf8String(data.slice(0, length));
}

function bytes2(data) {
    if ((data.length % 4) !== 0) {
        throw new Error("should not happen; bad data");
    }
    let result = [];
    for (let i = 0; i < data.length; i += 4) {
        result.push(parseInt(data.substring(i, i + 4), 16));
    }
    return result;
}
function createTable(data, _func) {
    const func = _func || function (value) { return [parseInt(value, 16)]; };
    let lo = 0;
    let result = {};
    data.split(",").forEach((pair) => {
        let comps = pair.split(":");
        lo += parseInt(comps[0], 16);
        result[lo] = func(comps[1]);
    });
    return result;
}
function createRangeTable(data) {
    let hi = 0;
    return data.split(",").map((v) => {
        let comps = v.split("-");
        if (comps.length === 1) {
            comps[1] = "0";
        }
        else if (comps[1] === "") {
            comps[1] = "1";
        }
        let lo = hi + parseInt(comps[0], 16);
        hi = parseInt(comps[1], 16);
        return { l: lo, h: hi };
    });
}
function matchMap(value, ranges) {
    let lo = 0;
    for (let i = 0; i < ranges.length; i++) {
        let range = ranges[i];
        lo += range.l;
        if (value >= lo && value <= lo + range.h && ((value - lo) % (range.d || 1)) === 0) {
            if (range.e && range.e.indexOf(value - lo) !== -1) {
                continue;
            }
            return range;
        }
    }
    return null;
}
const Table_A_1_ranges = createRangeTable("221,13-1b,5f-,40-10,51-f,11-3,3-3,2-2,2-4,8,2,15,2d,28-8,88,48,27-,3-5,11-20,27-,8,28,3-5,12,18,b-a,1c-4,6-16,2-d,2-2,2,1b-4,17-9,8f-,10,f,1f-2,1c-34,33-14e,4,36-,13-,6-2,1a-f,4,9-,3-,17,8,2-2,5-,2,8-,3-,4-8,2-3,3,6-,16-6,2-,7-3,3-,17,8,3,3,3-,2,6-3,3-,4-a,5,2-6,10-b,4,8,2,4,17,8,3,6-,b,4,4-,2-e,2-4,b-10,4,9-,3-,17,8,3-,5-,9-2,3-,4-7,3-3,3,4-3,c-10,3,7-2,4,5-2,3,2,3-2,3-2,4-2,9,4-3,6-2,4,5-8,2-e,d-d,4,9,4,18,b,6-3,8,4,5-6,3-8,3-3,b-11,3,9,4,18,b,6-3,8,4,5-6,3-6,2,3-3,b-11,3,9,4,18,11-3,7-,4,5-8,2-7,3-3,b-11,3,13-2,19,a,2-,8-2,2-3,7,2,9-11,4-b,3b-3,1e-24,3,2-,3,2-,2-5,5,8,4,2,2-,3,e,4-,6,2,7-,b-,3-21,49,23-5,1c-3,9,25,10-,2-2f,23,6,3,8-2,5-5,1b-45,27-9,2a-,2-3,5b-4,45-4,53-5,8,40,2,5-,8,2,5-,28,2,5-,20,2,5-,8,2,5-,8,8,18,20,2,5-,8,28,14-5,1d-22,56-b,277-8,1e-2,52-e,e,8-a,18-8,15-b,e,4,3-b,5e-2,b-15,10,b-5,59-7,2b-555,9d-3,5b-5,17-,7-,27-,7-,9,2,2,2,20-,36,10,f-,7,14-,4,a,54-3,2-6,6-5,9-,1c-10,13-1d,1c-14,3c-,10-6,32-b,240-30,28-18,c-14,a0,115-,3,66-,b-76,5,5-,1d,24,2,5-2,2,8-,35-2,19,f-10,1d-3,311-37f,1b,5a-b,d7-19,d-3,41,57-,68-4,29-3,5f,29-37,2e-2,25-c,2c-2,4e-3,30,78-3,64-,20,19b7-49,51a7-59,48e-2,38-738,2ba5-5b,222f-,3c-94,8-b,6-4,1b,6,2,3,3,6d-20,16e-f,41-,37-7,2e-2,11-f,5-b,18-,b,14,5-3,6,88-,2,bf-2,7-,7-,7-,4-2,8,8-9,8-2ff,20,5-b,1c-b4,27-,27-cbb1,f7-9,28-2,b5-221,56,48,3-,2-,3-,5,d,2,5,3,42,5-,9,8,1d,5,6,2-2,8,153-3,123-3,33-27fd,a6da-5128,21f-5df,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3-fffd,3,2-1d,61-ff7d");
// @TODO: Make this relative...
const Table_B_1_flags = "ad,34f,1806,180b,180c,180d,200b,200c,200d,2060,feff".split(",").map((v) => parseInt(v, 16));
const Table_B_2_ranges = [
    { h: 25, s: 32, l: 65 },
    { h: 30, s: 32, e: [23], l: 127 },
    { h: 54, s: 1, e: [48], l: 64, d: 2 },
    { h: 14, s: 1, l: 57, d: 2 },
    { h: 44, s: 1, l: 17, d: 2 },
    { h: 10, s: 1, e: [2, 6, 8], l: 61, d: 2 },
    { h: 16, s: 1, l: 68, d: 2 },
    { h: 84, s: 1, e: [18, 24, 66], l: 19, d: 2 },
    { h: 26, s: 32, e: [17], l: 435 },
    { h: 22, s: 1, l: 71, d: 2 },
    { h: 15, s: 80, l: 40 },
    { h: 31, s: 32, l: 16 },
    { h: 32, s: 1, l: 80, d: 2 },
    { h: 52, s: 1, l: 42, d: 2 },
    { h: 12, s: 1, l: 55, d: 2 },
    { h: 40, s: 1, e: [38], l: 15, d: 2 },
    { h: 14, s: 1, l: 48, d: 2 },
    { h: 37, s: 48, l: 49 },
    { h: 148, s: 1, l: 6351, d: 2 },
    { h: 88, s: 1, l: 160, d: 2 },
    { h: 15, s: 16, l: 704 },
    { h: 25, s: 26, l: 854 },
    { h: 25, s: 32, l: 55915 },
    { h: 37, s: 40, l: 1247 },
    { h: 25, s: -119711, l: 53248 },
    { h: 25, s: -119763, l: 52 },
    { h: 25, s: -119815, l: 52 },
    { h: 25, s: -119867, e: [1, 4, 5, 7, 8, 11, 12, 17], l: 52 },
    { h: 25, s: -119919, l: 52 },
    { h: 24, s: -119971, e: [2, 7, 8, 17], l: 52 },
    { h: 24, s: -120023, e: [2, 7, 13, 15, 16, 17], l: 52 },
    { h: 25, s: -120075, l: 52 },
    { h: 25, s: -120127, l: 52 },
    { h: 25, s: -120179, l: 52 },
    { h: 25, s: -120231, l: 52 },
    { h: 25, s: -120283, l: 52 },
    { h: 25, s: -120335, l: 52 },
    { h: 24, s: -119543, e: [17], l: 56 },
    { h: 24, s: -119601, e: [17], l: 58 },
    { h: 24, s: -119659, e: [17], l: 58 },
    { h: 24, s: -119717, e: [17], l: 58 },
    { h: 24, s: -119775, e: [17], l: 58 }
];
const Table_B_2_lut_abs = createTable("b5:3bc,c3:ff,7:73,2:253,5:254,3:256,1:257,5:259,1:25b,3:260,1:263,2:269,1:268,5:26f,1:272,2:275,7:280,3:283,5:288,3:28a,1:28b,5:292,3f:195,1:1bf,29:19e,125:3b9,8b:3b2,1:3b8,1:3c5,3:3c6,1:3c0,1a:3ba,1:3c1,1:3c3,2:3b8,1:3b5,1bc9:3b9,1c:1f76,1:1f77,f:1f7a,1:1f7b,d:1f78,1:1f79,1:1f7c,1:1f7d,107:63,5:25b,4:68,1:68,1:68,3:69,1:69,1:6c,3:6e,4:70,1:71,1:72,1:72,1:72,7:7a,2:3c9,2:7a,2:6b,1:e5,1:62,1:63,3:65,1:66,2:6d,b:3b3,1:3c0,6:64,1b574:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3,20:3b8,1a:3c3");
const Table_B_2_lut_rel = createTable("179:1,2:1,2:1,5:1,2:1,a:4f,a:1,8:1,2:1,2:1,3:1,5:1,3:1,4:1,2:1,3:1,4:1,8:2,1:1,2:2,1:1,2:2,27:2,195:26,2:25,1:25,1:25,2:40,2:3f,1:3f,33:1,11:-6,1:-9,1ac7:-3a,6d:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,b:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,c:-8,2:-8,2:-8,2:-8,9:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,1:-8,49:-8,1:-8,1:-4a,1:-4a,d:-56,1:-56,1:-56,1:-56,d:-8,1:-8,f:-8,1:-8,3:-7");
const Table_B_2_complex = createTable("df:00730073,51:00690307,19:02BC006E,a7:006A030C,18a:002003B9,16:03B903080301,20:03C503080301,1d7:05650582,190f:00680331,1:00740308,1:0077030A,1:0079030A,1:006102BE,b6:03C50313,2:03C503130300,2:03C503130301,2:03C503130342,2a:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F0003B9,1:1F0103B9,1:1F0203B9,1:1F0303B9,1:1F0403B9,1:1F0503B9,1:1F0603B9,1:1F0703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F2003B9,1:1F2103B9,1:1F2203B9,1:1F2303B9,1:1F2403B9,1:1F2503B9,1:1F2603B9,1:1F2703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,1:1F6003B9,1:1F6103B9,1:1F6203B9,1:1F6303B9,1:1F6403B9,1:1F6503B9,1:1F6603B9,1:1F6703B9,3:1F7003B9,1:03B103B9,1:03AC03B9,2:03B10342,1:03B1034203B9,5:03B103B9,6:1F7403B9,1:03B703B9,1:03AE03B9,2:03B70342,1:03B7034203B9,5:03B703B9,6:03B903080300,1:03B903080301,3:03B90342,1:03B903080342,b:03C503080300,1:03C503080301,1:03C10313,2:03C50342,1:03C503080342,b:1F7C03B9,1:03C903B9,1:03CE03B9,2:03C90342,1:03C9034203B9,5:03C903B9,ac:00720073,5b:00B00063,6:00B00066,d:006E006F,a:0073006D,1:00740065006C,1:0074006D,124f:006800700061,2:00610075,2:006F0076,b:00700061,1:006E0061,1:03BC0061,1:006D0061,1:006B0061,1:006B0062,1:006D0062,1:00670062,3:00700066,1:006E0066,1:03BC0066,4:0068007A,1:006B0068007A,1:006D0068007A,1:00670068007A,1:00740068007A,15:00700061,1:006B00700061,1:006D00700061,1:006700700061,8:00700076,1:006E0076,1:03BC0076,1:006D0076,1:006B0076,1:006D0076,1:00700077,1:006E0077,1:03BC0077,1:006D0077,1:006B0077,1:006D0077,1:006B03C9,1:006D03C9,2:00620071,3:00632215006B0067,1:0063006F002E,1:00640062,1:00670079,2:00680070,2:006B006B,1:006B006D,9:00700068,2:00700070006D,1:00700072,2:00730076,1:00770062,c723:00660066,1:00660069,1:0066006C,1:006600660069,1:00660066006C,1:00730074,1:00730074,d:05740576,1:05740565,1:0574056B,1:057E0576,1:0574056D", bytes2);
const Table_C_ranges = createRangeTable("80-20,2a0-,39c,32,f71,18e,7f2-f,19-7,30-4,7-5,f81-b,5,a800-20ff,4d1-1f,110,fa-6,d174-7,2e84-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,ffff-,2,1f-5f,ff7f-20001");
function flatten(values) {
    return values.reduce((accum, value) => {
        value.forEach((value) => { accum.push(value); });
        return accum;
    }, []);
}
function _nameprepTableA1(codepoint) {
    return !!matchMap(codepoint, Table_A_1_ranges);
}
function _nameprepTableB2(codepoint) {
    const range = matchMap(codepoint, Table_B_2_ranges);
    if (range) {
        if (range.s == null) {
            throw new Error("should not happenl bad range");
        }
        return [codepoint + range.s];
    }
    const codes = Table_B_2_lut_abs[codepoint];
    if (codes) {
        return codes;
    }
    const shift = Table_B_2_lut_rel[codepoint];
    if (shift) {
        return [codepoint + shift[0]];
    }
    const complex = Table_B_2_complex[codepoint];
    if (complex) {
        return complex;
    }
    return null;
}
function _nameprepTableC(codepoint) {
    return !!matchMap(codepoint, Table_C_ranges);
}
function nameprep(value) {
    // This allows platforms with incomplete normalize to bypass
    // it for very basic names which the built-in toLowerCase
    // will certainly handle correctly
    if (value.match(/^[a-z0-9-]*$/i) && value.length <= 59) {
        return value.toLowerCase();
    }
    // Get the code points (keeping the current normalization)
    let codes = toUtf8CodePoints(value);
    codes = flatten(codes.map((code) => {
        // Substitute Table B.1 (Maps to Nothing)
        if (Table_B_1_flags.indexOf(code) >= 0) {
            return [];
        }
        if (code >= 0xfe00 && code <= 0xfe0f) {
            return [];
        }
        // Substitute Table B.2 (Case Folding)
        let codesTableB2 = _nameprepTableB2(code);
        if (codesTableB2) {
            return codesTableB2;
        }
        // No Substitution
        return [code];
    }));
    // Normalize using form KC
    codes = toUtf8CodePoints(_toUtf8String(codes), UnicodeNormalizationForm.NFKC);
    // Prohibit Tables C.1.2, C.2.2, C.3, C.4, C.5, C.6, C.7, C.8, C.9
    codes.forEach((code) => {
        if (_nameprepTableC(code)) {
            logger$8.throwArgumentError("STRINGPREP_CONTAINS_PROHIBITED", "value", value);
        }
    });
    // Prohibit Unassigned Code Points (Table A.1)
    codes.forEach((code) => {
        if (_nameprepTableA1(code)) {
            logger$8.throwArgumentError("STRINGPREP_CONTAINS_UNASSIGNED", "value", value);
        }
    });
    // IDNA extras
    let name = _toUtf8String(codes);
    // IDNA: 4.2.3.1
    if (name.substring(0, 1) === "-" || name.substring(2, 4) === "--" || name.substring(name.length - 1) === "-") {
        logger$8.throwArgumentError("invalid hyphen", "value", value);
    }
    // IDNA: 4.2.4
    if (name.length > 63) {
        logger$8.throwArgumentError("too long", "value", value);
    }
    return name;
}

class StringCoder extends DynamicBytesCoder {
    constructor(localName) {
        super("string", localName);
    }
    defaultValue() {
        return "";
    }
    encode(writer, _value) {
        return super.encode(writer, toUtf8Bytes(Typed.dereference(_value, "string")));
    }
    decode(reader) {
        return toUtf8String(super.decode(reader));
    }
}

class TupleCoder extends Coder {
    constructor(coders, localName) {
        let dynamic = false;
        const types = [];
        coders.forEach((coder) => {
            if (coder.dynamic) {
                dynamic = true;
            }
            types.push(coder.type);
        });
        const type = ("tuple(" + types.join(",") + ")");
        super("tuple", type, localName, dynamic);
        defineProperties(this, { coders: Object.freeze(coders.slice()) });
    }
    defaultValue() {
        const values = [];
        this.coders.forEach((coder) => {
            values.push(coder.defaultValue());
        });
        // We only output named properties for uniquely named coders
        const uniqueNames = this.coders.reduce((accum, coder) => {
            const name = coder.localName;
            if (name) {
                if (!accum[name]) {
                    accum[name] = 0;
                }
                accum[name]++;
            }
            return accum;
        }, {});
        // Add named values
        this.coders.forEach((coder, index) => {
            let name = coder.localName;
            if (!name || uniqueNames[name] !== 1) {
                return;
            }
            if (name === "length") {
                name = "_length";
            }
            if (values[name] != null) {
                return;
            }
            values[name] = values[index];
        });
        return Object.freeze(values);
    }
    encode(writer, _value) {
        const value = Typed.dereference(_value, "tuple");
        return pack(writer, this.coders, value);
    }
    decode(reader) {
        return unpack(reader, this.coders);
    }
}

// See: https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
var __classPrivateFieldGet$t = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AbiCoder_instances, _AbiCoder_getCoder;
const paramTypeBytes = new RegExp(/^bytes([0-9]*)$/);
const paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);
class AbiCoder {
    constructor() {
        _AbiCoder_instances.add(this);
    }
    getDefaultValue(types) {
        const coders = types.map((type) => __classPrivateFieldGet$t(this, _AbiCoder_instances, "m", _AbiCoder_getCoder).call(this, ParamType.from(type)));
        const coder = new TupleCoder(coders, "_");
        return coder.defaultValue();
    }
    encode(types, values) {
        logger$e.assertArgumentCount(values.length, types.length, "types/values length mismatch");
        const coders = types.map((type) => __classPrivateFieldGet$t(this, _AbiCoder_instances, "m", _AbiCoder_getCoder).call(this, ParamType.from(type)));
        const coder = (new TupleCoder(coders, "_"));
        const writer = new Writer();
        coder.encode(writer, values);
        return writer.data;
    }
    decode(types, data, loose) {
        const coders = types.map((type) => __classPrivateFieldGet$t(this, _AbiCoder_instances, "m", _AbiCoder_getCoder).call(this, ParamType.from(type)));
        const coder = new TupleCoder(coders, "_");
        return coder.decode(new Reader(data, loose));
    }
}
_AbiCoder_instances = new WeakSet(), _AbiCoder_getCoder = function _AbiCoder_getCoder(param) {
    if (param.isArray()) {
        return new ArrayCoder(__classPrivateFieldGet$t(this, _AbiCoder_instances, "m", _AbiCoder_getCoder).call(this, param.arrayChildren), param.arrayLength, param.name);
    }
    if (param.isTuple()) {
        return new TupleCoder(param.components.map((c) => __classPrivateFieldGet$t(this, _AbiCoder_instances, "m", _AbiCoder_getCoder).call(this, c)), param.name);
    }
    switch (param.baseType) {
        case "address":
            return new AddressCoder(param.name);
        case "bool":
            return new BooleanCoder(param.name);
        case "string":
            return new StringCoder(param.name);
        case "bytes":
            return new BytesCoder(param.name);
        case "":
            return new NullCoder(param.name);
    }
    // u?int[0-9]*
    let match = param.type.match(paramTypeNumber);
    if (match) {
        let size = parseInt(match[2] || "256");
        if (size === 0 || size > 256 || (size % 8) !== 0) {
            logger$e.throwArgumentError("invalid " + match[1] + " bit length", "param", param);
        }
        return new NumberCoder(size / 8, (match[1] === "int"), param.name);
    }
    // bytes[0-9]+
    match = param.type.match(paramTypeBytes);
    if (match) {
        let size = parseInt(match[1]);
        if (size === 0 || size > 32) {
            logger$e.throwArgumentError("invalid bytes length", "param", param);
        }
        return new FixedBytesCoder(size, param.name);
    }
    return logger$e.throwArgumentError("invalid type", "type", param.type);
};
const defaultAbiCoder = new AbiCoder();

function id(value) {
    return keccak256(toUtf8Bytes(value));
}

const version$8 = "@ethersproject/hash@6.0.0-beta.7";

const logger$7 = new Logger(version$8);

const Zeros = new Uint8Array(32);
Zeros.fill(0);
const Partition = new RegExp("^((.*)\\.)?([^.]+)$");
function isValidName(name) {
    try {
        const comps = name.split(".");
        for (let i = 0; i < comps.length; i++) {
            if (nameprep(comps[i]).length === 0) {
                throw new Error("empty");
            }
        }
        return true;
    }
    catch (error) { }
    return false;
}
function namehash(name) {
    if (typeof (name) !== "string") {
        logger$7.throwArgumentError("invalid ENS name; not a string", "name", name);
    }
    let current = name;
    let result = Zeros;
    while (current.length) {
        const partition = current.match(Partition);
        if (partition == null || partition[2] === "") {
            return logger$7.throwArgumentError("invalid ENS name; missing component", "name", name);
        }
        const label = toUtf8Bytes(nameprep(partition[3]));
        result = keccak256(concat([result, keccak256(label)]));
        current = partition[2] || "";
    }
    return hexlify(result);
}
function dnsEncode(name) {
    if (typeof (name) !== "string") {
        logger$7.throwArgumentError("invalid DNS name; not a string", "name", name);
    }
    if (name === "") {
        return "0x00";
    }
    // @TODO: should we enforce the 255 octet limit?
    return concat(name.split(".").map((comp) => {
        if (comp === "") {
            logger$7.throwArgumentError("invalid DNS name; missing component", "name", name);
        }
        // We jam in an _ prefix to fill in with the length later
        // Note: Nameprep throws if the component is over 63 bytes
        const bytes = toUtf8Bytes("_" + nameprep(comp));
        bytes[0] = bytes.length - 1;
        return bytes;
    })) + "00";
}

const messagePrefix = "\x19Ethereum Signed Message:\n";
function hashMessage(message) {
    if (typeof (message) === "string") {
        message = toUtf8Bytes(message);
    }
    return keccak256(concat([
        toUtf8Bytes(messagePrefix),
        toUtf8Bytes(String(message.length)),
        message
    ]));
}

const regexBytes = new RegExp("^bytes([0-9]+)$");
const regexNumber = new RegExp("^(u?int)([0-9]*)$");
const regexArray = new RegExp("^(.*)\\[([0-9]*)\\]$");
function _pack(type, value, isArray) {
    switch (type) {
        case "address":
            if (isArray) {
                return logger$7.getBytes(zeroPadValue(value, 32));
            }
            return logger$7.getBytes(value);
        case "string":
            return toUtf8Bytes(value);
        case "bytes":
            return logger$7.getBytes(value);
        case "bool":
            value = (!!value ? "0x01" : "0x00");
            if (isArray) {
                return logger$7.getBytes(zeroPadValue(value, 32));
            }
            return logger$7.getBytes(value);
    }
    let match = type.match(regexNumber);
    if (match) {
        let size = parseInt(match[2] || "256");
        if ((match[2] && String(size) !== match[2]) || (size % 8 !== 0) || size === 0 || size > 256) {
            return logger$7.throwArgumentError("invalid number type", "type", type);
        }
        if (isArray) {
            size = 256;
        }
        value = toTwos(value, size);
        return logger$7.getBytes(zeroPadValue(toArray(value), size / 8));
    }
    match = type.match(regexBytes);
    if (match) {
        const size = parseInt(match[1]);
        if (String(size) !== match[1] || size === 0 || size > 32) {
            return logger$7.throwArgumentError("invalid bytes type", "type", type);
        }
        if (dataLength(value) !== size) {
            return logger$7.throwArgumentError(`invalid value for ${type}`, "value", value);
        }
        if (isArray) {
            return logger$7.getBytes(zeroPadBytes(value, 32));
        }
        return value;
    }
    match = type.match(regexArray);
    if (match && Array.isArray(value)) {
        const baseType = match[1];
        const count = parseInt(match[2] || String(value.length));
        if (count != value.length) {
            logger$7.throwArgumentError(`invalid array length for ${type}`, "value", value);
        }
        const result = [];
        value.forEach(function (value) {
            result.push(_pack(baseType, value, true));
        });
        return logger$7.getBytes(concat(result));
    }
    return logger$7.throwArgumentError("invalid type", "type", type);
}
// @TODO: Array Enum
function solidityPacked(types, values) {
    if (types.length != values.length) {
        logger$7.throwArgumentError("wrong number of values; expected ${ types.length }", "values", values);
    }
    const tight = [];
    types.forEach(function (type, index) {
        tight.push(_pack(type, values[index]));
    });
    return hexlify(concat(tight));
}
function solidityPackedKeccak256(types, values) {
    return keccak256(solidityPacked(types, values));
}
function solidityPackedSha256(types, values) {
    return sha256(solidityPacked(types, values));
}

var __classPrivateFieldSet$s = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$s = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TypedDataEncoder_instances, _TypedDataEncoder_types, _TypedDataEncoder_fullTypes, _TypedDataEncoder_encoderCache, _TypedDataEncoder_getEncoder;
const padding = new Uint8Array(32);
padding.fill(0);
const BN__1 = BigInt(-1);
const BN_0$2 = BigInt(0);
const BN_1$3 = BigInt(1);
const BN_MAX_UINT256$1 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
function hexPadRight(value) {
    const bytes = arrayify(value);
    const padOffset = bytes.length % 32;
    if (padOffset) {
        return concat([bytes, padding.slice(padOffset)]);
    }
    return hexlify(bytes);
}
const hexTrue = toHex(BN_1$3, 32);
const hexFalse = toHex(BN_0$2, 32);
const domainFieldTypes = {
    name: "string",
    version: "string",
    chainId: "uint256",
    verifyingContract: "address",
    salt: "bytes32"
};
const domainFieldNames = [
    "name", "version", "chainId", "verifyingContract", "salt"
];
function checkString(key) {
    return function (value) {
        if (typeof (value) !== "string") {
            logger$7.throwArgumentError(`invalid domain value for ${JSON.stringify(key)}`, `domain.${key}`, value);
        }
        return value;
    };
}
const domainChecks = {
    name: checkString("name"),
    version: checkString("version"),
    chainId: function (value) {
        return logger$7.getBigInt(value, "domain.chainId");
    },
    verifyingContract: function (value) {
        try {
            return getAddress(value).toLowerCase();
        }
        catch (error) { }
        return logger$7.throwArgumentError(`invalid domain value "verifyingContract"`, "domain.verifyingContract", value);
    },
    salt: function (value) {
        const bytes = logger$7.getBytes(value, "domain.salt");
        if (bytes.length !== 32) {
            logger$7.throwArgumentError(`invalid domain value "salt"`, "domain.salt", value);
        }
        return hexlify(bytes);
    }
};
function getBaseEncoder(type) {
    // intXX and uintXX
    {
        const match = type.match(/^(u?)int(\d*)$/);
        if (match) {
            const signed = (match[1] === "");
            const width = parseInt(match[2] || "256");
            if (width % 8 !== 0 || width > 256 || (match[2] && match[2] !== String(width))) {
                logger$7.throwArgumentError("invalid numeric width", "type", type);
            }
            const boundsUpper = mask(BN_MAX_UINT256$1, signed ? (width - 1) : width);
            const boundsLower = signed ? ((boundsUpper + BN_1$3) * BN__1) : BN_0$2;
            return function (_value) {
                const value = logger$7.getBigInt(_value, "value");
                if (value < boundsLower || value > boundsUpper) {
                    logger$7.throwArgumentError(`value out-of-bounds for ${type}`, "value", value);
                }
                return toHex(toTwos(value, 256), 32);
            };
        }
    }
    // bytesXX
    {
        const match = type.match(/^bytes(\d+)$/);
        if (match) {
            const width = parseInt(match[1]);
            if (width === 0 || width > 32 || match[1] !== String(width)) {
                logger$7.throwArgumentError("invalid bytes width", "type", type);
            }
            return function (value) {
                const bytes = arrayify(value);
                if (bytes.length !== width) {
                    logger$7.throwArgumentError(`invalid length for ${type}`, "value", value);
                }
                return hexPadRight(value);
            };
        }
    }
    switch (type) {
        case "address": return function (value) {
            return zeroPadValue(getAddress(value), 32);
        };
        case "bool": return function (value) {
            return ((!value) ? hexFalse : hexTrue);
        };
        case "bytes": return function (value) {
            return keccak256(value);
        };
        case "string": return function (value) {
            return id(value);
        };
    }
    return null;
}
function encodeType(name, fields) {
    return `${name}(${fields.map(({ name, type }) => (type + " " + name)).join(",")})`;
}
class TypedDataEncoder {
    constructor(types) {
        _TypedDataEncoder_instances.add(this);
        _TypedDataEncoder_types.set(this, void 0);
        _TypedDataEncoder_fullTypes.set(this, void 0);
        _TypedDataEncoder_encoderCache.set(this, void 0);
        __classPrivateFieldSet$s(this, _TypedDataEncoder_types, JSON.stringify(types), "f");
        __classPrivateFieldSet$s(this, _TypedDataEncoder_fullTypes, new Map(), "f");
        __classPrivateFieldSet$s(this, _TypedDataEncoder_encoderCache, new Map(), "f");
        // Link struct types to their direct child structs
        const links = new Map();
        // Link structs to structs which contain them as a child
        const parents = new Map();
        // Link all subtypes within a given struct
        const subtypes = new Map();
        Object.keys(types).forEach((type) => {
            links.set(type, new Set());
            parents.set(type, []);
            subtypes.set(type, new Set());
        });
        for (const name in types) {
            const uniqueNames = new Set();
            for (const field of types[name]) {
                // Check each field has a unique name
                if (uniqueNames.has(field.name)) {
                    logger$7.throwArgumentError(`duplicate variable name ${JSON.stringify(field.name)} in ${JSON.stringify(name)}`, "types", types);
                }
                uniqueNames.add(field.name);
                // Get the base type (drop any array specifiers)
                const baseType = (field.type.match(/^([^\x5b]*)(\x5b|$)/))[1] || null;
                if (baseType === name) {
                    logger$7.throwArgumentError(`circular type reference to ${JSON.stringify(baseType)}`, "types", types);
                }
                // Is this a base encoding type?
                const encoder = getBaseEncoder(baseType);
                if (encoder) {
                    continue;
                }
                if (!parents.has(baseType)) {
                    logger$7.throwArgumentError(`unknown type ${JSON.stringify(baseType)}`, "types", types);
                }
                // Add linkage
                parents.get(baseType).push(name);
                links.get(name).add(baseType);
            }
        }
        // Deduce the primary type
        const primaryTypes = Array.from(parents.keys()).filter((n) => (parents.get(n).length === 0));
        if (primaryTypes.length === 0) {
            logger$7.throwArgumentError("missing primary type", "types", types);
        }
        else if (primaryTypes.length > 1) {
            logger$7.throwArgumentError(`ambiguous primary types or unused types: ${primaryTypes.map((t) => (JSON.stringify(t))).join(", ")}`, "types", types);
        }
        defineProperties(this, { primaryType: primaryTypes[0] });
        // Check for circular type references
        function checkCircular(type, found) {
            if (found.has(type)) {
                logger$7.throwArgumentError(`circular type reference to ${JSON.stringify(type)}`, "types", types);
            }
            found.add(type);
            for (const child of links.get(type)) {
                if (!parents.has(child)) {
                    continue;
                }
                // Recursively check children
                checkCircular(child, found);
                // Mark all ancestors as having this decendant
                for (const subtype of found) {
                    subtypes.get(subtype).add(child);
                }
            }
            found.delete(type);
        }
        checkCircular(this.primaryType, new Set());
        // Compute each fully describe type
        for (const [name, set] of subtypes) {
            const st = Array.from(set);
            st.sort();
            __classPrivateFieldGet$s(this, _TypedDataEncoder_fullTypes, "f").set(name, encodeType(name, types[name]) + st.map((t) => encodeType(t, types[t])).join(""));
        }
    }
    get types() {
        return JSON.parse(__classPrivateFieldGet$s(this, _TypedDataEncoder_types, "f"));
    }
    getEncoder(type) {
        let encoder = __classPrivateFieldGet$s(this, _TypedDataEncoder_encoderCache, "f").get(type);
        if (!encoder) {
            encoder = __classPrivateFieldGet$s(this, _TypedDataEncoder_instances, "m", _TypedDataEncoder_getEncoder).call(this, type);
            __classPrivateFieldGet$s(this, _TypedDataEncoder_encoderCache, "f").set(type, encoder);
        }
        return encoder;
    }
    encodeType(name) {
        const result = __classPrivateFieldGet$s(this, _TypedDataEncoder_fullTypes, "f").get(name);
        if (!result) {
            return logger$7.throwArgumentError(`unknown type: ${JSON.stringify(name)}`, "name", name);
        }
        return result;
    }
    encodeData(type, value) {
        return this.getEncoder(type)(value);
    }
    hashStruct(name, value) {
        return keccak256(this.encodeData(name, value));
    }
    encode(value) {
        return this.encodeData(this.primaryType, value);
    }
    hash(value) {
        return this.hashStruct(this.primaryType, value);
    }
    _visit(type, value, callback) {
        // Basic encoder type (address, bool, uint256, etc)
        {
            const encoder = getBaseEncoder(type);
            if (encoder) {
                return callback(type, value);
            }
        }
        // Array
        const match = type.match(/^(.*)(\x5b(\d*)\x5d)$/);
        if (match) {
            const subtype = match[1];
            const length = parseInt(match[3]);
            if (length >= 0 && value.length !== length) {
                logger$7.throwArgumentError("array length mismatch; expected length ${ arrayLength }", "value", value);
            }
            return value.map((v) => this._visit(subtype, v, callback));
        }
        // Struct
        const fields = this.types[type];
        if (fields) {
            return fields.reduce((accum, { name, type }) => {
                accum[name] = this._visit(type, value[name], callback);
                return accum;
            }, {});
        }
        return logger$7.throwArgumentError(`unknown type: ${type}`, "type", type);
    }
    visit(value, callback) {
        return this._visit(this.primaryType, value, callback);
    }
    static from(types) {
        return new TypedDataEncoder(types);
    }
    static getPrimaryType(types) {
        return TypedDataEncoder.from(types).primaryType;
    }
    static hashStruct(name, types, value) {
        return TypedDataEncoder.from(types).hashStruct(name, value);
    }
    static hashDomain(domain) {
        const domainFields = [];
        for (const name in domain) {
            const type = domainFieldTypes[name];
            if (!type) {
                logger$7.throwArgumentError(`invalid typed-data domain key: ${JSON.stringify(name)}`, "domain", domain);
            }
            domainFields.push({ name, type });
        }
        domainFields.sort((a, b) => {
            return domainFieldNames.indexOf(a.name) - domainFieldNames.indexOf(b.name);
        });
        return TypedDataEncoder.hashStruct("EIP712Domain", { EIP712Domain: domainFields }, domain);
    }
    static encode(domain, types, value) {
        return concat([
            "0x1901",
            TypedDataEncoder.hashDomain(domain),
            TypedDataEncoder.from(types).hash(value)
        ]);
    }
    static hash(domain, types, value) {
        return keccak256(TypedDataEncoder.encode(domain, types, value));
    }
    // Replaces all address types with ENS names with their looked up address
    static async resolveNames(domain, types, value, resolveName) {
        // Make a copy to isolate it from the object passed in
        domain = Object.assign({}, domain);
        // Look up all ENS names
        const ensCache = {};
        // Do we need to look up the domain's verifyingContract?
        if (domain.verifyingContract && !isHexString(domain.verifyingContract, 20)) {
            ensCache[domain.verifyingContract] = "0x";
        }
        // We are going to use the encoder to visit all the base values
        const encoder = TypedDataEncoder.from(types);
        // Get a list of all the addresses
        encoder.visit(value, (type, value) => {
            if (type === "address" && !isHexString(value, 20)) {
                ensCache[value] = "0x";
            }
            return value;
        });
        // Lookup each name
        for (const name in ensCache) {
            ensCache[name] = await resolveName(name);
        }
        // Replace the domain verifyingContract if needed
        if (domain.verifyingContract && ensCache[domain.verifyingContract]) {
            domain.verifyingContract = ensCache[domain.verifyingContract];
        }
        // Replace all ENS names with their address
        value = encoder.visit(value, (type, value) => {
            if (type === "address" && ensCache[value]) {
                return ensCache[value];
            }
            return value;
        });
        return { domain, value };
    }
    static getPayload(domain, types, value) {
        // Validate the domain fields
        TypedDataEncoder.hashDomain(domain);
        // Derive the EIP712Domain Struct reference type
        const domainValues = {};
        const domainTypes = [];
        domainFieldNames.forEach((name) => {
            const value = domain[name];
            if (value == null) {
                return;
            }
            domainValues[name] = domainChecks[name](value);
            domainTypes.push({ name, type: domainFieldTypes[name] });
        });
        const encoder = TypedDataEncoder.from(types);
        const typesWithDomain = Object.assign({}, types);
        if (typesWithDomain.EIP712Domain) {
            logger$7.throwArgumentError("types must not contain EIP712Domain type", "types.EIP712Domain", types);
        }
        else {
            typesWithDomain.EIP712Domain = domainTypes;
        }
        // Validate the data structures and types
        encoder.encode(value);
        return {
            types: typesWithDomain,
            domain: domainValues,
            primaryType: encoder.primaryType,
            message: encoder.visit(value, (type, value) => {
                // bytes
                if (type.match(/^bytes(\d*)/)) {
                    return hexlify(logger$7.getBytes(value));
                }
                // uint or int
                if (type.match(/^u?int/)) {
                    return logger$7.getBigInt(value).toString();
                }
                switch (type) {
                    case "address":
                        return value.toLowerCase();
                    case "bool":
                        return !!value;
                    case "string":
                        if (typeof (value) !== "string") {
                            logger$7.throwArgumentError(`invalid string`, "value", value);
                        }
                        return value;
                }
                return logger$7.throwArgumentError("unsupported type", "type", type);
            })
        };
    }
}
_TypedDataEncoder_types = new WeakMap(), _TypedDataEncoder_fullTypes = new WeakMap(), _TypedDataEncoder_encoderCache = new WeakMap(), _TypedDataEncoder_instances = new WeakSet(), _TypedDataEncoder_getEncoder = function _TypedDataEncoder_getEncoder(type) {
    // Basic encoder type (address, bool, uint256, etc)
    {
        const encoder = getBaseEncoder(type);
        if (encoder) {
            return encoder;
        }
    }
    // Array
    const match = type.match(/^(.*)(\x5b(\d*)\x5d)$/);
    if (match) {
        const subtype = match[1];
        const subEncoder = this.getEncoder(subtype);
        const length = parseInt(match[3]);
        return (value) => {
            if (length >= 0 && value.length !== length) {
                logger$7.throwArgumentError("array length mismatch; expected length ${ arrayLength }", "value", value);
            }
            let result = value.map(subEncoder);
            if (__classPrivateFieldGet$s(this, _TypedDataEncoder_fullTypes, "f").has(subtype)) {
                result = result.map(keccak256);
            }
            return keccak256(concat(result));
        };
    }
    // Struct
    const fields = this.types[type];
    if (fields) {
        const encodedType = id(__classPrivateFieldGet$s(this, _TypedDataEncoder_fullTypes, "f").get(type));
        return (value) => {
            const values = fields.map(({ name, type }) => {
                const result = this.getEncoder(type)(value[name]);
                if (__classPrivateFieldGet$s(this, _TypedDataEncoder_fullTypes, "f").has(type)) {
                    return keccak256(result);
                }
                return result;
            });
            values.unshift(encodedType);
            return concat(values);
        };
    }
    return logger$7.throwArgumentError(`unknown type: ${type}`, "type", type);
};

var __classPrivateFieldSet$r = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$r = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Interface_instances, _Interface_errors, _Interface_events, _Interface_functions, _Interface_abiCoder, _Interface_getFunction, _Interface_getEvent;
class LogDescription {
    constructor(fragment, topic, args) {
        const name = fragment.name, signature = fragment.format();
        defineProperties(this, {
            fragment, name, signature, topic, args
        });
    }
}
class TransactionDescription {
    constructor(fragment, selector, args, value) {
        const name = fragment.name, signature = fragment.format();
        defineProperties(this, {
            fragment, name, args, signature, selector, value
        });
    }
}
class ErrorDescription {
    constructor(fragment, selector, args) {
        const name = fragment.name, signature = fragment.format();
        defineProperties(this, {
            fragment, name, args, signature, selector
        });
    }
}
class Indexed {
    constructor(hash) {
        defineProperties(this, { hash, _isIndexed: true });
    }
    static isIndexed(value) {
        return !!(value && value._isIndexed);
    }
}
// https://docs.soliditylang.org/en/v0.8.13/control-structures.html?highlight=panic#panic-via-assert-and-error-via-require
const PanicReasons = {
    "0": "generic panic",
    "1": "assert(false)",
    "17": "arithmetic overflow",
    "18": "division or modulo by zero",
    "33": "enum overflow",
    "34": "invalid encoded storage byte array accessed",
    "49": "out-of-bounds array access; popping on an empty array",
    "50": "out-of-bounds access of an array or bytesN",
    "65": "out of memory",
    "81": "uninitialized function",
};
const BuiltinErrors = {
    "0x08c379a0": {
        signature: "Error(string)",
        name: "Error",
        inputs: ["string"],
        reason: (message) => {
            return `reverted with reason string ${JSON.stringify(message)}`;
        }
    },
    "0x4e487b71": {
        signature: "Panic(uint256)",
        name: "Panic",
        inputs: ["uint256"],
        reason: (code) => {
            let reason = "unknown panic code";
            if (code >= 0 && code <= 0xff && PanicReasons[code.toString()]) {
                reason = PanicReasons[code.toString()];
            }
            return `reverted with panic code 0x${code.toString(16)} (${reason})`;
        }
    }
};
class Interface {
    constructor(fragments) {
        _Interface_instances.add(this);
        _Interface_errors.set(this, void 0);
        _Interface_events.set(this, void 0);
        _Interface_functions.set(this, void 0);
        //    #structs: Map<string, StructFragment>;
        _Interface_abiCoder.set(this, void 0);
        let abi = [];
        if (typeof (fragments) === "string") {
            abi = JSON.parse(fragments);
        }
        else {
            abi = fragments;
        }
        __classPrivateFieldSet$r(this, _Interface_functions, new Map(), "f");
        __classPrivateFieldSet$r(this, _Interface_errors, new Map(), "f");
        __classPrivateFieldSet$r(this, _Interface_events, new Map(), "f");
        //        this.#structs = new Map();
        defineProperties(this, {
            fragments: Object.freeze(abi.map((f) => Fragment.from(f)).filter((f) => (f != null))),
        });
        __classPrivateFieldSet$r(this, _Interface_abiCoder, this.getAbiCoder(), "f");
        // Add all fragments by their signature
        this.fragments.forEach((fragment) => {
            let bucket;
            switch (fragment.type) {
                case "constructor":
                    if (this.deploy) {
                        logger$e.warn("duplicate definition - constructor");
                        return;
                    }
                    //checkNames(fragment, "input", fragment.inputs);
                    defineProperties(this, { deploy: fragment });
                    return;
                case "function":
                    //checkNames(fragment, "input", fragment.inputs);
                    //checkNames(fragment, "output", (<FunctionFragment>fragment).outputs);
                    bucket = __classPrivateFieldGet$r(this, _Interface_functions, "f");
                    break;
                case "event":
                    //checkNames(fragment, "input", fragment.inputs);
                    bucket = __classPrivateFieldGet$r(this, _Interface_events, "f");
                    break;
                case "error":
                    bucket = __classPrivateFieldGet$r(this, _Interface_errors, "f");
                    break;
                default:
                    return;
            }
            const signature = fragment.format();
            if (bucket.has(signature)) {
                logger$e.warn("duplicate definition - " + signature);
                return;
            }
            bucket.set(signature, fragment);
        });
        // If we do not have a constructor add a default
        if (!this.deploy) {
            defineProperties(this, {
                deploy: ConstructorFragment.fromString("constructor()")
            });
        }
    }
    // @TODO: multi sig?
    format(format) {
        if (!format) {
            format = FormatType.full;
        }
        if (format === FormatType.sighash) {
            logger$e.throwArgumentError("interface does not support formatting sighash", "format", format);
        }
        const abi = this.fragments.map((f) => f.format(format));
        // We need to re-bundle the JSON fragments a bit
        if (format === FormatType.json) {
            return JSON.stringify(abi.map((j) => JSON.parse(j)));
        }
        return abi;
    }
    getAbiCoder() {
        return defaultAbiCoder;
    }
    getFunctionName(key) {
        return (__classPrivateFieldGet$r(this, _Interface_instances, "m", _Interface_getFunction).call(this, key, null, false)).name;
    }
    getFunction(key, values) {
        return __classPrivateFieldGet$r(this, _Interface_instances, "m", _Interface_getFunction).call(this, key, values || null, true);
    }
    getEventName(key) {
        return (__classPrivateFieldGet$r(this, _Interface_instances, "m", _Interface_getEvent).call(this, key, null, false)).name;
    }
    getEvent(key, values) {
        return __classPrivateFieldGet$r(this, _Interface_instances, "m", _Interface_getEvent).call(this, key, values || null, true);
    }
    // Find a function definition by any means necessary (unless it is ambiguous)
    getError(key, values) {
        if (isHexString(key)) {
            const selector = key.toLowerCase();
            for (const fragment of __classPrivateFieldGet$r(this, _Interface_errors, "f").values()) {
                if (selector === this.getSelector(fragment)) {
                    return fragment;
                }
            }
            logger$e.throwArgumentError("no matching error", "selector", key);
        }
        // It is a bare name, look up the function (will return null if ambiguous)
        if (key.indexOf("(") === -1) {
            const matching = [];
            for (const [name, fragment] of __classPrivateFieldGet$r(this, _Interface_errors, "f")) {
                if (name.split("(" /* fix:) */)[0] === key) {
                    matching.push(fragment);
                }
            }
            if (matching.length === 0) {
                logger$e.throwArgumentError("no matching error", "name", key);
            }
            else if (matching.length > 1) {
                // @TODO: refine by Typed
                logger$e.throwArgumentError("multiple matching errors", "name", key);
            }
            return matching[0];
        }
        // Normalize the signature and lookup the function
        const result = __classPrivateFieldGet$r(this, _Interface_errors, "f").get(ErrorFragment.fromString(key).format());
        if (result) {
            return result;
        }
        return logger$e.throwArgumentError("no matching error", "signature", key);
    }
    // Get the 4-byte selector used by Solidity to identify a function
    getSelector(fragment) {
        /*
        if (typeof(fragment) === "string") {
            const matches: Array<Fragment> = [ ];

            try { matches.push(this.getFunction(fragment)); } catch (error) { }
            try { matches.push(this.getError(<string>fragment)); } catch (_) { }

            if (matches.length === 0) {
                logger.throwArgumentError("unknown fragment", "key", fragment);
            } else if (matches.length > 1) {
                logger.throwArgumentError("ambiguous fragment matches function and error", "key", fragment);
            }

            fragment = matches[0];
        }
        */
        return dataSlice(id(fragment.format()), 0, 4);
    }
    // Get the 32-byte topic hash used by Solidity to identify an event
    getEventTopic(fragment) {
        //if (typeof(fragment) === "string") { fragment = this.getEvent(eventFragment); }
        return id(fragment.format());
    }
    _decodeParams(params, data) {
        return __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").decode(params, data);
    }
    _encodeParams(params, values) {
        return __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").encode(params, values);
    }
    encodeDeploy(values) {
        return this._encodeParams(this.deploy.inputs, values || []);
    }
    decodeErrorResult(fragment, data) {
        if (typeof (fragment) === "string") {
            fragment = this.getError(fragment);
        }
        if (dataSlice(data, 0, 4) !== this.getSelector(fragment)) {
            logger$e.throwArgumentError(`data signature does not match error ${fragment.name}.`, "data", data);
        }
        return this._decodeParams(fragment.inputs, dataSlice(data, 4));
    }
    encodeErrorResult(fragment, values) {
        if (typeof (fragment) === "string") {
            fragment = this.getError(fragment);
        }
        return concat([
            this.getSelector(fragment),
            this._encodeParams(fragment.inputs, values || [])
        ]);
    }
    // Decode the data for a function call (e.g. tx.data)
    decodeFunctionData(fragment, data) {
        if (typeof (fragment) === "string") {
            fragment = this.getFunction(fragment);
        }
        if (dataSlice(data, 0, 4) !== this.getSelector(fragment)) {
            logger$e.throwArgumentError(`data signature does not match function ${fragment.name}.`, "data", data);
        }
        return this._decodeParams(fragment.inputs, dataSlice(data, 4));
    }
    // Encode the data for a function call (e.g. tx.data)
    encodeFunctionData(fragment, values) {
        if (typeof (fragment) === "string") {
            fragment = this.getFunction(fragment);
        }
        return concat([
            this.getSelector(fragment),
            this._encodeParams(fragment.inputs, values || [])
        ]);
    }
    // Decode the result from a function call (e.g. from eth_call)
    decodeFunctionResult(fragment, data) {
        if (typeof (fragment) === "string") {
            fragment = this.getFunction(fragment);
        }
        let message = "invalid length for result data";
        const bytes = arrayify(data);
        if ((bytes.length % 32) === 0) {
            try {
                return __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").decode(fragment.outputs, bytes);
            }
            catch (error) {
                message = "could not decode result data";
            }
        }
        // Call returned data with no error, but the data is junk
        return logger$e.throwError(message, "BAD_DATA", {
            value: hexlify(bytes),
            info: { method: fragment.name, signature: fragment.format() }
        });
    }
    makeError(fragment, _data, tx) {
        if (typeof (fragment) === "string") {
            fragment = this.getFunction(fragment);
        }
        const data = logger$e.getBytes(_data);
        let args = undefined;
        if (tx) {
            try {
                args = __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").decode(fragment.inputs, tx.data || "0x");
            }
            catch (error) {
                console.log(error);
            }
        }
        let errorArgs = undefined;
        let errorName = undefined;
        let errorSignature = undefined;
        let reason = "unknown reason";
        if (data.length === 0) {
            reason = "missing error reason";
        }
        else if ((data.length % 32) === 4) {
            const selector = hexlify(data.slice(0, 4));
            const builtin = BuiltinErrors[selector];
            if (builtin) {
                try {
                    errorName = builtin.name;
                    errorSignature = builtin.signature;
                    errorArgs = __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").decode(builtin.inputs, data.slice(4));
                    reason = builtin.reason(...errorArgs);
                }
                catch (error) {
                    console.log(error); // @TODO: remove
                }
            }
            else {
                reason = "unknown custom error";
                try {
                    const error = this.getError(selector);
                    errorName = error.name;
                    errorSignature = error.format();
                    reason = `custom error: ${errorSignature}`;
                    try {
                        errorArgs = __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").decode(error.inputs, data.slice(4));
                    }
                    catch (error) {
                        reason = `custom error: ${errorSignature} (coult not decode error data)`;
                    }
                }
                catch (error) {
                    console.log(error); // @TODO: remove
                }
            }
        }
        return logger$e.makeError("call revert exception", "CALL_EXCEPTION", {
            data: hexlify(data), transaction: null,
            method: fragment.name, signature: fragment.format(), args,
            errorArgs, errorName, errorSignature, reason
        });
    }
    // Encode the result for a function call (e.g. for eth_call)
    encodeFunctionResult(functionFragment, values) {
        if (typeof (functionFragment) === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        return hexlify(__classPrivateFieldGet$r(this, _Interface_abiCoder, "f").encode(functionFragment.outputs, values || []));
    }
    /*
        spelunk(inputs: Array<ParamType>, values: ReadonlyArray<any>, processfunc: (type: string, value: any) => Promise<any>): Promise<Array<any>> {
            const promises: Array<Promise<>> = [ ];
            const process = function(type: ParamType, value: any): any {
                if (type.baseType === "array") {
                    return descend(type.child
                }
                if (type. === "address") {
                }
            };
    
            const descend = function (inputs: Array<ParamType>, values: ReadonlyArray<any>) {
                if (inputs.length !== values.length) { throw new Error("length mismatch"); }
                
            };
    
            const result: Array<any> = [ ];
            values.forEach((value, index) => {
                if (value == null) {
                    topics.push(null);
                } else if (param.baseType === "array" || param.baseType === "tuple") {
                    logger.throwArgumentError("filtering with tuples or arrays not supported", ("contract." + param.name), value);
                } else if (Array.isArray(value)) {
                    topics.push(value.map((value) => encodeTopic(param, value)));
                } else {
                    topics.push(encodeTopic(param, value));
                }
            });
        }
    */
    // Create the filter for the event with search criteria (e.g. for eth_filterLog)
    encodeFilterTopics(eventFragment, values) {
        if (typeof (eventFragment) === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        if (values.length > eventFragment.inputs.length) {
            logger$e.throwError("too many arguments for " + eventFragment.format(), "UNEXPECTED_ARGUMENT", {
                count: values.length,
                expectedCount: eventFragment.inputs.length
            });
        }
        const topics = [];
        if (!eventFragment.anonymous) {
            topics.push(this.getEventTopic(eventFragment));
        }
        const encodeTopic = (param, value) => {
            if (param.type === "string") {
                return id(value);
            }
            else if (param.type === "bytes") {
                return keccak256(hexlify(value));
            }
            // Check addresses are valid
            if (param.type === "address") {
                __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").encode(["address"], [value]);
            }
            return zeroPadValue(hexlify(value), 32);
            //@TOOD should probably be return toHex(value, 32)
        };
        values.forEach((value, index) => {
            const param = eventFragment.inputs[index];
            if (!param.indexed) {
                if (value != null) {
                    logger$e.throwArgumentError("cannot filter non-indexed parameters; must be null", ("contract." + param.name), value);
                }
                return;
            }
            if (value == null) {
                topics.push(null);
            }
            else if (param.baseType === "array" || param.baseType === "tuple") {
                logger$e.throwArgumentError("filtering with tuples or arrays not supported", ("contract." + param.name), value);
            }
            else if (Array.isArray(value)) {
                topics.push(value.map((value) => encodeTopic(param, value)));
            }
            else {
                topics.push(encodeTopic(param, value));
            }
        });
        // Trim off trailing nulls
        while (topics.length && topics[topics.length - 1] === null) {
            topics.pop();
        }
        return topics;
    }
    encodeEventLog(eventFragment, values) {
        if (typeof (eventFragment) === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        const topics = [];
        const dataTypes = [];
        const dataValues = [];
        if (!eventFragment.anonymous) {
            topics.push(this.getEventTopic(eventFragment));
        }
        if (values.length !== eventFragment.inputs.length) {
            logger$e.throwArgumentError("event arguments/values mismatch", "values", values);
        }
        eventFragment.inputs.forEach((param, index) => {
            const value = values[index];
            if (param.indexed) {
                if (param.type === "string") {
                    topics.push(id(value));
                }
                else if (param.type === "bytes") {
                    topics.push(keccak256(value));
                }
                else if (param.baseType === "tuple" || param.baseType === "array") {
                    // @TODO
                    throw new Error("not implemented");
                }
                else {
                    topics.push(__classPrivateFieldGet$r(this, _Interface_abiCoder, "f").encode([param.type], [value]));
                }
            }
            else {
                dataTypes.push(param);
                dataValues.push(value);
            }
        });
        return {
            data: __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").encode(dataTypes, dataValues),
            topics: topics
        };
    }
    // Decode a filter for the event and the search criteria
    decodeEventLog(eventFragment, data, topics) {
        if (typeof (eventFragment) === "string") {
            eventFragment = this.getEvent(eventFragment);
        }
        if (topics != null && !eventFragment.anonymous) {
            const eventTopic = this.getEventTopic(eventFragment);
            if (!isHexString(topics[0], 32) || topics[0].toLowerCase() !== eventTopic) {
                logger$e.throwArgumentError("fragment/topic mismatch", "topics[0]", topics[0]);
            }
            topics = topics.slice(1);
        }
        const indexed = [];
        const nonIndexed = [];
        const dynamic = [];
        eventFragment.inputs.forEach((param, index) => {
            if (param.indexed) {
                if (param.type === "string" || param.type === "bytes" || param.baseType === "tuple" || param.baseType === "array") {
                    indexed.push(ParamType.fromObject({ type: "bytes32", name: param.name }));
                    dynamic.push(true);
                }
                else {
                    indexed.push(param);
                    dynamic.push(false);
                }
            }
            else {
                nonIndexed.push(param);
                dynamic.push(false);
            }
        });
        const resultIndexed = (topics != null) ? __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").decode(indexed, concat(topics)) : null;
        const resultNonIndexed = __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").decode(nonIndexed, data, true);
        //const result: (Array<any> & { [ key: string ]: any }) = [ ];
        const values = [];
        const keys = [];
        let nonIndexedIndex = 0, indexedIndex = 0;
        eventFragment.inputs.forEach((param, index) => {
            let value = null;
            if (param.indexed) {
                if (resultIndexed == null) {
                    value = new Indexed(null);
                }
                else if (dynamic[index]) {
                    value = new Indexed(resultIndexed[indexedIndex++]);
                }
                else {
                    try {
                        value = resultIndexed[indexedIndex++];
                    }
                    catch (error) {
                        value = error;
                    }
                }
            }
            else {
                try {
                    value = resultNonIndexed[nonIndexedIndex++];
                }
                catch (error) {
                    value = error;
                }
            }
            values.push(value);
            keys.push(param.name || null);
        });
        return Result.fromItems(values, keys);
    }
    // Given a transaction, find the matching function fragment (if any) and
    // determine all its properties and call parameters
    parseTransaction(tx) {
        const data = logger$e.getBytes(tx.data, "tx.data");
        const value = logger$e.getBigInt((tx.value != null) ? tx.value : 0, "tx.value");
        const fragment = this.getFunction(hexlify(data.slice(0, 4)));
        if (!fragment) {
            return null;
        }
        const args = __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").decode(fragment.inputs, data.slice(4));
        return new TransactionDescription(fragment, this.getSelector(fragment), args, value);
    }
    // @TODO
    //parseCallResult(data: BytesLike): ??
    // Given an event log, find the matching event fragment (if any) and
    // determine all its properties and values
    parseLog(log) {
        const fragment = this.getEvent(log.topics[0]);
        if (!fragment || fragment.anonymous) {
            return null;
        }
        // @TODO: If anonymous, and the only method, and the input count matches, should we parse?
        //        Probably not, because just because it is the only event in the ABI does
        //        not mean we have the full ABI; maybe just a fragment?
        return new LogDescription(fragment, this.getEventTopic(fragment), this.decodeEventLog(fragment, log.data, log.topics));
    }
    parseError(data) {
        const hexData = hexlify(data);
        const fragment = this.getError(dataSlice(hexData, 0, 4));
        if (!fragment) {
            return null;
        }
        const args = __classPrivateFieldGet$r(this, _Interface_abiCoder, "f").decode(fragment.inputs, dataSlice(hexData, 4));
        return new ErrorDescription(fragment, this.getSelector(fragment), args);
    }
    static from(value) {
        // Already an Interface, which is immutable
        if (value instanceof Interface) {
            return value;
        }
        // JSON
        if (typeof (value) === "string") {
            return new Interface(JSON.parse(value));
        }
        // Maybe an interface from an older version, or from a symlinked copy
        if (typeof (value.format) === "function") {
            return new Interface(value.format(FormatType.json));
        }
        // Array of fragments
        return new Interface(value);
    }
}
_Interface_errors = new WeakMap(), _Interface_events = new WeakMap(), _Interface_functions = new WeakMap(), _Interface_abiCoder = new WeakMap(), _Interface_instances = new WeakSet(), _Interface_getFunction = function _Interface_getFunction(key, values, forceUnique) {
    // Selector
    if (isHexString(key)) {
        const selector = key.toLowerCase();
        for (const fragment of __classPrivateFieldGet$r(this, _Interface_functions, "f").values()) {
            if (selector === this.getSelector(fragment)) {
                return fragment;
            }
        }
        logger$e.throwArgumentError("no matching function", "selector", key);
    }
    // It is a bare name, look up the function (will return null if ambiguous)
    if (key.indexOf("(") === -1) {
        const matching = [];
        for (const [name, fragment] of __classPrivateFieldGet$r(this, _Interface_functions, "f")) {
            if (name.split("(" /* fix:) */)[0] === key) {
                matching.push(fragment);
            }
        }
        if (values) {
            const lastValue = (values.length > 0) ? values[values.length - 1] : null;
            let valueLength = values.length;
            let allowOptions = true;
            if (Typed.isTyped(lastValue) && lastValue.type === "overrides") {
                allowOptions = false;
                valueLength--;
            }
            // Remove all matches that don't have a compatible length. The args
            // may contain an overrides, so the match may have n or n - 1 parameters
            for (let i = matching.length - 1; i >= 0; i--) {
                const inputs = matching[i].inputs.length;
                if (inputs !== valueLength && (!allowOptions || inputs !== valueLength - 1)) {
                    matching.splice(i, 1);
                }
            }
            // Remove all matches that don't match the Typed signature
            for (let i = matching.length - 1; i >= 0; i--) {
                const inputs = matching[i].inputs;
                for (let j = 0; j < values.length; j++) {
                    // Not a typed value
                    if (!Typed.isTyped(values[j])) {
                        continue;
                    }
                    // We are past the inputs
                    if (j >= inputs.length) {
                        if (values[j].type === "overrides") {
                            continue;
                        }
                        matching.splice(i, 1);
                        break;
                    }
                    // Make sure the value type matches the input type
                    if (values[j].type !== inputs[j].baseType) {
                        matching.splice(i, 1);
                        break;
                    }
                }
            }
        }
        // We found a single matching signature with an overrides, but the
        // last value is something that cannot possibly be an options
        if (matching.length === 1 && values && values.length !== matching[0].inputs.length) {
            const lastArg = values[values.length - 1];
            if (lastArg == null || Array.isArray(lastArg) || typeof (lastArg) !== "object") {
                matching.splice(0, 1);
            }
        }
        if (matching.length === 0) {
            logger$e.throwArgumentError("no matching function", "name", key);
        }
        else if (matching.length > 1 && forceUnique) {
            const matchStr = matching.map((m) => JSON.stringify(m.format())).join(", ");
            logger$e.throwArgumentError(`multiple matching functions (i.e. ${matchStr})`, "name", key);
        }
        return matching[0];
    }
    // Normalize the signature and lookup the function
    const result = __classPrivateFieldGet$r(this, _Interface_functions, "f").get(FunctionFragment.fromString(key).format());
    if (result) {
        return result;
    }
    return logger$e.throwArgumentError("no matching function", "signature", key);
}, _Interface_getEvent = function _Interface_getEvent(key, values, forceUnique) {
    // EventTopic
    if (isHexString(key)) {
        const eventTopic = key.toLowerCase();
        for (const fragment of __classPrivateFieldGet$r(this, _Interface_events, "f").values()) {
            if (eventTopic === this.getEventTopic(fragment)) {
                return fragment;
            }
        }
        logger$e.throwArgumentError("no matching event", "eventTopic", key);
    }
    // It is a bare name, look up the function (will return null if ambiguous)
    if (key.indexOf("(") === -1) {
        const matching = [];
        for (const [name, fragment] of __classPrivateFieldGet$r(this, _Interface_events, "f")) {
            if (name.split("(" /* fix:) */)[0] === key) {
                matching.push(fragment);
            }
        }
        if (values) {
            // Remove all matches that don't have a compatible length.
            for (let i = matching.length - 1; i >= 0; i--) {
                if (matching[i].inputs.length < values.length) {
                    matching.splice(i, 1);
                }
            }
            // Remove all matches that don't match the Typed signature
            for (let i = matching.length - 1; i >= 0; i--) {
                const inputs = matching[i].inputs;
                for (let j = 0; j < values.length; j++) {
                    // Not a typed value
                    if (!Typed.isTyped(values[j])) {
                        continue;
                    }
                    // Make sure the value type matches the input type
                    if (values[j].type !== inputs[j].baseType) {
                        matching.splice(i, 1);
                        break;
                    }
                }
            }
        }
        if (matching.length === 0) {
            logger$e.throwArgumentError("no matching event", "name", key);
        }
        else if (matching.length > 1 && forceUnique) {
            // @TODO: refine by Typed
            logger$e.throwArgumentError("multiple matching events", "name", key);
        }
        return matching[0];
    }
    // Normalize the signature and lookup the function
    const result = __classPrivateFieldGet$r(this, _Interface_events, "f").get(EventFragment.fromString(key).format());
    if (result) {
        return result;
    }
    return logger$e.throwArgumentError("no matching event", "signature", key);
};

const version$7 = "@ethersproject/web@6.0.0-beta.6";

const logger$6 = new Logger(version$7);

var __classPrivateFieldSet$q = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$q = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FetchResponse_props, _FetchResponse_error;
class FetchResponse {
    constructor(statusCode, statusMessage, headers, body, request) {
        _FetchResponse_props.set(this, void 0);
        _FetchResponse_error.set(this, void 0);
        __classPrivateFieldSet$q(this, _FetchResponse_props, {
            statusCode,
            statusMessage,
            headers: Object.freeze(Object.assign({}, Object.keys(headers).reduce((accum, k) => {
                accum[k.toLowerCase()] = headers[k];
                return accum;
            }, {}))),
            body: ((body == null) ? null : new Uint8Array(body)),
            request: (request || null),
        }, "f");
        __classPrivateFieldSet$q(this, _FetchResponse_error, { message: "" }, "f");
    }
    toString() {
        const body = getStore(__classPrivateFieldGet$q(this, _FetchResponse_props, "f"), "body");
        return `<Response status=${this.statusCode} body=${body ? hexlify(body) : "null"}>`;
    }
    get statusCode() { return getStore(__classPrivateFieldGet$q(this, _FetchResponse_props, "f"), "statusCode"); }
    get statusMessage() { return getStore(__classPrivateFieldGet$q(this, _FetchResponse_props, "f"), "statusMessage"); }
    get headers() { return getStore(__classPrivateFieldGet$q(this, _FetchResponse_props, "f"), "headers"); }
    get body() {
        const body = getStore(__classPrivateFieldGet$q(this, _FetchResponse_props, "f"), "body");
        return (body == null) ? null : new Uint8Array(body);
    }
    get bodyText() {
        try {
            const body = getStore(__classPrivateFieldGet$q(this, _FetchResponse_props, "f"), "body");
            return (body == null) ? "" : toUtf8String(body);
        }
        catch (error) {
            return logger$6.throwError("response body is not valid UTF-8 data", "UNSUPPORTED_OPERATION", {
                operation: "bodyText", info: { response: this }
            });
        }
    }
    get bodyJson() {
        try {
            return JSON.parse(this.bodyText);
        }
        catch (error) {
            return logger$6.throwError("response body is not valid JSON", "UNSUPPORTED_OPERATION", {
                operation: "bodyJson", info: { response: this }
            });
        }
    }
    [(_FetchResponse_props = new WeakMap(), _FetchResponse_error = new WeakMap(), Symbol.iterator)]() {
        const headers = this.headers;
        const keys = Object.keys(headers);
        let index = 0;
        return {
            next: () => {
                if (index < keys.length) {
                    const key = keys[index++];
                    return {
                        value: [key, headers[key]], done: false
                    };
                }
                return { value: undefined, done: true };
            }
        };
    }
    makeServerError(message, error) {
        let statusMessage;
        if (!message) {
            message = `${this.statusCode} ${this.statusMessage}`;
            statusMessage = `CLIENT ESCALATED SERVER ERROR (${message})`;
        }
        else {
            statusMessage = `CLIENT ESCALATED SERVER ERROR (${this.statusCode} ${this.statusMessage}; ${message})`;
        }
        const response = new FetchResponse(599, statusMessage, this.headers, this.body, getStore(__classPrivateFieldGet$q(this, _FetchResponse_props, "f"), "request") || undefined);
        __classPrivateFieldSet$q(response, _FetchResponse_error, { message, error }, "f");
        return response;
    }
    throwThrottleError(message, stall) {
        if (stall == null) {
            stall = 1000;
        }
        if (typeof (stall) !== "number" || !Number.isInteger(stall) || stall < 0) {
            logger$6.throwArgumentError("invalid stall timeout", "stall", stall);
        }
        const error = new Error(message || "throttling requests");
        defineProperties(error, { stall, throttle: true });
        throw error;
    }
    getHeader(key) {
        return this.headers[key.toLowerCase()];
    }
    hasBody() {
        const body = getStore(__classPrivateFieldGet$q(this, _FetchResponse_props, "f"), "body");
        return (body != null);
    }
    get request() { return getStore(__classPrivateFieldGet$q(this, _FetchResponse_props, "f"), "request"); }
    ok() {
        return (__classPrivateFieldGet$q(this, _FetchResponse_error, "f").message === "" && this.statusCode >= 200 && this.statusCode < 300);
    }
    assertOk() {
        if (this.ok()) {
            return;
        }
        let { message, error } = __classPrivateFieldGet$q(this, _FetchResponse_error, "f");
        if (message === "") {
            message = `server response ${this.statusCode} ${this.statusMessage}`;
        }
        logger$6.throwError(message, "SERVER_ERROR", {
            request: (this.request || "unknown request"), response: this, error
        });
    }
}

async function getUrl(req, timeout) {
    const protocol = req.url.split(":")[0].toLowerCase();
    if (protocol !== "http" && protocol !== "https") {
        logger$6.throwError(`unsupported protocol ${protocol}`, "UNSUPPORTED_OPERATION", {
            info: { protocol },
            operation: "request"
        });
    }
    if (req.credentials && !req.allowInsecureAuthentication) {
        logger$6.throwError("insecure authorized connections unsupported", "UNSUPPORTED_OPERATION", {
            operation: "request"
        });
    }
    const init = {
        method: req.method,
        headers: new Headers(Array.from(req)),
        body: req.body || undefined,
    };
    const resp = await fetch(req.url, init);
    const headers = {};
    resp.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
    });
    const body = new Uint8Array(await resp.arrayBuffer());
    return new FetchResponse(resp.status, resp.statusText, headers, body, req);
}

var __classPrivateFieldSet$p = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$p = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FetchRequest_props;
function check(value, type, name) {
    if (typeof (value) !== type) {
        throw new Error(`invalid ${name}`);
    }
    return value;
}
class FetchRequest {
    constructor(url) {
        _FetchRequest_props.set(this, void 0);
        __classPrivateFieldSet$p(this, _FetchRequest_props, {
            allowInsecure: false,
            gzip: false,
            headers: {},
            method: "",
            timeout: 300,
            url: check(url, "string", "url")
        }, "f");
    }
    // URL
    get url() { return getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "url"); }
    set url(url) {
        setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "url", check(url, "string", "url"));
    }
    // Body
    get body() {
        const body = getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "body");
        if (body == null) {
            return null;
        }
        if (this.isFrozen()) {
            return new Uint8Array(body);
        }
        return body;
    }
    set body(body) {
        if (body == null) {
            setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "body", undefined);
            setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "bodyType", undefined);
        }
        else if (typeof (body) === "string") {
            // @TODO: utf8-check
            setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "body", toUtf8Bytes(body));
            setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "bodyType", "text/plain");
        }
        else if (body instanceof Uint8Array) {
            setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "body", body);
            setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "bodyType", "application/octet-stream");
        }
        else if (typeof (body) === "object") {
            setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "body", toUtf8Bytes(JSON.stringify(body)));
            setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "bodyType", "application/json");
        }
        else {
            throw new Error("invalid body");
        }
    }
    hasBody() {
        return (getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "body") != null);
    }
    // Method (default: GET with no body, POST with a body)
    get method() {
        const method = getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "method");
        if (method) {
            return method.toUpperCase();
        }
        if (this.body) {
            return "POST";
        }
        return "GET";
    }
    set method(method) {
        if (method == null) {
            method = "";
        }
        setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "method", check(method, "string", "method"));
    }
    // Headers (automatically fills content-type if not explicitly set)
    get headers() {
        const headers = Object.assign({}, getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "headers"));
        const bodyType = getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "bodyType");
        if (this.credentials) ;
        if (this.allowGzip) {
            headers["accept-encoding"] = "gzip";
        }
        if (headers["content-type"] == null && bodyType) {
            headers["content-type"] = bodyType;
        }
        if (this.body) {
            headers["content-length"] = String(this.body.length);
        }
        return Object.freeze(headers);
    }
    getHeader(key) {
        return this.headers[key.toLowerCase()];
    }
    setHeader(key, value) {
        const headers = getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "headers");
        setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "headers", headers);
        headers[check(key, "string", "key").toLowerCase()] = String(value);
    }
    clearHeaders() {
        setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "headers", {});
    }
    [(_FetchRequest_props = new WeakMap(), Symbol.iterator)]() {
        const headers = this.headers;
        const keys = Object.keys(headers);
        let index = 0;
        return {
            next: () => {
                if (index < keys.length) {
                    const key = keys[index++];
                    return {
                        value: [key, headers[key]], done: false
                    };
                }
                return { value: undefined, done: true };
            }
        };
    }
    // Configure an Authorization header
    get credentials() {
        return getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "creds") || null;
    }
    setCredentials(username, password) {
        if (username.match(/:/)) {
            logger$6.throwArgumentError("invalid basic authentication username", "username", "[REDACTED]");
        }
        setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "creds", `${username}:${password}`);
        // @TODO:
        //const auth = username + ":" + password;
        //this.setHeader("authorization", "Basic " + base64Encode(toUtf8Bytes(auth)))
        //this.setHeader("authorization", "Basic TODO:" + auth);
    }
    // Configure the request to allow gzipped responses
    get allowGzip() {
        return getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "gzip");
    }
    set allowGzip(value) {
        setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "gzip", !!value);
    }
    // Allow credentials to be sent over an insecure (non-HTTPS) channel
    get allowInsecureAuthentication() {
        return !!getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "allowInsecure");
    }
    set allowInsecureAuthentication(value) {
        setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "allowInsecure", check(value, "boolean", "allowInsecureAuthentication"));
    }
    // Timeout (seconds)
    get timeout() { return getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "timeout"); }
    set timeout(timeout) {
        timeout = check(timeout, "number", "timeout");
        if (timeout <= 0) {
            throw new Error("invalid timerout");
        }
        setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "timeout", timeout);
    }
    redirect(location) {
        // Redirection; for now we only support absolute locataions
        const current = this.url.split(":")[0].toLowerCase();
        const target = location.split(":")[0].toLowerCase();
        if (this.method !== "GET" || (current === "https" && target === "http") ||
            !location.match(/^https?:/)) {
            return logger$6.throwError(`unsupported redirect`, "UNSUPPORTED_OPERATION", {
                operation: `redirect(${this.method} ${JSON.stringify(this.url)} => ${JSON.stringify(location)})`
            });
        }
        // Create a copy of this request, with a new URL
        const req = new FetchRequest(location);
        req.method = "GET";
        req.allowGzip = this.allowGzip;
        req.timeout = this.timeout;
        setStore(__classPrivateFieldGet$p(req, _FetchRequest_props, "f"), "body", getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "body"));
        setStore(__classPrivateFieldGet$p(req, _FetchRequest_props, "f"), "headers", Object.assign({}, getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "headers")));
        setStore(__classPrivateFieldGet$p(req, _FetchRequest_props, "f"), "bodyType", getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "bodyType"));
        // Do not forward credentials unless on the same domain; only absolute
        //req.allowInsecure = false;
        // paths are currently supported; may want a way to specify to forward?
        //setStore(req.#props, "creds", getStore(this.#pros, "creds"));
        return req;
    }
    clone() {
        const clone = new FetchRequest(this.url);
        // Preserve "default method" (i.e. null)
        setStore(__classPrivateFieldGet$p(clone, _FetchRequest_props, "f"), "method", getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "method"));
        // Preserve "default body" with type, copying the Uint8Array is present
        const body = getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "body");
        setStore(__classPrivateFieldGet$p(clone, _FetchRequest_props, "f"), "body", (body == null) ? undefined : new Uint8Array(body));
        setStore(__classPrivateFieldGet$p(clone, _FetchRequest_props, "f"), "bodyType", getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "bodyType"));
        // Preserve "default headers"
        setStore(__classPrivateFieldGet$p(clone, _FetchRequest_props, "f"), "headers", Object.assign({}, getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "headers")));
        // Credentials is readonly, so we copy internally
        setStore(__classPrivateFieldGet$p(clone, _FetchRequest_props, "f"), "creds", getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "creds"));
        if (this.allowGzip) {
            clone.allowGzip = true;
        }
        clone.timeout = this.timeout;
        if (this.allowInsecureAuthentication) {
            clone.allowInsecureAuthentication = true;
        }
        return clone;
    }
    freeze() {
        // Copy the body so any changes to previous access do not modify it
        const body = getStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "body");
        if (body != null) {
            setStore(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"), "body", new Uint8Array(body));
        }
        Object.freeze(__classPrivateFieldGet$p(this, _FetchRequest_props, "f").headers);
        Object.freeze(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"));
        return this;
    }
    isFrozen() {
        return Object.isFrozen(__classPrivateFieldGet$p(this, _FetchRequest_props, "f"));
    }
}

async function delay(duration) {
    return new Promise((resolve) => { setTimeout(resolve, duration); });
}
// @TODO: Add option for global preflightRequest?
function getTime$2() { return (new Date()).getTime(); }
function unpercent(value) {
    value = value.replace(/%([0-9a-f][0-9a-f])/gi, (all, code) => {
        return String.fromCharCode(parseInt(code, 16));
    });
    return toUtf8Bytes(value);
}
let lockGateways = false;
async function fetchData(connection) {
    const conn = (typeof (connection) === "string") ? {
        request: new FetchRequest(connection)
    } : (connection instanceof FetchRequest) ? {
        request: connection
    } : Object.assign({}, connection);
    if (conn.request == null) {
        return logger$6.throwArgumentError("missing request", "connection", connection);
    }
    let req = conn.request.clone().freeze();
    switch (conn.request.url.split(":")[0]) {
        case "data": {
            const match = req.url.match(/^data:([^;:]*)?(;base64)?,(.*)$/i);
            if (match) {
                try {
                    const headers = {
                        "content-type": (match[1] ? match[1] : "text/plain")
                    };
                    const body = (match[2] ? decodeBase64(match[3]) : unpercent(match[3]));
                    return new FetchResponse(200, "OK", headers, body, req.clone());
                }
                catch (error) {
                    return new FetchResponse(400, "BAD REQUEST (invalid base64 encoded data)", {}, null, req.clone());
                }
            }
            return new FetchResponse(500, "INTERNAL SERVER ERROR (unsupported dara URI)", {}, null, req.clone());
        }
        case "ipfs":
        case "ipns":
        case "ar":
            throw new Error("not implemented yet");
        case "http":
        case "https":
            break;
        default:
            throw new Error("unsupported scheme");
    }
    const attempts = (conn.throttleLimit != null) ? conn.throttleLimit : 12;
    if (!Number.isInteger(attempts) || attempts < 1) {
        return logger$6.throwArgumentError("invalid throttleLimit", "connection", connection);
    }
    const slotInterval = (conn.throttleSlotInterval != null) ? conn.throttleSlotInterval : 100;
    //logger.assertInteger(slotInterval, "connection.throttleSlotInterval", connection.throttleSlotInterval);
    if (!Number.isInteger(slotInterval) || attempts < 0) {
        return logger$6.throwArgumentError("invalid throttleSlotInterval", "connection", connection);
    }
    const retryFunc = (conn.throttleRetry != null) ? conn.throttleRetry : null;
    if (retryFunc && typeof (retryFunc) !== "function") {
        return logger$6.throwArgumentError("invalid throttleRetry callback", "connection", connection);
    }
    const preflightRequest = conn.preflightRequest || null;
    if (preflightRequest && typeof (preflightRequest) !== "function") {
        return logger$6.throwArgumentError("invalid preflightRequest callback", "connection", connection);
    }
    const processResponse = conn.processResponse || null;
    if (processResponse && typeof (processResponse) !== "function") {
        return logger$6.throwArgumentError("invalid processResponse callback", "connection", connection);
    }
    // Start time of this fetch (for timeouts)
    const t0 = getTime$2();
    let response = null;
    for (let a = 0; a < attempts; a++) {
        let request = req.clone();
        if (preflightRequest) {
            request = (await preflightRequest(request.freeze())).clone();
        }
        const remainingTime = getTime$2() - t0;
        if (remainingTime < 0) {
            return logger$6.throwError("timeout", "TIMEOUT", { operation: "request", reason: "timeout", request });
        }
        response = await getUrl(request);
        // Retry logic (server forced)
        if (a < attempts) {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Try following the redirect; the request will through if the
                // type of redirect is not supported
                try {
                    req = request.redirect(response.headers.location || "");
                    continue;
                }
                catch (error) { }
                // Things won't get any better on another attempt; abort
                return response;
            }
            else if (response.statusCode === 429) {
                if (retryFunc == null || (await retryFunc(request.freeze(), response, a))) {
                    const retryAfter = response.headers["retry-after"];
                    if (typeof (retryAfter) === "string" && retryAfter.match(/^[1-9][0-9]*$/)) {
                        await delay(parseInt(retryAfter));
                    }
                    else {
                        await delay(slotInterval * Math.trunc(Math.random() * Math.pow(2, a)));
                    }
                    continue;
                }
            }
        }
        // Optional post-processing response; also allows trapping
        // HTTP status errors and doing "something different",
        // including any further throttling.
        if (processResponse) {
            try {
                return await processResponse(request, response);
            }
            catch (error) {
                // response.throwThrottleError
                if (error.throttle && typeof (error.stall) === "number") {
                    if (a < attempts) {
                        await delay(error.stall);
                        continue;
                    }
                    // Too many retries should behave more like a 5xx server error
                    return response.makeServerError("exceeded maximum retry limit", error);
                }
                // Something went wrong during processing; throw a 5xx server error
                response.makeServerError("error in post-processing function", error).assertOk();
            }
        }
        return response;
    }
    // Too many retries should behave more like a 5xx server error
    return response.makeServerError("exceeded maximum retry limit");
}
fetchData.lock = function () {
    lockGateways = true;
};
// @TODO: Allow a master Gateway function
fetchData.setGateway = function (gateway) {
};
fetchData.setIpfsGateway = function (gateway) {
    if (lockGateways) {
        logger$6.throwError("gateways are locked", "UNSUPPORTED_OPERATION", {
            operation: "setIpfsGateway"
        });
    }
};
fetchData.setArGateway = function (gateway) {
    if (lockGateways) {
        logger$6.throwError("gateways are locked", "UNSUPPORTED_OPERATION", {
            operation: "setArGateway"
        });
    }
};

const version$6 = "@ethersproject/providers@6.0.0-beta.8";

const logger$5 = new Logger(version$6);

var __classPrivateFieldSet$o = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$o = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a$1, _EnsResolver_supports2544, _EnsResolver_getResolver;
const BN_1$2 = BigInt(1);
const Empty = new Uint8Array([]);
const HashZero = "0x0000000000000000000000000000000000000000000000000000000000000000";
function parseBytes(result, start) {
    if (result === "0x") {
        return null;
    }
    const offset = toNumber(dataSlice(result, start, start + 32));
    const length = toNumber(dataSlice(result, offset, offset + 32));
    return dataSlice(result, offset + 32, offset + 32 + length);
}
function parseString(result, start) {
    try {
        const bytes = parseBytes(result, start);
        if (bytes != null) {
            return toUtf8String(bytes);
        }
    }
    catch (error) { }
    return null;
}
function numPad$1(value) {
    const result = toArray(value);
    if (result.length > 32) {
        throw new Error("internal; should not happen");
    }
    const padded = new Uint8Array(32);
    padded.set(result, 32 - result.length);
    return padded;
}
function bytesPad$1(value) {
    if ((value.length % 32) === 0) {
        return value;
    }
    const result = new Uint8Array(Math.ceil(value.length / 32) * 32);
    result.set(value);
    return result;
}
// ABI Encodes a series of (bytes, bytes, ...)
function encodeBytes$1(datas) {
    const result = [];
    let byteCount = 0;
    // Add place-holders for pointers as we add items
    for (let i = 0; i < datas.length; i++) {
        result.push(Empty);
        byteCount += 32;
    }
    for (let i = 0; i < datas.length; i++) {
        const data = logger$5.getBytes(datas[i]);
        // Update the bytes offset
        result[i] = numPad$1(byteCount);
        // The length and padded value of data
        result.push(numPad$1(data.length));
        result.push(bytesPad$1(data));
        byteCount += 32 + Math.ceil(data.length / 32) * 32;
    }
    return concat(result);
}
// @TODO: This should use the fetch-data:ipfs gateway
// Trim off the ipfs:// prefix and return the default gateway URL
function getIpfsLink(link) {
    if (link.match(/^ipfs:\/\/ipfs\//i)) {
        link = link.substring(12);
    }
    else if (link.match(/^ipfs:\/\//i)) {
        link = link.substring(7);
    }
    else {
        logger$5.throwArgumentError("unsupported IPFS format", "link", link);
    }
    return `https:/\/gateway.ipfs.io/ipfs/${link}`;
}
class MulticoinProviderPlugin {
    constructor(name) {
        defineProperties(this, { name });
    }
    validate(proivder) {
        return this;
    }
    supportsCoinType(coinType) {
        return false;
    }
    async encodeAddress(coinType, address) {
        throw new Error("unsupported coin");
    }
    async decodeAddress(coinType, data) {
        throw new Error("unsupported coin");
    }
}
const matcherIpfs = new RegExp("^(ipfs):/\/(.*)$", "i");
const matchers = [
    new RegExp("^(https):/\/(.*)$", "i"),
    new RegExp("^(data):(.*)$", "i"),
    matcherIpfs,
    new RegExp("^eip155:[0-9]+/(erc[0-9]+):(.*)$", "i"),
];
class EnsResolver {
    constructor(provider, address, name) {
        // For EIP-2544 names, the ancestor that provided the resolver
        _EnsResolver_supports2544.set(this, void 0);
        defineProperties(this, { provider, address, name });
        __classPrivateFieldSet$o(this, _EnsResolver_supports2544, null, "f");
    }
    async supportsWildcard() {
        if (!__classPrivateFieldGet$o(this, _EnsResolver_supports2544, "f")) {
            // supportsInterface(bytes4 = selector("resolve(bytes,bytes)"))
            __classPrivateFieldSet$o(this, _EnsResolver_supports2544, this.provider.call({
                to: this.address,
                data: "0x01ffc9a79061b92300000000000000000000000000000000000000000000000000000000"
            }).then((result) => {
                return (logger$5.getBigInt(result) === BN_1$2);
            }).catch((error) => {
                if (error.code === "CALL_EXCEPTION") {
                    return false;
                }
                // Rethrow the error: link is down, etc. Let future attempts retry.
                __classPrivateFieldSet$o(this, _EnsResolver_supports2544, null, "f");
                throw error;
            }), "f");
        }
        return await __classPrivateFieldGet$o(this, _EnsResolver_supports2544, "f");
    }
    async _fetch(selector, parameters = "0x") {
        // e.g. keccak256("addr(bytes32,uint256)")
        const addrData = concat([selector, namehash(this.name), parameters]);
        const tx = {
            to: this.address,
            enableCcipRead: true,
            data: addrData
        };
        // Wildcard support; use EIP-2544 to resolve the request
        let wrapped = false;
        if (await this.supportsWildcard()) {
            wrapped = true;
            // selector("resolve(bytes,bytes)")
            tx.data = concat(["0x9061b923", encodeBytes$1([dnsEncode(this.name), addrData])]);
        }
        try {
            let data = await this.provider.call(tx);
            if ((logger$5.getBytes(data).length % 32) === 4) {
                return logger$5.throwError("resolver threw error", "CALL_EXCEPTION", {
                    transaction: tx, data
                });
            }
            if (wrapped) {
                return parseBytes(data, 0);
            }
            return data;
        }
        catch (error) {
            if (error.code !== "CALL_EXCEPTION") {
                throw error;
            }
        }
        return null;
    }
    async getAddress(coinType = 60) {
        if (coinType === 60) {
            try {
                // keccak256("addr(bytes32)")
                const result = await this._fetch("0x3b3b57de");
                // No address
                if (result === "0x" || result === HashZero) {
                    return null;
                }
                const network = await this.provider.getNetwork();
                return network.formatter.callAddress(result);
            }
            catch (error) {
                if (error.code === "CALL_EXCEPTION") {
                    return null;
                }
                throw error;
            }
        }
        let coinPlugin = null;
        for (const plugin of this.provider.plugins) {
            if (!(plugin instanceof MulticoinProviderPlugin)) {
                continue;
            }
            if (plugin.supportsCoinType(coinType)) {
                coinPlugin = plugin;
                break;
            }
        }
        if (coinPlugin == null) {
            return null;
        }
        // keccak256("addr(bytes32,uint256")
        const data = parseBytes((await this._fetch("0xf1cb7e06", numPad$1(coinType))) || "0x", 0);
        // No address
        if (data == null || data === "0x") {
            return null;
        }
        // Compute the address
        const address = await coinPlugin.encodeAddress(coinType, data);
        if (address != null) {
            return address;
        }
        return logger$5.throwError(`invalid coin data`, "UNSUPPORTED_OPERATION", {
            operation: `getAddress(${coinType})`,
            info: { coinType, data }
        });
    }
    async getText(key) {
        // The key encoded as parameter to fetchBytes
        let keyBytes = toUtf8Bytes(key);
        // The nodehash consumes the first slot, so the string pointer targets
        // offset 64, with the length at offset 64 and data starting at offset 96
        const calldata = logger$5.getBytes(concat([numPad$1(64), numPad$1(keyBytes.length), keyBytes]));
        const hexBytes = parseBytes((await this._fetch("0x59d1d43c", bytesPad$1(calldata))) || "0x", 0);
        if (hexBytes == null || hexBytes === "0x") {
            return null;
        }
        return toUtf8String(hexBytes);
    }
    async getContentHash() {
        // keccak256("contenthash()")
        const hexBytes = parseBytes((await this._fetch("0xbc1c58d1")) || "0x", 0);
        // No contenthash
        if (hexBytes == null || hexBytes === "0x") {
            return null;
        }
        // IPFS (CID: 1, Type: 70=DAG-PB, 72=libp2p-key)
        const ipfs = hexBytes.match(/^0x(e3010170|e5010172)(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/);
        if (ipfs) {
            const scheme = (ipfs[1] === "e3010170") ? "ipfs" : "ipns";
            const length = parseInt(ipfs[4], 16);
            if (ipfs[5].length === length * 2) {
                return `${scheme}:/\/${encodeBase58("0x" + ipfs[2])}`;
            }
        }
        // Swarm (CID: 1, Type: swarm-manifest; hash/length hard-coded to keccak256/32)
        const swarm = hexBytes.match(/^0xe40101fa011b20([0-9a-f]*)$/);
        if (swarm && swarm[1].length === 64) {
            return `bzz:/\/${swarm[1]}`;
        }
        return logger$5.throwError(`invalid or unsupported content hash data`, "UNSUPPORTED_OPERATION", {
            operation: "getContentHash()",
            info: { data: hexBytes }
        });
    }
    async getAvatar() {
        return (await this._getAvatar()).url;
    }
    async _getAvatar() {
        const linkage = [{ type: "name", value: this.name }];
        try {
            // test data for ricmoo.eth
            //const avatar = "eip155:1/erc721:0x265385c7f4132228A0d54EB1A9e7460b91c0cC68/29233";
            const avatar = await this.getText("avatar");
            if (avatar == null) {
                linkage.push({ type: "!avatar", value: "" });
                throw new Error("!avatar");
            }
            linkage.push({ type: "avatar", value: avatar });
            for (let i = 0; i < matchers.length; i++) {
                const match = avatar.match(matchers[i]);
                if (match == null) {
                    continue;
                }
                const scheme = match[1].toLowerCase();
                switch (scheme) {
                    case "https":
                    case "data":
                        linkage.push({ type: "url", value: avatar });
                        return { linkage, url: avatar };
                    case "ipfs": {
                        const url = getIpfsLink(avatar);
                        linkage.push({ type: "ipfs", value: avatar });
                        linkage.push({ type: "url", value: url });
                        return { linkage, url };
                    }
                    case "erc721":
                    case "erc1155": {
                        // Depending on the ERC type, use tokenURI(uint256) or url(uint256)
                        const selector = (scheme === "erc721") ? "0xc87b56dd" : "0x0e89341c";
                        linkage.push({ type: scheme, value: avatar });
                        // The owner of this name
                        const owner = await this.getAddress();
                        if (owner == null) {
                            linkage.push({ type: "!owner", value: "" });
                            throw new Error("!owner");
                        }
                        const comps = (match[2] || "").split("/");
                        if (comps.length !== 2) {
                            linkage.push({ type: `!${scheme}caip`, value: (match[2] || "") });
                            throw new Error("!caip");
                        }
                        const formatter = (await this.provider.getNetwork()).formatter;
                        const addr = formatter.address(comps[0]);
                        const tokenId = numPad$1(comps[1]);
                        // Check that this account owns the token
                        if (scheme === "erc721") {
                            // ownerOf(uint256 tokenId)
                            const tokenOwner = formatter.callAddress(await this.provider.call({
                                to: addr, data: concat(["0x6352211e", tokenId])
                            }));
                            if (owner !== tokenOwner) {
                                linkage.push({ type: "!owner", value: tokenOwner });
                                throw new Error("!owner");
                            }
                            linkage.push({ type: "owner", value: tokenOwner });
                        }
                        else if (scheme === "erc1155") {
                            // balanceOf(address owner, uint256 tokenId)
                            const balance = logger$5.getBigInt(await this.provider.call({
                                to: addr, data: concat(["0x00fdd58e", zeroPadValue(owner, 32), tokenId])
                            }));
                            if (!balance) {
                                linkage.push({ type: "!balance", value: "0" });
                                throw new Error("!balance");
                            }
                            linkage.push({ type: "balance", value: balance.toString() });
                        }
                        // Call the token contract for the metadata URL
                        const tx = {
                            to: comps[0],
                            data: concat([selector, tokenId])
                        };
                        let metadataUrl = parseString(await this.provider.call(tx), 0);
                        if (metadataUrl == null) {
                            linkage.push({ type: "!metadata-url", value: "" });
                            throw new Error("!metadata-url");
                        }
                        linkage.push({ type: "metadata-url-base", value: metadataUrl });
                        // ERC-1155 allows a generic {id} in the URL
                        if (scheme === "erc1155") {
                            metadataUrl = metadataUrl.replace("{id}", hexlify(tokenId).substring(2));
                            linkage.push({ type: "metadata-url-expanded", value: metadataUrl });
                        }
                        // Transform IPFS metadata links
                        if (metadataUrl.match(/^ipfs:/i)) {
                            metadataUrl = getIpfsLink(metadataUrl);
                        }
                        linkage.push({ type: "metadata-url", value: metadataUrl });
                        // Get the token metadata
                        let metadata = {};
                        const response = await fetchData(metadataUrl);
                        response.assertOk();
                        try {
                            metadata = response.bodyJson;
                        }
                        catch (error) {
                            try {
                                linkage.push({ type: "!metadata", value: response.bodyText });
                            }
                            catch (error) {
                                const bytes = response.body;
                                if (bytes) {
                                    linkage.push({ type: "!metadata", value: hexlify(bytes) });
                                }
                                throw error;
                            }
                            throw error;
                        }
                        if (!metadata) {
                            linkage.push({ type: "!metadata", value: "" });
                            throw new Error("!metadata");
                        }
                        linkage.push({ type: "metadata", value: JSON.stringify(metadata) });
                        // Pull the image URL out
                        let imageUrl = metadata.image;
                        if (typeof (imageUrl) !== "string") {
                            linkage.push({ type: "!imageUrl", value: "" });
                            throw new Error("!imageUrl");
                        }
                        if (imageUrl.match(/^(https:\/\/|data:)/i)) {
                            // Allow
                        }
                        else {
                            // Transform IPFS link to gateway
                            const ipfs = imageUrl.match(matcherIpfs);
                            if (ipfs == null) {
                                linkage.push({ type: "!imageUrl-ipfs", value: imageUrl });
                                throw new Error("!imageUrl-ipfs");
                            }
                            linkage.push({ type: "imageUrl-ipfs", value: imageUrl });
                            imageUrl = getIpfsLink(imageUrl);
                        }
                        linkage.push({ type: "url", value: imageUrl });
                        return { linkage, url: imageUrl };
                    }
                }
            }
        }
        catch (error) {
            console.log("EE", error);
        }
        return { linkage, url: null };
    }
    static async fromName(provider, name) {
        let currentName = name;
        while (true) {
            if (currentName === "" || currentName === ".") {
                return null;
            }
            // Optimization since the eth node cannot change and does
            // not have a wildcar resolver
            if (name !== "eth" && currentName === "eth") {
                return null;
            }
            // Check the current node for a resolver
            const addr = await __classPrivateFieldGet$o(EnsResolver, _a$1, "m", _EnsResolver_getResolver).call(EnsResolver, provider, currentName);
            // Found a resolver!
            if (addr != null) {
                const resolver = new EnsResolver(provider, addr, name);
                // Legacy resolver found, using EIP-2544 so it isn't safe to use
                if (currentName !== name && !(await resolver.supportsWildcard())) {
                    return null;
                }
                return resolver;
            }
            // Get the parent node
            currentName = currentName.split(".").slice(1).join(".");
        }
    }
}
_a$1 = EnsResolver, _EnsResolver_supports2544 = new WeakMap(), _EnsResolver_getResolver = async function _EnsResolver_getResolver(provider, name) {
    const network = await provider.getNetwork();
    const ensPlugin = network.getPlugin("org.ethers.plugins.ens");
    // No ENS...
    if (!ensPlugin) {
        return logger$5.throwError("network does not support ENS", "UNSUPPORTED_OPERATION", {
            operation: "getResolver", info: { network: network.name }
        });
    }
    try {
        // keccak256("resolver(bytes32)")
        const addrData = await provider.call({
            to: ensPlugin.address,
            data: concat(["0x0178b8bf", namehash(name)]),
            enableCcipRead: true
        });
        const addr = network.formatter.callAddress(addrData);
        if (addr === dataSlice(HashZero, 0, 20)) {
            return null;
        }
        return addr;
    }
    catch (error) {
        // ENS registry cannot throw errors on resolver(bytes32),
        // so probably a link error
        throw error;
    }
    return null;
};

const version$5 = "@ethersproject/signing-key@6.0.0-beta.2";

const logger$4 = new Logger(version$5);

var __classPrivateFieldSet$n = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$n = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Signature_props;
// Constants
const BN_0$1 = BigInt(0);
const BN_1$1 = BigInt(1);
const BN_2$3 = BigInt(2);
const BN_27$1 = BigInt(27);
const BN_28$1 = BigInt(28);
const BN_35$1 = BigInt(35);
const _guard$2 = {};
const Zero = "0x0000000000000000000000000000000000000000000000000000000000000000";
class Signature$1 {
    constructor(guard, r, s, v) {
        _Signature_props.set(this, void 0);
        logger$4.assertPrivate(guard, _guard$2, "Signature");
        __classPrivateFieldSet$n(this, _Signature_props, { r, s, v, networkV: null }, "f");
    }
    get r() { return getStore(__classPrivateFieldGet$n(this, _Signature_props, "f"), "r"); }
    set r(value) {
        if (dataLength(value) !== 32) {
            logger$4.throwArgumentError("invalid r", "value", value);
        }
        setStore(__classPrivateFieldGet$n(this, _Signature_props, "f"), "r", hexlify(value));
    }
    get s() { return getStore(__classPrivateFieldGet$n(this, _Signature_props, "f"), "s"); }
    set s(value) {
        if (dataLength(value) !== 32) {
            logger$4.throwArgumentError("invalid r", "value", value);
        }
        else if (logger$4.getBytes(value)[0] & 0x80) {
            logger$4.throwArgumentError("non-canonical s", "value", value);
        }
        setStore(__classPrivateFieldGet$n(this, _Signature_props, "f"), "s", hexlify(value));
    }
    get v() { return getStore(__classPrivateFieldGet$n(this, _Signature_props, "f"), "v"); }
    set v(value) {
        const v = logger$4.getNumber(value, "value");
        if (v !== 27 && v !== 28) {
            throw new Error("@TODO");
        }
        setStore(__classPrivateFieldGet$n(this, _Signature_props, "f"), "v", v);
    }
    get networkV() { return getStore(__classPrivateFieldGet$n(this, _Signature_props, "f"), "networkV"); }
    get legacyChainId() {
        const v = this.networkV;
        if (v == null) {
            return null;
        }
        return Signature$1.getChainId(v);
    }
    get yParity() {
        if (this.v === 27) {
            return 0;
        }
        return 1;
        /*
        // When v is 0 or 1 it is the recid directly
        if (this.v.isZero()) { return 0; }
        if (this.v.eq(1)) { return 1; }

        // Otherwise, odd (e.g. 27) is 0 and even (e.g. 28) is 1
        return this.v.and(1).isZero() ? 1: 0;
        */
    }
    get yParityAndS() {
        // The EIP-2098 compact representation
        const yParityAndS = logger$4.getBytes(this.s);
        if (this.yParity) {
            yParityAndS[0] |= 0x80;
        }
        return hexlify(yParityAndS);
    }
    get compactSerialized() {
        return concat([this.r, this.yParityAndS]);
    }
    get serialized() {
        return concat([this.r, this.s, (this.yParity ? "0x1c" : "0x1b")]);
    }
    [(_Signature_props = new WeakMap(), Symbol.for('nodejs.util.inspect.custom'))]() {
        return `Signature { r: "${this.r}", s: "${this.s}", yParity: ${this.yParity}, networkV: ${this.networkV} }`;
    }
    clone() {
        const clone = new Signature$1(_guard$2, this.r, this.s, this.v);
        if (this.networkV) {
            setStore(__classPrivateFieldGet$n(clone, _Signature_props, "f"), "networkV", this.networkV);
        }
        return clone;
    }
    freeze() {
        Object.freeze(__classPrivateFieldGet$n(this, _Signature_props, "f"));
        return this;
    }
    isFrozen() {
        return Object.isFrozen(__classPrivateFieldGet$n(this, _Signature_props, "f"));
    }
    toJSON() {
        const networkV = this.networkV;
        return {
            _type: "signature",
            networkV: ((networkV != null) ? networkV.toString() : null),
            r: this.r, s: this.s, v: this.v,
        };
    }
    static create() {
        return new Signature$1(_guard$2, Zero, Zero, 27);
    }
    // Get the chain ID from an EIP-155 v
    static getChainId(v) {
        const bv = logger$4.getBigInt(v, "v");
        // The v is not an EIP-155 v, so it is the unspecified chain ID
        if ((bv == BN_27$1) || (bv == BN_28$1)) {
            return BN_0$1;
        }
        // Bad value for an EIP-155 v
        if (bv < BN_35$1) {
            logger$4.throwArgumentError("invalid EIP-155 v", "v", v);
        }
        return (bv - BN_35$1) / BN_2$3;
    }
    // Get the EIP-155 v transformed for a given chainId
    static getChainIdV(chainId, v) {
        return (logger$4.getBigInt(chainId) * BN_2$3) + BigInt(35 + v - 27);
    }
    // Convert an EIP-155 v into a normalized v
    static getNormalizedV(v) {
        const bv = logger$4.getBigInt(v);
        if (bv == BN_0$1) {
            return 27;
        }
        if (bv == BN_1$1) {
            return 28;
        }
        // Otherwise, EIP-155 v means odd is 27 and even is 28
        return (bv & BN_1$1) ? 27 : 28;
    }
    static from(sig) {
        const throwError = (message) => {
            return logger$4.throwArgumentError(message, "signature", sig);
        };
        if (typeof (sig) === "string") {
            const bytes = logger$4.getBytes(sig, "signature");
            if (bytes.length === 64) {
                const r = hexlify(bytes.slice(0, 32));
                const s = bytes.slice(32, 64);
                const v = (s[0] & 0x80) ? 28 : 27;
                s[0] &= 0x7f;
                return new Signature$1(_guard$2, r, hexlify(s), v);
            }
            if (dataLength(sig) !== 65) {
                const r = hexlify(sig.slice(0, 32));
                const s = bytes.slice(32, 64);
                if (s[0] & 0x80) {
                    throwError("non-canonical s");
                }
                const v = Signature$1.getNormalizedV(bytes[64]);
                return new Signature$1(_guard$2, r, hexlify(s), v);
            }
            return throwError("invlaid raw signature length");
        }
        if (sig instanceof Signature$1) {
            return sig.clone();
        }
        // Get r
        const r = sig.r;
        if (r == null) {
            throwError("missing r");
        }
        if (!isHexString(r, 32)) {
            throwError("invalid r");
        }
        // Get s; by any means necessary (we check consistency below)
        const s = (function (s, yParityAndS) {
            if (s != null) {
                if (!isHexString(s, 32)) {
                    throwError("invalid s");
                }
                return s;
            }
            if (yParityAndS != null) {
                if (!isHexString(yParityAndS, 32)) {
                    throwError("invalid yParityAndS");
                }
                const bytes = logger$4.getBytes(yParityAndS);
                bytes[0] &= 0x7f;
                return hexlify(bytes);
            }
            return throwError("missing s");
        })(sig.s, sig.yParityAndS);
        if (logger$4.getBytes(s)[0] & 0x80) {
            throwError("non-canonical s");
        }
        // Get v; by any means necessary (we check consistency below)
        const { networkV, v } = (function (_v, yParityAndS, yParity) {
            if (_v != null) {
                const v = logger$4.getBigInt(_v);
                return {
                    networkV: ((v >= BN_35$1) ? v : undefined),
                    v: Signature$1.getNormalizedV(v)
                };
            }
            if (yParityAndS != null) {
                if (!isHexString(yParityAndS, 32)) {
                    throwError("invalid yParityAndS");
                }
                return { v: ((logger$4.getBytes(yParityAndS)[0] & 0x80) ? 28 : 27) };
            }
            if (yParity != null) {
                switch (yParity) {
                    case 0: return { v: 27 };
                    case 1: return { v: 28 };
                }
                return throwError("invalid yParity");
            }
            return throwError("missing v");
        })(sig.v, sig.yParityAndS, sig.yParity);
        const result = new Signature$1(_guard$2, r, s, v);
        if (networkV) {
            setStore(__classPrivateFieldGet$n(result, _Signature_props, "f"), "networkV", networkV);
        }
        // If multiple of v, yParity, yParityAndS we given, check they match
        if ("yParity" in sig && sig.yParity !== result.yParity) {
            throwError("yParity mismatch");
        }
        else if ("yParityAndS" in sig && sig.yParityAndS !== result.yParityAndS) {
            throwError("yParityAndS mismatch");
        }
        return result;
    }
}

/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const nodeCrypto = undefined; /* ethers:rollup */
const _0n = BigInt(0);
const _1n = BigInt(1);
const _2n = BigInt(2);
const _3n = BigInt(3);
const _8n = BigInt(8);
const POW_2_256 = _2n ** BigInt(256);
const CURVE = {
    a: _0n,
    b: BigInt(7),
    P: POW_2_256 - _2n ** BigInt(32) - BigInt(977),
    n: POW_2_256 - BigInt('432420386565659656852420866394968145599'),
    h: _1n,
    Gx: BigInt('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
    Gy: BigInt('32670510020758816978083085130507043184471273380659243275938904335757337482424'),
    beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
};
function weistrass(x) {
    const { a, b } = CURVE;
    const x2 = mod(x * x);
    const x3 = mod(x2 * x);
    return mod(x3 + a * x + b);
}
const USE_ENDOMORPHISM = CURVE.a === _0n;
class JacobianPoint {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static fromAffine(p) {
        if (!(p instanceof Point)) {
            throw new TypeError('JacobianPoint#fromAffine: expected Point');
        }
        return new JacobianPoint(p.x, p.y, _1n);
    }
    static toAffineBatch(points) {
        const toInv = invertBatch(points.map((p) => p.z));
        return points.map((p, i) => p.toAffine(toInv[i]));
    }
    static normalizeZ(points) {
        return JacobianPoint.toAffineBatch(points).map(JacobianPoint.fromAffine);
    }
    equals(other) {
        if (!(other instanceof JacobianPoint))
            throw new TypeError('JacobianPoint expected');
        const { x: X1, y: Y1, z: Z1 } = this;
        const { x: X2, y: Y2, z: Z2 } = other;
        const Z1Z1 = mod(Z1 ** _2n);
        const Z2Z2 = mod(Z2 ** _2n);
        const U1 = mod(X1 * Z2Z2);
        const U2 = mod(X2 * Z1Z1);
        const S1 = mod(mod(Y1 * Z2) * Z2Z2);
        const S2 = mod(mod(Y2 * Z1) * Z1Z1);
        return U1 === U2 && S1 === S2;
    }
    negate() {
        return new JacobianPoint(this.x, mod(-this.y), this.z);
    }
    double() {
        const { x: X1, y: Y1, z: Z1 } = this;
        const A = mod(X1 ** _2n);
        const B = mod(Y1 ** _2n);
        const C = mod(B ** _2n);
        const D = mod(_2n * (mod((X1 + B) ** _2n) - A - C));
        const E = mod(_3n * A);
        const F = mod(E ** _2n);
        const X3 = mod(F - _2n * D);
        const Y3 = mod(E * (D - X3) - _8n * C);
        const Z3 = mod(_2n * Y1 * Z1);
        return new JacobianPoint(X3, Y3, Z3);
    }
    add(other) {
        if (!(other instanceof JacobianPoint))
            throw new TypeError('JacobianPoint expected');
        const { x: X1, y: Y1, z: Z1 } = this;
        const { x: X2, y: Y2, z: Z2 } = other;
        if (X2 === _0n || Y2 === _0n)
            return this;
        if (X1 === _0n || Y1 === _0n)
            return other;
        const Z1Z1 = mod(Z1 ** _2n);
        const Z2Z2 = mod(Z2 ** _2n);
        const U1 = mod(X1 * Z2Z2);
        const U2 = mod(X2 * Z1Z1);
        const S1 = mod(mod(Y1 * Z2) * Z2Z2);
        const S2 = mod(mod(Y2 * Z1) * Z1Z1);
        const H = mod(U2 - U1);
        const r = mod(S2 - S1);
        if (H === _0n) {
            if (r === _0n) {
                return this.double();
            }
            else {
                return JacobianPoint.ZERO;
            }
        }
        const HH = mod(H ** _2n);
        const HHH = mod(H * HH);
        const V = mod(U1 * HH);
        const X3 = mod(r ** _2n - HHH - _2n * V);
        const Y3 = mod(r * (V - X3) - S1 * HHH);
        const Z3 = mod(Z1 * Z2 * H);
        return new JacobianPoint(X3, Y3, Z3);
    }
    subtract(other) {
        return this.add(other.negate());
    }
    multiplyUnsafe(scalar) {
        let n = normalizeScalar(scalar);
        const P0 = JacobianPoint.ZERO;
        if (n === _0n)
            return P0;
        if (n === _1n)
            return this;
        if (!USE_ENDOMORPHISM) {
            let p = P0;
            let d = this;
            while (n > _0n) {
                if (n & _1n)
                    p = p.add(d);
                d = d.double();
                n >>= _1n;
            }
            return p;
        }
        let { k1neg, k1, k2neg, k2 } = splitScalarEndo(n);
        let k1p = P0;
        let k2p = P0;
        let d = this;
        while (k1 > _0n || k2 > _0n) {
            if (k1 & _1n)
                k1p = k1p.add(d);
            if (k2 & _1n)
                k2p = k2p.add(d);
            d = d.double();
            k1 >>= _1n;
            k2 >>= _1n;
        }
        if (k1neg)
            k1p = k1p.negate();
        if (k2neg)
            k2p = k2p.negate();
        k2p = new JacobianPoint(mod(k2p.x * CURVE.beta), k2p.y, k2p.z);
        return k1p.add(k2p);
    }
    precomputeWindow(W) {
        const windows = USE_ENDOMORPHISM ? 128 / W + 1 : 256 / W + 1;
        const points = [];
        let p = this;
        let base = p;
        for (let window = 0; window < windows; window++) {
            base = p;
            points.push(base);
            for (let i = 1; i < 2 ** (W - 1); i++) {
                base = base.add(p);
                points.push(base);
            }
            p = base.double();
        }
        return points;
    }
    wNAF(n, affinePoint) {
        if (!affinePoint && this.equals(JacobianPoint.BASE))
            affinePoint = Point.BASE;
        const W = (affinePoint && affinePoint._WINDOW_SIZE) || 1;
        if (256 % W) {
            throw new Error('Point#wNAF: Invalid precomputation window, must be power of 2');
        }
        let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
        if (!precomputes) {
            precomputes = this.precomputeWindow(W);
            if (affinePoint && W !== 1) {
                precomputes = JacobianPoint.normalizeZ(precomputes);
                pointPrecomputes.set(affinePoint, precomputes);
            }
        }
        let p = JacobianPoint.ZERO;
        let f = JacobianPoint.ZERO;
        const windows = 1 + (USE_ENDOMORPHISM ? 128 / W : 256 / W);
        const windowSize = 2 ** (W - 1);
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window = 0; window < windows; window++) {
            const offset = window * windowSize;
            let wbits = Number(n & mask);
            n >>= shiftBy;
            if (wbits > windowSize) {
                wbits -= maxNumber;
                n += _1n;
            }
            if (wbits === 0) {
                let pr = precomputes[offset];
                if (window % 2)
                    pr = pr.negate();
                f = f.add(pr);
            }
            else {
                let cached = precomputes[offset + Math.abs(wbits) - 1];
                if (wbits < 0)
                    cached = cached.negate();
                p = p.add(cached);
            }
        }
        return { p, f };
    }
    multiply(scalar, affinePoint) {
        let n = normalizeScalar(scalar);
        let point;
        let fake;
        if (USE_ENDOMORPHISM) {
            const { k1neg, k1, k2neg, k2 } = splitScalarEndo(n);
            let { p: k1p, f: f1p } = this.wNAF(k1, affinePoint);
            let { p: k2p, f: f2p } = this.wNAF(k2, affinePoint);
            if (k1neg)
                k1p = k1p.negate();
            if (k2neg)
                k2p = k2p.negate();
            k2p = new JacobianPoint(mod(k2p.x * CURVE.beta), k2p.y, k2p.z);
            point = k1p.add(k2p);
            fake = f1p.add(f2p);
        }
        else {
            const { p, f } = this.wNAF(n, affinePoint);
            point = p;
            fake = f;
        }
        return JacobianPoint.normalizeZ([point, fake])[0];
    }
    toAffine(invZ = invert(this.z)) {
        const { x, y, z } = this;
        const iz1 = invZ;
        const iz2 = mod(iz1 * iz1);
        const iz3 = mod(iz2 * iz1);
        const ax = mod(x * iz2);
        const ay = mod(y * iz3);
        const zz = mod(z * iz1);
        if (zz !== _1n)
            throw new Error('invZ was invalid');
        return new Point(ax, ay);
    }
}
JacobianPoint.BASE = new JacobianPoint(CURVE.Gx, CURVE.Gy, _1n);
JacobianPoint.ZERO = new JacobianPoint(_0n, _1n, _0n);
const pointPrecomputes = new WeakMap();
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    _setWindowSize(windowSize) {
        this._WINDOW_SIZE = windowSize;
        pointPrecomputes.delete(this);
    }
    static fromCompressedHex(bytes) {
        const isShort = bytes.length === 32;
        const x = bytesToNumber(isShort ? bytes : bytes.subarray(1));
        if (!isValidFieldElement(x))
            throw new Error('Point is not on curve');
        const y2 = weistrass(x);
        let y = sqrtMod(y2);
        const isYOdd = (y & _1n) === _1n;
        if (isShort) {
            if (isYOdd)
                y = mod(-y);
        }
        else {
            const isFirstByteOdd = (bytes[0] & 1) === 1;
            if (isFirstByteOdd !== isYOdd)
                y = mod(-y);
        }
        const point = new Point(x, y);
        point.assertValidity();
        return point;
    }
    static fromUncompressedHex(bytes) {
        const x = bytesToNumber(bytes.subarray(1, 33));
        const y = bytesToNumber(bytes.subarray(33, 65));
        const point = new Point(x, y);
        point.assertValidity();
        return point;
    }
    static fromHex(hex) {
        const bytes = ensureBytes(hex);
        const len = bytes.length;
        const header = bytes[0];
        if (len === 32 || (len === 33 && (header === 0x02 || header === 0x03))) {
            return this.fromCompressedHex(bytes);
        }
        if (len === 65 && header === 0x04)
            return this.fromUncompressedHex(bytes);
        throw new Error(`Point.fromHex: received invalid point. Expected 32-33 compressed bytes or 65 uncompressed bytes, not ${len}`);
    }
    static fromPrivateKey(privateKey) {
        return Point.BASE.multiply(normalizePrivateKey(privateKey));
    }
    static fromSignature(msgHash, signature, recovery) {
        msgHash = ensureBytes(msgHash);
        const h = truncateHash(msgHash);
        const { r, s } = normalizeSignature(signature);
        if (recovery !== 0 && recovery !== 1) {
            throw new Error('Cannot recover signature: invalid recovery bit');
        }
        if (h === _0n)
            throw new Error('Cannot recover signature: msgHash cannot be 0');
        const prefix = recovery & 1 ? '03' : '02';
        const R = Point.fromHex(prefix + numTo32bStr(r));
        const { n } = CURVE;
        const rinv = invert(r, n);
        const u1 = mod(-h * rinv, n);
        const u2 = mod(s * rinv, n);
        const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
        if (!Q)
            throw new Error('Cannot recover signature: point at infinify');
        Q.assertValidity();
        return Q;
    }
    toRawBytes(isCompressed = false) {
        return hexToBytes(this.toHex(isCompressed));
    }
    toHex(isCompressed = false) {
        const x = numTo32bStr(this.x);
        if (isCompressed) {
            const prefix = this.y & _1n ? '03' : '02';
            return `${prefix}${x}`;
        }
        else {
            return `04${x}${numTo32bStr(this.y)}`;
        }
    }
    toHexX() {
        return this.toHex(true).slice(2);
    }
    toRawX() {
        return this.toRawBytes(true).slice(1);
    }
    assertValidity() {
        const msg = 'Point is not on elliptic curve';
        const { x, y } = this;
        if (!isValidFieldElement(x) || !isValidFieldElement(y))
            throw new Error(msg);
        const left = mod(y * y);
        const right = weistrass(x);
        if (mod(left - right) !== _0n)
            throw new Error(msg);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    negate() {
        return new Point(this.x, mod(-this.y));
    }
    double() {
        return JacobianPoint.fromAffine(this).double().toAffine();
    }
    add(other) {
        return JacobianPoint.fromAffine(this).add(JacobianPoint.fromAffine(other)).toAffine();
    }
    subtract(other) {
        return this.add(other.negate());
    }
    multiply(scalar) {
        return JacobianPoint.fromAffine(this).multiply(scalar, this).toAffine();
    }
    multiplyAndAddUnsafe(Q, a, b) {
        const P = JacobianPoint.fromAffine(this);
        const aP = P.multiply(a);
        const bQ = JacobianPoint.fromAffine(Q).multiplyUnsafe(b);
        const sum = aP.add(bQ);
        return sum.equals(JacobianPoint.ZERO) ? undefined : sum.toAffine();
    }
}
Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
Point.ZERO = new Point(_0n, _0n);
function sliceDER(s) {
    return Number.parseInt(s[0], 16) >= 8 ? '00' + s : s;
}
function parseDERInt(data) {
    if (data.length < 2 || data[0] !== 0x02) {
        throw new Error(`Invalid signature integer tag: ${bytesToHex(data)}`);
    }
    const len = data[1];
    const res = data.subarray(2, len + 2);
    if (!len || res.length !== len) {
        throw new Error(`Invalid signature integer: wrong length`);
    }
    if (res[0] === 0x00 && res[1] <= 0x7f) {
        throw new Error('Invalid signature integer: trailing length');
    }
    return { data: bytesToNumber(res), left: data.subarray(len + 2) };
}
function parseDERSignature(data) {
    if (data.length < 2 || data[0] != 0x30) {
        throw new Error(`Invalid signature tag: ${bytesToHex(data)}`);
    }
    if (data[1] !== data.length - 2) {
        throw new Error('Invalid signature: incorrect length');
    }
    const { data: r, left: sBytes } = parseDERInt(data.subarray(2));
    const { data: s, left: rBytesLeft } = parseDERInt(sBytes);
    if (rBytesLeft.length) {
        throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex(rBytesLeft)}`);
    }
    return { r, s };
}
class Signature {
    constructor(r, s) {
        this.r = r;
        this.s = s;
        this.assertValidity();
    }
    static fromCompact(hex) {
        const arr = isUint8a(hex);
        const name = 'Signature.fromCompact';
        if (typeof hex !== 'string' && !arr)
            throw new TypeError(`${name}: Expected string or Uint8Array`);
        const str = arr ? bytesToHex(hex) : hex;
        if (str.length !== 128)
            throw new Error(`${name}: Expected 64-byte hex`);
        return new Signature(hexToNumber(str.slice(0, 64)), hexToNumber(str.slice(64, 128)));
    }
    static fromDER(hex) {
        const arr = isUint8a(hex);
        if (typeof hex !== 'string' && !arr)
            throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
        const { r, s } = parseDERSignature(arr ? hex : hexToBytes(hex));
        return new Signature(r, s);
    }
    static fromHex(hex) {
        return this.fromDER(hex);
    }
    assertValidity() {
        const { r, s } = this;
        if (!isWithinCurveOrder(r))
            throw new Error('Invalid Signature: r must be 0 < r < n');
        if (!isWithinCurveOrder(s))
            throw new Error('Invalid Signature: s must be 0 < s < n');
    }
    hasHighS() {
        const HALF = CURVE.n >> _1n;
        return this.s > HALF;
    }
    normalizeS() {
        return this.hasHighS() ? new Signature(this.r, CURVE.n - this.s) : this;
    }
    toDERRawBytes(isCompressed = false) {
        return hexToBytes(this.toDERHex(isCompressed));
    }
    toDERHex(isCompressed = false) {
        const sHex = sliceDER(numberToHexUnpadded(this.s));
        if (isCompressed)
            return sHex;
        const rHex = sliceDER(numberToHexUnpadded(this.r));
        const rLen = numberToHexUnpadded(rHex.length / 2);
        const sLen = numberToHexUnpadded(sHex.length / 2);
        const length = numberToHexUnpadded(rHex.length / 2 + sHex.length / 2 + 4);
        return `30${length}02${rLen}${rHex}02${sLen}${sHex}`;
    }
    toRawBytes() {
        return this.toDERRawBytes();
    }
    toHex() {
        return this.toDERHex();
    }
    toCompactRawBytes() {
        return hexToBytes(this.toCompactHex());
    }
    toCompactHex() {
        return numTo32bStr(this.r) + numTo32bStr(this.s);
    }
}
function concatBytes(...arrays) {
    if (!arrays.every(isUint8a))
        throw new Error('Uint8Array list expected');
    if (arrays.length === 1)
        return arrays[0];
    const length = arrays.reduce((a, arr) => a + arr.length, 0);
    const result = new Uint8Array(length);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
    }
    return result;
}
function isUint8a(bytes) {
    return bytes instanceof Uint8Array;
}
const hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
function bytesToHex(uint8a) {
    if (!(uint8a instanceof Uint8Array))
        throw new Error('Expected Uint8Array');
    let hex = '';
    for (let i = 0; i < uint8a.length; i++) {
        hex += hexes[uint8a[i]];
    }
    return hex;
}
function numTo32bStr(num) {
    if (num > POW_2_256)
        throw new Error('Expected number < 2^256');
    return num.toString(16).padStart(64, '0');
}
function numTo32b(num) {
    return hexToBytes(numTo32bStr(num));
}
function numberToHexUnpadded(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber(hex) {
    if (typeof hex !== 'string') {
        throw new TypeError('hexToNumber: expected string, got ' + typeof hex);
    }
    return BigInt(`0x${hex}`);
}
function hexToBytes(hex) {
    if (typeof hex !== 'string') {
        throw new TypeError('hexToBytes: expected string, got ' + typeof hex);
    }
    if (hex.length % 2)
        throw new Error('hexToBytes: received invalid unpadded hex' + hex.length);
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error('Invalid byte sequence');
        array[i] = byte;
    }
    return array;
}
function bytesToNumber(bytes) {
    return hexToNumber(bytesToHex(bytes));
}
function ensureBytes(hex) {
    return hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes(hex);
}
function normalizeScalar(num) {
    if (typeof num === 'number' && Number.isSafeInteger(num) && num > 0)
        return BigInt(num);
    if (typeof num === 'bigint' && isWithinCurveOrder(num))
        return num;
    throw new TypeError('Expected valid private scalar: 0 < scalar < curve.n');
}
function mod(a, b = CURVE.P) {
    const result = a % b;
    return result >= _0n ? result : b + result;
}
function pow2(x, power) {
    const { P } = CURVE;
    let res = x;
    while (power-- > _0n) {
        res *= res;
        res %= P;
    }
    return res;
}
function sqrtMod(x) {
    const { P } = CURVE;
    const _6n = BigInt(6);
    const _11n = BigInt(11);
    const _22n = BigInt(22);
    const _23n = BigInt(23);
    const _44n = BigInt(44);
    const _88n = BigInt(88);
    const b2 = (x * x * x) % P;
    const b3 = (b2 * b2 * x) % P;
    const b6 = (pow2(b3, _3n) * b3) % P;
    const b9 = (pow2(b6, _3n) * b3) % P;
    const b11 = (pow2(b9, _2n) * b2) % P;
    const b22 = (pow2(b11, _11n) * b11) % P;
    const b44 = (pow2(b22, _22n) * b22) % P;
    const b88 = (pow2(b44, _44n) * b44) % P;
    const b176 = (pow2(b88, _88n) * b88) % P;
    const b220 = (pow2(b176, _44n) * b44) % P;
    const b223 = (pow2(b220, _3n) * b3) % P;
    const t1 = (pow2(b223, _23n) * b22) % P;
    const t2 = (pow2(t1, _6n) * b2) % P;
    return pow2(t2, _2n);
}
function invert(number, modulo = CURVE.P) {
    if (number === _0n || modulo <= _0n) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
    }
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n, u = _1n;
    while (a !== _0n) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        b = a, a = r, x = u, u = m;
    }
    const gcd = b;
    if (gcd !== _1n)
        throw new Error('invert: does not exist');
    return mod(x, modulo);
}
function invertBatch(nums, p = CURVE.P) {
    const scratch = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
        if (num === _0n)
            return acc;
        scratch[i] = acc;
        return mod(acc * num, p);
    }, _1n);
    const inverted = invert(lastMultiplied, p);
    nums.reduceRight((acc, num, i) => {
        if (num === _0n)
            return acc;
        scratch[i] = mod(acc * scratch[i], p);
        return mod(acc * num, p);
    }, inverted);
    return scratch;
}
const divNearest = (a, b) => (a + b / _2n) / b;
const POW_2_128 = _2n ** BigInt(128);
function splitScalarEndo(k) {
    const { n } = CURVE;
    const a1 = BigInt('0x3086d221a7d46bcde86c90e49284eb15');
    const b1 = -_1n * BigInt('0xe4437ed6010e88286f547fa90abfe4c3');
    const a2 = BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8');
    const b2 = a1;
    const c1 = divNearest(b2 * k, n);
    const c2 = divNearest(-b1 * k, n);
    let k1 = mod(k - c1 * a1 - c2 * a2, n);
    let k2 = mod(-c1 * b1 - c2 * b2, n);
    const k1neg = k1 > POW_2_128;
    const k2neg = k2 > POW_2_128;
    if (k1neg)
        k1 = n - k1;
    if (k2neg)
        k2 = n - k2;
    if (k1 > POW_2_128 || k2 > POW_2_128) {
        throw new Error('splitScalarEndo: Endomorphism failed, k=' + k);
    }
    return { k1neg, k1, k2neg, k2 };
}
function truncateHash(hash) {
    const { n } = CURVE;
    const byteLength = hash.length;
    const delta = byteLength * 8 - 256;
    let h = bytesToNumber(hash);
    if (delta > 0)
        h = h >> BigInt(delta);
    if (h >= n)
        h -= n;
    return h;
}
class HmacDrbg {
    constructor() {
        this.v = new Uint8Array(32).fill(1);
        this.k = new Uint8Array(32).fill(0);
        this.counter = 0;
    }
    hmac(...values) {
        return utils.hmacSha256(this.k, ...values);
    }
    hmacSync(...values) {
        if (typeof utils.hmacSha256Sync !== 'function')
            throw new Error('utils.hmacSha256Sync is undefined, you need to set it');
        const res = utils.hmacSha256Sync(this.k, ...values);
        if (res instanceof Promise)
            throw new Error('To use sync sign(), ensure utils.hmacSha256 is sync');
        return res;
    }
    incr() {
        if (this.counter >= 1000) {
            throw new Error('Tried 1,000 k values for sign(), all were invalid');
        }
        this.counter += 1;
    }
    async reseed(seed = new Uint8Array()) {
        this.k = await this.hmac(this.v, Uint8Array.from([0x00]), seed);
        this.v = await this.hmac(this.v);
        if (seed.length === 0)
            return;
        this.k = await this.hmac(this.v, Uint8Array.from([0x01]), seed);
        this.v = await this.hmac(this.v);
    }
    reseedSync(seed = new Uint8Array()) {
        this.k = this.hmacSync(this.v, Uint8Array.from([0x00]), seed);
        this.v = this.hmacSync(this.v);
        if (seed.length === 0)
            return;
        this.k = this.hmacSync(this.v, Uint8Array.from([0x01]), seed);
        this.v = this.hmacSync(this.v);
    }
    async generate() {
        this.incr();
        this.v = await this.hmac(this.v);
        return this.v;
    }
    generateSync() {
        this.incr();
        this.v = this.hmacSync(this.v);
        return this.v;
    }
}
function isWithinCurveOrder(num) {
    return _0n < num && num < CURVE.n;
}
function isValidFieldElement(num) {
    return _0n < num && num < CURVE.P;
}
function kmdToSig(kBytes, m, d) {
    const k = bytesToNumber(kBytes);
    if (!isWithinCurveOrder(k))
        return;
    const { n } = CURVE;
    const q = Point.BASE.multiply(k);
    const r = mod(q.x, n);
    if (r === _0n)
        return;
    const s = mod(invert(k, n) * mod(m + d * r, n), n);
    if (s === _0n)
        return;
    const sig = new Signature(r, s);
    const recovery = (q.x === sig.r ? 0 : 2) | Number(q.y & _1n);
    return { sig, recovery };
}
function normalizePrivateKey(key) {
    let num;
    if (typeof key === 'bigint') {
        num = key;
    }
    else if (typeof key === 'number' && Number.isSafeInteger(key) && key > 0) {
        num = BigInt(key);
    }
    else if (typeof key === 'string') {
        if (key.length !== 64)
            throw new Error('Expected 32 bytes of private key');
        num = hexToNumber(key);
    }
    else if (isUint8a(key)) {
        if (key.length !== 32)
            throw new Error('Expected 32 bytes of private key');
        num = bytesToNumber(key);
    }
    else {
        throw new TypeError('Expected valid private key');
    }
    if (!isWithinCurveOrder(num))
        throw new Error('Expected private key: 0 < key < n');
    return num;
}
function normalizePublicKey(publicKey) {
    if (publicKey instanceof Point) {
        publicKey.assertValidity();
        return publicKey;
    }
    else {
        return Point.fromHex(publicKey);
    }
}
function normalizeSignature(signature) {
    if (signature instanceof Signature) {
        signature.assertValidity();
        return signature;
    }
    try {
        return Signature.fromDER(signature);
    }
    catch (error) {
        return Signature.fromCompact(signature);
    }
}
function getPublicKey(privateKey, isCompressed = false) {
    return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
}
function recoverPublicKey(msgHash, signature, recovery, isCompressed = false) {
    return Point.fromSignature(msgHash, signature, recovery).toRawBytes(isCompressed);
}
function isPub(item) {
    const arr = isUint8a(item);
    const str = typeof item === 'string';
    const len = (arr || str) && item.length;
    if (arr)
        return len === 33 || len === 65;
    if (str)
        return len === 66 || len === 130;
    if (item instanceof Point)
        return true;
    return false;
}
function getSharedSecret(privateA, publicB, isCompressed = false) {
    if (isPub(privateA))
        throw new TypeError('getSharedSecret: first arg must be private key');
    if (!isPub(publicB))
        throw new TypeError('getSharedSecret: second arg must be public key');
    const b = normalizePublicKey(publicB);
    b.assertValidity();
    return b.multiply(normalizePrivateKey(privateA)).toRawBytes(isCompressed);
}
function bits2int(bytes) {
    const slice = bytes.length > 32 ? bytes.slice(0, 32) : bytes;
    return bytesToNumber(slice);
}
function bits2octets(bytes) {
    const z1 = bits2int(bytes);
    const z2 = mod(z1, CURVE.n);
    return int2octets(z2 < _0n ? z1 : z2);
}
function int2octets(num) {
    if (typeof num !== 'bigint')
        throw new Error('Expected bigint');
    const hex = numTo32bStr(num);
    return hexToBytes(hex);
}
function initSigArgs(msgHash, privateKey, extraEntropy) {
    if (msgHash == null)
        throw new Error(`sign: expected valid message hash, not "${msgHash}"`);
    const h1 = ensureBytes(msgHash);
    const d = normalizePrivateKey(privateKey);
    const seedArgs = [int2octets(d), bits2octets(h1)];
    if (extraEntropy != null) {
        if (extraEntropy === true)
            extraEntropy = utils.randomBytes(32);
        const e = ensureBytes(extraEntropy);
        if (e.length !== 32)
            throw new Error('sign: Expected 32 bytes of extra data');
        seedArgs.push(e);
    }
    const seed = concatBytes(...seedArgs);
    const m = bits2int(h1);
    return { seed, m, d };
}
function finalizeSig(recSig, opts) {
    let { sig, recovery } = recSig;
    const { canonical, der, recovered } = Object.assign({ canonical: true, der: true }, opts);
    if (canonical && sig.hasHighS()) {
        sig = sig.normalizeS();
        recovery ^= 1;
    }
    const hashed = der ? sig.toDERRawBytes() : sig.toCompactRawBytes();
    return recovered ? [hashed, recovery] : hashed;
}
function signSync(msgHash, privKey, opts = {}) {
    const { seed, m, d } = initSigArgs(msgHash, privKey, opts.extraEntropy);
    let sig;
    const drbg = new HmacDrbg();
    drbg.reseedSync(seed);
    while (!(sig = kmdToSig(drbg.generateSync(), m, d)))
        drbg.reseedSync();
    return finalizeSig(sig, opts);
}
Point.BASE._setWindowSize(8);
const crypto = {
    node: nodeCrypto,
    web: typeof self === 'object' && 'crypto' in self ? self.crypto : undefined,
};
const utils = {
    isValidPrivateKey(privateKey) {
        try {
            normalizePrivateKey(privateKey);
            return true;
        }
        catch (error) {
            return false;
        }
    },
    hashToPrivateKey: (hash) => {
        hash = ensureBytes(hash);
        if (hash.length < 40 || hash.length > 1024)
            throw new Error('Expected 40-1024 bytes of private key as per FIPS 186');
        const num = mod(bytesToNumber(hash), CURVE.n);
        if (num === _0n || num === _1n)
            throw new Error('Invalid private key');
        return numTo32b(num);
    },
    randomBytes: (bytesLength = 32) => {
        if (crypto.web) {
            return crypto.web.getRandomValues(new Uint8Array(bytesLength));
        }
        else {
            throw new Error("The environment doesn't have randomBytes function");
        }
    },
    randomPrivateKey: () => {
        return utils.hashToPrivateKey(utils.randomBytes(40));
    },
    bytesToHex,
    mod,
    sha256: async (message) => {
        if (crypto.web) {
            const buffer = await crypto.web.subtle.digest('SHA-256', message.buffer);
            return new Uint8Array(buffer);
        }
        else {
            throw new Error("The environment doesn't have sha256 function");
        }
    },
    hmacSha256: async (key, ...messages) => {
        if (crypto.web) {
            const ckey = await crypto.web.subtle.importKey('raw', key, { name: 'HMAC', hash: { name: 'SHA-256' } }, false, ['sign']);
            const message = concatBytes(...messages);
            const buffer = await crypto.web.subtle.sign('HMAC', ckey, message);
            return new Uint8Array(buffer);
        }
        else {
            throw new Error("The environment doesn't have hmac-sha256 function");
        }
    },
    sha256Sync: undefined,
    hmacSha256Sync: undefined,
    precompute(windowSize = 8, point = Point.BASE) {
        const cached = point === Point.BASE ? point : new Point(point.x, point.y);
        cached._setWindowSize(windowSize);
        cached.multiply(_3n);
        return cached;
    },
};

var __classPrivateFieldSet$m = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$m = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SigningKey_privateKey;
// Make noble-secp256k1 sync
utils.hmacSha256Sync = function (key, ...messages) {
    return arrayify(computeHmac("sha256", key, concat(messages)));
};
class SigningKey {
    constructor(privateKey) {
        _SigningKey_privateKey.set(this, void 0);
        logger$4.assertArgument((dataLength(privateKey) === 32), "invalid private key length", "privateKey", "[REDACTED]");
        __classPrivateFieldSet$m(this, _SigningKey_privateKey, hexlify(privateKey), "f");
    }
    get privateKey() { return __classPrivateFieldGet$m(this, _SigningKey_privateKey, "f"); }
    get publicKey() { return SigningKey.computePublicKey(__classPrivateFieldGet$m(this, _SigningKey_privateKey, "f")); }
    get compressedPublicKey() { return SigningKey.computePublicKey(__classPrivateFieldGet$m(this, _SigningKey_privateKey, "f"), true); }
    sign(digest) {
        logger$4.assertArgument((dataLength(digest) === 32), "invalid digest length", "digest", digest);
        const [sigDer, recid] = signSync(arrayify(digest), arrayify(__classPrivateFieldGet$m(this, _SigningKey_privateKey, "f")), {
            recovered: true,
            canonical: true
        });
        const sig = Signature.fromHex(sigDer);
        return Signature$1.from({
            r: toHex("0x" + sig.r.toString(16), 32),
            s: toHex("0x" + sig.s.toString(16), 32),
            v: (recid ? 0x1c : 0x1b)
        }).freeze();
    }
    computeShardSecret(other) {
        const pubKey = SigningKey.computePublicKey(other);
        return hexlify(getSharedSecret(arrayify(__classPrivateFieldGet$m(this, _SigningKey_privateKey, "f")), pubKey));
    }
    static computePublicKey(key, compressed) {
        let bytes = logger$4.getBytes(key, "key");
        if (bytes.length === 32) {
            const pubKey = getPublicKey(bytes, !!compressed);
            return hexlify(pubKey);
        }
        if (bytes.length === 64) {
            const pub = new Uint8Array(65);
            pub[0] = 0x04;
            pub.set(bytes, 1);
            bytes = pub;
        }
        const point = Point.fromHex(bytes);
        return hexlify(point.toRawBytes(compressed));
    }
    static recoverPublicKey(digest, signature) {
        const sig = Signature$1.from(signature);
        const der = Signature.fromCompact(arrayify(concat([sig.r, sig.s]))).toDERRawBytes();
        const pubKey = recoverPublicKey(arrayify(digest), der, sig.yParity);
        if (pubKey != null) {
            return hexlify(pubKey);
        }
        return logger$4.throwArgumentError("invalid signautre for digest", "signature", signature);
    }
    static _addPoints(p0, p1, compressed) {
        const pub0 = Point.fromHex(SigningKey.computePublicKey(p0).substring(2));
        const pub1 = Point.fromHex(SigningKey.computePublicKey(p1).substring(2));
        return "0x" + pub0.add(pub1).toHex(!!compressed);
    }
}
_SigningKey_privateKey = new WeakMap();
/*
const key = new SigningKey("0x1234567890123456789012345678901234567890123456789012345678901234");
console.log(key);
console.log(key.sign("0x1234567890123456789012345678901234567890123456789012345678901234"));
{
  const privKey = "0x1234567812345678123456781234567812345678123456781234567812345678";
  const signingKey = new SigningKey(privKey);
  console.log("0", signingKey, signingKey.publicKey, signingKey.publicKeyCompressed);

  let pubKey = SigningKey.computePublicKey(privKey);
  let pubKeyComp = SigningKey.computePublicKey(privKey, true);
  let pubKeyRaw = "0x" + SigningKey.computePublicKey(privKey).substring(4);
  console.log("A", pubKey, pubKeyComp);

  let a = SigningKey.computePublicKey(pubKey);
  let b = SigningKey.computePublicKey(pubKey, true);
  console.log("B", a, b);

  a = SigningKey.computePublicKey(pubKeyComp);
  b = SigningKey.computePublicKey(pubKeyComp, true);
  console.log("C", a, b);

  a = SigningKey.computePublicKey(pubKeyRaw);
  b = SigningKey.computePublicKey(pubKeyRaw, true);
  console.log("D", a, b);

  const digest = "0x1122334411223344112233441122334411223344112233441122334411223344";
  const sig = signingKey.sign(digest);
  console.log("SS", sig, sig.r, sig.s, sig.yParity);

  console.log("R", SigningKey.recoverPublicKey(digest, sig));
}
*/

function accessSetify(addr, storageKeys) {
    return {
        address: getAddress(addr),
        storageKeys: (storageKeys || []).map((storageKey, index) => {
            if (dataLength(storageKey) !== 32) {
                //logger.throwArgumentError("invalid access list storageKey", `accessList[${ addr }>
                throw new Error("");
            }
            return storageKey.toLowerCase();
        })
    };
}
function accessListify(value) {
    if (Array.isArray(value)) {
        return value.map((set, index) => {
            if (Array.isArray(set)) {
                if (set.length > 2) {
                    //logger.throwArgumentError("access list expected to be [ address, storageKeys[>
                    throw new Error("");
                }
                return accessSetify(set[0], set[1]);
            }
            return accessSetify(set.address, set.storageKeys);
        });
    }
    const result = Object.keys(value).map((addr) => {
        const storageKeys = value[addr].reduce((accum, storageKey) => {
            accum[storageKey] = true;
            return accum;
        }, {});
        return accessSetify(addr, Object.keys(storageKeys).sort());
    });
    result.sort((a, b) => (a.address.localeCompare(b.address)));
    return result;
}

function computeAddress(key) {
    const publicKey = SigningKey.computePublicKey(key, false);
    return getAddress(keccak256("0x" + publicKey.substring(4)).substring(26));
}
function recoverAddress(digest, signature) {
    return computeAddress(SigningKey.recoverPublicKey(digest, signature));
}

const version$4 = "@ethersproject/transaction@6.0.0-beta.2";

const logger$3 = new Logger(version$4);

var __classPrivateFieldSet$l = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$l = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Transaction_props;
const BN_0 = BigInt(0);
const BN_2$2 = BigInt(2);
const BN_27 = BigInt(27);
const BN_28 = BigInt(28);
const BN_35 = BigInt(35);
const BN_MAX_UINT = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
function handleAddress(value) {
    if (value === "0x") {
        return null;
    }
    return getAddress(value);
}
function handleData(value, param) {
    try {
        return hexlify(value);
    }
    catch (error) {
        return logger$3.throwArgumentError("invalid data", param, value);
    }
}
function handleAccessList(value, param) {
    try {
        return accessListify(value);
    }
    catch (error) {
        return logger$3.throwArgumentError("invalid accessList", param, value);
    }
}
function handleNumber(_value, param) {
    if (_value === "0x") {
        return 0;
    }
    return logger$3.getNumber(_value, param);
}
function handleUint(_value, param) {
    if (_value === "0x") {
        return BN_0;
    }
    const value = logger$3.getBigInt(_value, param);
    if (value > BN_MAX_UINT) {
        logger$3.throwArgumentError("value exceeds uint size", param, value);
    }
    return value;
}
function formatNumber(_value, name) {
    const value = logger$3.getBigInt(_value, "value");
    const result = toArray(value);
    if (result.length > 32) {
        logger$3.throwArgumentError(`value too large`, `tx.${name}`, value);
    }
    return result;
}
function formatAccessList(value) {
    return accessListify(value).map((set) => [set.address, set.storageKeys]);
}
function _parseLegacy(data) {
    const fields = decodeRlp(data);
    if (!Array.isArray(fields) || (fields.length !== 9 && fields.length !== 6)) {
        return logger$3.throwArgumentError("invalid field count for legacy transaction", "data", data);
    }
    const tx = {
        type: 0,
        nonce: handleNumber(fields[0], "nonce"),
        gasPrice: handleUint(fields[1], "gasPrice"),
        gasLimit: handleUint(fields[2], "gasLimit"),
        to: handleAddress(fields[3]),
        value: handleUint(fields[4], "value"),
        data: handleData(fields[5], "dta"),
        chainId: BN_0
    };
    // Legacy unsigned transaction
    if (fields.length === 6) {
        return tx;
    }
    const v = handleUint(fields[6], "v");
    const r = handleUint(fields[7], "r");
    const s = handleUint(fields[8], "s");
    if (r === BN_0 && s === BN_0) {
        // EIP-155 unsigned transaction
        tx.chainId = v;
    }
    else {
        // Compute the EIP-155 chain ID (or 0 for legacy)
        let chainId = (v - BN_35) / BN_2$2;
        if (chainId < BN_0) {
            chainId = BN_0;
        }
        tx.chainId = chainId;
        // Signed Legacy Transaction
        if (chainId === BN_0 && (v < BN_27 || v > BN_28)) {
            logger$3.throwArgumentError("non-canonical legacy v", "v", fields[6]);
        }
        tx.signature = Signature$1.from({
            r: zeroPadValue(fields[7], 32),
            s: zeroPadValue(fields[8], 32),
            v
        });
        tx.hash = keccak256(data);
    }
    return tx;
}
function _serializeLegacy(tx, sig) {
    const fields = [
        formatNumber(tx.nonce || 0, "nonce"),
        formatNumber(tx.gasPrice || 0, "gasPrice"),
        formatNumber(tx.gasLimit || 0, "gasLimit"),
        ((tx.to != null) ? getAddress(tx.to) : "0x"),
        formatNumber(tx.value || 0, "value"),
        (tx.data || "0x"),
    ];
    let chainId = BN_0;
    if (tx.chainId != null) {
        // A chainId was provided; if non-zero we'll use EIP-155
        chainId = logger$3.getBigInt(tx.chainId, "tx.chainId");
        // We have a chainId in the tx and an EIP-155 v in the signature,
        // make sure they agree with each other
        if (sig && sig.networkV != null && sig.legacyChainId !== chainId) {
            logger$3.throwArgumentError("tx.chainId/sig.v mismatch", "sig", sig);
        }
    }
    else if (sig) {
        // No chainId provided, but the signature is signing with EIP-155; derive chainId
        const legacy = sig.legacyChainId;
        if (legacy != null) {
            chainId = legacy;
        }
    }
    // Requesting an unsigned transaction
    if (!sig) {
        // We have an EIP-155 transaction (chainId was specified and non-zero)
        if (chainId !== BN_0) {
            fields.push(toArray(chainId));
            fields.push("0x");
            fields.push("0x");
        }
        return encodeRlp(fields);
    }
    // We pushed a chainId and null r, s on for hashing only; remove those
    let v = BigInt(27 + sig.yParity);
    if (chainId !== BN_0) {
        v = Signature$1.getChainIdV(chainId, sig.v);
    }
    else if (BigInt(sig.v) !== v) {
        logger$3.throwArgumentError("tx.chainId/sig.v mismatch", "sig", sig);
    }
    fields.push(toArray(v));
    fields.push(toArray(sig.r));
    fields.push(toArray(sig.s));
    return encodeRlp(fields);
}
function _parseEipSignature(tx, fields, serialize) {
    let yParity;
    try {
        yParity = handleNumber(fields[0], "yParity");
        if (yParity !== 0 && yParity !== 1) {
            throw new Error("bad yParity");
        }
    }
    catch (error) {
        return logger$3.throwArgumentError("invalid yParity", "yParity", fields[0]);
    }
    const r = zeroPadValue(fields[1], 32);
    const s = zeroPadValue(fields[2], 32);
    const signature = Signature$1.from({ r, s, yParity });
    tx.signature = signature;
}
function _parseEip1559(data) {
    const fields = decodeRlp(logger$3.getBytes(data).slice(1));
    if (!Array.isArray(fields) || (fields.length !== 9 && fields.length !== 12)) {
        logger$3.throwArgumentError("invalid field count for transaction type: 2", "data", hexlify(data));
    }
    const maxPriorityFeePerGas = handleUint(fields[2], "maxPriorityFeePerGas");
    const maxFeePerGas = handleUint(fields[3], "maxFeePerGas");
    const tx = {
        type: 2,
        chainId: handleUint(fields[0], "chainId"),
        nonce: handleNumber(fields[1], "nonce"),
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        maxFeePerGas: maxFeePerGas,
        gasPrice: null,
        gasLimit: handleUint(fields[4], "gasLimit"),
        to: handleAddress(fields[5]),
        value: handleUint(fields[6], "value"),
        data: handleData(fields[7], "data"),
        accessList: handleAccessList(fields[8], "accessList"),
    };
    // Unsigned EIP-1559 Transaction
    if (fields.length === 9) {
        return tx;
    }
    tx.hash = keccak256(data);
    _parseEipSignature(tx, fields.slice(9));
    return tx;
}
function _serializeEip1559(tx, sig) {
    const fields = [
        formatNumber(tx.chainId || 0, "chainId"),
        formatNumber(tx.nonce || 0, "nonce"),
        formatNumber(tx.maxPriorityFeePerGas || 0, "maxPriorityFeePerGas"),
        formatNumber(tx.maxFeePerGas || 0, "maxFeePerGas"),
        formatNumber(tx.gasLimit || 0, "gasLimit"),
        ((tx.to != null) ? getAddress(tx.to) : "0x"),
        formatNumber(tx.value || 0, "value"),
        (tx.data || "0x"),
        (formatAccessList(tx.accessList || []))
    ];
    if (sig) {
        fields.push(formatNumber(sig.yParity, "yParity"));
        fields.push(toArray(sig.r));
        fields.push(toArray(sig.s));
    }
    return concat(["0x02", encodeRlp(fields)]);
}
function _parseEip2930(data) {
    const fields = decodeRlp(logger$3.getBytes(data).slice(1));
    if (!Array.isArray(fields) || (fields.length !== 8 && fields.length !== 11)) {
        logger$3.throwArgumentError("invalid field count for transaction type: 1", "data", hexlify(data));
    }
    const tx = {
        type: 1,
        chainId: handleUint(fields[0], "chainId"),
        nonce: handleNumber(fields[1], "nonce"),
        gasPrice: handleUint(fields[2], "gasPrice"),
        gasLimit: handleUint(fields[3], "gasLimit"),
        to: handleAddress(fields[4]),
        value: handleUint(fields[5], "value"),
        data: handleData(fields[6], "data"),
        accessList: handleAccessList(fields[7], "accessList")
    };
    // Unsigned EIP-2930 Transaction
    if (fields.length === 8) {
        return tx;
    }
    tx.hash = keccak256(data);
    _parseEipSignature(tx, fields.slice(8));
    return tx;
}
function _serializeEip2930(tx, sig) {
    const fields = [
        formatNumber(tx.chainId || 0, "chainId"),
        formatNumber(tx.nonce || 0, "nonce"),
        formatNumber(tx.gasPrice || 0, "gasPrice"),
        formatNumber(tx.gasLimit || 0, "gasLimit"),
        ((tx.to != null) ? getAddress(tx.to) : "0x"),
        formatNumber(tx.value || 0, "value"),
        (tx.data || "0x"),
        (formatAccessList(tx.accessList || []))
    ];
    if (sig) {
        fields.push(formatNumber(sig.yParity, "recoveryParam"));
        fields.push(toArray(sig.r));
        fields.push(toArray(sig.s));
    }
    return concat(["0x01", encodeRlp(fields)]);
}
class Transaction {
    constructor() {
        _Transaction_props.set(this, void 0);
        __classPrivateFieldSet$l(this, _Transaction_props, {
            type: null,
            to: null,
            nonce: 0,
            gasLimit: BigInt(0),
            gasPrice: null,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
            data: "0x",
            value: BigInt(0),
            chainId: BigInt(0),
            sig: null,
            accessList: null
        }, "f");
    }
    // A type of null indicates the type will be populated automatically
    get type() { return getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "type"); }
    get typeName() {
        switch (this.type) {
            case 0: return "legacy";
            case 1: return "eip-2930";
            case 2: return "eip-1559";
        }
        return null;
    }
    set type(value) {
        switch (value) {
            case null:
                setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "type", null);
                break;
            case 0:
            case "legacy":
                setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "type", 0);
                break;
            case 1:
            case "berlin":
            case "eip-2930":
                setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "type", 1);
                break;
            case 2:
            case "london":
            case "eip-1559":
                setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "type", 2);
                break;
            default:
                throw new Error(`unsupported transaction type`);
        }
    }
    get to() { return getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "to"); }
    set to(value) {
        setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "to", (value == null) ? null : getAddress(value));
    }
    get nonce() { return getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "nonce"); }
    set nonce(value) { setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "nonce", logger$3.getNumber(value, "value")); }
    get gasLimit() { return getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "gasLimit"); }
    set gasLimit(value) { setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "gasLimit", logger$3.getBigInt(value)); }
    get gasPrice() {
        const value = getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "gasPrice");
        if (value == null && (this.type === 0 || this.type === 1)) {
            return BN_0;
        }
        return value;
    }
    set gasPrice(value) {
        setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "gasPrice", (value == null) ? null : logger$3.getBigInt(value, "gasPrice"));
    }
    get maxPriorityFeePerGas() {
        const value = getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "maxPriorityFeePerGas");
        if (value == null && this.type === 2) {
            return BN_0;
        }
        return value;
    }
    set maxPriorityFeePerGas(value) {
        setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "maxPriorityFeePerGas", (value == null) ? null : logger$3.getBigInt(value, "maxPriorityFeePerGas"));
    }
    get maxFeePerGas() {
        const value = getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "maxFeePerGas");
        if (value == null && this.type === 2) {
            return BN_0;
        }
        return value;
    }
    set maxFeePerGas(value) {
        setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "maxFeePerGas", (value == null) ? null : logger$3.getBigInt(value, "maxFeePerGas"));
    }
    get data() { return getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "data"); }
    set data(value) { setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "data", hexlify(value)); }
    get value() { return getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "value"); }
    set value(value) {
        setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "value", logger$3.getBigInt(value, "value"));
    }
    get chainId() { return getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "chainId"); }
    set chainId(value) { setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "chainId", logger$3.getBigInt(value)); }
    get signature() { return getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "sig") || null; }
    set signature(value) {
        setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "sig", (value == null) ? null : Signature$1.from(value));
    }
    get accessList() {
        const value = getStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "accessList") || null;
        if (value == null && (this.type === 1 || this.type === 2)) {
            return [];
        }
        return value;
    }
    set accessList(value) {
        setStore(__classPrivateFieldGet$l(this, _Transaction_props, "f"), "accessList", (value == null) ? null : accessListify(value));
    }
    get hash() {
        if (this.signature == null) {
            throw new Error("cannot hash unsigned transaction; maybe you meant .unsignedHash");
        }
        return keccak256(this.serialized);
    }
    get unsignedHash() {
        return keccak256(this.unsignedSerialized);
    }
    get from() {
        if (this.signature == null) {
            return null;
        }
        return recoverAddress(this.unsignedSerialized, this.signature);
    }
    get fromPublicKey() {
        if (this.signature == null) {
            return null;
        }
        // use ecrecover
        return "";
    }
    isSigned() {
        return this.signature != null;
    }
    get serialized() {
        if (this.signature == null) {
            throw new Error("cannot serialize unsigned transaction; maybe you meant .unsignedSerialized");
        }
        const types = this.inferTypes();
        if (types.length !== 1) {
            throw new Error("cannot determine transaction type; specify type manually");
        }
        switch (types[0]) {
            case 0:
                return _serializeLegacy(this, this.signature);
            case 1:
                return _serializeEip2930(this, this.signature);
            case 2:
                return _serializeEip1559(this, this.signature);
        }
        throw new Error("unsupported type");
    }
    get unsignedSerialized() {
        const types = this.inferTypes();
        if (types.length !== 1) {
            throw new Error("cannot determine transaction type; specify type manually");
        }
        switch (types[0]) {
            case 0:
                return _serializeLegacy(this);
            case 1:
                return _serializeEip2930(this);
            case 2:
                return _serializeEip1559(this);
        }
        throw new Error("unsupported type");
    }
    // Validates properties and lists possible types this transaction adheres to
    inferTypes() {
        // Checks that there are no conflicting properties set
        const hasGasPrice = this.gasPrice != null;
        const hasFee = (this.maxFeePerGas != null || this.maxPriorityFeePerGas != null);
        const hasAccessList = (this.accessList != null);
        //if (hasGasPrice && hasFee) {
        //    throw new Error("transaction cannot have gasPrice and maxFeePerGas");
        //}
        if (this.maxFeePerGas != null && this.maxPriorityFeePerGas != null) {
            if (this.maxFeePerGas < this.maxPriorityFeePerGas) {
                throw new Error("priorityFee cannot be more than maxFee");
            }
        }
        //if (this.type === 2 && hasGasPrice) {
        //    throw new Error("eip-1559 transaction cannot have gasPrice");
        //}
        if ((this.type === 0 || this.type === 1) && hasFee) {
            throw new Error("transaction type cannot have maxFeePerGas or maxPriorityFeePerGas");
        }
        if (this.type === 0 && hasAccessList) {
            throw new Error("legacy transaction cannot have accessList");
        }
        const types = [];
        // Explicit type
        if (this.type != null) {
            types.push(this.type);
        }
        else {
            if (hasFee) {
                types.push(2);
            }
            else if (hasGasPrice) {
                types.push(1);
                if (!hasAccessList) {
                    types.push(0);
                }
            }
            else if (hasAccessList) {
                types.push(1);
                types.push(2);
            }
            else {
                types.push(0);
                types.push(1);
                types.push(2);
            }
        }
        types.sort();
        return types;
    }
    isLegacy() { return (this.type === 0); }
    isBerlin() { return (this.type === 1); }
    isLondon() { return (this.type === 2); }
    clone() {
        return Transaction.from(this);
    }
    freeze() {
        if (__classPrivateFieldGet$l(this, _Transaction_props, "f").sig) {
            __classPrivateFieldGet$l(this, _Transaction_props, "f").sig = (__classPrivateFieldGet$l(this, _Transaction_props, "f").sig.clone().freeze());
        }
        if (__classPrivateFieldGet$l(this, _Transaction_props, "f").accessList) {
            __classPrivateFieldGet$l(this, _Transaction_props, "f").accessList = Object.freeze(__classPrivateFieldGet$l(this, _Transaction_props, "f").accessList.map((set) => {
                Object.freeze(set.storageKeys);
                return Object.freeze(set);
            }));
        }
        Object.freeze(__classPrivateFieldGet$l(this, _Transaction_props, "f"));
        return this;
    }
    isFrozen() {
        return Object.isFrozen(__classPrivateFieldGet$l(this, _Transaction_props, "f"));
    }
    static from(tx) {
        if (typeof (tx) === "string") {
            const payload = arrayify(tx);
            if (payload[0] >= 0x7f) { // @TODO: > vs >= ??
                return Transaction.from(_parseLegacy(payload));
            }
            switch (payload[0]) {
                case 1: return Transaction.from(_parseEip2930(payload));
                case 2: return Transaction.from(_parseEip1559(payload));
            }
            throw new Error("unsupported transaction type");
        }
        const result = new Transaction();
        if (tx.type != null) {
            result.type = tx.type;
        }
        if (tx.to != null) {
            result.to = tx.to;
        }
        if (tx.nonce != null) {
            result.nonce = tx.nonce;
        }
        if (tx.gasLimit != null) {
            result.gasLimit = tx.gasLimit;
        }
        if (tx.gasPrice != null) {
            result.gasPrice = tx.gasPrice;
        }
        if (tx.maxPriorityFeePerGas != null) {
            result.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
        }
        if (tx.maxFeePerGas != null) {
            result.maxFeePerGas = tx.maxFeePerGas;
        }
        if (tx.data != null) {
            result.data = tx.data;
        }
        if (tx.value != null) {
            result.value = tx.value;
        }
        if (tx.chainId != null) {
            result.chainId = tx.chainId;
        }
        if (tx.signature != null) {
            result.signature = Signature$1.from(tx.signature);
        }
        if (tx.accessList != null) {
            result.accessList = tx.accessList;
        }
        if (tx.hash != null) {
            if (result.isSigned()) {
                if (result.hash !== tx.hash) {
                    throw new Error("hash mismatch");
                }
            }
            else {
                throw new Error("unsigned transaction cannot have a hashs");
            }
        }
        if (tx.from != null) {
            if (result.isSigned()) {
                if (result.from.toLowerCase() !== (tx.from || "").toLowerCase()) {
                    throw new Error("from mismatch");
                }
            }
            else {
                throw new Error("unsigned transaction cannot have a from");
            }
        }
        return result;
    }
}
_Transaction_props = new WeakMap();

var __classPrivateFieldSet$k = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$k = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Block_transactions, _TransactionReceipt_logs;
// -----------------------
function getValue(value) {
    if (value == null) {
        return null;
    }
    return value;
}
function toJson(value) {
    if (value == null) {
        return null;
    }
    return value.toString();
}
// @TODO? <T extends FeeData = { }> implements Required<T>
class FeeData {
    constructor(gasPrice, maxFeePerGas, maxPriorityFeePerGas) {
        defineProperties(this, {
            gasPrice: getValue(gasPrice),
            maxFeePerGas: getValue(maxFeePerGas),
            maxPriorityFeePerGas: getValue(maxPriorityFeePerGas)
        });
    }
    toJSON() {
        const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = this;
        return {
            _type: "FeeData",
            gasPrice: toJson(gasPrice),
            maxFeePerGas: toJson(maxFeePerGas),
            maxPriorityFeePerGas: toJson(maxPriorityFeePerGas),
        };
    }
}
function copyRequest$1(req) {
    const result = {};
    // These could be addresses, ENS names or Addressables
    if (req.to) {
        result.to = req.to;
    }
    if (req.from) {
        result.from = req.from;
    }
    if (req.data) {
        result.data = hexlify(req.data);
    }
    const bigIntKeys = "chainId,gasLimit,gasPrice,maxFeePerGas, maxPriorityFeePerGas,value".split(/,/);
    for (const key in bigIntKeys) {
        if (!(key in req) || req[key] == null) {
            continue;
        }
        result[key] = logger$5.getBigInt(req[key], `request.${key}`);
    }
    const numberKeys = "type,nonce".split(/,/);
    for (const key in numberKeys) {
        if (!(key in req) || req[key] == null) {
            continue;
        }
        result[key] = logger$5.getNumber(req[key], `request.${key}`);
    }
    if (req.accessList) {
        result.accessList = accessListify(req.accessList);
    }
    if ("blockTag" in req) {
        result.blockTag = req.blockTag;
    }
    if ("enableCcipRead" in req) {
        result.enableCcipReadEnabled = !!req.enableCcipRead;
    }
    if ("customData" in req) {
        result.customData = req.customData;
    }
    return result;
}
class Block {
    constructor(block, provider) {
        _Block_transactions.set(this, void 0);
        if (provider == null) {
            provider = dummyProvider;
        }
        __classPrivateFieldSet$k(this, _Block_transactions, Object.freeze(block.transactions.map((tx) => {
            if (typeof (tx) !== "string" && tx.provider !== provider) {
                throw new Error("provider mismatch");
            }
            return tx;
        })), "f");
        defineProperties(this, {
            provider,
            hash: getValue(block.hash),
            number: block.number,
            timestamp: block.timestamp,
            parentHash: block.parentHash,
            nonce: block.nonce,
            difficulty: block.difficulty,
            gasLimit: block.gasLimit,
            gasUsed: block.gasUsed,
            miner: block.miner,
            extraData: block.extraData,
            baseFeePerGas: getValue(block.baseFeePerGas)
        });
    }
    get transactions() { return __classPrivateFieldGet$k(this, _Block_transactions, "f"); }
    //connect(provider: Provider): Block<T> {
    //    return new Block(this, provider);
    //}
    toJSON() {
        const { baseFeePerGas, difficulty, extraData, gasLimit, gasUsed, hash, miner, nonce, number, parentHash, timestamp, transactions } = this;
        return {
            _type: "Block",
            baseFeePerGas: toJson(baseFeePerGas),
            difficulty: toJson(difficulty),
            extraData,
            gasLimit: toJson(gasLimit),
            gasUsed: toJson(gasUsed),
            hash, miner, nonce, number, parentHash, timestamp,
            transactions,
        };
    }
    [(_Block_transactions = new WeakMap(), Symbol.iterator)]() {
        let index = 0;
        return {
            next: () => {
                if (index < this.length) {
                    return {
                        value: this.transactions[index++], done: false
                    };
                }
                return { value: undefined, done: true };
            }
        };
    }
    get length() { return this.transactions.length; }
    get date() {
        if (this.timestamp == null) {
            return null;
        }
        return new Date(this.timestamp * 1000);
    }
    async getTransaction(index) {
        const tx = this.transactions[index];
        if (tx == null) {
            throw new Error("no such tx");
        }
        if (typeof (tx) === "string") {
            return (await this.provider.getTransaction(tx));
        }
        else {
            return tx;
        }
    }
    isMined() { return !!this.hash; }
    isLondon() { return !!this.baseFeePerGas; }
    orphanedEvent() {
        if (!this.isMined()) {
            throw new Error("");
        }
        return createOrphanedBlockFilter(this);
    }
}
class Log {
    constructor(log, provider) {
        if (provider == null) {
            provider = dummyProvider;
        }
        this.provider = provider;
        const topics = Object.freeze(log.topics.slice());
        defineProperties(this, {
            transactionHash: log.transactionHash,
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            removed: log.removed,
            address: log.address,
            data: log.data,
            topics,
            index: log.index,
            transactionIndex: log.transactionIndex,
        });
    }
    //connect(provider: Provider): Log {
    //    return new Log(this, provider);
    //}
    toJSON() {
        const { address, blockHash, blockNumber, data, index, removed, topics, transactionHash, transactionIndex } = this;
        return {
            _type: "log",
            address, blockHash, blockNumber, data, index,
            removed, topics, transactionHash, transactionIndex
        };
    }
    async getBlock() {
        return (await this.provider.getBlock(this.blockHash));
    }
    async getTransaction() {
        return (await this.provider.getTransaction(this.transactionHash));
    }
    async getTransactionReceipt() {
        return (await this.provider.getTransactionReceipt(this.transactionHash));
    }
    removedEvent() {
        return createRemovedLogFilter(this);
    }
}
class TransactionReceipt {
    constructor(tx, provider) {
        _TransactionReceipt_logs.set(this, void 0);
        if (provider == null) {
            provider = dummyProvider;
        }
        __classPrivateFieldSet$k(this, _TransactionReceipt_logs, Object.freeze(tx.logs.map((log) => {
            if (provider !== log.provider) {
                //return log.connect(provider);
                throw new Error("provider mismatch");
            }
            return log;
        })), "f");
        defineProperties(this, {
            provider,
            to: tx.to,
            from: tx.from,
            contractAddress: tx.contractAddress,
            hash: tx.hash,
            index: tx.index,
            blockHash: tx.blockHash,
            blockNumber: tx.blockNumber,
            logsBloom: tx.logsBloom,
            gasUsed: tx.gasUsed,
            cumulativeGasUsed: tx.cumulativeGasUsed,
            gasPrice: (tx.effectiveGasPrice || tx.gasPrice),
            byzantium: tx.byzantium,
            status: tx.status,
            root: tx.root
        });
    }
    get logs() { return __classPrivateFieldGet$k(this, _TransactionReceipt_logs, "f"); }
    //connect(provider: Provider): TransactionReceipt {
    //    return new TransactionReceipt(this, provider);
    //}
    toJSON() {
        const { to, from, contractAddress, hash, index, blockHash, blockNumber, logsBloom, logs, byzantium, status, root } = this;
        return {
            _type: "TransactionReceipt",
            blockHash, blockNumber, byzantium, contractAddress,
            cumulativeGasUsed: toJson(this.cumulativeGasUsed),
            from,
            gasPrice: toJson(this.gasPrice),
            gasUsed: toJson(this.gasUsed),
            hash, index, logs, logsBloom, root, status, to
        };
    }
    get length() { return this.logs.length; }
    [(_TransactionReceipt_logs = new WeakMap(), Symbol.iterator)]() {
        let index = 0;
        return {
            next: () => {
                if (index < this.length) {
                    return { value: this.logs[index++], done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
    get fee() {
        return this.gasUsed * this.gasPrice;
    }
    async getBlock() {
        const block = await this.provider.getBlock(this.blockHash);
        if (block == null) {
            throw new Error("TODO");
        }
        return block;
    }
    async getTransaction() {
        const tx = await this.provider.getTransaction(this.hash);
        if (tx == null) {
            throw new Error("TODO");
        }
        return tx;
    }
    async confirmations() {
        return (await this.provider.getBlockNumber()) - this.blockNumber + 1;
    }
    removedEvent() {
        return createRemovedTransactionFilter(this);
    }
    reorderedEvent(other) {
        if (other && !other.isMined()) {
            return logger$5.throwError("unmined 'other' transction cannot be orphaned", "UNSUPPORTED_OPERATION", {
                operation: "reorderedEvent(other)"
            });
        }
        return createReorderedTransactionFilter(this, other);
    }
}
class TransactionResponse {
    constructor(tx, provider) {
        if (provider == null) {
            provider = dummyProvider;
        }
        this.provider = provider;
        this.blockNumber = (tx.blockNumber != null) ? tx.blockNumber : null;
        this.blockHash = (tx.blockHash != null) ? tx.blockHash : null;
        this.hash = tx.hash;
        this.index = tx.index;
        this.type = tx.type;
        this.from = tx.from;
        this.to = tx.to || null;
        this.gasLimit = tx.gasLimit;
        this.nonce = tx.nonce;
        this.data = tx.data;
        this.value = tx.value;
        this.gasPrice = tx.gasPrice;
        this.maxPriorityFeePerGas = (tx.maxPriorityFeePerGas != null) ? tx.maxPriorityFeePerGas : null;
        this.maxFeePerGas = (tx.maxFeePerGas != null) ? tx.maxFeePerGas : null;
        this.chainId = tx.chainId;
        this.signature = tx.signature;
        this.accessList = (tx.accessList != null) ? tx.accessList : null;
    }
    //connect(provider: Provider): TransactionResponse {
    //    return new TransactionResponse(this, provider);
    //}
    toJSON() {
        const { blockNumber, blockHash, index, hash, type, to, from, nonce, data, signature, accessList } = this;
        return {
            _type: "TransactionReceipt",
            accessList, blockNumber, blockHash,
            chainId: toJson(this.chainId),
            data, from,
            gasLimit: toJson(this.gasLimit),
            gasPrice: toJson(this.gasPrice),
            hash,
            maxFeePerGas: toJson(this.maxFeePerGas),
            maxPriorityFeePerGas: toJson(this.maxPriorityFeePerGas),
            nonce, signature, to, index, type,
            value: toJson(this.value),
        };
    }
    async getBlock() {
        let blockNumber = this.blockNumber;
        if (blockNumber == null) {
            const tx = await this.getTransaction();
            if (tx) {
                blockNumber = tx.blockNumber;
            }
        }
        if (blockNumber == null) {
            return null;
        }
        const block = this.provider.getBlock(blockNumber);
        if (block == null) {
            throw new Error("TODO");
        }
        return block;
    }
    async getTransaction() {
        return this.provider.getTransaction(this.hash);
    }
    async wait(confirms) {
        return this.provider.waitForTransaction(this.hash, confirms);
    }
    isMined() {
        return (this.blockHash != null);
    }
    isLegacy() {
        return (this.type === 0);
    }
    isBerlin() {
        return (this.type === 1);
    }
    isLondon() {
        return (this.type === 2);
    }
    removedEvent() {
        if (!this.isMined()) {
            return logger$5.throwError("unmined transaction canot be orphaned", "UNSUPPORTED_OPERATION", {
                operation: "removeEvent()"
            });
        }
        return createRemovedTransactionFilter(this);
    }
    reorderedEvent(other) {
        if (!this.isMined()) {
            return logger$5.throwError("unmined transaction canot be orphaned", "UNSUPPORTED_OPERATION", {
                operation: "removeEvent()"
            });
        }
        if (other && !other.isMined()) {
            return logger$5.throwError("unmined 'other' transaction canot be orphaned", "UNSUPPORTED_OPERATION", {
                operation: "removeEvent()"
            });
        }
        return createReorderedTransactionFilter(this, other);
    }
}
function createOrphanedBlockFilter(block) {
    return { orphan: "drop-block", hash: block.hash, number: block.number };
}
function createReorderedTransactionFilter(tx, other) {
    return { orphan: "reorder-transaction", tx, other };
}
function createRemovedTransactionFilter(tx) {
    return { orphan: "drop-transaction", tx };
}
function createRemovedLogFilter(log) {
    return { orphan: "drop-log", log: {
            transactionHash: log.transactionHash,
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            address: log.address,
            data: log.data,
            topics: Object.freeze(log.topics.slice()),
            index: log.index
        } };
}
function fail() {
    throw new Error("this provider should not be used");
}
class DummyProvider {
    get provider() { return this; }
    async getNetwork() { return fail(); }
    async getFeeData() { return fail(); }
    async estimateGas(tx) { return fail(); }
    async call(tx) { return fail(); }
    async resolveName(name) { return fail(); }
    // State
    async getBlockNumber() { return fail(); }
    // Account
    async getBalanceOf(address, blockTag) {
        return fail();
    }
    async getTransactionCountOf(address, blockTag) {
        return fail();
    }
    async getCode(address, blockTag) {
        return fail();
    }
    async getStorageAt(address, position, blockTag) {
        return fail();
    }
    // Write
    async broadcastTransaction(signedTx) { return fail(); }
    // Queries
    async getBlock(blockHashOrBlockTag) {
        return fail();
    }
    async getBlockWithTransactions(blockHashOrBlockTag) {
        return fail();
    }
    async getTransaction(hash) {
        return fail();
    }
    async getTransactionReceipt(hash) {
        return fail();
    }
    // Bloom-filter Queries
    async getLogs(filter) {
        return fail();
    }
    // ENS
    async lookupAddress(address) {
        return fail();
    }
    async waitForTransaction(hash, confirms, timeout) {
        return fail();
    }
    async waitForBlock(blockTag) {
        return fail();
    }
    // EventEmitterable
    async on(event, listener) { return fail(); }
    async once(event, listener) { return fail(); }
    async emit(event, ...args) { return fail(); }
    async listenerCount(event) { return fail(); }
    async listeners(event) { return fail(); }
    async off(event, listener) { return fail(); }
    async removeAllListeners(event) { return fail(); }
    async addListener(event, listener) { return fail(); }
    async removeListener(event, listener) { return fail(); }
}
// A singleton provider instance that can be used as a placeholder. This
// allows API that have a Provider added later to not require a null check.
const dummyProvider = new DummyProvider();

// Belongs to Networks; requires abstract-provider
// provider requires abstract-provider and network
var __classPrivateFieldSet$j = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$j = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Formatter_format, _Formatter_baseBlock;
const BN_MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
//export type AccessListSet = { address: string, storageKeys: Array<string> };
//export type AccessList = Array<AccessListSet>;
//export type AccessListish = AccessList |
//                            Array<[ string, Array<string> ]> |
//                            Record<string, Array<string>>;
function stringify(value) {
    if (typeof (value) !== "string") {
        throw new Error("invalid string");
    }
    return value;
}
class Formatter {
    constructor() {
        _Formatter_format.set(this, void 0);
        _Formatter_baseBlock.set(this, void 0);
        const address = this.address.bind(this);
        const bigNumber = this.bigNumber.bind(this);
        const blockTag = this.blockTag.bind(this);
        const data = this.data.bind(this);
        const hash = this.hash.bind(this);
        const number = this.number.bind(this);
        const uint256 = this.uint256.bind(this);
        const topics = this.arrayOf(hash);
        __classPrivateFieldSet$j(this, _Formatter_format, {
            address,
            bigNumber,
            blockTag,
            data,
            hash,
            number,
            uint256,
            topics,
            filter: this.object({
                fromBlock: this.allowNull(blockTag, undefined),
                toBlock: this.allowNull(blockTag, undefined),
                blockHash: this.allowNull(hash, undefined),
                address: this.allowNull(address, undefined),
                topics: this.allowNull(topics, undefined)
            }),
            transactionRequest: this.object({
                from: this.allowNull(address),
                type: this.allowNull(number),
                to: this.allowNull(address),
                nonce: this.allowNull(number),
                gasLimit: this.allowNull(uint256),
                gasPrice: this.allowNull(uint256),
                maxFeePerGas: this.allowNull(uint256),
                maxPriorityFeePerGas: this.allowNull(uint256),
                data: this.allowNull(data),
                value: this.allowNull(uint256),
            }),
            transactionResponse: this.object({
                hash: hash,
                index: number,
                type: this.allowNull(number, 0),
                // These can be null for pending blocks
                blockHash: this.allowNull(hash),
                blockNumber: this.allowNull(number),
                // For Legacy transactions, this comes from the v
                chainId: this.allowNull(number),
                from: address,
                to: this.address,
                gasLimit: bigNumber,
                gasPrice: this.allowNull(bigNumber),
                maxFeePerGas: this.allowNull(bigNumber),
                maxPriorityFeePerGas: this.allowNull(bigNumber),
                value: bigNumber,
                data: data,
                nonce: number,
                r: hash,
                s: hash,
                v: number,
                accessList: this.allowNull(this.accessList)
            }, {
                index: ["transactionIndex"]
            }),
        }, "f");
        __classPrivateFieldSet$j(this, _Formatter_baseBlock, this.object({
            number: number,
            hash: this.allowNull(hash, null),
            timestamp: number,
            parentHash: hash,
            nonce: this.allowNull(stringify, "0x0000000000000000"),
            difficulty: bigNumber,
            gasLimit: bigNumber,
            gasUsed: bigNumber,
            miner: this.allowNull(address, "0x0000000000000000000000000000000000000000"),
            extraData: stringify,
            baseFeePerGas: this.allowNull(bigNumber),
        }), "f");
    }
    // An address
    address(value) {
        return getAddress(value);
    }
    // An address from a call result; may be zero-padded
    callAddress(value) {
        if (dataLength(value) !== 32 || dataSlice(value, 0, 12) !== "0x000000000000000000000000") {
            logger$5.throwArgumentError("invalid call address", "value", value);
        }
        return this.address(dataSlice(value, 12));
    }
    // An address from a transaction (e.g. { from: string, nonce: number })
    contractAddress(value) {
        return getCreateAddress({
            from: this.address(value.from),
            nonce: logger$5.getNumber(value.nonce, "value.nonce")
        });
    }
    // Block Tag
    blockTag(value) {
        if (value == null) {
            return "latest";
        }
        switch (value) {
            case "earliest":
                return "0x0";
            case "latest":
            case "pending":
                return value;
        }
        if (typeof (value) === "number" || (isHexString(value) && dataLength(value) < 32)) {
            return quantity(value);
        }
        return logger$5.throwArgumentError("invalid blockTag", "value", value);
    }
    // Block objects
    block(value, provider) {
        const params = __classPrivateFieldGet$j(this, _Formatter_baseBlock, "f").call(this, value);
        params.transactions = value.transactions.map((t) => this.hash(t));
        return new Block(params, provider);
    }
    blockWithTransactions(value, provider) {
        throw new Error();
    }
    // Transactions
    transactionRequest(value, provider) {
        return __classPrivateFieldGet$j(this, _Formatter_format, "f").transactionRequest(value);
    }
    transactionResponse(value, provider) {
        value = Object.assign({}, value);
        // @TODO: Use the remap feature
        if (value.data == null && value.input != null) {
            value.data = value.input;
        }
        if (value.gasLimit == null && value.gas) {
            value.gasLimit = value.gas;
        }
        value = __classPrivateFieldGet$j(this, _Formatter_format, "f").transactionResponse(value);
        const sig = Signature$1.from({ r: value.r, s: value.s, v: value.v });
        value.signature = sig;
        if (value.chainId == null) {
            value.chainId = sig.legacyChainId;
        }
        return new TransactionResponse(value, provider);
    }
    // Receipts
    log(value, provider) {
        const log = this.object({
            address: this.address,
            blockHash: this.hash,
            blockNumber: this.number,
            data: this.data,
            index: this.number,
            removed: this.boolean,
            topics: this.topics,
            transactionHash: this.hash,
            transactionIndex: this.number,
        }, {
            index: ["logIndex"]
        })(value);
        return new Log(log, provider);
    }
    receipt(value, provider) {
        const receipt = this.object({
            blockHash: this.hash,
            blockNumber: this.number,
            contractAddress: this.allowNull(this.address),
            cumulativeGasUsed: this.bigNumber,
            from: this.address,
            gasUsed: this.bigNumber,
            logs: this.arrayOf((v) => (this.log(v, provider))),
            logsBloom: this.data,
            root: this.allowNull(this.data),
            status: this.allowNull(this.number),
            to: this.address,
            gasPrice: this.allowNull(this.bigNumber),
            hash: this.hash,
            index: this.number,
            type: this.allowNull(this.number, 0),
        }, {
            hash: ["transactionHash"],
            gasPrice: ["effectiveGasPrice"],
            index: ["transactionIndex"]
        })(value);
        // RSK incorrectly implemented EIP-658, so we munge things a bit here for it
        if (receipt.root != null) {
            if (receipt.root.length <= 4) {
                // Could be 0x00, 0x0, 0x01 or 0x1
                const value = parseInt(receipt.root);
                if (value === 0 || value === 1) {
                    // Make sure if both are specified, they match
                    if (receipt.status != null && receipt.status !== value) {
                        return logger$5.throwError("alt-root-status/status mismatch", "BAD_DATA", {
                            value: { root: receipt.root, status: receipt.status }
                        });
                    }
                    receipt.status = value;
                    delete receipt.root;
                }
                else {
                    return logger$5.throwError("invalid alt-root-status", "BAD_DATA", {
                        value: receipt.root
                    });
                }
            }
            else if (!isHexString(receipt.root, 32)) {
                // Must be a valid bytes32
                return logger$5.throwError("invalid receipt root hash", "BAD_DATA", {
                    value: receipt.root
                });
            }
        }
        //receipt.byzantium = (receipt.root == null);
        return new TransactionReceipt(receipt, provider);
    }
    // Fitlers
    topics(value) {
        return __classPrivateFieldGet$j(this, _Formatter_format, "f").topics(value);
    }
    filter(value) {
        return __classPrivateFieldGet$j(this, _Formatter_format, "f").filter(value);
    }
    filterLog(value) {
        console.log("ME", value);
        return null;
    }
    // Converts a serialized transaction to a TransactionResponse
    transaction(value) {
        throw new Error();
    }
    // Useful utility formatters functions, which if need be use the
    // methods within the formatter to ensure internal compatibility
    // Access List; converts an AccessListish to an AccessList
    accessList(value) {
        return accessListify(value);
    }
    // Converts falsish values to a specific value, otherwise use the formatter. Calls preserve `this`.
    allowFalsish(format, ifFalse) {
        return ((value) => {
            if (!value) {
                return ifFalse;
            }
            return format.call(this, value);
        });
    }
    // Allows null, optionally replacing it with a default value. Calls preserve `this`.
    allowNull(format, ifNull) {
        return ((value) => {
            if (value == null) {
                return ifNull;
            }
            return format.call(this, value);
        });
    }
    // Requires an Array satisfying the formatter. Calls preserves `this`.
    arrayOf(format) {
        return ((array) => {
            if (!Array.isArray(array)) {
                throw new Error("not an array");
            }
            return array.map((i) => format.call(this, i));
        });
    }
    // Requires a value which is a value BigNumber
    bigNumber(value) {
        return logger$5.getBigInt(value, "value");
    }
    uint256(value) {
        const result = this.bigNumber(value);
        if (result < 0 || result > BN_MAX_UINT256) {
            logger$5.throwArgumentError("invalid uint256", "value", value);
        }
        return result;
    }
    // Requires a value which is a value boolean or string equivalent
    boolean(value) {
        switch (value) {
            case true:
            case "true":
                return true;
            case false:
            case "false":
                return false;
        }
        return logger$5.throwArgumentError(`invalid boolean; ${JSON.stringify(value)}`, "value", value);
    }
    // Requires a value which is a valid hexstring. If dataOrLength is true,
    // the length must be even (i.e. a datahexstring) or if it is a number,
    // specifies teh number of bytes value must represent
    _hexstring(dataOrLength) {
        if (dataOrLength == null) {
            dataOrLength = false;
        }
        return (function (value) {
            if (isHexString(value, dataOrLength)) {
                return value.toLowerCase();
            }
            throw new Error("bad hexstring");
        });
    }
    data(value) {
        if (dataLength(value) == null) {
            logger$5.throwArgumentError("", "value", value);
        }
        return value;
    }
    // Requires a network-native hash
    hash(value) {
        if (dataLength(value) !== 32) {
            logger$5.throwArgumentError("", "value", value);
        }
        return __classPrivateFieldGet$j(this, _Formatter_format, "f").data(value);
    }
    // Requires a valid number, within the IEEE 754 safe range
    number(value) {
        return logger$5.getNumber(value);
    }
    // Requires an object which matches a fleet of other formatters
    // Any FormatFunc may return `undefined` to have the value omitted
    // from the result object. Calls preserve `this`.
    object(format, altNames) {
        return ((value) => {
            const result = {};
            for (const key in format) {
                let srcKey = key;
                if (altNames && key in altNames && !(srcKey in value)) {
                    for (const altKey of altNames[key]) {
                        if (altKey in value) {
                            srcKey = altKey;
                            break;
                        }
                    }
                }
                try {
                    const nv = format[key].call(this, value[srcKey]);
                    if (nv !== undefined) {
                        result[key] = nv;
                    }
                }
                catch (error) {
                    const message = (error instanceof Error) ? error.message : "not-an-error";
                    logger$5.throwError(`invalid value for value.${key} (${message})`, "BAD_DATA", { value });
                }
            }
            return result;
        });
    }
    // Requires a value which matches a network-native storage slot
    storageSlot(value) {
        return toHex(logger$5.getBigInt(value), 32);
    }
}
_Formatter_format = new WeakMap(), _Formatter_baseBlock = new WeakMap();

const EnsAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
class NetworkPlugin {
    constructor(name) {
        defineProperties(this, { name });
    }
    clone() {
        return new NetworkPlugin(this.name);
    }
    validate(network) {
        return this;
    }
}
class GasCostPlugin extends NetworkPlugin {
    constructor(effectiveBlock = 0, costs) {
        super(`org.ethers.plugins.gas-cost#${(effectiveBlock || 0)}`);
        const props = { effectiveBlock };
        function set(name, nullish) {
            let value = (costs || {})[name];
            if (value == null) {
                value = nullish;
            }
            if (typeof (value) !== "number") {
                logger$5.throwArgumentError(`invalud value for ${name}`, "costs", costs);
            }
            props[name] = value;
        }
        set("txBase", 21000);
        set("txCreate", 32000);
        set("txDataZero", 4);
        set("txDataNonzero", 16);
        set("txAccessListStorageKey", 1900);
        set("txAccessListAddress", 2400);
        defineProperties(this, props);
    }
    clone() {
        return new GasCostPlugin(this.effectiveBlock, this);
    }
}
// Networks shoudl use this plugin to specify the contract address
// and network necessary to resolve ENS names.
class EnsPlugin extends NetworkPlugin {
    constructor(address, targetNetwork) {
        super("org.ethers.plugins.ens");
        defineProperties(this, {
            address: (address || EnsAddress),
            targetNetwork: ((targetNetwork == null) ? 1 : targetNetwork)
        });
    }
    clone() {
        return new EnsPlugin(this.address, this.targetNetwork);
    }
    validate(network) {
        network.formatter.address(this.address);
        return this;
    }
}
class MaxPriorityFeePlugin extends NetworkPlugin {
    constructor(priorityFee) {
        super("org.ethers.plugins.max-priority-fee");
        defineProperties(this, {
            priorityFee: logger$5.getBigInt(priorityFee)
        });
    }
    async getPriorityFee(provider) {
        return this.priorityFee;
    }
    clone() {
        return new MaxPriorityFeePlugin(this.priorityFee);
    }
}

var __classPrivateFieldSet$i = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$i = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Network_props;
/* * * *
// Networks which operation against an L2 can use this plugin to
// specify how to access L1, for the purpose of resolving ENS,
// for example.
export class LayerOneConnectionPlugin extends NetworkPlugin {
    readonly provider!: Provider;
// @TODO: Rename to ChainAccess and allow for connecting to any chain
    constructor(provider: Provider) {
        super("org.ethers.plugins.layer-one-connection");
        defineProperties<LayerOneConnectionPlugin>(this, { provider });
    }

    clone(): LayerOneConnectionPlugin {
        return new LayerOneConnectionPlugin(this.provider);
    }
}
*/
/* * * *
export class PriceOraclePlugin extends NetworkPlugin {
    readonly address!: string;

    constructor(address: string) {
        super("org.ethers.plugins.price-oracle");
        defineProperties<PriceOraclePlugin>(this, { address });
    }

    clone(): PriceOraclePlugin {
        return new PriceOraclePlugin(this.address);
    }
}
*/
// Networks or clients with a higher need for security (such as clients
// that may automatically make CCIP requests without user interaction)
// can use this plugin to anonymize requests or intercept CCIP requests
// to notify and/or receive authorization from the user
/* * * *
export type FetchDataFunc = (req: Frozen<FetchRequest>) => Promise<FetchRequest>;
export class CcipPreflightPlugin extends NetworkPlugin {
    readonly fetchData!: FetchDataFunc;

    constructor(fetchData: FetchDataFunc) {
        super("org.ethers.plugins.ccip-preflight");
        defineProperties<CcipPreflightPlugin>(this, { fetchData });
    }

    clone(): CcipPreflightPlugin {
        return new CcipPreflightPlugin(this.fetchData);
    }
}
*/
const Networks = new Map();
const defaultFormatter = new Formatter();
class Network {
    constructor(name, _chainId, formatter) {
        _Network_props.set(this, void 0);
        const chainId = logger$5.getBigInt(_chainId);
        if (formatter == null) {
            formatter = defaultFormatter;
        }
        const plugins = new Map();
        __classPrivateFieldSet$i(this, _Network_props, { name, chainId, formatter, plugins }, "f");
    }
    toJSON() {
        return { name: this.name, chainId: this.chainId };
    }
    get name() { return getStore(__classPrivateFieldGet$i(this, _Network_props, "f"), "name"); }
    set name(value) { setStore(__classPrivateFieldGet$i(this, _Network_props, "f"), "name", value); }
    get chainId() { return getStore(__classPrivateFieldGet$i(this, _Network_props, "f"), "chainId"); }
    set chainId(value) { setStore(__classPrivateFieldGet$i(this, _Network_props, "f"), "chainId", logger$5.getBigInt(value, "chainId")); }
    get formatter() { return getStore(__classPrivateFieldGet$i(this, _Network_props, "f"), "formatter"); }
    set formatter(value) { setStore(__classPrivateFieldGet$i(this, _Network_props, "f"), "formatter", value); }
    get plugins() {
        return Array.from(__classPrivateFieldGet$i(this, _Network_props, "f").plugins.values());
    }
    attachPlugin(plugin) {
        if (this.isFrozen()) {
            throw new Error("frozen");
        }
        if (__classPrivateFieldGet$i(this, _Network_props, "f").plugins.get(plugin.name)) {
            throw new Error(`cannot replace existing plugin: ${plugin.name} `);
        }
        __classPrivateFieldGet$i(this, _Network_props, "f").plugins.set(plugin.name, plugin.validate(this));
        return this;
    }
    getPlugin(name) {
        return (__classPrivateFieldGet$i(this, _Network_props, "f").plugins.get(name)) || null;
    }
    // Gets a list of Plugins which match basename, ignoring any fragment
    getPlugins(basename) {
        return (this.plugins.filter((p) => (p.name.split("#")[0] === basename)));
    }
    clone() {
        const clone = new Network(this.name, this.chainId, this.formatter);
        this.plugins.forEach((plugin) => {
            clone.attachPlugin(plugin.clone());
        });
        return clone;
    }
    freeze() {
        Object.freeze(__classPrivateFieldGet$i(this, _Network_props, "f"));
        return this;
    }
    isFrozen() {
        return Object.isFrozen(__classPrivateFieldGet$i(this, _Network_props, "f"));
    }
    computeIntrinsicGas(tx) {
        const costs = this.getPlugin("org.ethers.gas-cost") || (new GasCostPlugin());
        let gas = costs.txBase;
        if (tx.to == null) {
            gas += costs.txCreate;
        }
        if (tx.data) {
            for (let i = 2; i < tx.data.length; i += 2) {
                if (tx.data.substring(i, i + 2) === "00") {
                    gas += costs.txDataZero;
                }
                else {
                    gas += costs.txDataNonzero;
                }
            }
        }
        if (tx.accessList) {
            const accessList = this.formatter.accessList(tx.accessList);
            for (const addr in accessList) {
                gas += costs.txAccessListAddress + costs.txAccessListStorageKey * accessList[addr].storageKeys.length;
            }
        }
        return gas;
    }
    static from(network) {
        // Default network
        if (network == null) {
            return Network.from("homestead");
        }
        // Canonical name or chain ID
        if (typeof (network) === "number") {
            network = BigInt(network);
        }
        if (typeof (network) === "string" || typeof (network) === "bigint") {
            const networkFunc = Networks.get(network);
            if (networkFunc) {
                return networkFunc();
            }
            if (typeof (network) === "bigint") {
                return new Network("unknown", network);
            }
            logger$5.throwArgumentError("unknown network", "network", network);
        }
        // Clonable with network-like abilities
        if (typeof (network.clone) === "function") {
            const clone = network.clone();
            //if (typeof(network.name) !== "string" || typeof(network.chainId) !== "number") {
            //}
            return clone;
        }
        // Networkish
        if (typeof (network) === "object") {
            if (typeof (network.name) !== "string" || typeof (network.chainId) !== "number") {
                logger$5.throwArgumentError("invalid network object name or chainId", "network", network);
            }
            const custom = new Network((network.name), (network.chainId));
            if (network.ensAddress || network.ensNetwork != null) {
                custom.attachPlugin(new EnsPlugin(network.ensAddress, network.ensNetwork));
            }
            //if ((<any>network).layerOneConnection) {
            //    custom.attachPlugin(new LayerOneConnectionPlugin((<any>network).layerOneConnection));
            //}
            return custom;
        }
        return logger$5.throwArgumentError("invalid network", "network", network);
    }
    static register(nameOrChainId, networkFunc) {
        if (typeof (nameOrChainId) === "number") {
            nameOrChainId = BigInt(nameOrChainId);
        }
        const existing = Networks.get(nameOrChainId);
        if (existing) {
            logger$5.throwArgumentError(`conflicting network for ${JSON.stringify(existing.name)}`, "nameOrChainId", nameOrChainId);
        }
        Networks.set(nameOrChainId, networkFunc);
    }
}
_Network_props = new WeakMap();

var __classPrivateFieldSet$h = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$h = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PollingBlockSubscriber_instances, _PollingBlockSubscriber_provider, _PollingBlockSubscriber_poller, _PollingBlockSubscriber_interval, _PollingBlockSubscriber_blockNumber, _PollingBlockSubscriber_poll, _OnBlockSubscriber_provider, _OnBlockSubscriber_poll, _PollingOrphanSubscriber_filter, _PollingTransactionSubscriber_hash, _PollingEventSubscriber_instances, _PollingEventSubscriber_provider, _PollingEventSubscriber_filter, _PollingEventSubscriber_poller, _PollingEventSubscriber_blockNumber, _PollingEventSubscriber_poll;
function copy$3(obj) {
    return JSON.parse(JSON.stringify(obj));
}
// @TODO: refactor this
class PollingBlockSubscriber {
    constructor(provider) {
        _PollingBlockSubscriber_instances.add(this);
        _PollingBlockSubscriber_provider.set(this, void 0);
        _PollingBlockSubscriber_poller.set(this, void 0);
        _PollingBlockSubscriber_interval.set(this, void 0);
        // The most recent block we have scanned for events. The value -2
        // indicates we still need to fetch an initial block number
        _PollingBlockSubscriber_blockNumber.set(this, void 0);
        __classPrivateFieldSet$h(this, _PollingBlockSubscriber_provider, provider, "f");
        __classPrivateFieldSet$h(this, _PollingBlockSubscriber_poller, null, "f");
        __classPrivateFieldSet$h(this, _PollingBlockSubscriber_interval, 4000, "f");
        __classPrivateFieldSet$h(this, _PollingBlockSubscriber_blockNumber, -2, "f");
    }
    get pollingInterval() { return __classPrivateFieldGet$h(this, _PollingBlockSubscriber_interval, "f"); }
    set pollingInterval(value) { __classPrivateFieldSet$h(this, _PollingBlockSubscriber_interval, value, "f"); }
    start() {
        if (__classPrivateFieldGet$h(this, _PollingBlockSubscriber_poller, "f")) {
            throw new Error("subscriber already running");
        }
        __classPrivateFieldGet$h(this, _PollingBlockSubscriber_instances, "m", _PollingBlockSubscriber_poll).call(this);
        __classPrivateFieldSet$h(this, _PollingBlockSubscriber_poller, __classPrivateFieldGet$h(this, _PollingBlockSubscriber_provider, "f")._setTimeout(__classPrivateFieldGet$h(this, _PollingBlockSubscriber_instances, "m", _PollingBlockSubscriber_poll).bind(this), __classPrivateFieldGet$h(this, _PollingBlockSubscriber_interval, "f")), "f");
    }
    stop() {
        if (!__classPrivateFieldGet$h(this, _PollingBlockSubscriber_poller, "f")) {
            throw new Error("subscriber not running");
        }
        __classPrivateFieldGet$h(this, _PollingBlockSubscriber_provider, "f")._clearTimeout(__classPrivateFieldGet$h(this, _PollingBlockSubscriber_poller, "f"));
        __classPrivateFieldSet$h(this, _PollingBlockSubscriber_poller, null, "f");
    }
    pause(dropWhilePaused) {
        this.stop();
        if (dropWhilePaused) {
            __classPrivateFieldSet$h(this, _PollingBlockSubscriber_blockNumber, -2, "f");
        }
    }
    resume() {
        this.start();
    }
}
_PollingBlockSubscriber_provider = new WeakMap(), _PollingBlockSubscriber_poller = new WeakMap(), _PollingBlockSubscriber_interval = new WeakMap(), _PollingBlockSubscriber_blockNumber = new WeakMap(), _PollingBlockSubscriber_instances = new WeakSet(), _PollingBlockSubscriber_poll = async function _PollingBlockSubscriber_poll() {
    const blockNumber = await __classPrivateFieldGet$h(this, _PollingBlockSubscriber_provider, "f").getBlockNumber();
    if (__classPrivateFieldGet$h(this, _PollingBlockSubscriber_blockNumber, "f") === -2) {
        __classPrivateFieldSet$h(this, _PollingBlockSubscriber_blockNumber, blockNumber, "f");
        return;
    }
    // @TODO: Put a cap on the maximum number of events per loop?
    if (blockNumber !== __classPrivateFieldGet$h(this, _PollingBlockSubscriber_blockNumber, "f")) {
        for (let b = __classPrivateFieldGet$h(this, _PollingBlockSubscriber_blockNumber, "f") + 1; b <= blockNumber; b++) {
            __classPrivateFieldGet$h(this, _PollingBlockSubscriber_provider, "f").emit("block", b);
        }
        __classPrivateFieldSet$h(this, _PollingBlockSubscriber_blockNumber, blockNumber, "f");
    }
    __classPrivateFieldSet$h(this, _PollingBlockSubscriber_poller, __classPrivateFieldGet$h(this, _PollingBlockSubscriber_provider, "f")._setTimeout(__classPrivateFieldGet$h(this, _PollingBlockSubscriber_instances, "m", _PollingBlockSubscriber_poll).bind(this), __classPrivateFieldGet$h(this, _PollingBlockSubscriber_interval, "f")), "f");
};
class OnBlockSubscriber {
    constructor(provider) {
        _OnBlockSubscriber_provider.set(this, void 0);
        _OnBlockSubscriber_poll.set(this, void 0);
        __classPrivateFieldSet$h(this, _OnBlockSubscriber_provider, provider, "f");
        __classPrivateFieldSet$h(this, _OnBlockSubscriber_poll, (blockNumber) => {
            this._poll(blockNumber, __classPrivateFieldGet$h(this, _OnBlockSubscriber_provider, "f"));
        }, "f");
    }
    async _poll(blockNumber, provider) {
        throw new Error("sub-classes must override this");
    }
    start() {
        __classPrivateFieldGet$h(this, _OnBlockSubscriber_poll, "f").call(this, -2);
        __classPrivateFieldGet$h(this, _OnBlockSubscriber_provider, "f").on("block", __classPrivateFieldGet$h(this, _OnBlockSubscriber_poll, "f"));
    }
    stop() {
        __classPrivateFieldGet$h(this, _OnBlockSubscriber_provider, "f").off("block", __classPrivateFieldGet$h(this, _OnBlockSubscriber_poll, "f"));
    }
    pause(dropWhilePaused) { this.stop(); }
    resume() { this.start(); }
}
_OnBlockSubscriber_provider = new WeakMap(), _OnBlockSubscriber_poll = new WeakMap();
class PollingOrphanSubscriber extends OnBlockSubscriber {
    constructor(provider, filter) {
        super(provider);
        _PollingOrphanSubscriber_filter.set(this, void 0);
        __classPrivateFieldSet$h(this, _PollingOrphanSubscriber_filter, copy$3(filter), "f");
    }
    async _poll(blockNumber, provider) {
        throw new Error("@TODO");
    }
}
_PollingOrphanSubscriber_filter = new WeakMap();
class PollingTransactionSubscriber extends OnBlockSubscriber {
    constructor(provider, hash) {
        super(provider);
        _PollingTransactionSubscriber_hash.set(this, void 0);
        __classPrivateFieldSet$h(this, _PollingTransactionSubscriber_hash, hash, "f");
    }
    async _poll(blockNumber, provider) {
        const tx = await provider.getTransactionReceipt(__classPrivateFieldGet$h(this, _PollingTransactionSubscriber_hash, "f"));
        if (tx) {
            provider.emit(__classPrivateFieldGet$h(this, _PollingTransactionSubscriber_hash, "f"), tx);
        }
    }
}
_PollingTransactionSubscriber_hash = new WeakMap();
class PollingEventSubscriber {
    constructor(provider, filter) {
        _PollingEventSubscriber_instances.add(this);
        _PollingEventSubscriber_provider.set(this, void 0);
        _PollingEventSubscriber_filter.set(this, void 0);
        _PollingEventSubscriber_poller.set(this, void 0);
        // The most recent block we have scanned for events. The value -2
        // indicates we still need to fetch an initial block number
        _PollingEventSubscriber_blockNumber.set(this, void 0);
        __classPrivateFieldSet$h(this, _PollingEventSubscriber_provider, provider, "f");
        __classPrivateFieldSet$h(this, _PollingEventSubscriber_filter, copy$3(filter), "f");
        __classPrivateFieldSet$h(this, _PollingEventSubscriber_poller, __classPrivateFieldGet$h(this, _PollingEventSubscriber_instances, "m", _PollingEventSubscriber_poll).bind(this), "f");
        __classPrivateFieldSet$h(this, _PollingEventSubscriber_blockNumber, -2, "f");
    }
    start() {
        if (__classPrivateFieldGet$h(this, _PollingEventSubscriber_blockNumber, "f") === -2) {
            __classPrivateFieldGet$h(this, _PollingEventSubscriber_provider, "f").getBlockNumber().then((blockNumber) => {
                __classPrivateFieldSet$h(this, _PollingEventSubscriber_blockNumber, blockNumber, "f");
            });
        }
        __classPrivateFieldGet$h(this, _PollingEventSubscriber_provider, "f").on("block", __classPrivateFieldGet$h(this, _PollingEventSubscriber_poller, "f"));
    }
    stop() {
        __classPrivateFieldGet$h(this, _PollingEventSubscriber_provider, "f").off("block", __classPrivateFieldGet$h(this, _PollingEventSubscriber_poller, "f"));
    }
    pause(dropWhilePaused) {
        this.stop();
        if (dropWhilePaused) {
            __classPrivateFieldSet$h(this, _PollingEventSubscriber_blockNumber, -2, "f");
        }
    }
    resume() {
        this.start();
    }
}
_PollingEventSubscriber_provider = new WeakMap(), _PollingEventSubscriber_filter = new WeakMap(), _PollingEventSubscriber_poller = new WeakMap(), _PollingEventSubscriber_blockNumber = new WeakMap(), _PollingEventSubscriber_instances = new WeakSet(), _PollingEventSubscriber_poll = async function _PollingEventSubscriber_poll(blockNumber) {
    // The initial block hasn't been determined yet
    if (__classPrivateFieldGet$h(this, _PollingEventSubscriber_blockNumber, "f") === -2) {
        return;
    }
    const filter = copy$3(__classPrivateFieldGet$h(this, _PollingEventSubscriber_filter, "f"));
    filter.fromBlock = __classPrivateFieldGet$h(this, _PollingEventSubscriber_blockNumber, "f") + 1;
    filter.toBlock = blockNumber;
    const logs = await __classPrivateFieldGet$h(this, _PollingEventSubscriber_provider, "f").getLogs(filter);
    // No logs could just mean the node has not indexed them yet,
    // so we keep a sliding window of 60 blocks to keep scanning
    if (logs.length === 0) {
        if (__classPrivateFieldGet$h(this, _PollingEventSubscriber_blockNumber, "f") < blockNumber - 60) {
            __classPrivateFieldSet$h(this, _PollingEventSubscriber_blockNumber, blockNumber - 60, "f");
        }
        return;
    }
    __classPrivateFieldSet$h(this, _PollingEventSubscriber_blockNumber, blockNumber, "f");
    for (const log of logs) {
        __classPrivateFieldGet$h(this, _PollingEventSubscriber_provider, "f").emit(__classPrivateFieldGet$h(this, _PollingEventSubscriber_filter, "f"), log);
    }
};

// @TODO
// Event coalescence
//   When we register an event with an async value (e.g. address is a Signer
//   or ENS name), we need to add it immeidately for the Event API, but also
//   need time to resolve the address. Upon resolving the address, we need to
//   migrate the listener to the static event. We also need to maintain a map
//   of Signer/ENS name to address so we can sync respond to listenerCount.
var __classPrivateFieldSet$g = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$g = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AbstractProvider_instances, _AbstractProvider_subs, _AbstractProvider_plugins, _AbstractProvider_pausedState, _AbstractProvider_networkPromise, _AbstractProvider_anyNetwork, _AbstractProvider_performCache, _AbstractProvider_nextTimer, _AbstractProvider_timers, _AbstractProvider_disableCcipRead, _AbstractProvider_perform, _AbstractProvider_call, _AbstractProvider_getBlock, _AbstractProvider_hasSub, _AbstractProvider_getSub;
// Constants
const BN_2$1 = BigInt(2);
const MAX_CCIP_REDIRECTS = 10;
function getTag(prefix, value) {
    return prefix + ":" + JSON.stringify(value, (k, v) => {
        if (typeof (v) === "bigint") {
            return `bigint:${v.toString()}`;
        }
        if (typeof (v) === "string") {
            return v.toLowerCase();
        }
        // Sort object keys
        if (typeof (v) === "object" && !Array.isArray(v)) {
            const keys = Object.keys(v);
            keys.sort();
            return keys.reduce((accum, key) => {
                accum[key] = v[key];
                return accum;
            }, {});
        }
        return v;
    });
}
class UnmanagedSubscriber {
    constructor(name) { defineProperties(this, { name }); }
    start() { }
    stop() { }
    pause(dropWhilePaused) { }
    resume() { }
}
function copy$2(value) {
    return JSON.parse(JSON.stringify(value));
}
function concisify$1(items) {
    items = Array.from((new Set(items)).values());
    items.sort();
    return items;
}
// Normalize a ProviderEvent into a Subscription
// @TODO: Make events sync if possible; like block
//function getSyncSubscription(_event: ProviderEvent): Subscription {
//}
async function getSubscription(_event, provider) {
    if (_event == null) {
        throw new Error("invalid event");
    }
    // Normalize topic array info an EventFilter
    if (Array.isArray(_event)) {
        _event = { topics: _event };
    }
    if (typeof (_event) === "string") {
        switch (_event) {
            case "block":
            case "pending":
            case "debug":
            case "network": {
                return { type: _event, tag: _event };
            }
        }
    }
    if (isHexString(_event, 32)) {
        const hash = _event.toLowerCase();
        return { type: "transaction", tag: getTag("tx", { hash }), hash };
    }
    if (_event.orphan) {
        const event = _event;
        // @TODO: Should lowercase and whatnot things here instead of copy...
        return { type: "orphan", tag: getTag("orphan", event), filter: copy$2(event) };
    }
    if ((_event.address || _event.topics)) {
        const event = _event;
        const filter = {
            topics: ((event.topics || []).map((t) => {
                if (t == null) {
                    return null;
                }
                if (Array.isArray(t)) {
                    return concisify$1(t.map((t) => t.toLowerCase()));
                }
                return t.toLowerCase();
            }))
        };
        if (event.address) {
            const addresses = [];
            const promises = [];
            const addAddress = (addr) => {
                if (isHexString(addr)) {
                    addresses.push(addr);
                }
                else {
                    promises.push((async () => {
                        addresses.push(await resolveAddress(addr, provider));
                    })());
                }
            };
            if (Array.isArray(event.address)) {
                event.address.forEach(addAddress);
            }
            else {
                addAddress(event.address);
            }
            if (promises.length) {
                await Promise.all(promises);
            }
            filter.address = concisify$1(addresses.map((a) => a.toLowerCase()));
        }
        return { filter, tag: getTag("event", filter), type: "event" };
    }
    return logger$5.throwArgumentError("unknown ProviderEvent", "event", _event);
}
function getTime$1() { return (new Date()).getTime(); }
function copyRequest(tx) {
    // @TODO: copy the copy from contracts and use it from this
    return tx;
}
class AbstractProvider {
    // @TODO: This should be a () => Promise<Network> so network can be
    // done when needed; or rely entirely on _detectNetwork?
    constructor(_network) {
        _AbstractProvider_instances.add(this);
        _AbstractProvider_subs.set(this, void 0);
        _AbstractProvider_plugins.set(this, void 0);
        // null=unpaused, true=paused+dropWhilePaused, false=paused
        _AbstractProvider_pausedState.set(this, void 0);
        _AbstractProvider_networkPromise.set(this, void 0);
        _AbstractProvider_anyNetwork.set(this, void 0);
        _AbstractProvider_performCache.set(this, void 0);
        _AbstractProvider_nextTimer.set(this, void 0);
        _AbstractProvider_timers.set(this, void 0);
        _AbstractProvider_disableCcipRead.set(this, void 0);
        if (_network === "any") {
            __classPrivateFieldSet$g(this, _AbstractProvider_anyNetwork, true, "f");
            __classPrivateFieldSet$g(this, _AbstractProvider_networkPromise, null, "f");
        }
        else if (_network) {
            const network = Network.from(_network);
            __classPrivateFieldSet$g(this, _AbstractProvider_anyNetwork, false, "f");
            __classPrivateFieldSet$g(this, _AbstractProvider_networkPromise, Promise.resolve(network), "f");
            setTimeout(() => { this.emit("network", network, null); }, 0);
        }
        else {
            __classPrivateFieldSet$g(this, _AbstractProvider_anyNetwork, false, "f");
            __classPrivateFieldSet$g(this, _AbstractProvider_networkPromise, null, "f");
        }
        __classPrivateFieldSet$g(this, _AbstractProvider_performCache, new Map(), "f");
        __classPrivateFieldSet$g(this, _AbstractProvider_subs, new Map(), "f");
        __classPrivateFieldSet$g(this, _AbstractProvider_plugins, new Map(), "f");
        __classPrivateFieldSet$g(this, _AbstractProvider_pausedState, null, "f");
        __classPrivateFieldSet$g(this, _AbstractProvider_nextTimer, 0, "f");
        __classPrivateFieldSet$g(this, _AbstractProvider_timers, new Map(), "f");
        __classPrivateFieldSet$g(this, _AbstractProvider_disableCcipRead, false, "f");
    }
    get provider() { return this; }
    get plugins() {
        return Array.from(__classPrivateFieldGet$g(this, _AbstractProvider_plugins, "f").values());
    }
    attachPlugin(plugin) {
        if (__classPrivateFieldGet$g(this, _AbstractProvider_plugins, "f").get(plugin.name)) {
            throw new Error(`cannot replace existing plugin: ${plugin.name} `);
        }
        __classPrivateFieldGet$g(this, _AbstractProvider_plugins, "f").set(plugin.name, plugin.validate(this));
        return this;
    }
    getPlugin(name) {
        return (__classPrivateFieldGet$g(this, _AbstractProvider_plugins, "f").get(name)) || null;
    }
    set disableCcipRead(value) { __classPrivateFieldSet$g(this, _AbstractProvider_disableCcipRead, !!value, "f"); }
    get disableCcipRead() { return __classPrivateFieldGet$g(this, _AbstractProvider_disableCcipRead, "f"); }
    async ccipReadFetch(tx, calldata, urls) {
        if (this.disableCcipRead || urls.length === 0 || tx.to == null) {
            return null;
        }
        const sender = tx.to.toLowerCase();
        const data = calldata.toLowerCase();
        const errorMessages = [];
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            // URL expansion
            const href = url.replace("{sender}", sender).replace("{data}", data);
            // If no {data} is present, use POST; otherwise GET
            //const json: string | null = (url.indexOf("{data}") >= 0) ? null: JSON.stringify({ data, sender });
            //const result = await fetchJson({ url: href, errorPassThrough: true }, json, (value, response) => {
            //    value.status = response.statusCode;
            //    return value;
            //});
            const request = new FetchRequest(href);
            if (url.indexOf("{data}") === -1) {
                request.body = { data, sender };
            }
            let errorMessage = "unknown error";
            const resp = await fetchData(request);
            try {
                const result = resp.bodyJson;
                if (result.data) {
                    return result.data;
                }
                if (result.message) {
                    errorMessage = result.message;
                }
            }
            catch (error) { }
            // 4xx indicates the result is not present; stop
            if (resp.statusCode >= 400 && resp.statusCode < 500) {
                return logger$5.throwError(`response not found during CCIP fetch: ${errorMessage}`, "OFFCHAIN_FAULT", {
                    reason: "404_MISSING_RESOURCE",
                    transaction: tx, info: { url, errorMessage }
                });
            }
            // 5xx indicates server issue; try the next url
            errorMessages.push(errorMessage);
        }
        return logger$5.throwError(`error encountered during CCIP fetch: ${errorMessages.map((m) => JSON.stringify(m)).join(", ")}`, "OFFCHAIN_FAULT", {
            reason: "500_SERVER_ERROR",
            transaction: tx, info: { urls, errorMessages }
        });
    }
    _wrapTransaction(tx, hash, blockNumber) {
        return tx;
    }
    _detectNetwork() {
        return logger$5.throwError("sub-classes must implement this", "UNSUPPORTED_OPERATION", {
            operation: "_detectNetwork"
        });
    }
    async _perform(req) {
        return logger$5.throwError(`unsupported method: ${req.method}`, "UNSUPPORTED_OPERATION", {
            operation: req.method,
            info: req
        });
    }
    // State
    async getBlockNumber() {
        return logger$5.getNumber(await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, { method: "getBlockNumber" }), "%response");
    }
    async _getAddress(address) {
        if (typeof (address) === "string") {
            return address;
        }
        return await address.getAddress();
    }
    async _getBlockTag(blockTag) {
        const network = await this.getNetwork();
        if (typeof (blockTag) === "number" && Number.isSafeInteger(blockTag) && blockTag < 0) {
            //let blockNumber = await this._getApproxBlockNumber(500);
            let blockNumber = await this.getBlockNumber();
            blockNumber += blockTag;
            if (blockNumber < 0) {
                blockNumber = 0;
            }
            return network.formatter.blockTag(blockNumber);
        }
        return network.formatter.blockTag(blockTag);
    }
    async getNetwork() {
        // No explicit network was set and this is our first time
        if (__classPrivateFieldGet$g(this, _AbstractProvider_networkPromise, "f") == null) {
            // Detect the current network (shared with all calls)
            const detectNetwork = this._detectNetwork().then((network) => {
                this.emit("network", network, null);
                return network;
            }, (error) => {
                // Reset the networkPromise on failure, so we will try again
                if (__classPrivateFieldGet$g(this, _AbstractProvider_networkPromise, "f") === detectNetwork) {
                    __classPrivateFieldSet$g(this, _AbstractProvider_networkPromise, null, "f");
                }
                throw error;
            });
            __classPrivateFieldSet$g(this, _AbstractProvider_networkPromise, detectNetwork, "f");
            return await detectNetwork;
        }
        const networkPromise = __classPrivateFieldGet$g(this, _AbstractProvider_networkPromise, "f");
        const [expected, actual] = await Promise.all([
            networkPromise,
            this._detectNetwork() // The actual connected network
        ]);
        if (expected.chainId !== actual.chainId) {
            if (__classPrivateFieldGet$g(this, _AbstractProvider_anyNetwork, "f")) {
                // The "any" network can change, so notify listeners
                this.emit("network", actual, expected);
                // Update the network if something else hasn't already changed it
                if (__classPrivateFieldGet$g(this, _AbstractProvider_networkPromise, "f") === networkPromise) {
                    __classPrivateFieldSet$g(this, _AbstractProvider_networkPromise, Promise.resolve(actual), "f");
                }
            }
            else {
                // Otherwise, we do not allow changes to the underlying network
                logger$5.throwError(`network changed: ${expected.chainId} => ${actual.chainId} `, "NETWORK_ERROR", {
                    event: "changed"
                });
            }
        }
        return expected.clone().freeze();
    }
    async getFeeData() {
        const { block, gasPrice } = await resolveProperties({
            block: this.getBlock("latest"),
            gasPrice: ((async () => {
                try {
                    const gasPrice = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, { method: "getGasPrice" });
                    return logger$5.getBigInt(gasPrice, "%response");
                }
                catch (error) { }
                return null;
            })())
        });
        let maxFeePerGas = null, maxPriorityFeePerGas = null;
        if (block && block.baseFeePerGas) {
            // We may want to compute this more accurately in the future,
            // using the formula "check if the base fee is correct".
            // See: https://eips.ethereum.org/EIPS/eip-1559
            maxPriorityFeePerGas = BigInt("1500000000");
            // Allow a network to override their maximum priority fee per gas
            const priorityFeePlugin = (await this.getNetwork()).getPlugin("org.ethers.plugins.max-priority-fee");
            if (priorityFeePlugin) {
                maxPriorityFeePerGas = await priorityFeePlugin.getPriorityFee(this);
            }
            maxFeePerGas = (block.baseFeePerGas * BN_2$1) + maxPriorityFeePerGas;
        }
        return new FeeData(gasPrice, maxFeePerGas, maxPriorityFeePerGas);
    }
    async _getTransaction(_request) {
        const network = await this.getNetwork();
        // Fill in any addresses
        const request = Object.assign({}, _request, await resolveProperties({
            to: (_request.to ? resolveAddress(_request.to, this) : undefined),
            from: (_request.from ? resolveAddress(_request.from, this) : undefined),
        }));
        return network.formatter.transactionRequest(request);
    }
    async estimateGas(_tx) {
        const transaction = await this._getTransaction(_tx);
        return logger$5.getBigInt(await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, {
            method: "estimateGas", transaction
        }), "%response");
    }
    async call(_tx) {
        const { tx, blockTag } = await resolveProperties({
            tx: this._getTransaction(_tx),
            blockTag: this._getBlockTag(_tx.blockTag)
        });
        return __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_call).call(this, tx, blockTag, _tx.enableCcipRead ? 0 : -1);
    }
    // Account
    async getBalanceOf(_address, _blockTag) {
        const { address, blockTag } = await resolveProperties({
            address: resolveAddress(_address),
            blockTag: this._getBlockTag(_blockTag)
        });
        return logger$5.getBigInt(await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, {
            method: "getBalance", address, blockTag
        }), "%response");
    }
    async getTransactionCountOf(_address, _blockTag) {
        const { address, blockTag } = await resolveProperties({
            address: resolveAddress(_address),
            blockTag: this._getBlockTag(_blockTag)
        });
        return logger$5.getNumber(await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, {
            method: "getTransactionCount", address, blockTag
        }), "%response");
    }
    async getCode(_address, _blockTag) {
        const { address, blockTag } = await resolveProperties({
            address: resolveAddress(_address),
            blockTag: this._getBlockTag(_blockTag)
        });
        return hexlify(await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, {
            method: "getCode", address, blockTag
        }));
    }
    async getStorageAt(_address, _position, _blockTag) {
        const position = logger$5.getBigInt(_position);
        const { address, blockTag } = await resolveProperties({
            address: resolveAddress(_address),
            blockTag: this._getBlockTag(_blockTag)
        });
        return hexlify(await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, {
            method: "getStorageAt", address, position, blockTag
        }));
    }
    // Write
    async broadcastTransaction(signedTx) {
        throw new Error();
    }
    // Queries
    async getBlock(block) {
        const format = (await this.getNetwork()).formatter;
        const params = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_getBlock).call(this, block, false);
        if (params == null) {
            return null;
        }
        return format.block(params, this);
    }
    async getBlockWithTransactions(block) {
        const format = (await this.getNetwork()).formatter;
        const params = __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_getBlock).call(this, block, true);
        if (params == null) {
            return null;
        }
        return format.blockWithTransactions(params, this);
    }
    async getTransaction(hash) {
        const format = (await this.getNetwork()).formatter;
        const params = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, { method: "getTransaction", hash });
        return format.transactionResponse(params, this);
    }
    async getTransactionReceipt(hash) {
        const format = (await this.getNetwork()).formatter;
        const receipt = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, { method: "getTransactionReceipt", hash });
        if (receipt == null) {
            return null;
        }
        // Some backends did not backfill the effectiveGasPrice into old transactions
        // in the receipt, so we look it up manually and inject it.
        if (receipt.gasPrice == null && receipt.effectiveGasPrice == null) {
            const tx = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, { method: "getTransaction", hash });
            receipt.effectiveGasPrice = tx.gasPrice;
        }
        return format.receipt(receipt, this);
    }
    async _getFilter(filter) {
        // Create a canonical representation of the topics
        const topics = (filter.topics || []).map((t) => {
            if (t == null) {
                return null;
            }
            if (Array.isArray(t)) {
                return concisify$1(t.map((t) => t.toLowerCase()));
            }
            return t.toLowerCase();
        });
        const blockHash = ("blockHash" in filter) ? filter.blockHash : undefined;
        const lookup = {};
        // Addresses could be async (ENS names or Addressables)
        if (filter.address) {
            if (Array.isArray(filter.address)) {
                lookup.address = Promise.all(filter.address.map((a) => resolveAddress(a, this)));
            }
            else {
                lookup.address = resolveAddress(filter.address, this);
            }
        }
        // Block Tags could be async (i.e. relative)
        const addBlockTag = (key) => {
            if (filter[key] == null) {
                return;
            }
            lookup[key] = this._getBlockTag(filter[key]);
        };
        addBlockTag("fromBlock");
        addBlockTag("toBlock");
        // Wait for all properties to resolve
        const result = await resolveProperties(lookup);
        // Make sure things are canonical
        if (Array.isArray(result.address)) {
            result.address.sort();
        }
        result.topics = topics;
        if (blockHash) {
            if (filter.fromBlock || filter.toBlock) {
                throw new Error("invalid filter");
            }
            result.blockHash = blockHash;
        }
        return result;
    }
    // Bloom-filter Queries
    async getLogs(_filter) {
        const { network, filter } = await resolveProperties({
            network: this.getNetwork(),
            filter: this._getFilter(_filter)
        });
        return (await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, { method: "getLogs", filter })).map((l) => {
            return network.formatter.log(l, this);
        });
    }
    // ENS
    _getProvider(chainId) {
        return logger$5.throwError("provider cannot connect to target network", "UNSUPPORTED_OPERATION", {
            operation: "_getProvider()"
        });
    }
    async getResolver(name) {
        return await EnsResolver.fromName(this, name);
    }
    async getAvatar(name) {
        const resolver = await this.getResolver(name);
        if (resolver) {
            return await resolver.getAvatar();
        }
        return null;
    }
    async resolveName(name) {
        if (typeof (name) === "string") {
            const resolver = await this.getResolver(name);
            if (resolver) {
                return await resolver.getAddress();
            }
        }
        else {
            const address = await name.getAddress();
            if (address == null) {
                return logger$5.throwArgumentError("Addressable returned no address", "name", name);
            }
            return address;
        }
        return null;
    }
    async lookupAddress(address) {
        throw new Error();
        //return "TODO";
    }
    async waitForTransaction(hash, confirms = 1, timeout) {
        if (confirms === 0) {
            return this.getTransactionReceipt(hash);
        }
        return new Promise(async (resolve, reject) => {
            let timer = null;
            const listener = (async (blockNumber) => {
                try {
                    const receipt = await this.getTransactionReceipt(hash);
                    if (receipt != null) {
                        if (blockNumber - receipt.blockNumber + 1 >= confirms) {
                            resolve(receipt);
                            this.off("block", listener);
                            if (timer) {
                                clearTimeout(timer);
                                timer = null;
                            }
                            return;
                        }
                    }
                }
                catch (error) {
                    console.log("EEE", error);
                }
                this.once("block", listener);
            });
            if (timeout != null) {
                timer = setTimeout(() => {
                    if (timer == null) {
                        return;
                    }
                    timer = null;
                    this.off("block", listener);
                    reject(logger$5.makeError("timeout", "TIMEOUT", { reason: "timeout" }));
                }, timeout);
            }
            listener(await this.getBlockNumber());
        });
    }
    async waitForBlock(blockTag) {
        throw new Error();
        //return new Block(<any><unknown>{ }, this);
    }
    _clearTimeout(timerId) {
        const timer = __classPrivateFieldGet$g(this, _AbstractProvider_timers, "f").get(timerId);
        if (!timer) {
            return;
        }
        if (timer.timer) {
            clearTimeout(timer.timer);
        }
        __classPrivateFieldGet$g(this, _AbstractProvider_timers, "f").delete(timerId);
    }
    _setTimeout(_func, timeout = 0) {
        var _a, _b;
        const timerId = (__classPrivateFieldSet$g(this, _AbstractProvider_nextTimer, (_b = __classPrivateFieldGet$g(this, _AbstractProvider_nextTimer, "f"), _a = _b++, _b), "f"), _a);
        const func = () => {
            __classPrivateFieldGet$g(this, _AbstractProvider_timers, "f").delete(timerId);
            _func();
        };
        if (this.paused) {
            __classPrivateFieldGet$g(this, _AbstractProvider_timers, "f").set(timerId, { timer: null, func, time: timeout });
        }
        else {
            const timer = setTimeout(func, timeout);
            __classPrivateFieldGet$g(this, _AbstractProvider_timers, "f").set(timerId, { timer, func, time: getTime$1() });
        }
        return timerId;
    }
    _forEachSubscriber(func) {
        for (const sub of __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f").values()) {
            func(sub.subscriber);
        }
    }
    // Event API; sub-classes should override this; any supported
    // event filter will have been munged into an EventFilter
    _getSubscriber(sub) {
        switch (sub.type) {
            case "debug":
            case "network":
                return new UnmanagedSubscriber(sub.type);
            case "block":
                return new PollingBlockSubscriber(this);
            case "event":
                return new PollingEventSubscriber(this, sub.filter);
            case "transaction":
                return new PollingTransactionSubscriber(this, sub.hash);
            case "orphan":
                return new PollingOrphanSubscriber(this, sub.filter);
        }
        throw new Error(`unsupported event: ${sub.type}`);
    }
    _recoverSubscriber(oldSub, newSub) {
        for (const sub of __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f").values()) {
            if (sub.subscriber === oldSub) {
                if (sub.started) {
                    sub.subscriber.stop();
                }
                sub.subscriber = newSub;
                if (sub.started) {
                    newSub.start();
                }
                if (__classPrivateFieldGet$g(this, _AbstractProvider_pausedState, "f") != null) {
                    newSub.pause(__classPrivateFieldGet$g(this, _AbstractProvider_pausedState, "f"));
                }
                break;
            }
        }
    }
    async on(event, listener) {
        const sub = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_getSub).call(this, event);
        sub.listeners.push({ listener, once: false });
        if (!sub.started) {
            sub.subscriber.start();
            sub.started = true;
            if (__classPrivateFieldGet$g(this, _AbstractProvider_pausedState, "f") != null) {
                sub.subscriber.pause(__classPrivateFieldGet$g(this, _AbstractProvider_pausedState, "f"));
            }
        }
        return this;
    }
    async once(event, listener) {
        const sub = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_getSub).call(this, event);
        sub.listeners.push({ listener, once: true });
        if (!sub.started) {
            sub.subscriber.start();
            sub.started = true;
            if (__classPrivateFieldGet$g(this, _AbstractProvider_pausedState, "f") != null) {
                sub.subscriber.pause(__classPrivateFieldGet$g(this, _AbstractProvider_pausedState, "f"));
            }
        }
        return this;
    }
    async emit(event, ...args) {
        const sub = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_hasSub).call(this, event, args);
        if (!sub) {
            return false;
        }
        const count = sub.listeners.length;
        sub.listeners = sub.listeners.filter(({ listener, once }) => {
            const payload = new EventPayload(this, (once ? null : listener), event);
            try {
                listener.call(this, ...args, payload);
            }
            catch (error) { }
            return !once;
        });
        return (count > 0);
    }
    async listenerCount(event) {
        if (event) {
            const sub = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_hasSub).call(this, event);
            if (!sub) {
                return 0;
            }
            return sub.listeners.length;
        }
        let total = 0;
        for (const { listeners } of __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f").values()) {
            total += listeners.length;
        }
        return total;
    }
    async listeners(event) {
        if (event) {
            const sub = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_hasSub).call(this, event);
            if (!sub) {
                return [];
            }
            return sub.listeners.map(({ listener }) => listener);
        }
        let result = [];
        for (const { listeners } of __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f").values()) {
            result = result.concat(listeners.map(({ listener }) => listener));
        }
        return result;
    }
    async off(event, listener) {
        const sub = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_hasSub).call(this, event);
        if (!sub) {
            return this;
        }
        if (listener) {
            const index = sub.listeners.map(({ listener }) => listener).indexOf(listener);
            if (index >= 0) {
                sub.listeners.splice(index, 1);
            }
        }
        if (!listener || sub.listeners.length === 0) {
            if (sub.started) {
                sub.subscriber.stop();
            }
            __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f").delete(sub.tag);
        }
        return this;
    }
    async removeAllListeners(event) {
        if (event) {
            const { tag, started, subscriber } = await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_getSub).call(this, event);
            if (started) {
                subscriber.stop();
            }
            __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f").delete(tag);
        }
        else {
            for (const [tag, { started, subscriber }] of __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f")) {
                if (started) {
                    subscriber.stop();
                }
                __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f").delete(tag);
            }
        }
        return this;
    }
    // Alias for "on"
    async addListener(event, listener) {
        return await this.on(event, listener);
    }
    // Alias for "off"
    async removeListener(event, listener) {
        return this.off(event, listener);
    }
    // Sub-classes should override this to shutdown any sockets, etc.
    // but MUST call this super.shutdown.
    async shutdown() {
        // Stop all listeners
        this.removeAllListeners();
        // Shut down all tiemrs
        for (const timerId of __classPrivateFieldGet$g(this, _AbstractProvider_timers, "f").keys()) {
            this._clearTimeout(timerId);
        }
    }
    get paused() { return (__classPrivateFieldGet$g(this, _AbstractProvider_pausedState, "f") != null); }
    pause(dropWhilePaused) {
        if (__classPrivateFieldGet$g(this, _AbstractProvider_pausedState, "f") != null) {
            if (__classPrivateFieldGet$g(this, _AbstractProvider_pausedState, "f") == !!dropWhilePaused) {
                return;
            }
            return logger$5.throwError("cannot change pause type; resume first", "UNSUPPORTED_OPERATION", {
                operation: "pause"
            });
        }
        this._forEachSubscriber((s) => s.pause(dropWhilePaused));
        __classPrivateFieldSet$g(this, _AbstractProvider_pausedState, !!dropWhilePaused, "f");
        for (const timer of __classPrivateFieldGet$g(this, _AbstractProvider_timers, "f").values()) {
            // Clear the timer
            if (timer.timer) {
                clearTimeout(timer.timer);
            }
            // Remaining time needed for when we become unpaused
            timer.time = getTime$1() - timer.time;
        }
    }
    resume() {
        if (__classPrivateFieldGet$g(this, _AbstractProvider_pausedState, "f") == null) {
            return;
        }
        this._forEachSubscriber((s) => s.resume());
        __classPrivateFieldSet$g(this, _AbstractProvider_pausedState, null, "f");
        for (const timer of __classPrivateFieldGet$g(this, _AbstractProvider_timers, "f").values()) {
            // Remaining time when we were paused
            let timeout = timer.time;
            if (timeout < 0) {
                timeout = 0;
            }
            // Start time (in cause paused, so we con compute remaininf time)
            timer.time = getTime$1();
            // Start the timer
            setTimeout(timer.func, timeout);
        }
    }
}
_AbstractProvider_subs = new WeakMap(), _AbstractProvider_plugins = new WeakMap(), _AbstractProvider_pausedState = new WeakMap(), _AbstractProvider_networkPromise = new WeakMap(), _AbstractProvider_anyNetwork = new WeakMap(), _AbstractProvider_performCache = new WeakMap(), _AbstractProvider_nextTimer = new WeakMap(), _AbstractProvider_timers = new WeakMap(), _AbstractProvider_disableCcipRead = new WeakMap(), _AbstractProvider_instances = new WeakSet(), _AbstractProvider_perform = 
// Shares multiple identical requests made during the same 250ms
async function _AbstractProvider_perform(req) {
    // Create a tag
    const tag = getTag(req.method, req);
    let perform = __classPrivateFieldGet$g(this, _AbstractProvider_performCache, "f").get(tag);
    if (!perform) {
        perform = this._perform(req);
        __classPrivateFieldGet$g(this, _AbstractProvider_performCache, "f").set(tag, perform);
        setTimeout(() => {
            if (__classPrivateFieldGet$g(this, _AbstractProvider_performCache, "f").get(tag) === perform) {
                __classPrivateFieldGet$g(this, _AbstractProvider_performCache, "f").delete(tag);
            }
        }, 250);
    }
    return await perform;
}, _AbstractProvider_call = async function _AbstractProvider_call(tx, blockTag, attempt) {
    if (attempt >= MAX_CCIP_REDIRECTS) {
        logger$5.throwError("CCIP read exceeded maximum redirections", "OFFCHAIN_FAULT", {
            reason: "TOO_MANY_REDIRECTS",
            transaction: Object.assign({}, tx, { blockTag, enableCcipRead: true })
        });
    }
    const transaction = copyRequest(tx);
    try {
        return hexlify(await this._perform({ method: "call", transaction, blockTag }));
    }
    catch (error) {
        // CCIP Read OffchainLookup
        if (!this.disableCcipRead && isCallException(error) && attempt >= 0 && blockTag === "latest" && transaction.to != null && dataSlice(error.data, 0, 4) === "0x556f1830") {
            const data = error.data;
            const txSender = await resolveAddress(transaction.to, this);
            // Parse the CCIP Read Arguments
            let ccipArgs;
            try {
                ccipArgs = parseOffchainLookup(dataSlice(error.data, 4));
            }
            catch (error) {
                return logger$5.throwError(error.message, "OFFCHAIN_FAULT", {
                    reason: "BAD_DATA",
                    transaction, info: { data }
                });
            }
            // Check the sender of the OffchainLookup matches the transaction
            if (ccipArgs.sender.toLowerCase() !== txSender.toLowerCase()) {
                return logger$5.throwError("CCIP Read sender mismatch", "CALL_EXCEPTION", {
                    data, transaction,
                    errorSignature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                    errorName: "OffchainLookup",
                    errorArgs: ccipArgs.errorArgs
                });
            }
            const ccipResult = await this.ccipReadFetch(transaction, ccipArgs.calldata, ccipArgs.urls);
            if (ccipResult == null) {
                return logger$5.throwError("CCIP Read failed to fetch data", "OFFCHAIN_FAULT", {
                    reason: "FETCH_FAILED",
                    transaction, info: { data: error.data, errorArgs: ccipArgs.errorArgs }
                });
            }
            return __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_call).call(this, {
                to: txSender,
                data: concat([
                    ccipArgs.selector, encodeBytes([ccipResult, ccipArgs.extraData])
                ]),
            }, blockTag, attempt + 1);
        }
        throw error;
    }
}, _AbstractProvider_getBlock = async function _AbstractProvider_getBlock(block, includeTransactions) {
    const format = (await this.getNetwork()).formatter;
    if (isHexString(block, 32)) {
        return await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, {
            method: "getBlock", blockHash: block, includeTransactions
        });
    }
    return await __classPrivateFieldGet$g(this, _AbstractProvider_instances, "m", _AbstractProvider_perform).call(this, {
        method: "getBlock", blockTag: format.blockTag(block), includeTransactions
    });
}, _AbstractProvider_hasSub = async function _AbstractProvider_hasSub(event, emitArgs) {
    let sub = await getSubscription(event, this);
    // This is a log that is removing an existing log; we actually want
    // to emit an orphan event for the removed log
    if (sub.type === "event" && emitArgs && emitArgs.length > 0 && emitArgs[0].removed === true) {
        sub = await getSubscription({ orphan: "drop-log", log: emitArgs[0] }, this);
    }
    return __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f").get(sub.tag) || null;
}, _AbstractProvider_getSub = async function _AbstractProvider_getSub(event) {
    const subscription = await getSubscription(event, this);
    // Prevent tampering with our tag in any subclass' _getSubscriber
    const tag = subscription.tag;
    let sub = __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f").get(tag);
    if (!sub) {
        const subscriber = this._getSubscriber(subscription);
        const addressableMap = new WeakMap();
        const nameMap = new Map();
        sub = { subscriber, tag, addressableMap, nameMap, started: false, listeners: [] };
        __classPrivateFieldGet$g(this, _AbstractProvider_subs, "f").set(tag, sub);
    }
    return sub;
};
function _parseString(result, start) {
    try {
        const bytes = _parseBytes(result, start);
        if (bytes) {
            return toUtf8String(bytes);
        }
    }
    catch (error) { }
    return null;
}
function _parseBytes(result, start) {
    if (result === "0x") {
        return null;
    }
    try {
        const offset = logger$5.getNumber(dataSlice(result, start, start + 32));
        const length = logger$5.getNumber(dataSlice(result, offset, offset + 32));
        return dataSlice(result, offset + 32, offset + 32 + length);
    }
    catch (error) { }
    return null;
}
function numPad(value) {
    const result = toArray(value);
    if (result.length > 32) {
        throw new Error("internal; should not happen");
    }
    const padded = new Uint8Array(32);
    padded.set(result, 32 - result.length);
    return padded;
}
function bytesPad(value) {
    if ((value.length % 32) === 0) {
        return value;
    }
    const result = new Uint8Array(Math.ceil(value.length / 32) * 32);
    result.set(value);
    return result;
}
const empty = new Uint8Array([]);
// ABI Encodes a series of (bytes, bytes, ...)
function encodeBytes(datas) {
    const result = [];
    let byteCount = 0;
    // Add place-holders for pointers as we add items
    for (let i = 0; i < datas.length; i++) {
        result.push(empty);
        byteCount += 32;
    }
    for (let i = 0; i < datas.length; i++) {
        const data = logger$5.getBytes(datas[i]);
        // Update the bytes offset
        result[i] = numPad(byteCount);
        // The length and padded value of data
        result.push(numPad(data.length));
        result.push(bytesPad(data));
        byteCount += 32 + Math.ceil(data.length / 32) * 32;
    }
    return concat(result);
}
const zeros = "0x0000000000000000000000000000000000000000000000000000000000000000";
function parseOffchainLookup(data) {
    const result = {
        sender: "", urls: [], calldata: "", selector: "", extraData: "", errorArgs: []
    };
    if (dataLength(data) < 5 * 32) {
        throw new Error("insufficient OffchainLookup data");
    }
    const sender = dataSlice(data, 0, 32);
    if (dataSlice(sender, 0, 12) !== dataSlice(zeros, 0, 12)) {
        throw new Error("corrupt OffchainLookup sender");
    }
    result.sender = dataSlice(sender, 12);
    // Read the URLs from the response
    try {
        const urls = [];
        const urlsOffset = logger$5.getNumber(dataSlice(data, 32, 64));
        const urlsLength = logger$5.getNumber(dataSlice(data, urlsOffset, urlsOffset + 32));
        const urlsData = dataSlice(data, urlsOffset + 32);
        for (let u = 0; u < urlsLength; u++) {
            const url = _parseString(urlsData, u * 32);
            if (url == null) {
                throw new Error("abort");
            }
            urls.push(url);
        }
        result.urls = urls;
    }
    catch (error) {
        throw new Error("corrupt OffchainLookup urls");
    }
    // Get the CCIP calldata to forward
    try {
        const calldata = _parseBytes(data, 64);
        if (calldata == null) {
            throw new Error("abort");
        }
        result.calldata = calldata;
    }
    catch (error) {
        throw new Error("corrupt OffchainLookup calldata");
    }
    // Get the callbackSelector (bytes4)
    if (dataSlice(data, 100, 128) !== dataSlice(zeros, 0, 28)) {
        throw new Error("corrupt OffchainLookup callbaackSelector");
    }
    result.selector = dataSlice(data, 96, 100);
    // Get the extra data to send back to the contract as context
    try {
        const extraData = _parseBytes(data, 128);
        if (extraData == null) {
            throw new Error("abort");
        }
        result.extraData = extraData;
    }
    catch (error) {
        throw new Error("corrupt OffchainLookup extraData");
    }
    result.errorArgs = "sender,urls,calldata,selector,extraData".split(/,/).map((k) => result[k]);
    return result;
}

var __classPrivateFieldGet$f = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet$f = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AbstractSigner_instances, _AbstractSigner_checkProvider, _AbstractSigner_fromify, _VoidSigner_instances, _VoidSigner_throwUnsupported, _WrappedSigner_signer;
class AbstractSigner {
    constructor(provider) {
        _AbstractSigner_instances.add(this);
        defineProperties(this, { provider: (provider || null) });
    }
    async getBalance(blockTag) {
        return __classPrivateFieldGet$f(this, _AbstractSigner_instances, "m", _AbstractSigner_checkProvider).call(this, "getBalance").getBalanceOf(await this.getAddress(), blockTag);
    }
    async getTransactionCount(blockTag) {
        return __classPrivateFieldGet$f(this, _AbstractSigner_instances, "m", _AbstractSigner_checkProvider).call(this, "getTransactionCount").getTransactionCountOf(await this.getAddress(), blockTag);
    }
    async estimateGas(tx) {
        return __classPrivateFieldGet$f(this, _AbstractSigner_instances, "m", _AbstractSigner_checkProvider).call(this, "estimateGas").estimateGas(await __classPrivateFieldGet$f(this, _AbstractSigner_instances, "m", _AbstractSigner_fromify).call(this, tx));
    }
    async call(tx) {
        return __classPrivateFieldGet$f(this, _AbstractSigner_instances, "m", _AbstractSigner_checkProvider).call(this, "call").call(await __classPrivateFieldGet$f(this, _AbstractSigner_instances, "m", _AbstractSigner_fromify).call(this, tx));
    }
    async populateTransaction(tx) {
        const provider = __classPrivateFieldGet$f(this, _AbstractSigner_instances, "m", _AbstractSigner_checkProvider).call(this, "populateTransaction");
        //let pop: Deferrable<TransactionRequest> = Object.assign({ }, tx);
        let pop = Object.assign({}, tx);
        if (pop.to != null) {
            pop.to = provider.resolveName(pop.to).then((to) => {
                if (to == null) {
                    return logger$5.throwArgumentError("transaction to ENS name not configured", "tx.to", pop.to);
                }
                return to;
            });
        }
        if (pop.from != null) {
            const from = pop.from;
            pop.from = Promise.all([
                this.getAddress(),
                this.resolveName(from)
            ]).then(([address, from]) => {
                if (!from || address.toLowerCase() !== from.toLowerCase()) {
                    return logger$5.throwArgumentError("transaction from mismatch", "tx.from", from);
                }
                return address;
            });
        }
        if (pop.nonce == null) {
            pop.nonce = this.getTransactionCount();
        }
        pop = resolveProperties(pop);
        if (pop.gasLimit == null) {
            pop.gasLimit = provider.estimateGas(pop);
        }
        pop = resolveProperties(pop);
        //@TODO: Copy logic from AbstractSigner in v5
        return await resolveProperties(pop);
    }
    async resolveName(name) {
        const provider = __classPrivateFieldGet$f(this, _AbstractSigner_instances, "m", _AbstractSigner_checkProvider).call(this, "resolveName");
        return await provider.resolveName(name);
    }
    async sendTransaction(tx) {
        const provider = __classPrivateFieldGet$f(this, _AbstractSigner_instances, "m", _AbstractSigner_checkProvider).call(this, "sendTransaction");
        const txObj = Transaction.from(await this.populateTransaction(tx));
        return await provider.broadcastTransaction(await this.signTransaction(txObj));
    }
}
_AbstractSigner_instances = new WeakSet(), _AbstractSigner_checkProvider = function _AbstractSigner_checkProvider(operation) {
    if (this.provider) {
        return this.provider;
    }
    return logger$5.throwError("missing provider", "UNSUPPORTED_OPERATION", { operation });
}, _AbstractSigner_fromify = async function _AbstractSigner_fromify(tx) {
    tx = Object.assign({}, tx);
    const actions = [];
    if (tx.from != null) {
        const from = tx.from;
        actions.push(Promise.all([
            this.getAddress(),
            this.resolveName(from)
        ]).then(([address, from]) => {
            if (!from || address.toLowerCase() !== from.toLowerCase()) {
                logger$5.throwArgumentError("transaction from mismatch", "tx.from", from);
            }
            tx.from = address;
        }));
    }
    await Promise.all(actions);
    return tx;
};
class VoidSigner extends AbstractSigner {
    constructor(address, provider) {
        super(provider);
        _VoidSigner_instances.add(this);
        defineProperties(this, { address });
    }
    async getAddress() { return this.address; }
    connect(provider) {
        return new VoidSigner(this.address, provider);
    }
    async signTransaction(tx) {
        __classPrivateFieldGet$f(this, _VoidSigner_instances, "m", _VoidSigner_throwUnsupported).call(this, "transactions", "signTransaction");
    }
    async signMessage(message) {
        __classPrivateFieldGet$f(this, _VoidSigner_instances, "m", _VoidSigner_throwUnsupported).call(this, "messages", "signMessage");
    }
    async signTypedData(domain, types, value) {
        __classPrivateFieldGet$f(this, _VoidSigner_instances, "m", _VoidSigner_throwUnsupported).call(this, "typed-data", "signTypedData");
    }
}
_VoidSigner_instances = new WeakSet(), _VoidSigner_throwUnsupported = function _VoidSigner_throwUnsupported(suffix, operation) {
    return logger$5.throwError(`VoidSigner cannot sign ${suffix}`, "UNSUPPORTED_OPERATION", {
        operation
    });
};
class WrappedSigner extends AbstractSigner {
    //get provider(): null | Provider { return this.#signer.provider; }
    constructor(signer) {
        super(signer.provider);
        _WrappedSigner_signer.set(this, void 0);
        __classPrivateFieldSet$f(this, _WrappedSigner_signer, signer, "f");
    }
    async getAddress() {
        return await __classPrivateFieldGet$f(this, _WrappedSigner_signer, "f").getAddress();
    }
    connect(provider) {
        return new WrappedSigner(__classPrivateFieldGet$f(this, _WrappedSigner_signer, "f").connect(provider));
    }
    async signTransaction(tx) {
        return await __classPrivateFieldGet$f(this, _WrappedSigner_signer, "f").signTransaction(tx);
    }
    async sendTransaction(tx) {
        return await __classPrivateFieldGet$f(this, _WrappedSigner_signer, "f").sendTransaction(tx);
    }
    async signMessage(message) {
        return await __classPrivateFieldGet$f(this, _WrappedSigner_signer, "f").signMessage(message);
    }
    async signTypedData(domain, types, value) {
        return await __classPrivateFieldGet$f(this, _WrappedSigner_signer, "f").signTypedData(domain, types, value);
    }
}
_WrappedSigner_signer = new WeakMap();

// Show the throttle message only once
const shown = new Set();
function showThrottleMessage(service) {
    if (shown.has(service)) {
        return;
    }
    shown.add(service);
    console.log("========= NOTICE =========");
    console.log(`Request-Rate Exceeded for ${service} (this message will not be repeated)`);
    console.log("");
    console.log("The default API keys for each service are provided as a highly-throttled,");
    console.log("community resource for low-traffic projects and early prototyping.");
    console.log("");
    console.log("While your application will continue to function, we highly recommended");
    console.log("signing up for your own API keys to improve performance, increase your");
    console.log("request rate/limit and enable other perks, such as metrics and advanced APIs.");
    console.log("");
    console.log("For more details: https:/\/docs.ethers.io/api-keys/");
    console.log("==========================");
}

var __classPrivateFieldSet$e = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$e = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FilterIdSubscriber_instances, _FilterIdSubscriber_provider, _FilterIdSubscriber_filterIdPromise, _FilterIdSubscriber_poller, _FilterIdSubscriber_network, _FilterIdSubscriber_poll, _FilterIdSubscriber_teardown, _FilterIdEventSubscriber_event;
function copy$1(obj) {
    return JSON.parse(JSON.stringify(obj));
}
class FilterIdSubscriber {
    constructor(provider) {
        _FilterIdSubscriber_instances.add(this);
        _FilterIdSubscriber_provider.set(this, void 0);
        _FilterIdSubscriber_filterIdPromise.set(this, void 0);
        _FilterIdSubscriber_poller.set(this, void 0);
        _FilterIdSubscriber_network.set(this, void 0);
        __classPrivateFieldSet$e(this, _FilterIdSubscriber_provider, provider, "f");
        __classPrivateFieldSet$e(this, _FilterIdSubscriber_filterIdPromise, null, "f");
        __classPrivateFieldSet$e(this, _FilterIdSubscriber_poller, __classPrivateFieldGet$e(this, _FilterIdSubscriber_instances, "m", _FilterIdSubscriber_poll).bind(this), "f");
        __classPrivateFieldSet$e(this, _FilterIdSubscriber_network, null, "f");
    }
    _subscribe(provider) {
        throw new Error("subclasses must override this");
    }
    _emitResults(provider, result) {
        throw new Error("subclasses must override this");
    }
    _recover(provider) {
        throw new Error("subclasses must override this");
    }
    start() { __classPrivateFieldGet$e(this, _FilterIdSubscriber_instances, "m", _FilterIdSubscriber_poll).call(this, -2); }
    stop() {
        __classPrivateFieldGet$e(this, _FilterIdSubscriber_instances, "m", _FilterIdSubscriber_teardown).call(this);
        __classPrivateFieldGet$e(this, _FilterIdSubscriber_provider, "f").off("block", __classPrivateFieldGet$e(this, _FilterIdSubscriber_poller, "f"));
    }
    pause(dropWhilePaused) {
        if (dropWhilePaused) {
            __classPrivateFieldGet$e(this, _FilterIdSubscriber_instances, "m", _FilterIdSubscriber_teardown).call(this);
        }
        __classPrivateFieldGet$e(this, _FilterIdSubscriber_provider, "f").off("block", __classPrivateFieldGet$e(this, _FilterIdSubscriber_poller, "f"));
    }
    resume() { this.start(); }
}
_FilterIdSubscriber_provider = new WeakMap(), _FilterIdSubscriber_filterIdPromise = new WeakMap(), _FilterIdSubscriber_poller = new WeakMap(), _FilterIdSubscriber_network = new WeakMap(), _FilterIdSubscriber_instances = new WeakSet(), _FilterIdSubscriber_poll = async function _FilterIdSubscriber_poll(blockNumber) {
    try {
        if (__classPrivateFieldGet$e(this, _FilterIdSubscriber_filterIdPromise, "f") == null) {
            __classPrivateFieldSet$e(this, _FilterIdSubscriber_filterIdPromise, this._subscribe(__classPrivateFieldGet$e(this, _FilterIdSubscriber_provider, "f")), "f");
        }
        const filterId = await __classPrivateFieldGet$e(this, _FilterIdSubscriber_filterIdPromise, "f");
        if (filterId == null) {
            __classPrivateFieldGet$e(this, _FilterIdSubscriber_provider, "f")._recoverSubscriber(this, this._recover(__classPrivateFieldGet$e(this, _FilterIdSubscriber_provider, "f")));
            return;
        }
        const network = await __classPrivateFieldGet$e(this, _FilterIdSubscriber_provider, "f").getNetwork();
        if (!__classPrivateFieldGet$e(this, _FilterIdSubscriber_network, "f")) {
            __classPrivateFieldSet$e(this, _FilterIdSubscriber_network, network, "f");
        }
        if (__classPrivateFieldGet$e(this, _FilterIdSubscriber_network, "f").chainId !== network.chainId) {
            throw new Error("chaid changed");
        }
        const result = await __classPrivateFieldGet$e(this, _FilterIdSubscriber_provider, "f").send("eth_getFilterChanges", [filterId]);
        await this._emitResults(__classPrivateFieldGet$e(this, _FilterIdSubscriber_provider, "f"), result);
    }
    catch (error) {
        console.log("@TODO", error);
    }
    __classPrivateFieldGet$e(this, _FilterIdSubscriber_provider, "f").once("block", __classPrivateFieldGet$e(this, _FilterIdSubscriber_poller, "f"));
}, _FilterIdSubscriber_teardown = function _FilterIdSubscriber_teardown() {
    const filterIdPromise = __classPrivateFieldGet$e(this, _FilterIdSubscriber_filterIdPromise, "f");
    if (filterIdPromise) {
        __classPrivateFieldSet$e(this, _FilterIdSubscriber_filterIdPromise, null, "f");
        filterIdPromise.then((filterId) => {
            __classPrivateFieldGet$e(this, _FilterIdSubscriber_provider, "f").send("eth_uninstallFilter", [filterId]);
        });
    }
};
class FilterIdEventSubscriber extends FilterIdSubscriber {
    constructor(provider, filter) {
        super(provider);
        _FilterIdEventSubscriber_event.set(this, void 0);
        __classPrivateFieldSet$e(this, _FilterIdEventSubscriber_event, copy$1(filter), "f");
    }
    _recover(provider) {
        return new PollingEventSubscriber(provider, __classPrivateFieldGet$e(this, _FilterIdEventSubscriber_event, "f"));
    }
    async _subscribe(provider) {
        const filterId = await provider.send("eth_newFilter", [__classPrivateFieldGet$e(this, _FilterIdEventSubscriber_event, "f")]);
        console.log("____SUB", filterId);
        return filterId;
    }
    async _emitResults(provider, results) {
        const network = await provider.getNetwork();
        for (const result of results) {
            const log = network.formatter.log(result, provider);
            provider.emit(__classPrivateFieldGet$e(this, _FilterIdEventSubscriber_event, "f"), log);
        }
    }
}
_FilterIdEventSubscriber_event = new WeakMap();
class FilterIdPendingSubscriber extends FilterIdSubscriber {
    async _subscribe(provider) {
        return await provider.send("eth_newPendingTransactionFilter", []);
    }
    async _emitResults(provider, results) {
        const network = await provider.getNetwork();
        for (const result of results) {
            provider.emit("pending", network.formatter.hash(result));
        }
    }
}

// @TODO:
// - Add the batching API
var __classPrivateFieldSet$d = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$d = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _JsonRpcApiProvider_nextId, _JsonRpcApiProvider_options, _JsonRpcProvider_connect, _JsonRpcProvider_pollingInterval;
function copy(value) {
    return JSON.parse(JSON.stringify(value));
}
const Primitive = "bigint,boolean,function,number,string,symbol".split(/,/g);
//const Methods = "getAddress,then".split(/,/g);
function deepCopy(value) {
    if (value == null || Primitive.indexOf(typeof (value)) >= 0) {
        return value;
    }
    // Keep any Addressable
    if (typeof (value.getAddress) === "function") {
        return value;
    }
    if (Array.isArray(value)) {
        return (value.map(deepCopy));
    }
    if (typeof (value) === "object") {
        return Object.keys(value).reduce((accum, key) => {
            accum[key] = value[key];
            return accum;
        }, {});
    }
    throw new Error(`should not happen: ${value} (${typeof (value)})`);
}
function getLowerCase(value) {
    if (value) {
        return value.toLowerCase();
    }
    return value;
}
function isPollable(value) {
    return (value && typeof (value.pollingInterval) === "number");
}
const defaultOptions = {
    // Default to use filter ID (the FilterIdSubscriber will
    // fallback onto polling if subscription fails)
    polling: false,
    // Maximum batch size (in bytes)
    batchMaxSize: (1 << 20),
    // How long to wait before dispatching a new batch
    batchStallTime: 250,
};
// @TODO: Unchecked Signers
class JsonRpcSigner {
    constructor(provider, address) {
        defineProperties(this, { provider, address });
    }
    connect(provider) {
        return logger$5.throwError("cannot reconnect JsonRpcSigner", "UNSUPPORTED_OPERATION", {
            operation: "signer.connect"
        });
    }
    async getAddress() {
        return this.address;
    }
    async getNetwork() {
        return await this.provider.getNetwork();
    }
    async getFeeData() {
        return await this.provider.getFeeData();
    }
    async estimateGas(tx) {
        return await this.provider.estimateGas(tx);
    }
    async call(tx) {
        return await this.provider.call(tx);
    }
    async resolveName(name) {
        return await this.provider.resolveName(name);
    }
    async getBalance(blockTag) {
        return await this.provider.getBalanceOf(this.address);
    }
    async getTransactionCount(blockTag) {
        return await this.provider.getTransactionCountOf(this.address);
    }
    // Returns just the hash of the transaction after sent, which is what
    // the bare JSON-RPC API does;
    async sendUncheckedTransaction(_tx) {
        const tx = deepCopy(_tx);
        const promises = [];
        // Make sure the from matches the sender
        if (tx.from) {
            const _from = tx.from;
            promises.push((async () => {
                const from = await resolveAddress(_from, this.provider);
                if (from == null || from.toLowerCase() !== this.address.toLowerCase()) {
                    logger$5.throwArgumentError("from address mismatch", "transaction", _tx);
                }
                tx.from = from;
            })());
        }
        else {
            tx.from = this.address;
        }
        // The JSON-RPC for eth_sendTransaction uses 90000 gas; if the user
        // wishes to use this, it is easy to specify explicitly, otherwise
        // we look it up for them.
        if (tx.gasLimit == null) {
            promises.push((async () => {
                tx.gasLimit = await this.provider.estimateGas(Object.assign(Object.assign({}, tx), { from: this.address }));
            })());
        }
        // The address may be an ENS name or Addressable
        if (tx.to != null) {
            const _to = tx.to;
            promises.push((async () => {
                tx.to = await resolveAddress(_to, this.provider);
            })());
        }
        // Wait until all of our properties are filled in
        if (promises.length) {
            await Promise.all(promises);
        }
        const hexTx = this.provider.getRpcTransaction(tx);
        return this.provider.send("eth_sendTransaction", [hexTx]);
    }
    async sendTransaction(tx) {
        // This cannot be mined any earlier than any recent block
        const blockNumber = await this.provider.getBlockNumber();
        // Send the transaction
        const hash = await this.sendUncheckedTransaction(tx);
        // Unfortunately, JSON-RPC only provides and opaque transaction hash
        // for a response, and we need the actual transaction, so we poll
        // for it; it should show up very quickly
        return await (new Promise((resolve, reject) => {
            const timeouts = [1000, 100];
            const checkTx = async () => {
                // Try getting the transaction
                const tx = await this.provider.getTransaction(hash);
                if (tx != null) {
                    resolve(this.provider._wrapTransaction(tx, hash, blockNumber));
                    return;
                }
                // Wait another 4 seconds
                this.provider._setTimeout(() => { checkTx(); }, timeouts.pop() || 4000);
            };
            checkTx();
        }));
    }
    async signTransaction(_tx) {
        const tx = deepCopy(_tx);
        // Make sure the from matches the sender
        if (tx.from) {
            const from = await resolveAddress(tx.from, this.provider);
            if (from == null || from.toLowerCase() !== this.address.toLowerCase()) {
                return logger$5.throwArgumentError("from address mismatch", "transaction", _tx);
            }
            tx.from = from;
        }
        else {
            tx.from = this.address;
        }
        const hexTx = this.provider.getRpcTransaction(tx);
        return await this.provider.send("eth_sign_Transaction", [hexTx]);
    }
    async signMessage(_message) {
        const message = ((typeof (_message) === "string") ? toUtf8Bytes(_message) : _message);
        return await this.provider.send("personal_sign", [
            hexlify(message), this.address.toLowerCase()
        ]);
    }
    async signTypedData(domain, types, _value) {
        const value = deepCopy(_value);
        // Populate any ENS names (in-place)
        const populated = await TypedDataEncoder.resolveNames(domain, types, value, async (value) => {
            const address = await resolveAddress(value);
            if (address == null) {
                return logger$5.throwArgumentError("TypedData does not support null address", "value", value);
            }
            return address;
        });
        return await this.provider.send("eth_signTypedData_v4", [
            this.address.toLowerCase(),
            JSON.stringify(TypedDataEncoder.getPayload(populated.domain, types, populated.value))
        ]);
    }
    async unlock(password) {
        return this.provider.send("personal_unlockAccount", [
            this.address.toLowerCase(), password, null
        ]);
    }
    // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
    async _legacySignMessage(_message) {
        const message = ((typeof (_message) === "string") ? toUtf8Bytes(_message) : _message);
        return await this.provider.send("eth_sign", [
            this.address.toLowerCase(), hexlify(message)
        ]);
    }
}
class JsonRpcApiProvider extends AbstractProvider {
    constructor(network) {
        super(network);
        _JsonRpcApiProvider_nextId.set(this, void 0);
        _JsonRpcApiProvider_options.set(this, void 0);
        __classPrivateFieldSet$d(this, _JsonRpcApiProvider_nextId, 1, "f");
        __classPrivateFieldSet$d(this, _JsonRpcApiProvider_options, Object.assign({}, defaultOptions), "f");
    }
    _getOptions(key) {
        return __classPrivateFieldGet$d(this, _JsonRpcApiProvider_options, "f")[key];
    }
    _setOptions(options) {
        // Validate all the options
        for (const _key in options) {
            const key = _key;
            const value = options[key];
            if (typeof (value) !== typeof (__classPrivateFieldGet$d(this, _JsonRpcApiProvider_options, "f")[key])) {
                return logger$5.throwArgumentError("invalid option value", `options.${key}`, value);
            }
        }
        // Update the values
        for (const _key in options) {
            const key = _key;
            __classPrivateFieldGet$d(this, _JsonRpcApiProvider_options, "f")[key] = (options[key]);
        }
    }
    prepareRequest(method, params) {
        var _a, _b;
        return {
            method, params, id: (__classPrivateFieldSet$d(this, _JsonRpcApiProvider_nextId, (_b = __classPrivateFieldGet$d(this, _JsonRpcApiProvider_nextId, "f"), _a = _b++, _b), "f"), _a), jsonrpc: "2.0"
        };
    }
    // Sends the payload to the backend
    //async sendPayload(payload: any): Promise<any> {
    //    throw new Error("sub-class must implement this");
    //}
    async send(method, params) {
        // @TODO: This should construct and queue the payload
        throw new Error("sub-class must implement this");
    }
    async getSigner(address = 0) {
        const network = await this.getNetwork();
        const accounts = await this.send("eth_accounts", []);
        // Account index
        if (typeof (address) === "number") {
            if (address > accounts.length) {
                throw new Error("no such account");
            }
            return new JsonRpcSigner(this, accounts[address]);
        }
        // Account address
        address = network.formatter.address(address);
        for (const account of accounts) {
            if (network.formatter.address(account) === account) {
                return new JsonRpcSigner(this, account);
            }
        }
        throw new Error("invalid account");
    }
    // Sub-classes can override this; it detects the *actual* network we
    // are connected to
    async _detectNetwork() {
        return Network.from(logger$5.getBigInt(await this._perform({ method: "chainId" })));
    }
    _getSubscriber(sub) {
        // Pending Filters aren't availble via polling
        if (sub.type === "pending") {
            return new FilterIdPendingSubscriber(this);
        }
        if (sub.type === "event") {
            return new FilterIdEventSubscriber(this, sub.filter);
        }
        // Orphaned Logs are handled automatically, by the filter, since
        // logs with removed are emitted by it
        if (sub.type === "orphan" && sub.filter.orphan === "drop-log") {
            return new UnmanagedSubscriber("orphan");
        }
        return super._getSubscriber(sub);
    }
    getRpcTransaction(tx) {
        const result = {};
        // JSON-RPC now requires numeric values to be "quantity" values
        ["chainId", "gasLimit", "gasPrice", "type", "maxFeePerGas", "maxPriorityFeePerGas", "nonce", "value"].forEach((key) => {
            if (tx[key] == null) {
                return;
            }
            let dstKey = key;
            if (key === "gasLimit") {
                dstKey = "gas";
            }
            result[dstKey] = quantity(tx[key]);
        });
        // Make sure addresses and data are lowercase
        ["from", "to", "data"].forEach((key) => {
            if (tx[key] == null) {
                return;
            }
            result[key] = hexlify(tx[key]);
        });
        // Normalize the access list object
        if (tx.accessList) {
            result["accessList"] = accessListify(tx.accessList);
        }
        return result;
    }
    getRpcRequest(req) {
        switch (req.method) {
            case "chainId":
                return { method: "eth_chainId", args: [] };
            case "getBlockNumber":
                return { method: "eth_blockNumber", args: [] };
            case "getGasPrice":
                return { method: "eth_gasPrice", args: [] };
            case "getBalance":
                return {
                    method: "eth_getBalance",
                    args: [getLowerCase(req.address), req.blockTag]
                };
            case "getTransactionCount":
                return {
                    method: "eth_getTransactionCount",
                    args: [getLowerCase(req.address), req.blockTag]
                };
            case "getCode":
                return {
                    method: "eth_getCode",
                    args: [getLowerCase(req.address), req.blockTag]
                };
            case "getStorageAt":
                return {
                    method: "eth_getStorageAt",
                    args: [
                        getLowerCase(req.address),
                        ("0x" + req.position.toString(16)),
                        req.blockTag
                    ]
                };
            case "sendTransaction":
                return {
                    method: "eth_sendRawTransaction",
                    args: [req.signedTransaction]
                };
            case "getBlock":
                if ("blockTag" in req) {
                    return {
                        method: "eth_getBlockByNumber",
                        args: [req.blockTag, !!req.includeTransactions]
                    };
                }
                else if ("blockHash" in req) {
                    return {
                        method: "eth_getBlockByHash",
                        args: [req.blockHash, !!req.includeTransactions]
                    };
                }
                break;
            case "getTransaction":
                return {
                    method: "eth_getTransactionByHash",
                    args: [req.hash]
                };
            case "getTransactionReceipt":
                return {
                    method: "eth_getTransactionReceipt",
                    args: [req.hash]
                };
            case "call":
                return {
                    method: "eth_call",
                    args: [this.getRpcTransaction(req.transaction), req.blockTag]
                };
            case "estimateGas": {
                return {
                    method: "eth_estimateGas",
                    args: [this.getRpcTransaction(req.transaction)]
                };
            }
            case "getLogs":
                if (req.filter && req.filter.address != null) {
                    if (Array.isArray(req.filter.address)) {
                        req.filter.address = req.filter.address.map(getLowerCase);
                    }
                    else {
                        req.filter.address = getLowerCase(req.filter.address);
                    }
                }
                return { method: "eth_getLogs", args: [req.filter] };
        }
        return null;
    }
    getRpcError(method, args, error) {
        if (method === "eth_call") {
            const result = spelunkData(error);
            if (result) {
                // @TODO: Extract errorSignature, errorName, errorArgs, reason if
                //        it is Error(string) or Panic(uint25)
                return logger$5.makeError("execution reverted during JSON-RPC call", "CALL_EXCEPTION", {
                    data: result.data,
                    transaction: args[0]
                });
            }
            return logger$5.makeError("missing revert data during JSON-RPC call", "CALL_EXCEPTION", {
                data: "0x", transaction: args[0], info: { error }
            });
        }
        const message = JSON.stringify(spelunkMessage(error));
        if (message.match(/insufficient funds|base fee exceeds gas limit/)) {
            return logger$5.makeError("insufficient funds for intrinsic transaction cost", "INSUFFICIENT_FUNDS", {
                transaction: args[0]
            });
        }
        if (message.match(/nonce/) && message.match(/too low/)) {
            return logger$5.makeError("nonce has already been used", "NONCE_EXPIRED", {
                transaction: args[0]
            });
        }
        // "replacement transaction underpriced"
        if (message.match(/replacement transaction/) && message.match(/underpriced/)) {
            return logger$5.makeError("replacement fee too low", "REPLACEMENT_UNDERPRICED", {
                transaction: args[0]
            });
        }
        if (message.match(/only replay-protected/)) {
            return logger$5.makeError("legacy pre-eip-155 transactions not supported", "UNSUPPORTED_OPERATION", {
                operation: method, info: { transaction: args[0] }
            });
        }
        if (method === "estimateGas" && message.match(/gas required exceeds allowance|always failing transaction|execution reverted/)) {
            return logger$5.makeError("cannot estimate gas; transaction may fail or may require manual gas limit", "UNPREDICTABLE_GAS_LIMIT", {
                transaction: args[0]
            });
        }
        return error;
    }
    async _perform(req) {
        // Legacy networks do not like the type field being passed along (which
        // is fair), so we delete type if it is 0 and a non-EIP-1559 network
        if (req.method === "call" || req.method === "estimateGas") {
            let tx = req.transaction;
            if (tx && tx.type != null && logger$5.getBigInt(tx.type)) {
                // If there are no EIP-1559 properties, it might be non-EIP-a559
                if (tx.maxFeePerGas == null && tx.maxPriorityFeePerGas == null) {
                    const feeData = await this.getFeeData();
                    if (feeData.maxFeePerGas == null && feeData.maxPriorityFeePerGas == null) {
                        // Network doesn't know about EIP-1559 (and hence type)
                        req = Object.assign({}, req, {
                            transaction: Object.assign({}, tx, { type: undefined })
                        });
                    }
                }
            }
        }
        const request = this.getRpcRequest(req);
        if (request != null) {
            this.emit("debug", { type: "sendRequest", request });
            try {
                const result = await this.send(request.method, request.args);
                //console.log("RR", result);
                this.emit("debug", { type: "getResponse", result });
                return result;
            }
            catch (error) {
                this.emit("debug", { type: "getError", error });
                throw this.getRpcError(request.method, request.args, error);
            }
        }
        return super._perform(req);
    }
}
_JsonRpcApiProvider_nextId = new WeakMap(), _JsonRpcApiProvider_options = new WeakMap();
class JsonRpcProvider extends JsonRpcApiProvider {
    constructor(url, network) {
        if (url == null) {
            url = "http:/\/localhost:8545";
        }
        super(network);
        _JsonRpcProvider_connect.set(this, void 0);
        _JsonRpcProvider_pollingInterval.set(this, void 0);
        if (typeof (url) === "string") {
            __classPrivateFieldSet$d(this, _JsonRpcProvider_connect, { request: new FetchRequest(url) }, "f");
        }
        else {
            __classPrivateFieldSet$d(this, _JsonRpcProvider_connect, Object.assign({}, url), "f");
            __classPrivateFieldGet$d(this, _JsonRpcProvider_connect, "f").request = __classPrivateFieldGet$d(this, _JsonRpcProvider_connect, "f").request.clone();
        }
        __classPrivateFieldSet$d(this, _JsonRpcProvider_pollingInterval, 4000, "f");
    }
    async send(method, params) {
        params = copy(params);
        // Configure a POST connection for the requested method
        const connection = Object.assign({}, __classPrivateFieldGet$d(this, _JsonRpcProvider_connect, "f"));
        connection.request = connection.request.clone();
        connection.request.body = this.prepareRequest(method, params);
        const response = await fetchData(connection);
        response.assertOk();
        const result = response.bodyJson;
        if ("error" in result) {
            return logger$5.throwError("error from JSON-RPC", "UNKNOWN_ERROR", {
                result
            });
        }
        return result.result;
    }
    get pollingInterval() { return __classPrivateFieldGet$d(this, _JsonRpcProvider_pollingInterval, "f"); }
    set pollingInterval(value) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error("invalid interval");
        }
        __classPrivateFieldSet$d(this, _JsonRpcProvider_pollingInterval, value, "f");
        this._forEachSubscriber((sub) => {
            if (isPollable(sub)) {
                sub.pollingInterval = __classPrivateFieldGet$d(this, _JsonRpcProvider_pollingInterval, "f");
            }
        });
    }
}
_JsonRpcProvider_connect = new WeakMap(), _JsonRpcProvider_pollingInterval = new WeakMap();
// This class should only be used when it is not possible for the
// underlying network to change, such as with INFURA. If you are
// using MetaMask or some other client which allows users to change
// their network DO NOT USE THIS. Bad things will happen.
class StaticJsonRpcProvider extends JsonRpcProvider {
    constructor(url, network) {
        super(url, network);
        defineProperties(this, { network });
    }
    async _detectNetwork() {
        return this.network;
    }
}
function spelunkData(value) {
    if (value == null) {
        return null;
    }
    // These *are* the droids we're looking for.
    if (typeof (value.message) === "string" && value.message.match("reverted") && isHexString(value.data)) {
        return { message: value.message, data: value.data };
    }
    // Spelunk further...
    if (typeof (value) === "object") {
        for (const key in value) {
            const result = spelunkData(value[key]);
            if (result) {
                return result;
            }
        }
        return null;
    }
    // Might be a JSON string we can further descend...
    if (typeof (value) === "string") {
        try {
            return spelunkData(JSON.parse(value));
        }
        catch (error) { }
    }
    return null;
}
function _spelunkMessage(value, result) {
    if (value == null) {
        return;
    }
    // These *are* the droids we're looking for.
    if (typeof (value.message) === "string") {
        result.push(value.message);
    }
    // Spelunk further...
    if (typeof (value) === "object") {
        for (const key in value) {
            _spelunkMessage(value[key], result);
        }
    }
    // Might be a JSON string we can further descend...
    if (typeof (value) === "string") {
        try {
            return _spelunkMessage(JSON.parse(value), result);
        }
        catch (error) { }
    }
}
function spelunkMessage(value) {
    const result = [];
    _spelunkMessage(value, result);
    return result;
}

const defaultApiKey$2 = "9f7d929b018cdffb338517efa06f58359e86ff1ffd350bc889738523659e7972";
function getHost$3(name) {
    switch (name) {
        case "homestead":
            return "rpc.ankr.com/eth";
        case "matic":
            return "rpc.ankr.com/polygon";
        case "arbitrum":
            return "rpc.ankr.com/arbitrum";
    }
    return logger$5.throwArgumentError("unsupported network", "network", name);
}
class AnkrProvider extends StaticJsonRpcProvider {
    constructor(_network = "homestead", apiKey) {
        const network = Network.from(_network);
        if (apiKey == null) {
            apiKey = defaultApiKey$2;
        }
        const connection = AnkrProvider.getConnection(network, apiKey);
        super(connection, network);
        defineProperties(this, { apiKey });
        // Ankr does not support filterId, so we force polling
        super._setOptions({ polling: true });
    }
    _getProvider(chainId) {
        try {
            return new AnkrProvider(chainId, this.apiKey);
        }
        catch (error) { }
        return super._getProvider(chainId);
    }
    static getConnection(network, apiKey) {
        if (apiKey == null) {
            apiKey = defaultApiKey$2;
        }
        const request = new FetchRequest(`https:/\/${getHost$3(network.name)}/${apiKey}`);
        request.allowGzip = true;
        const throttleRetry = async (request, response, attempt) => {
            if (apiKey === defaultApiKey$2) {
                showThrottleMessage("AnkrProvider");
            }
            return true;
        };
        return { request, throttleRetry };
    }
    isCommunityResource() {
        return (this.apiKey === defaultApiKey$2);
    }
}

const defaultApiKey$1 = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";
function getHost$2(name) {
    switch (name) {
        case "homestead":
            return "eth-mainnet.alchemyapi.io";
        case "ropsten":
            return "eth-ropsten.alchemyapi.io";
        case "rinkeby":
            return "eth-rinkeby.alchemyapi.io";
        case "goerli":
            return "eth-goerli.alchemyapi.io";
        case "kovan":
            return "eth-kovan.alchemyapi.io";
        case "matic":
            return "polygon-mainnet.g.alchemy.com";
        case "maticmum":
            return "polygon-mumbai.g.alchemy.com";
        case "arbitrum":
            return "arb-mainnet.g.alchemy.com";
        case "arbitrum-rinkeby":
            return "arb-rinkeby.g.alchemy.com";
        case "optimism":
            return "opt-mainnet.g.alchemy.com";
        case "optimism-kovan":
            return "opt-kovan.g.alchemy.com";
    }
    return logger$5.throwArgumentError("unsupported network", "network", name);
}
class AlchemyProvider extends StaticJsonRpcProvider {
    constructor(_network = "homestead", apiKey) {
        const network = Network.from(_network);
        if (apiKey == null) {
            apiKey = defaultApiKey$1;
        }
        super(AlchemyProvider.getConnection(network, apiKey), network);
        defineProperties(this, { apiKey });
    }
    _getProvider(chainId) {
        try {
            return new AlchemyProvider(chainId, this.apiKey);
        }
        catch (error) { }
        return super._getProvider(chainId);
    }
    isCommunityResource() {
        return (this.apiKey === defaultApiKey$1);
    }
    static getConnection(network, apiKey) {
        if (apiKey == null) {
            apiKey = defaultApiKey$1;
        }
        const request = new FetchRequest(`https:/\/${getHost$2(network.name)}/v2/${apiKey}`);
        request.allowGzip = true;
        const throttleRetry = async (request, response, attempt) => {
            if (apiKey === defaultApiKey$1) {
                showThrottleMessage("alchemy");
            }
            return true;
        };
        return { request, throttleRetry };
    }
}

class CloudflareProvider extends StaticJsonRpcProvider {
    constructor(_network = "homestead") {
        const network = Network.from(_network);
        if (network.name !== "homestead") {
            return logger$5.throwArgumentError("unsupported network", "network", _network);
        }
        super("https:/\/cloudflare-eth.com/", network);
    }
}

const defaultApiKey = "9D13ZE7XSBTJ94N9BNJ2MA33VMAY2YPIRB";
const EtherscanPluginId = "org.ethers.plugins.etherscan";
class EtherscanProvider extends AbstractProvider {
    constructor(_network, apiKey) {
        super();
        const network = Network.from(_network);
        if (apiKey == null) {
            const plugin = network.getPlugin(EtherscanPluginId);
            if (plugin) {
                apiKey = plugin.communityApiKey;
            }
            else {
                apiKey = defaultApiKey;
            }
        }
        defineProperties(this, { apiKey, network });
        // Test that the network is supported by Etherscan
        this.getBaseUrl();
    }
    getBaseUrl() {
        const plugin = this.network.getPlugin(EtherscanPluginId);
        if (plugin) {
            return plugin.baseUrl;
        }
        switch (this.network.name) {
            case "homestead":
                return "https:/\/api.etherscan.io";
            case "ropsten":
                return "https:/\/api-ropsten.etherscan.io";
            case "rinkeby":
                return "https:/\/api-rinkeby.etherscan.io";
            case "kovan":
                return "https:/\/api-kovan.etherscan.io";
            case "goerli":
                return "https:/\/api-goerli.etherscan.io";
        }
        return logger$5.throwArgumentError("unsupported network", "network", this.network);
    }
    getUrl(module, params) {
        const query = Object.keys(params).reduce((accum, key) => {
            const value = params[key];
            if (value != null) {
                accum += `&${key}=${value}`;
            }
            return accum;
        }, "");
        const apiKey = ((this.apiKey) ? `&apikey=${this.apiKey}` : "");
        return `${this.getBaseUrl()}/api?module=${module}${query}${apiKey}`;
    }
    getPostUrl() {
        return `${this.getBaseUrl()}/api`;
    }
    getPostData(module, params) {
        params.module = module;
        params.apikey = this.apiKey;
        return params;
    }
    async detectNetwork() {
        return this.network;
    }
    async fetch(module, params, post) {
        const url = (post ? this.getPostUrl() : this.getUrl(module, params));
        const payload = (post ? this.getPostData(module, params) : null);
        /*
        this.emit("debug", {
            action: "request",
            request: url,
            provider: this
        });
        */
        const request = new FetchRequest(url);
        const connection = {
            request,
            throttleSlotInterval: 1000,
            processResponse: async (request, response) => {
                const result = response.hasBody() ? JSON.parse(toUtf8String(response.body)) : {};
                const throttle = ((typeof (result.result) === "string") ? result.result : "").toLowerCase().indexOf("rate limit") >= 0;
                if (module === "proxy") {
                    // This JSON response indicates we are being throttled
                    if (result && result.status == 0 && result.message == "NOTOK" && throttle) {
                        response.throwThrottleError(result.result);
                    }
                }
                else {
                    if (throttle) {
                        response.throwThrottleError(result.result);
                    }
                }
                return response;
            },
        };
        if (payload) {
            request.setHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            request.body = Object.keys(payload).map((k) => `${k}=${payload[k]}`).join("&");
        }
        const response = await fetchData(connection);
        response.assertOk();
        if (!response.hasBody()) {
            throw new Error();
        }
        /*
        this.emit("debug", {
            action: "response",
            request: url,
            response: deepCopy(result),
            provider: this
        });
        */
        const result = JSON.parse(toUtf8String(response.body));
        if (module === "proxy") {
            if (result.jsonrpc != "2.0") {
                // @TODO: not any
                const error = new Error("invalid response");
                error.result = JSON.stringify(result);
                throw error;
            }
            if (result.error) {
                // @TODO: not any
                const error = new Error(result.error.message || "unknown error");
                if (result.error.code) {
                    error.code = result.error.code;
                }
                if (result.error.data) {
                    error.data = result.error.data;
                }
                throw error;
            }
            return result.result;
        }
        else {
            // getLogs, getHistory have weird success responses
            if (result.status == 0 && (result.message === "No records found" || result.message === "No transactions found")) {
                return result.result;
            }
            if (result.status != 1 || result.message != "OK") {
                const error = new Error("invalid response");
                error.result = JSON.stringify(result);
                //        if ((result.result || "").toLowerCase().indexOf("rate limit") >= 0) {
                //            error.throttleRetry = true;
                //        }
                throw error;
            }
            return result.result;
        }
    }
    // The transaction has already been sanitized by the calls in Provider
    _getTransactionPostData(transaction) {
        const result = {};
        for (let key in transaction) {
            if (transaction[key] == null) {
                continue;
            }
            let value = transaction[key];
            if (key === "type" && value === 0) {
                continue;
            }
            // Quantity-types require no leading zero, unless 0
            if ({ type: true, gasLimit: true, gasPrice: true, maxFeePerGs: true, maxPriorityFeePerGas: true, nonce: true, value: true }[key]) {
                value = quantity(hexlify(value));
            }
            else if (key === "accessList") {
                value = "[" + this.network.formatter.accessList(value).map((set) => {
                    return `{address:"${set.address}",storageKeys:["${set.storageKeys.join('","')}"]}`;
                }).join(",") + "]";
            }
            else {
                value = hexlify(value);
            }
            result[key] = value;
        }
        return result;
    }
    _checkError(req, error, transaction) {
        /*
            let body = "";
            if (isError(error, Logger.Errors.SERVER_ERROR) && error.response && error.response.hasBody()) {
                body = toUtf8String(error.response.body);
            }
            console.log(body);
    
            // Undo the "convenience" some nodes are attempting to prevent backwards
            // incompatibility; maybe for v6 consider forwarding reverts as errors
            if (method === "call" && body) {
    
                // Etherscan keeps changing their string
                if (body.match(/reverted/i) || body.match(/VM execution error/i)) {
    
                    // Etherscan prefixes the data like "Reverted 0x1234"
                    let data = e.data;
                    if (data) { data = "0x" + data.replace(/^.*0x/i, ""); }
                    if (!isHexString(data)) { data = "0x"; }
    
                    logger.throwError("call exception", Logger.Errors.CALL_EXCEPTION, {
                        error, data
                    });
                }
            }
    
            // Get the message from any nested error structure
            let message = error.message;
            if (isError(error, Logger.Errors.SERVER_ERROR)) {
                if (error.error && typeof(error.error.message) === "string") {
                    message = error.error.message;
                } else if (typeof(error.body) === "string") {
                    message = error.body;
                } else if (typeof(error.responseText) === "string") {
                    message = error.responseText;
                }
            }
            message = (message || "").toLowerCase();
    
            // "Insufficient funds. The account you tried to send transaction from
            // does not have enough funds. Required 21464000000000 and got: 0"
            if (message.match(/insufficient funds/)) {
                logger.throwError("insufficient funds for intrinsic transaction cost", Logger.Errors.INSUFFICIENT_FUNDS, {
                   error, transaction, info: { method }
                });
            }
    
            // "Transaction with the same hash was already imported."
            if (message.match(/same hash was already imported|transaction nonce is too low|nonce too low/)) {
                logger.throwError("nonce has already been used", Logger.Errors.NONCE_EXPIRED, {
                   error, transaction, info: { method }
                });
            }
    
            // "Transaction gas price is too low. There is another transaction with
            // same nonce in the queue. Try increasing the gas price or incrementing the nonce."
            if (message.match(/another transaction with same nonce/)) {
                 logger.throwError("replacement fee too low", Logger.Errors.REPLACEMENT_UNDERPRICED, {
                    error, transaction, info: { method }
                 });
            }
    
            if (message.match(/execution failed due to an exception|execution reverted/)) {
                logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", Logger.Errors.UNPREDICTABLE_GAS_LIMIT, {
                    error, transaction, info: { method }
                });
            }
    */
        throw error;
    }
    async _detectNetwork() {
        return this.network;
    }
    async _perform(req) {
        switch (req.method) {
            case "chainId":
                return this.network.chainId;
            case "getBlockNumber":
                return this.fetch("proxy", { action: "eth_blockNumber" });
            case "getGasPrice":
                return this.fetch("proxy", { action: "eth_gasPrice" });
            case "getBalance":
                // Returns base-10 result
                return this.fetch("account", {
                    action: "balance",
                    address: req.address,
                    tag: req.blockTag
                });
            case "getTransactionCount":
                return this.fetch("proxy", {
                    action: "eth_getTransactionCount",
                    address: req.address,
                    tag: req.blockTag
                });
            case "getCode":
                return this.fetch("proxy", {
                    action: "eth_getCode",
                    address: req.address,
                    tag: req.blockTag
                });
            case "getStorageAt":
                return this.fetch("proxy", {
                    action: "eth_getStorageAt",
                    address: req.address,
                    position: req.position,
                    tag: req.blockTag
                });
            case "sendTransaction":
                return this.fetch("proxy", {
                    action: "eth_sendRawTransaction",
                    hex: req.signedTransaction
                }, true).catch((error) => {
                    return this._checkError(req, error, req.signedTransaction);
                });
            case "getBlock":
                if ("blockTag" in req) {
                    return this.fetch("proxy", {
                        action: "eth_getBlockByNumber",
                        tag: req.blockTag,
                        boolean: (req.includeTransactions ? "true" : "false")
                    });
                }
                return logger$5.throwError("getBlock by blockHash not supported by Etherscan", "UNSUPPORTED_OPERATION", {
                    operation: "getBlock(blockHash)"
                });
            case "getTransaction":
                return this.fetch("proxy", {
                    action: "eth_getTransactionByHash",
                    txhash: req.hash
                });
            case "getTransactionReceipt":
                return this.fetch("proxy", {
                    action: "eth_getTransactionReceipt",
                    txhash: req.hash
                });
            case "call": {
                if (req.blockTag !== "latest") {
                    throw new Error("EtherscanProvider does not support blockTag for call");
                }
                const postData = this._getTransactionPostData(req.transaction);
                postData.module = "proxy";
                postData.action = "eth_call";
                try {
                    return await this.fetch("proxy", postData, true);
                }
                catch (error) {
                    return this._checkError(req, error, req.transaction);
                }
            }
            case "estimateGas": {
                const postData = this._getTransactionPostData(req.transaction);
                postData.module = "proxy";
                postData.action = "eth_estimateGas";
                try {
                    return await this.fetch("proxy", postData, true);
                }
                catch (error) {
                    return this._checkError(req, error, req.transaction);
                }
            }
        }
        return super._perform(req);
    }
    async getNetwork() {
        return this.network;
    }
    async getEtherPrice() {
        if (this.network.name !== "homestead") {
            return 0.0;
        }
        return parseFloat((await this.fetch("stats", { action: "ethprice" })).ethusd);
    }
    isCommunityResource() {
        const plugin = this.network.getPlugin(EtherscanPluginId);
        if (plugin) {
            return (plugin.communityApiKey === this.apiKey);
        }
        return (defaultApiKey === this.apiKey);
    }
}
/*
(async function() {
    const provider = new EtherscanProvider();
    console.log(provider);
    console.log(await provider.getBlockNumber());
    / *
    provider.on("block", (b) => {
        console.log("BB", b);
    });
    console.log(await provider.getTransactionReceipt("0xa5ded92f548e9f362192f9ab7e5b3fbc9b5a919a868e29247f177d49ce38de6e"));

    provider.once("0xa5ded92f548e9f362192f9ab7e5b3fbc9b5a919a868e29247f177d49ce38de6e", (tx) => {
        console.log("TT", tx);
    });
    * /
    try {
        console.log(await provider.getBlock(100));
    } catch (error) {
        console.log(error);
    }

    try {
        console.log(await provider.getBlock(13821768));
    } catch (error) {
        console.log(error);
    }

})();
*/

const defaultProjectId = "84842078b09946638c03157f83405213";
function getHost$1(name) {
    switch (name) {
        case "homestead":
            return "mainnet.infura.io";
        case "ropsten":
            return "ropsten.infura.io";
        case "rinkeby":
            return "rinkeby.infura.io";
        case "kovan":
            return "kovan.infura.io";
        case "goerli":
            return "goerli.infura.io";
        case "matic":
            return "polygon-mainnet.infura.io";
        case "maticmum":
            return "polygon-mumbai.infura.io";
        case "optimism":
            return "optimism-mainnet.infura.io";
        case "optimism-kovan":
            return "optimism-kovan.infura.io";
        case "arbitrum":
            return "arbitrum-mainnet.infura.io";
        case "arbitrum-rinkeby":
            return "arbitrum-rinkeby.infura.io";
    }
    return logger$5.throwArgumentError("unsupported network", "network", name);
}
class InfuraProvider extends StaticJsonRpcProvider {
    constructor(_network = "homestead", projectId, projectSecret) {
        const network = Network.from(_network);
        if (projectId == null) {
            projectId = defaultProjectId;
        }
        if (projectSecret == null) {
            projectSecret = null;
        }
        const connection = InfuraProvider.getConnection(network, projectId, projectSecret);
        super(connection, network);
        defineProperties(this, { projectId, projectSecret });
    }
    _getProvider(chainId) {
        try {
            return new InfuraProvider(chainId, this.projectId, this.projectSecret);
        }
        catch (error) { }
        return super._getProvider(chainId);
    }
    static getConnection(network, projectId, projectSecret) {
        if (projectId == null) {
            projectId = defaultProjectId;
        }
        if (projectSecret == null) {
            projectSecret = null;
        }
        const request = new FetchRequest(`https:/\/${getHost$1(network.name)}/v3/${projectId}`);
        request.allowGzip = true;
        if (projectSecret) {
            request.setCredentials("", projectSecret);
        }
        const throttleRetry = async (request, response, attempt) => {
            if (projectId === defaultProjectId) {
                showThrottleMessage("InfuraProvider");
            }
            return true;
        };
        return { request, throttleRetry };
    }
    isCommunityResource() {
        return (this.projectId === defaultProjectId);
    }
}

// These are load-balancer-based application IDs
const defaultAppIds = {
    homestead: "6004bcd10040261633ade990",
    ropsten: "6004bd4d0040261633ade991",
    rinkeby: "6004bda20040261633ade994",
    goerli: "6004bd860040261633ade992",
};
function getHost(name) {
    switch (name) {
        case "homestead":
            return "eth-mainnet.gateway.pokt.network";
        case "ropsten":
            return "eth-ropsten.gateway.pokt.network";
        case "rinkeby":
            return "eth-rinkeby.gateway.pokt.network";
        case "goerli":
            return "eth-goerli.gateway.pokt.network";
    }
    return logger$5.throwArgumentError("unsupported network", "network", name);
}
function normalizeApiKey(network, _appId, applicationSecretKey, loadBalancer) {
    loadBalancer = !!loadBalancer;
    let community = false;
    let applicationId = _appId;
    if (applicationId == null) {
        applicationId = defaultAppIds[network.name];
        if (applicationId == null) {
            logger$5.throwArgumentError("network does not support default applicationId", "applicationId", _appId);
        }
        loadBalancer = true;
        community = true;
    }
    else if (applicationId === defaultAppIds[network.name]) {
        loadBalancer = true;
        community = true;
    }
    if (applicationSecretKey == null) {
        applicationSecretKey = null;
    }
    return { applicationId, applicationSecretKey, community, loadBalancer };
}
class PocketProvider extends StaticJsonRpcProvider {
    constructor(_network = "homestead", _appId, _secretKey, _loadBalancer) {
        const network = Network.from(_network);
        const { applicationId, applicationSecretKey, loadBalancer } = normalizeApiKey(network, _appId, _secretKey, _loadBalancer);
        const connection = PocketProvider.getConnection(network, applicationId, applicationSecretKey, loadBalancer);
        super(connection, network);
        defineProperties(this, { applicationId, applicationSecretKey, loadBalancer });
    }
    static getConnection(network, _appId, _secretKey, _loadBalancer) {
        const { applicationId, applicationSecretKey, community, loadBalancer } = normalizeApiKey(network, _appId, _secretKey, _loadBalancer);
        let url = `https:/\/${getHost(network.name)}/v1/`;
        if (loadBalancer) {
            url += "lb/";
        }
        url += applicationId;
        const request = new FetchRequest(url);
        request.allowGzip = true;
        if (applicationSecretKey) {
            request.setCredentials("", applicationSecretKey);
        }
        const throttleRetry = async (request, response, attempt) => {
            if (community) {
                showThrottleMessage("PocketProvider");
            }
            return true;
        };
        return { request, throttleRetry };
    }
    isCommunityResource() {
        return (this.applicationId === defaultAppIds[this.network.name]);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}

var __classPrivateFieldSet$c = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$c = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FallbackProvider_instances, _FallbackProvider_configs, _FallbackProvider_height, _FallbackProvider_initialSyncPromise, _FallbackProvider_getNextConfig, _FallbackProvider_addRunner, _FallbackProvider_initialSync, _FallbackProvider_checkQuorum, _FallbackProvider_waitForQuorum;
//const BN_0 = BigInt("0");
const BN_1 = BigInt("1");
const BN_2 = BigInt("2");
function stall$2(duration) {
    return new Promise((resolve) => { setTimeout(resolve, duration); });
}
function getTime() { return (new Date()).getTime(); }
const defaultConfig = { stallTimeout: 400, priority: 1, weight: 1 };
const defaultState = {
    blockNumber: -2, requests: 0, lateResponses: 0, errorResponses: 0,
    outOfSync: -1, unsupportedEvents: 0, rollingDuration: 0, score: 0,
    _network: null, _updateNumber: null, _totalTime: 0
};
async function waitForSync(config, blockNumber) {
    while (config.blockNumber < 0 || config.blockNumber < blockNumber) {
        if (!config._updateNumber) {
            config._updateNumber = (async () => {
                const blockNumber = await config.provider.getBlockNumber();
                if (blockNumber > config.blockNumber) {
                    config.blockNumber = blockNumber;
                }
                config._updateNumber = null;
            })();
        }
        await config._updateNumber;
        config.outOfSync++;
    }
}
// Normalizes a result to a string that can be used to compare against
// other results using normal string equality
function normalize(network, value, req) {
    switch (req.method) {
        case "chainId":
            return logger$5.getBigInt(value).toString();
        case "getBlockNumber":
            return logger$5.getNumber(value).toString();
        case "getGasPrice":
            return logger$5.getBigInt(value).toString();
        case "getBalance":
            return logger$5.getBigInt(value).toString();
        case "getTransactionCount":
            return logger$5.getNumber(value).toString();
        case "getCode":
            return hexlify(value);
        case "getStorageAt":
            return hexlify(value);
        case "getBlock":
            if (req.includeTransactions) {
                return JSON.stringify(network.formatter.blockWithTransactions(value));
            }
            return JSON.stringify(network.formatter.block(value));
        case "getTransaction":
            return JSON.stringify(network.formatter.transactionResponse(value));
        case "getTransactionReceipt":
            return JSON.stringify(network.formatter.receipt(value));
        case "call":
            return hexlify(value);
        case "estimateGas":
            return logger$5.getBigInt(value).toString();
        case "getLogs":
            return JSON.stringify(value.map((v) => network.formatter.log(v)));
    }
    return logger$5.throwError("unsupported method", "UNSUPPORTED_OPERATION", {
        operation: `_perform(${JSON.stringify(req.method)})`
    });
}
// This strategy picks the highest wieght result, as long as the weight is
// equal to or greater than quorum
function checkQuorum(quorum, results) {
    const tally = new Map();
    for (const { result, normal, weight } of results) {
        const t = tally.get(normal) || { result, weight: 0 };
        t.weight += weight;
        tally.set(normal, t);
    }
    let bestWeight = 0;
    let bestResult = undefined;
    for (const { weight, result } of tally.values()) {
        if (weight >= quorum && weight > bestWeight) {
            bestWeight = weight;
            bestResult = result;
        }
    }
    return bestResult;
}
/*
function getMean(results: Array<TallyResult>): bigint {
    const total = results.reduce((a, r) => (a + BigInt(r.result)), BN_0);
    return total / BigInt(results.length);
}
*/
function getMedian(results) {
    // Get the sorted values
    const values = results.map((r) => BigInt(r.result));
    values.sort((a, b) => ((a < b) ? -1 : (b > a) ? 1 : 0));
    const mid = values.length / 2;
    // Odd-length; take the middle value
    if (values.length % 2) {
        return values[mid];
    }
    // Even length; take the ceiling of the mean of the center two values
    return (values[mid - 1] + values[mid] + BN_1) / BN_2;
}
function getFuzzyMode(quorum, results) {
    if (quorum === 1) {
        return logger$5.getNumber(getMedian(results), "%internal");
    }
    const tally = new Map();
    const add = (result, weight) => {
        const t = tally.get(result) || { result, weight: 0 };
        t.weight += weight;
        tally.set(result, t);
    };
    for (const { weight, result } of results) {
        const r = logger$5.getNumber(result);
        add(r - 1, weight);
        add(r, weight);
        add(r + 1, weight);
    }
    let bestWeight = 0;
    let bestResult = undefined;
    for (const { weight, result } of tally.values()) {
        // Use this result, if this result meets quorum and has either:
        // - a better weight
        // - or equal weight, but the result is larger
        if (weight >= quorum && (weight > bestWeight || (bestResult != null && weight === bestWeight && result > bestResult))) {
            bestWeight = weight;
            bestResult = result;
        }
    }
    return bestResult;
}
class FallbackProvider extends AbstractProvider {
    constructor(providers, network) {
        super(network);
        _FallbackProvider_instances.add(this);
        _FallbackProvider_configs.set(this, void 0);
        _FallbackProvider_height.set(this, void 0);
        _FallbackProvider_initialSyncPromise.set(this, void 0);
        __classPrivateFieldSet$c(this, _FallbackProvider_configs, providers.map((p) => {
            if (p instanceof AbstractProvider) {
                return Object.assign({ provider: p }, defaultConfig, defaultState);
            }
            else {
                return Object.assign({}, defaultConfig, p, defaultState);
            }
        }), "f");
        __classPrivateFieldSet$c(this, _FallbackProvider_height, -2, "f");
        __classPrivateFieldSet$c(this, _FallbackProvider_initialSyncPromise, null, "f");
        this.quorum = 2; //Math.ceil(providers.length /  2);
        this.eventQuorum = 1;
        this.eventWorkers = 1;
        if (this.quorum > __classPrivateFieldGet$c(this, _FallbackProvider_configs, "f").reduce((a, c) => (a + c.weight), 0)) {
            logger$5.throwArgumentError("quorum exceed provider wieght", "quorum", this.quorum);
        }
    }
    // @TOOD: Copy these and only return public values
    get providerConfigs() {
        return __classPrivateFieldGet$c(this, _FallbackProvider_configs, "f").slice();
    }
    async _detectNetwork() {
        return Network.from(logger$5.getBigInt(await this._perform({ method: "chainId" }))).freeze();
    }
    async _perform(req) {
        await __classPrivateFieldGet$c(this, _FallbackProvider_instances, "m", _FallbackProvider_initialSync).call(this);
        // Bootstrap enough to meet quorum
        const running = new Set();
        for (let i = 0; i < this.quorum; i++) {
            __classPrivateFieldGet$c(this, _FallbackProvider_instances, "m", _FallbackProvider_addRunner).call(this, running, req);
        }
        const result = __classPrivateFieldGet$c(this, _FallbackProvider_instances, "m", _FallbackProvider_waitForQuorum).call(this, running, req);
        for (const runner of running) {
            runner.done = true;
        }
        return result;
    }
}
_FallbackProvider_configs = new WeakMap(), _FallbackProvider_height = new WeakMap(), _FallbackProvider_initialSyncPromise = new WeakMap(), _FallbackProvider_instances = new WeakSet(), _FallbackProvider_getNextConfig = function _FallbackProvider_getNextConfig(configs) {
    // Shuffle the states, sorted by priority
    const allConfigs = __classPrivateFieldGet$c(this, _FallbackProvider_configs, "f").slice();
    shuffle(allConfigs);
    allConfigs.sort((a, b) => (b.priority - a.priority));
    for (const config of allConfigs) {
        if (configs.indexOf(config) === -1) {
            return config;
        }
    }
    return null;
}, _FallbackProvider_addRunner = function _FallbackProvider_addRunner(running, req) {
    const config = __classPrivateFieldGet$c(this, _FallbackProvider_instances, "m", _FallbackProvider_getNextConfig).call(this, Array.from(running).map((r) => r.config));
    if (config == null) {
        return null;
    }
    const result = {};
    const runner = {
        config, result, didBump: false, done: false,
        perform: null, staller: null
    };
    const now = getTime();
    runner.perform = (async () => {
        try {
            config.requests++;
            result.result = await config.provider._perform(req);
        }
        catch (error) {
            config.errorResponses++;
            result.error = error;
        }
        if (runner.done) {
            config.lateResponses++;
        }
        const dt = (getTime() - now);
        config._totalTime += dt;
        config.rollingDuration = 0.95 * config.rollingDuration + 0.05 * dt;
        runner.perform = null;
    })();
    runner.staller = (async () => {
        await stall$2(config.stallTimeout);
        runner.staller = null;
    })();
    running.add(runner);
    return runner;
}, _FallbackProvider_initialSync = 
// Initializes the blockNumber and network for each runner and
// blocks until initialized
async function _FallbackProvider_initialSync() {
    let initialSync = __classPrivateFieldGet$c(this, _FallbackProvider_initialSyncPromise, "f");
    if (!initialSync) {
        const promises = [];
        __classPrivateFieldGet$c(this, _FallbackProvider_configs, "f").forEach((config) => {
            promises.push(waitForSync(config, 0));
            promises.push((async () => {
                config._network = await config.provider.getNetwork();
            })());
        });
        __classPrivateFieldSet$c(this, _FallbackProvider_initialSyncPromise, initialSync = (async () => {
            // Wait for all providers to have a block number and network
            await Promise.all(promises);
            // Check all the networks match
            let chainId = null;
            for (const config of __classPrivateFieldGet$c(this, _FallbackProvider_configs, "f")) {
                const network = (config._network);
                if (chainId == null) {
                    chainId = network.chainId;
                }
                else if (network.chainId !== chainId) {
                    logger$5.throwError("cannot mix providers on different networks", "UNSUPPORTED_OPERATION", {
                        operation: "new FallbackProvider"
                    });
                }
            }
        })(), "f");
    }
    await initialSync;
}, _FallbackProvider_checkQuorum = async function _FallbackProvider_checkQuorum(running, req) {
    // Get all the result objects
    const results = [];
    for (const runner of running) {
        if ("result" in runner.result) {
            const result = runner.result.result;
            results.push({
                result,
                normal: normalize((runner.config._network), result, req),
                weight: runner.config.weight
            });
        }
    }
    // Are there enough results to event meet quorum?
    if (results.reduce((a, r) => (a + r.weight), 0) < this.quorum) {
        return undefined;
    }
    switch (req.method) {
        case "getBlockNumber": {
            // We need to get the bootstrap block height
            if (__classPrivateFieldGet$c(this, _FallbackProvider_height, "f") === -2) {
                const height = Math.ceil(logger$5.getNumber(getMedian(__classPrivateFieldGet$c(this, _FallbackProvider_configs, "f").map((c) => ({
                    result: c.blockNumber,
                    normal: logger$5.getNumber(c.blockNumber).toString(),
                    weight: c.weight
                }))), "%internal"));
                __classPrivateFieldSet$c(this, _FallbackProvider_height, height, "f");
            }
            const mode = getFuzzyMode(this.quorum, results);
            if (mode === undefined) {
                return undefined;
            }
            if (mode > __classPrivateFieldGet$c(this, _FallbackProvider_height, "f")) {
                __classPrivateFieldSet$c(this, _FallbackProvider_height, mode, "f");
            }
            return __classPrivateFieldGet$c(this, _FallbackProvider_height, "f");
        }
        case "getGasPrice":
        case "estimateGas":
            return getMedian(results);
        case "getBlock":
            // Pending blocks are mempool dependant and already
            // quite untrustworthy
            if ("blockTag" in req && req.blockTag === "pending") {
                return results[0].result;
            }
            return checkQuorum(this.quorum, results);
        case "chainId":
        case "getBalance":
        case "getTransactionCount":
        case "getCode":
        case "getStorageAt":
        case "getTransaction":
        case "getTransactionReceipt":
        case "getLogs":
            return checkQuorum(this.quorum, results);
        case "call":
            // @TODO: Check errors
            return checkQuorum(this.quorum, results);
        case "sendTransaction":
            throw new Error("TODO");
    }
    return logger$5.throwError("unsupported method", "UNSUPPORTED_OPERATION", {
        operation: `_perform(${JSON.stringify(req.method)})`
    });
}, _FallbackProvider_waitForQuorum = async function _FallbackProvider_waitForQuorum(running, req) {
    if (running.size === 0) {
        throw new Error("no runners?!");
    }
    // Any promises that are interesting to watch for; an expired stall
    // or a successful perform
    const interesting = [];
    //const results: Array<any> = [ ];
    //const errors: Array<Error> = [ ];
    let newRunners = 0;
    for (const runner of running) {
        // @TODO: use runner.perfom != null
        /*
      if ("result" in runner.result) {
          results.push(runner.result.result);
      } else if ("error" in runner.result) {
          errors.push(runner.result.error);
      }
*/
        // No responses, yet; keep an eye on it
        if (runner.perform) {
            interesting.push(runner.perform);
        }
        // Still stalling...
        if (runner.staller) {
            interesting.push(runner.staller);
            continue;
        }
        // This runner has already triggered another runner
        if (runner.didBump) {
            continue;
        }
        // Got a response (result or error) or stalled; kick off another runner
        runner.didBump = true;
        newRunners++;
    }
    // Check for quorum
    /*
    console.log({ results, errors } );
    if (results.length >= this.quorum) {
        return results[0];
    }

    if (errors.length >= this.quorum) {
        return errors[0];
    }
    */
    const value = await __classPrivateFieldGet$c(this, _FallbackProvider_instances, "m", _FallbackProvider_checkQuorum).call(this, running, req);
    if (value !== undefined) {
        if (value instanceof Error) {
            throw value;
        }
        return value;
    }
    // Add any new runners, because a staller timed out or a result
    // or error response came in.
    for (let i = 0; i < newRunners; i++) {
        __classPrivateFieldGet$c(this, _FallbackProvider_instances, "m", _FallbackProvider_addRunner).call(this, running, req);
    }
    if (interesting.length === 0) {
        throw new Error("quorum not met");
        //            return logger.throwError("failed to meet quorum", "", {
        //            });
    }
    // Wait for someone to either complete its perform or trigger a stall
    await Promise.race(interesting);
    return await __classPrivateFieldGet$c(this, _FallbackProvider_instances, "m", _FallbackProvider_waitForQuorum).call(this, running, req);
};

function getGlobal() {
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    throw new Error('unable to locate global object');
}
const _WebSocket = getGlobal().WebSocket;

/**
 *  SocketProvider
 *
 *  Generic long-lived socket provider.
 *
 *  Sub-classing notes
 *  - a sub-class MUST call the `_start()` method once connected
 *  - a sub-class MUST override the `_write(string)` method
 *  - a sub-class MUST call `_processMessage(string)` for each message
 */
var __classPrivateFieldSet$b = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$b = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SocketSubscriber_provider, _SocketSubscriber_filter, _SocketSubscriber_filterId, _SocketSubscriber_paused, _SocketSubscriber_emitPromise, _SocketEventSubscriber_logFilter, _SocketEventSubscriber_formatter, _SocketProvider_callbacks, _SocketProvider_ready, _SocketProvider_subs, _SocketProvider_pending;
class SocketSubscriber {
    constructor(provider, filter) {
        _SocketSubscriber_provider.set(this, void 0);
        _SocketSubscriber_filter.set(this, void 0);
        _SocketSubscriber_filterId.set(this, void 0);
        _SocketSubscriber_paused.set(this, void 0);
        _SocketSubscriber_emitPromise.set(this, void 0);
        __classPrivateFieldSet$b(this, _SocketSubscriber_provider, provider, "f");
        __classPrivateFieldSet$b(this, _SocketSubscriber_filter, JSON.stringify(filter), "f");
        __classPrivateFieldSet$b(this, _SocketSubscriber_filterId, null, "f");
        __classPrivateFieldSet$b(this, _SocketSubscriber_paused, null, "f");
        __classPrivateFieldSet$b(this, _SocketSubscriber_emitPromise, null, "f");
    }
    get filter() { return JSON.parse(__classPrivateFieldGet$b(this, _SocketSubscriber_filter, "f")); }
    start() {
        __classPrivateFieldSet$b(this, _SocketSubscriber_filterId, __classPrivateFieldGet$b(this, _SocketSubscriber_provider, "f").send("eth_subscribe", this.filter).then((filterId) => {
            __classPrivateFieldGet$b(this, _SocketSubscriber_provider, "f")._register(filterId, this);
            return filterId;
        }), "f");
    }
    stop() {
        (__classPrivateFieldGet$b(this, _SocketSubscriber_filterId, "f")).then((filterId) => {
            __classPrivateFieldGet$b(this, _SocketSubscriber_provider, "f").send("eth_unsubscribe", [filterId]);
        });
        __classPrivateFieldSet$b(this, _SocketSubscriber_filterId, null, "f");
    }
    // @TODO: pause should trap the current blockNumber, unsub, and on resume use getLogs
    //        and resume
    pause(dropWhilePaused) {
        if (!dropWhilePaused) {
            logger$5.throwError("preserve logs while paused not supported by SocketSubscriber yet", "UNSUPPORTED_OPERATION", {
                operation: "pause(false)"
            });
        }
        __classPrivateFieldSet$b(this, _SocketSubscriber_paused, !!dropWhilePaused, "f");
    }
    resume() {
        __classPrivateFieldSet$b(this, _SocketSubscriber_paused, null, "f");
    }
    _handleMessage(message) {
        if (__classPrivateFieldGet$b(this, _SocketSubscriber_filterId, "f") == null) {
            return;
        }
        if (__classPrivateFieldGet$b(this, _SocketSubscriber_paused, "f") === null) {
            let emitPromise = __classPrivateFieldGet$b(this, _SocketSubscriber_emitPromise, "f");
            if (emitPromise == null) {
                emitPromise = this._emit(__classPrivateFieldGet$b(this, _SocketSubscriber_provider, "f"), message);
            }
            else {
                emitPromise = emitPromise.then(async () => {
                    await this._emit(__classPrivateFieldGet$b(this, _SocketSubscriber_provider, "f"), message);
                });
            }
            __classPrivateFieldSet$b(this, _SocketSubscriber_emitPromise, emitPromise.then(() => {
                if (__classPrivateFieldGet$b(this, _SocketSubscriber_emitPromise, "f") === emitPromise) {
                    __classPrivateFieldSet$b(this, _SocketSubscriber_emitPromise, null, "f");
                }
            }), "f");
        }
    }
    async _emit(provider, message) {
        throw new Error("sub-classes must implemente this; _emit");
    }
}
_SocketSubscriber_provider = new WeakMap(), _SocketSubscriber_filter = new WeakMap(), _SocketSubscriber_filterId = new WeakMap(), _SocketSubscriber_paused = new WeakMap(), _SocketSubscriber_emitPromise = new WeakMap();
class SocketBlockSubscriber extends SocketSubscriber {
    constructor(provider) {
        super(provider, ["newHeads"]);
    }
    async _emit(provider, message) {
        provider.emit("block", parseInt(message.number));
    }
}
class SocketPendingSubscriber extends SocketSubscriber {
    constructor(provider) {
        super(provider, ["newPendingTransactions"]);
    }
    async _emit(provider, message) {
        provider.emit("pending", message);
    }
}
class SocketEventSubscriber extends SocketSubscriber {
    constructor(provider, filter) {
        super(provider, ["logs", filter]);
        _SocketEventSubscriber_logFilter.set(this, void 0);
        _SocketEventSubscriber_formatter.set(this, void 0);
        __classPrivateFieldSet$b(this, _SocketEventSubscriber_logFilter, JSON.stringify(filter), "f");
        __classPrivateFieldSet$b(this, _SocketEventSubscriber_formatter, provider.getNetwork().then((network) => network.formatter), "f");
    }
    get logFilter() { return JSON.parse(__classPrivateFieldGet$b(this, _SocketEventSubscriber_logFilter, "f")); }
    async _emit(provider, message) {
        const formatter = await __classPrivateFieldGet$b(this, _SocketEventSubscriber_formatter, "f");
        provider.emit(__classPrivateFieldGet$b(this, _SocketEventSubscriber_logFilter, "f"), formatter.log(message, provider));
    }
}
_SocketEventSubscriber_logFilter = new WeakMap(), _SocketEventSubscriber_formatter = new WeakMap();
class SocketProvider extends JsonRpcApiProvider {
    constructor(network) {
        super(network);
        _SocketProvider_callbacks.set(this, void 0);
        _SocketProvider_ready.set(this, void 0);
        // Maps each filterId to its subscriber
        _SocketProvider_subs.set(this, void 0);
        // If any events come in before a subscriber has finished
        // registering, queue them
        _SocketProvider_pending.set(this, void 0);
        __classPrivateFieldSet$b(this, _SocketProvider_callbacks, new Map(), "f");
        __classPrivateFieldSet$b(this, _SocketProvider_ready, false, "f");
        __classPrivateFieldSet$b(this, _SocketProvider_subs, new Map(), "f");
        __classPrivateFieldSet$b(this, _SocketProvider_pending, new Map(), "f");
    }
    _getSubscriber(sub) {
        switch (sub.type) {
            case "close":
                return new UnmanagedSubscriber("close");
            case "block":
                return new SocketBlockSubscriber(this);
            case "pending":
                return new SocketPendingSubscriber(this);
            case "event":
                return new SocketEventSubscriber(this, sub.filter);
            case "orphan":
                // Handled auto-matically within AbstractProvider
                // when the log.removed = true
                if (sub.filter.orphan === "drop-log") {
                    return new UnmanagedSubscriber("drop-log");
                }
        }
        return super._getSubscriber(sub);
    }
    _register(filterId, subscriber) {
        __classPrivateFieldGet$b(this, _SocketProvider_subs, "f").set(filterId, subscriber);
        const pending = __classPrivateFieldGet$b(this, _SocketProvider_pending, "f").get(filterId);
        if (pending) {
            for (const message of pending) {
                subscriber._handleMessage(message);
            }
            __classPrivateFieldGet$b(this, _SocketProvider_pending, "f").delete(filterId);
        }
    }
    async send(method, params) {
        const payload = this.prepareRequest(method, params);
        const promise = new Promise((resolve, reject) => {
            __classPrivateFieldGet$b(this, _SocketProvider_callbacks, "f").set(payload.id, { payload, resolve, reject });
        });
        if (__classPrivateFieldGet$b(this, _SocketProvider_ready, "f")) {
            await this._write(JSON.stringify(payload));
        }
        return await promise;
    }
    // Sub-classes must call this once they are connected
    async _start() {
        if (__classPrivateFieldGet$b(this, _SocketProvider_ready, "f")) {
            return;
        }
        __classPrivateFieldSet$b(this, _SocketProvider_ready, true, "f");
        for (const { payload } of __classPrivateFieldGet$b(this, _SocketProvider_callbacks, "f").values()) {
            await this._write(JSON.stringify(payload));
        }
    }
    // Sub-classes must call this for each message
    async _processMessage(message) {
        const result = JSON.parse(message);
        if ("id" in result) {
            const promise = __classPrivateFieldGet$b(this, _SocketProvider_callbacks, "f").get(result.id);
            if (!promise) {
                console.log("Weird... Response for not a thing we sent");
                return;
            }
            __classPrivateFieldGet$b(this, _SocketProvider_callbacks, "f").delete(result.id);
            if ("error" in result) {
                const { message, code, data } = result.error;
                const error = logger$5.makeError(message || "unkonwn error", "SERVER_ERROR", {
                    request: `ws:${JSON.stringify(promise.payload)}`,
                    info: { code, data }
                });
                promise.reject(error);
            }
            else {
                promise.resolve(result.result);
            }
        }
        else if (result.method === "eth_subscription") {
            const filterId = result.params.subscription;
            const subscriber = __classPrivateFieldGet$b(this, _SocketProvider_subs, "f").get(filterId);
            if (subscriber) {
                subscriber._handleMessage(result.params.result);
            }
            else {
                let pending = __classPrivateFieldGet$b(this, _SocketProvider_pending, "f").get(filterId);
                if (pending == null) {
                    pending = [];
                    __classPrivateFieldGet$b(this, _SocketProvider_pending, "f").set(filterId, pending);
                }
                pending.push(result.params.result);
            }
        }
    }
    async _write(message) {
        throw new Error("sub-classes must override this");
    }
}
_SocketProvider_callbacks = new WeakMap(), _SocketProvider_ready = new WeakMap(), _SocketProvider_subs = new WeakMap(), _SocketProvider_pending = new WeakMap();

var __classPrivateFieldSet$a = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$a = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WebSocketProvider_websocket;
class WebSocketProvider extends SocketProvider {
    constructor(url, network) {
        super(network);
        _WebSocketProvider_websocket.set(this, void 0);
        if (typeof (url) === "string") {
            __classPrivateFieldSet$a(this, _WebSocketProvider_websocket, new _WebSocket(url), "f");
        }
        else {
            __classPrivateFieldSet$a(this, _WebSocketProvider_websocket, url, "f");
        }
        this.websocket.onopen = () => {
            this._start();
        };
        this.websocket.onmessage = (message) => {
            this._processMessage(message.data);
        };
    }
    get websocket() { return __classPrivateFieldGet$a(this, _WebSocketProvider_websocket, "f"); }
    async _write(message) {
        this.websocket.send(message);
    }
}
_WebSocketProvider_websocket = new WeakMap();

function isWebSocketLike(value) {
    return (value && typeof (value.send) === "function" &&
        typeof (value.close) === "function");
}
function getDefaultProvider(network, options) {
    if (options == null) {
        options = {};
    }
    if (typeof (network) === "string" && network.match(/^https?:/)) {
        return new JsonRpcProvider(network);
    }
    if (typeof (network) === "string" && network.match(/^wss?:/) || isWebSocketLike(network)) {
        return new WebSocketProvider(network);
    }
    const providers = [];
    if (options.alchemy !== "-") {
        try {
            providers.push(new AlchemyProvider(network, options.alchemy));
        }
        catch (error) {
            console.log(error);
        }
    }
    if (options.ankr !== "-") {
        try {
            providers.push(new AnkrProvider(network, options.ankr));
        }
        catch (error) {
            console.log(error);
        }
    }
    if (options.cloudflare !== "-") {
        try {
            providers.push(new CloudflareProvider(network));
        }
        catch (error) {
            console.log(error);
        }
    }
    if (options.etherscan !== "-") {
        try {
            providers.push(new EtherscanProvider(network, options.etherscan));
        }
        catch (error) {
            console.log(error);
        }
    }
    if (options.infura !== "-") {
        try {
            let projectId = options.infura;
            let projectSecret = undefined;
            if (typeof (projectId) === "object") {
                projectSecret = projectId.projectSecret;
                projectId = projectId.projectId;
            }
            providers.push(new InfuraProvider(network, projectId, projectSecret));
        }
        catch (error) {
            console.log(error);
        }
    }
    if (options.pocket !== "-") {
        try {
            let appId = options.pocket;
            let secretKey = undefined;
            let loadBalancer = undefined;
            if (typeof (appId) === "object") {
                loadBalancer = !!appId.loadBalancer;
                secretKey = appId.secretKey;
                appId = appId.appId;
            }
            providers.push(new PocketProvider(network, appId, secretKey, loadBalancer));
        }
        catch (error) {
            console.log(error);
        }
    }
    if (providers.length === 0) {
        throw new Error("TODO");
    }
    if (providers.length === 1) {
        return providers[0];
    }
    return new FallbackProvider(providers);
}

const IpcSocketProvider = undefined;

var __classPrivateFieldSet$9 = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$9 = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ContractTransactionReceipt_interface, _ContractTransactionResponse_interface;
class EventLog extends Log {
    constructor(log, iface, fragment) {
        super(log, log.provider);
        const args = iface.decodeEventLog(fragment, log.data, log.topics);
        defineProperties(this, { args, fragment, interface: iface });
    }
    get eventName() { return this.fragment.name; }
    get eventSignature() { return this.fragment.format(); }
}
class ContractTransactionReceipt extends TransactionReceipt {
    constructor(iface, provider, tx) {
        super(tx, provider);
        _ContractTransactionReceipt_interface.set(this, void 0);
        __classPrivateFieldSet$9(this, _ContractTransactionReceipt_interface, iface, "f");
    }
    get logs() {
        return super.logs.map((log) => {
            const fragment = log.topics.length ? __classPrivateFieldGet$9(this, _ContractTransactionReceipt_interface, "f").getEvent(log.topics[0]) : null;
            if (fragment) {
                return new EventLog(log, __classPrivateFieldGet$9(this, _ContractTransactionReceipt_interface, "f"), fragment);
            }
            else {
                return log;
            }
        });
    }
}
_ContractTransactionReceipt_interface = new WeakMap();
class ContractTransactionResponse extends TransactionResponse {
    constructor(iface, provider, tx) {
        super(tx, provider);
        _ContractTransactionResponse_interface.set(this, void 0);
        __classPrivateFieldSet$9(this, _ContractTransactionResponse_interface, iface, "f");
    }
    async wait(confirms) {
        const receipt = await super.wait();
        if (receipt == null) {
            return null;
        }
        return new ContractTransactionReceipt(__classPrivateFieldGet$9(this, _ContractTransactionResponse_interface, "f"), this.provider, receipt);
    }
}
_ContractTransactionResponse_interface = new WeakMap();
class ContractEventPayload extends EventPayload {
    constructor(contract, listener, filter, fragment, _log) {
        super(contract, listener, filter);
        const log = new EventLog(_log, contract.interface, fragment);
        const args = contract.interface.decodeEventLog(fragment, log.data, log.topics);
        defineProperties(this, { args, fragment, log });
    }
    get eventName() {
        return this.fragment.name;
    }
    get eventSignature() {
        return this.fragment.format();
    }
    async getBlock() {
        return await this.log.getBlock();
    }
    async getTransaction() {
        return await this.log.getTransaction();
    }
    async getTransactionReceipt() {
        return await this.log.getTransactionReceipt();
    }
}

const version$3 = "@ethersproject/contract@6.0.0-beta.4";

const logger$2 = new Logger(version$3);

var __classPrivateFieldSet$8 = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$8 = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PreparedTopicFilter_filter;
function canCall(value) {
    return (value && typeof (value.call) === "function");
}
function canEstimate(value) {
    return (value && typeof (value.estimateGas) === "function");
}
function canResolve(value) {
    return (value && typeof (value.resolveName) === "function");
}
function canSend(value) {
    return (value && typeof (value.sendTransaction) === "function");
}
function concisify(items) {
    items = Array.from((new Set(items)).values());
    items.sort();
    return items;
}
class PreparedTopicFilter {
    constructor(contract, fragment, args) {
        _PreparedTopicFilter_filter.set(this, void 0);
        defineProperties(this, { fragment });
        if (fragment.inputs.length < args.length) {
            throw new Error("too many arguments");
        }
        // Recursively descend into args and resolve any addresses
        const runner = getRunner(contract.runner, "resolveName");
        const resolver = canResolve(runner) ? runner : null;
        __classPrivateFieldSet$8(this, _PreparedTopicFilter_filter, (async function () {
            const resolvedArgs = await Promise.all(fragment.inputs.map((param, index) => {
                return param.walkAsync(args[index], (type, value) => {
                    if (type === "address") {
                        return resolveAddress(value, resolver);
                    }
                    return value;
                });
            }));
            return contract.interface.encodeFilterTopics(fragment, resolvedArgs);
        })(), "f");
    }
    getTopicFilter() {
        return __classPrivateFieldGet$8(this, _PreparedTopicFilter_filter, "f");
    }
}
_PreparedTopicFilter_filter = new WeakMap();
// A = Arguments passed in as a tuple
// R = The result type of the call (i.e. if only one return type,
//     the qualified type, otherwise Result)
// D = The type the default call will return (i.e. R for view/pure,
//     TransactionResponse otherwise)
//export interface ContractMethod<A extends Array<any> = Array<any>, R = any, D extends R | ContractTransactionResponse = ContractTransactionResponse> {
function _WrappedMethodBase() {
    return Function;
}
function getRunner(value, feature) {
    if (value == null) {
        return null;
    }
    if (typeof (value[feature]) === "function") {
        return value;
    }
    if (value.provider && typeof (value.provider[feature]) === "function") {
        return value.provider;
    }
    return null;
}
function getProvider(value) {
    if (value == null) {
        return null;
    }
    return value.provider || null;
}
async function copyOverrides(arg) {
    // Create a shallow copy (we'll deep-ify anything needed during normalizing)
    const overrides = copyRequest$1(Typed.dereference(arg, "overrides"));
    // Some sanity checking; these are what these methods adds
    //if ((<any>overrides).to) {
    if (overrides.to) {
        logger$2.throwArgumentError("cannot override to", "overrides.to", overrides.to);
    }
    else if (overrides.data) {
        logger$2.throwArgumentError("cannot override data", "overrides.data", overrides.data);
    }
    // Resolve any from
    if (overrides.from) {
        overrides.from = await resolveAddress(overrides.from);
    }
    return overrides;
}
async function resolveArgs(_runner, inputs, args) {
    // Recursively descend into args and resolve any addresses
    const runner = getRunner(_runner, "resolveName");
    const resolver = canResolve(runner) ? runner : null;
    return await Promise.all(inputs.map((param, index) => {
        return param.walkAsync(args[index], (type, value) => {
            if (type === "address") {
                return resolveAddress(value, resolver);
            }
            return value;
        });
    }));
}
class WrappedMethod extends _WrappedMethodBase() {
    constructor(contract, key) {
        super();
        defineProperties(this, {
            name: contract.interface.getFunctionName(key),
            _contract: contract, _key: key
        });
        const proxy = new Proxy(this, {
            // Perform the default operation for this fragment type
            apply: async (target, thisArg, args) => {
                const fragment = target.getFragment(...args);
                if (fragment.constant) {
                    return await target.staticCall(...args);
                }
                return await target.send(...args);
            },
        });
        return proxy;
    }
    // Only works on non-ambiguous keys (refined fragment is always non-ambiguous)
    get fragment() {
        return this._contract.interface.getFunction(this._key);
    }
    getFragment(...args) {
        return this._contract.interface.getFunction(this._key, args);
    }
    async populateTransaction(...args) {
        const fragment = this.getFragment(...args);
        // If an overrides was passed in, copy it and normalize the values
        let overrides = {};
        if (fragment.inputs.length + 1 === args.length) {
            overrides = await copyOverrides(args.pop());
        }
        if (fragment.inputs.length !== args.length) {
            throw new Error("internal error: fragment inputs doesn't match arguments; should not happen");
        }
        const resolvedArgs = await resolveArgs(this._contract.runner, fragment.inputs, args);
        return Object.assign({}, overrides, await resolveProperties({
            to: this._contract.getAddress(),
            data: this._contract.interface.encodeFunctionData(fragment, resolvedArgs)
        }));
    }
    async staticCall(...args) {
        const result = await this.staticCallResult(...args);
        if (result.length === 1) {
            return result[0];
        }
        return result;
    }
    async send(...args) {
        const runner = this._contract.runner;
        if (!canSend(runner)) {
            return logger$2.throwError("contract runner does not support sending transactions", "UNSUPPORTED_OPERATION", {
                operation: "sendTransaction"
            });
        }
        const tx = await runner.sendTransaction(await this.populateTransaction(...args));
        const provider = getProvider(this._contract.runner);
        return new ContractTransactionResponse(this._contract.interface, provider, tx);
    }
    async estimateGas(...args) {
        const runner = getRunner(this._contract.runner, "estimateGas");
        if (!canEstimate(runner)) {
            return logger$2.throwError("contract runner does not support gas estimation", "UNSUPPORTED_OPERATION", {
                operation: "estimateGas"
            });
        }
        return await runner.estimateGas(await this.populateTransaction(...args));
    }
    async staticCallResult(...args) {
        const runner = getRunner(this._contract.runner, "call");
        if (!canCall(runner)) {
            return logger$2.throwError("contract runner does not support calling", "UNSUPPORTED_OPERATION", {
                operation: "call"
            });
        }
        const fragment = this.getFragment(...args);
        const tx = await this.populateTransaction(...args);
        let result = "0x";
        try {
            result = await runner.call(tx);
        }
        catch (error) {
            if (isCallException(error)) {
                throw this._contract.interface.makeError(fragment, error.data, tx);
            }
            throw error;
        }
        return this._contract.interface.decodeFunctionResult(fragment, result);
    }
}
function _WrappedEventBase() {
    return Function;
}
class WrappedEvent extends _WrappedEventBase() {
    constructor(contract, key) {
        super();
        defineProperties(this, {
            name: contract.interface.getEventName(key),
            _contract: contract, _key: key
        });
        return new Proxy(this, {
            // Perform the default operation for this fragment type
            apply: async (target, thisArg, args) => {
                return new PreparedTopicFilter(contract, target.getFragment(...args), args);
            },
        });
    }
    // Only works on non-ambiguous keys
    get fragment() {
        return this._contract.interface.getEvent(this._key);
    }
    getFragment(...args) {
        return this._contract.interface.getEvent(this._key, args);
    }
}
// The combination of TypeScrype, Private Fields and Proxies makes
// the world go boom; so we hide variables with some trickery keeping
// a symbol attached to each BaseContract which its sub-class (even
// via a Proxy) can reach and use to look up its internal values.
const internal = Symbol.for("_ethersInternal_contract");
const internalValues = new WeakMap();
function setInternal(contract, values) {
    internalValues.set(contract[internal], values);
}
function getInternal(contract) {
    return internalValues.get(contract[internal]);
}
function isDeferred(value) {
    return (value && typeof (value) === "object" && ("getTopicFilter" in value) &&
        (typeof (value.getTopicFilter) === "function") && value.fragment);
}
async function getSubTag(contract, event) {
    let fragment;
    let topics;
    if (Array.isArray(event)) {
        // Topics; e.g. `[ "0x1234...89ab" ]`
        fragment = contract.interface.getEvent(event[0]);
        topics = event;
    }
    else if (typeof (event) === "string") {
        // Event name (name or signature); `"Transfer"`
        fragment = contract.interface.getEvent(event);
        topics = [contract.interface.getEventTopic(fragment)];
    }
    else if (isDeferred(event)) {
        // Deferred Topic Filter; e.g. `contract.filter.Transfer(from)`
        fragment = event.fragment;
        topics = await event.getTopicFilter();
    }
    else if ("fragment" in event) {
        // ContractEvent; e.g. `contract.filter.Transfer`
        fragment = event.fragment;
        topics = [contract.interface.getEventTopic(fragment)];
    }
    else {
        console.log(event);
        throw new Error("TODO");
    }
    // Normalize topics and sort TopicSets
    topics = topics.map((t) => {
        if (t == null) {
            return null;
        }
        if (Array.isArray(t)) {
            return concisify(t.map((t) => t.toLowerCase()));
        }
        return t.toLowerCase();
    });
    const tag = topics.map((t) => {
        if (t == null) {
            return "null";
        }
        if (Array.isArray(t)) {
            return t.join("|");
        }
        return t;
    }).join("&");
    return { fragment, tag, topics };
}
async function hasSub(contract, event) {
    const { subs } = getInternal(contract);
    return subs.get((await getSubTag(contract, event)).tag) || null;
}
async function getSub(contract, event) {
    // Make sure our runner can actually subscribe to events
    const provider = getProvider(contract.runner);
    if (!provider) {
        return logger$2.throwError("contract runner does not support subscribing", "UNSUPPORTED_OPERATION", {
            operation: "on"
        });
    }
    const { fragment, tag, topics } = await getSubTag(contract, event);
    const { addr, subs } = getInternal(contract);
    let sub = subs.get(tag);
    if (!sub) {
        const address = (addr ? addr : contract);
        const filter = { address, topics };
        const listener = (log) => {
            const payload = new ContractEventPayload(contract, null, event, fragment, log);
            emit(contract, event, payload.args, payload);
        };
        let started = false;
        const start = () => {
            if (started) {
                return;
            }
            provider.on(filter, listener);
            started = true;
        };
        const stop = () => {
            if (!started) {
                return;
            }
            provider.off(filter, listener);
            started = false;
        };
        sub = { tag, listeners: [], start, stop };
        subs.set(tag, sub);
    }
    return sub;
}
async function _emit(contract, event, args, payload) {
    await lastEmit;
    const sub = await hasSub(contract, event);
    if (!sub) {
        return false;
    }
    const count = sub.listeners.length;
    sub.listeners = sub.listeners.filter(({ listener, once }) => {
        const passArgs = args.slice();
        if (payload) {
            passArgs.push(new ContractEventPayload(contract, (once ? null : listener), event, payload.fragment, payload.log));
        }
        try {
            listener.call(contract, ...passArgs);
        }
        catch (error) { }
        return !once;
    });
    return (count > 0);
}
// We use this to ensure one emit resolves before firing the next to
// ensure correct ordering (note this cannot throw and just adds the
// notice to the event queu using setTimeout).
let lastEmit = Promise.resolve();
async function emit(contract, event, args, payload) {
    try {
        await lastEmit;
    }
    catch (error) { }
    const resultPromise = _emit(contract, event, args, payload);
    lastEmit = resultPromise;
    return await resultPromise;
}
const passProperties = ["then"];
class BaseContract {
    constructor(target, abi, runner = null, _deployTx) {
        const iface = Interface.from(abi);
        defineProperties(this, { target, runner, interface: iface });
        Object.defineProperty(this, internal, { value: {} });
        let addrPromise;
        let addr = null;
        let deployTx = null;
        if (_deployTx) {
            const provider = getProvider(runner);
            deployTx = new ContractTransactionResponse(this.interface, provider, _deployTx);
        }
        let subs = new Map();
        // Resolve the target as the address
        if (typeof (target) === "string") {
            if (isHexString(target)) {
                addr = target;
                addrPromise = Promise.resolve(target);
            }
            else {
                const resolver = getRunner(runner, "resolveName");
                if (!canResolve(resolver)) {
                    throw logger$2.makeError("contract runner does not support name resolution", "UNSUPPORTED_OPERATION", {
                        operation: "resolveName"
                    });
                }
                addrPromise = resolver.resolveName(target).then((addr) => {
                    if (addr == null) {
                        throw new Error("TODO");
                    }
                    getInternal(this).addr = addr;
                    return addr;
                });
            }
        }
        else {
            addrPromise = target.getAddress().then((addr) => {
                if (addr == null) {
                    throw new Error("TODO");
                }
                getInternal(this).addr = addr;
                return addr;
            });
        }
        // Set our private values
        setInternal(this, { addrPromise, addr, deployTx, subs });
        // Add the event filters
        const filters = new Proxy({}, {
            get: (target, _prop, receiver) => {
                // Pass important checks (like `then` for Promise) through
                if (passProperties.indexOf(_prop) >= 0) {
                    return Reflect.get(target, _prop, receiver);
                }
                const prop = String(_prop);
                const result = this.getEvent(prop);
                if (result) {
                    return result;
                }
                throw new Error(`unknown contract event: ${prop}`);
            }
        });
        defineProperties(this, { filters });
        // Return a Proxy that will respond to functions
        return new Proxy(this, {
            get: (target, _prop, receiver) => {
                if (_prop in target || passProperties.indexOf(_prop) >= 0) {
                    return Reflect.get(target, _prop, receiver);
                }
                const prop = String(_prop);
                const result = target.getFunction(prop);
                if (result) {
                    return result;
                }
                throw new Error(`unknown contract method: ${prop}`);
            }
        });
    }
    async getAddress() { return await getInternal(this).addrPromise; }
    async getDeployedCode() {
        const provider = getProvider(this.runner);
        if (!provider) {
            return logger$2.throwError("runner does not support .provider", "UNSUPPORTED_OPERATION", {
                operation: "getDeployedCode"
            });
        }
        const code = await provider.getCode(await this.getAddress());
        if (code === "0x") {
            return null;
        }
        return code;
    }
    async waitForDeployment() {
        // We have the deployement transaction; just use that (throws if deployement fails)
        const deployTx = this.deploymentTransaction();
        if (deployTx) {
            await deployTx.wait();
            return this;
        }
        // Check for code
        const code = await this.getDeployedCode();
        if (code != null) {
            return this;
        }
        // Make sure we can subscribe to a provider event
        const provider = getProvider(this.runner);
        if (provider == null) {
            return logger$2.throwError("contract runner does not support .provider", "UNSUPPORTED_OPERATION", {
                operation: "waitForDeployment"
            });
        }
        return new Promise((resolve, reject) => {
            const checkCode = async () => {
                try {
                    const code = await this.getDeployedCode();
                    if (code != null) {
                        return resolve(this);
                    }
                    provider.once("block", checkCode);
                }
                catch (error) {
                    reject(error);
                }
            };
            checkCode();
        });
    }
    deploymentTransaction() {
        return getInternal(this).deployTx;
    }
    getFunction(key) {
        if (typeof (key) !== "string") {
            key = key.format();
        }
        return (new WrappedMethod(this, key));
    }
    getEvent(key) {
        if (typeof (key) !== "string") {
            key = key.format();
        }
        return (new WrappedEvent(this, key));
    }
    async queryTransaction(hash) {
        // Is this useful?
        throw new Error("@TODO");
    }
    async queryFilter(event, fromBlock = 0, toBlock = "latest") {
        const { addr, addrPromise } = getInternal(this);
        const address = (addr ? addr : (await addrPromise));
        const { fragment, topics } = await getSubTag(this, event);
        const filter = { address, topics, fromBlock, toBlock };
        const provider = getProvider(this.runner);
        if (!provider) {
            return logger$2.throwError("contract runner does not have a provider", "UNSUPPORTED_OPERATION", {
                operation: "queryFilter"
            });
        }
        return (await provider.getLogs(filter)).map((log) => {
            return new EventLog(log, this.interface, fragment);
        });
    }
    async on(event, listener) {
        const sub = await getSub(this, event);
        sub.listeners.push({ listener, once: false });
        sub.start();
        return this;
    }
    async once(event, listener) {
        const sub = await getSub(this, event);
        sub.listeners.push({ listener, once: true });
        sub.start();
        return this;
    }
    async emit(event, ...args) {
        return await emit(this, event, args, null);
    }
    async listenerCount(event) {
        if (event) {
            const sub = await hasSub(this, event);
            if (!sub) {
                return 0;
            }
            return sub.listeners.length;
        }
        const { subs } = getInternal(this);
        let total = 0;
        for (const { listeners } of subs.values()) {
            total += listeners.length;
        }
        return total;
    }
    async listeners(event) {
        if (event) {
            const sub = await hasSub(this, event);
            if (!sub) {
                return [];
            }
            return sub.listeners.map(({ listener }) => listener);
        }
        const { subs } = getInternal(this);
        let result = [];
        for (const { listeners } of subs.values()) {
            result = result.concat(listeners.map(({ listener }) => listener));
        }
        return result;
    }
    async off(event, listener) {
        const sub = await hasSub(this, event);
        if (!sub) {
            return this;
        }
        if (listener) {
            const index = sub.listeners.map(({ listener }) => listener).indexOf(listener);
            if (index >= 0) {
                sub.listeners.splice(index, 1);
            }
        }
        if (listener == null || sub.listeners.length === 0) {
            sub.stop();
            getInternal(this).subs.delete(sub.tag);
        }
        return this;
    }
    async removeAllListeners(event) {
        if (event) {
            const sub = await hasSub(this, event);
            if (!sub) {
                return this;
            }
            sub.stop();
            getInternal(this).subs.delete(sub.tag);
        }
        else {
            const { subs } = getInternal(this);
            for (const { tag, stop } of subs.values()) {
                stop();
                subs.delete(tag);
            }
        }
        return this;
    }
    // Alias for "on"
    async addListener(event, listener) {
        return await this.on(event, listener);
    }
    // Alias for "off"
    async removeListener(event, listener) {
        return await this.off(event, listener);
    }
    static buildClass(abi) {
        class CustomContract extends BaseContract {
            constructor(address, runner = null) {
                super(address, abi, runner);
            }
        }
        return CustomContract;
    }
    ;
    static from(target, abi, runner = null) {
        const contract = new this(target, abi, runner);
        return contract;
    }
}
function _ContractBase() {
    return BaseContract;
}
class Contract extends _ContractBase() {
}

const subsChrs = " !#$%&'()*+,-./<=>?@[]^_`{|}~";
const Word = /^[a-z]*$/i;
function unfold(words, sep) {
    let initial = 97;
    return words.reduce((accum, word) => {
        if (word === sep) {
            initial++;
        }
        else if (word.match(Word)) {
            accum.push(String.fromCharCode(initial) + word);
        }
        else {
            initial = 97;
            accum.push(word);
        }
        return accum;
    }, []);
}
function decode(data, subs) {
    // Replace all the substitutions with their expanded form
    for (let i = subsChrs.length - 1; i >= 0; i--) {
        data = data.split(subsChrs[i]).join(subs.substring(2 * i, 2 * i + 2));
    }
    // Get all tle clumps; each suffix, first-increment and second-increment
    const clumps = [];
    const leftover = data.replace(/(:|([0-9])|([A-Z][a-z]*))/g, (all, item, semi, word) => {
        if (semi) {
            for (let i = parseInt(semi); i >= 0; i--) {
                clumps.push(";");
            }
        }
        else {
            clumps.push(item.toLowerCase());
        }
        return "";
    });
    if (leftover) {
        throw new Error(`leftovers: ${JSON.stringify(leftover)}`);
    }
    return unfold(unfold(clumps, ";"), ":");
}
function decodeOwl(data) {
    if (data[0] !== "0") {
        throw TypeError("unsupported auwl data");
    }
    return decode(data.substring(1 + 2 * subsChrs.length), data.substring(1, 1 + 2 * subsChrs.length));
}

const version$2 = "@ethersproject/wordlists@6.0.0-beta.2";

const logger$1 = new Logger(version$2);

class Wordlist {
    constructor(locale) {
        defineProperties(this, { locale });
    }
    // Subclasses may override this
    split(mnemonic) {
        return mnemonic.toLowerCase().split(/ +/g);
    }
    // Subclasses may override this
    join(words) {
        return words.join(" ");
    }
}

// Use the encode-latin.js script to create the necessary
// data files to be consumed by this class
var __classPrivateFieldSet$7 = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$7 = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WordlistOwl_instances, _WordlistOwl_data, _WordlistOwl_checksum, _WordlistOwl_words, _WordlistOwl_loadWords;
class WordlistOwl extends Wordlist {
    constructor(locale, data, checksum) {
        super(locale);
        _WordlistOwl_instances.add(this);
        _WordlistOwl_data.set(this, void 0);
        _WordlistOwl_checksum.set(this, void 0);
        _WordlistOwl_words.set(this, void 0);
        __classPrivateFieldSet$7(this, _WordlistOwl_data, data, "f");
        __classPrivateFieldSet$7(this, _WordlistOwl_checksum, checksum, "f");
        __classPrivateFieldSet$7(this, _WordlistOwl_words, null, "f");
    }
    get _data() { return __classPrivateFieldGet$7(this, _WordlistOwl_data, "f"); }
    _decodeWords() {
        return decodeOwl(__classPrivateFieldGet$7(this, _WordlistOwl_data, "f"));
    }
    getWord(index) {
        const words = __classPrivateFieldGet$7(this, _WordlistOwl_instances, "m", _WordlistOwl_loadWords).call(this);
        if (index < 0 || index >= words.length) {
            logger$1.throwArgumentError(`invalid word index: ${index}`, "index", index);
        }
        return words[index];
    }
    getWordIndex(word) {
        return __classPrivateFieldGet$7(this, _WordlistOwl_instances, "m", _WordlistOwl_loadWords).call(this).indexOf(word);
    }
}
_WordlistOwl_data = new WeakMap(), _WordlistOwl_checksum = new WeakMap(), _WordlistOwl_words = new WeakMap(), _WordlistOwl_instances = new WeakSet(), _WordlistOwl_loadWords = function _WordlistOwl_loadWords() {
    if (__classPrivateFieldGet$7(this, _WordlistOwl_words, "f") == null) {
        const words = this._decodeWords();
        // Verify the computed list matches the official list
        const checksum = id(words.join("\n") + "\n");
        /* c8 ignore start */
        if (checksum !== __classPrivateFieldGet$7(this, _WordlistOwl_checksum, "f")) {
            throw new Error(`BIP39 Wordlist for ${this.locale} FAILED`);
        }
        /* c8 ignore stop */
        __classPrivateFieldSet$7(this, _WordlistOwl_words, words, "f");
    }
    return __classPrivateFieldGet$7(this, _WordlistOwl_words, "f");
};

const words = "0erleonalorenseinceregesticitStanvetearctssi#ch2Athck&tneLl0And#Il.yLeOutO=S|S%b/ra@SurdU'0Ce[Cid|CountCu'Hie=IdOu,-Qui*Ro[TT]T%T*[Tu$0AptDD-tD*[Ju,M.UltV<)Vi)0Rob-0FairF%dRaid0A(EEntRee0Ead0MRRp%tS!_rmBumCoholErtI&LLeyLowMo,O}PhaReadySoT Ways0A>urAz(gOngOuntU'd0Aly,Ch%Ci|G G!GryIm$K!Noun)Nu$O` Sw T&naTiqueXietyY1ArtOlogyPe?P!Pro=Ril1ChCt-EaEnaGueMMedM%MyOundR<+Re,Ri=RowTTefa@Ti,Tw%k0KPe@SaultSetSi,SumeThma0H!>OmTa{T&dT.udeTra@0Ct]D.Gu,NtTh%ToTumn0Era+OcadoOid0AkeA*AyEsomeFulKw?d0Is:ByChel%C#D+GL<)Lc#y~MbooN<aNn RRelyRga(R*lSeS-SketTt!3A^AnAutyCau'ComeEfF%eG(Ha=H(dLie=LowLtN^Nef./TrayTt Twe&Y#d3Cyc!DKeNdOlogyRdR`Tt _{AdeAmeAnketA,EakE[IndOodO[omOu'UeUrUsh_rdAtDyIlMbNeNusOkO,Rd R(gRrowSsTtomUn)XY_{etA(AndA[A=EadEezeI{Id+IefIghtIngIskOccoliOk&OnzeOomO` OwnUsh2Bb!DdyD+tFf$oIldLbLkL!tNd!Nk Rd&Rg R,SS(e[SyTt Y Zz:Bba+B(B!CtusGeKe~LmM aMpNN$N)lNdyNn#NoeNvasNy#Pab!P.$Pta(RRb#RdRgoRpetRryRtSeShS(o/!Su$TT$ogT^Teg%yTt!UghtU'Ut]Ve3Il(gL yM|NsusNturyRe$Rta(_irAlkAmp]An+AosApt Ar+A'AtEapE{Ee'EfErryE,I{&IefIldIm}yOi)Oo'R#-U{!UnkUrn0G?Nnam#Rc!Tiz&TyVil_imApArifyAwAyE<ErkEv I{I|IffImbIn-IpO{OgO'O`OudOwnUbUmpU, Ut^_^A,C#utDeFfeeIlInL!@L%LumnMb(eMeMf%tM-Mm#Mp<yNc tNdu@NfirmNg*[N}@Nsid NtrolNv()OkOlPp PyR$ReRnR*@/Tt#U^UntryUp!Ur'Us(V Yo>_{Ad!AftAmA}AshAt AwlAzyEamEd.EekEwI{etImeIspIt-OpO[Ou^OwdUci$UelUi'Umb!Un^UshYY,$2BeLtu*PPbo?dRiousRr|Rta(R=Sh]/omTe3C!:DMa+MpN)Ng R(gShUght WnY3AlBa>BrisCadeCemb CideCl(eC%a>C*a'ErF&'F(eFyG*eLayLiv M<dMi'Ni$Nti,NyP?tP&dPos.P`PutyRi=ScribeS tSignSkSpair/royTailTe@VelopVi)Vo>3AgramAlAm#dAryCeE'lEtFf G.$Gn.yLemmaNn NosaurRe@RtSag*eScov Sea'ShSmi[S%d Splay/<)V tVideV%)Zzy5Ct%Cum|G~Lph(Ma(Na>NkeyN%OrSeUb!Ve_ftAg#AmaA,-AwEamE[IftIllInkIpI=OpUmY2CkMbNeR(g/T^Ty1Arf1Nam-:G G!RlyRnR`Sily/Sy1HoOlogyOnomy0GeItUca>1F%t0G1GhtTh 2BowD E@r-Eg<tEm|Eph<tEvat%I>Se0B?kBodyBra)Er+Ot]PloyPow Pty0Ab!A@DD![D%'EmyErgyF%)Ga+G(eH<)JoyLi,OughR-hRollSu*T Ti*TryVelope1Isode0U$Uip0AA'OdeOs]R%Upt0CapeSayS&)Ta>0Ern$H-s1Id&)IlOkeOl=1A@Amp!Ce[Ch<+C.eCludeCu'Ecu>Erci'Hau,Hib.I!I,ItOt-P<dPe@Pi*Pla(Po'P*[T&dTra0EEbrow:Br-CeCultyDeIntI`~L'MeMilyMousNNcyNtasyRmSh]TT$Th TigueUltV%.e3Atu*Bru?yD $EEdElMa!N)/iv$T^V W3B Ct]EldGu*LeLmLt N$NdNeNg NishReRmR,Sc$ShTT}[X_gAmeAshAtAv%EeIghtIpOatO{O%Ow UidUshY_mCusGIlLd~owOdOtR)Re,R+tRkRtu}RumRw?dSsil/ UndX_gi!AmeEqu|EshI&dIn+OgOntO,OwnOz&U.2ElNNnyRna)RyTu*:D+tInLaxy~ yMePRa+Rba+Rd&Rl-Rm|SSpTeTh U+Ze3N $NiusN*Nt!Nu(e/u*2O,0AntFtGg!Ng RaffeRlVe_dAn)A*A[IdeImp'ObeOomOryO=OwUe_tDde[LdOdO'RillaSpelSsipV nWn_bA)A(AntApeA[Av.yEatE&IdIefItOc yOupOwUnt_rdE[IdeIltIt?N3M:B.IrLfMm M, NdPpyRb%RdRshR=,TVeWkZ?d3AdAl`ArtAvyD+hogIght~oLmetLpNRo3Dd&Gh~NtPRe/%y5BbyCkeyLdLeLiday~owMeNeyOdPeRnRr%R'Sp.$/TelUrV 5BGeM<Mb!M%Nd*dNgryNtRd!RryRtSb<d3Brid:1EOn0EaEntifyLe2N%e4LLeg$L}[0A+Ita>M&'Mu}Pa@Po'Pro=Pul'0ChCludeComeC*a'DexD-a>Do%Du,ryF<tFl-tF%mHa!H .Iti$Je@JuryMa>N Noc|PutQuiryS<eSe@SideSpi*/$lTa@T e,ToVe,V.eVol=3On0L<dOla>Sue0Em1Ory:CketGu?RZz3AlousAns~yWel9BInKeUr}yY5D+I)MpNg!Ni%Nk/:Ng?oo3EnEpT^upY3CkDD}yNdNgdomSsTT^&TeTt&Wi4EeIfeO{Ow:BBelB%Dd DyKeMpNgua+PtopR+T T(UghUndryVaWWnWsu.Y Zy3Ad AfArnA=Ctu*FtGG$G&dIsu*M#NdNg`NsOp?dSs#Tt Vel3ArB tyBr?yC&'FeFtGhtKeMbM.NkOnQuid/Tt!VeZ?d5AdAnB, C$CkG-NelyNgOpTt yUdUn+VeY$5CkyGga+Mb N?N^Xury3R-s:Ch(eDG-G}tIdIlInJ%KeMm$NNa+Nda>NgoNs]Nu$P!Rb!R^Rg(R(eRketRria+SkSs/ T^T i$ThTrixTt XimumZe3AdowAnAsu*AtCh<-D$DiaLodyLtMb M%yNt]NuRcyR+R.RryShSsa+T$Thod3Dd!DnightLk~]M-NdNimumN%Nu>Rac!Rr%S ySs/akeXXedXtu*5Bi!DelDifyMM|N.%NkeyN, N`OnR$ReRn(gSqu.oTh T]T%Unta(U'VeVie5ChFf(LeLtiplySc!SeumShroomS-/Tu$3Self/ yTh:I=MePk(Rrow/yT]Tu*3ArCkEdGati=G!@I` PhewR=/TTw%kUtr$V WsXt3CeGht5B!I'M(eeOd!Rm$R`SeTab!TeTh(gTi)VelW5C!?Mb R'T:K0EyJe@Li+Scu*S =Ta(Vious0CurE<Tob 0Or1FF Fi)T&2L1Ay0DI=Ymp-0It0CeEI#L(eLy1EnEraIn]Po'T]1An+B.Ch?dD D(?yG<I|Ig($Ph<0Tr-h0H 0Tdo%T TputTside0AlEnEr0NN 0Yg&0/ 0O}:CtDd!GeIrLa)LmNdaNelN-N` P RadeR|RkRrotRtySsT^ThTi|TrolTt nU'VeYm|3A)AnutArAs<tL-<NN$tyNcilOp!Pp Rfe@Rm.Rs#T2O}OtoRa'Ys-$0AnoCn-Ctu*E)GGe#~LotNkO} Pe/olT^Zza_)A}tA,-A>AyEa'Ed+U{UgUn+2EmEtIntL?LeLi)NdNyOlPul?Rt]S.]Ssib!/TatoTt yV tyWd W _@i)Ai'Ed-tEf Epa*Es|EttyEv|I)IdeIm?yIntI%.yIs#Iva>IzeOb!mO)[Odu)Of.OgramOje@Omo>OofOp tyOsp O>@OudOvide2Bl-Dd(g~LpL'Mpk(N^PilPpyR^a'R.yRpo'R'ShTZz!3Ramid:99Al.yAntumArt E,]I{ItIzO>:Bb.Cco#CeCkD?DioIlInI'~yMpN^NdomN+PidReTeTh V&WZ%3AdyAlAs#BelBuildC$lCei=CipeC%dCyc!Du)F!@F%mFu'G]G*tGul?Je@LaxLea'LiefLyMa(Memb M(dMo=Nd NewNtOp&PairPeatPla)P%tQui*ScueSemb!Si,Sour)Sp#'SultTi*T*atTurnUn]Ve$ViewW?d2Y`m0BBb#CeChDeD+F!GhtGidNgOtPp!SkTu$V$V 5AdA,BotBu,CketM<)OfOkieOmSeTa>UghUndU>Y$5Bb DeGLeNNwayR$:DDd!D}[FeIlLadLm#L#LtLu>MeMp!NdTisfyToshiU)Usa+VeY1A!AnA*Att E}HemeHoolI&)I[%sOrp]OutRapRe&RiptRub1AAr^As#AtC#dC*tCt]Cur.yEdEkGm|Le@~M(?Ni%N'Nt&)RiesRvi)Ss]Tt!TupV&_dowAftAllowA*EdEllEriffIeldIftI}IpIv O{OeOotOpOrtOuld O=RimpRugUff!Y0Bl(gCkDeE+GhtGnL|Lk~yLv Mil?Mp!N)NgR&/ Tua>XZe1A>Et^IIllInIrtUll0AbAmEepEnd I)IdeIghtImOg<OtOwUsh0AllArtI!OkeOo`0A{AkeApIffOw0ApCc Ci$CkDaFtL?Ldi LidLut]L=Me#eNgOnRryRtUlUndUpUr)U`0A)A*Ati$AwnEakEci$EedEllEndH eI)Id IkeInIr.L.OilOns%O#OrtOtRayReadR(gY0Ua*UeezeUir*l_b!AdiumAffA+AirsAmpAndArtA>AyEakEelEmEpE*oI{IllIngO{Oma^O}OolOryO=Ra>gyReetRikeR#gRugg!Ud|UffUmb!Y!0Bje@Bm.BwayC)[ChDd&Ff G?G+,ItMm NNnyN'tP PplyP*meReRfa)R+Rpri'RroundR=ySpe@/a(1AllowAmpApArmE?EetIftImIngIt^Ord1MbolMptomRup/em:B!Ck!GIlL|LkNkPeR+tSk/eTtooXi3A^Am~NN<tNnisNtRm/Xt_nkAtEmeEnE%yE*EyIngIsOughtReeRi=RowUmbUnd 0CketDeG LtMb MeNyPRedSsueT!5A,BaccoDayDdl EGe` I!tK&MatoM%rowNeNgueNightOlO`PP-Pp!R^RnadoRtoi'SsT$Uri,W?dW WnY_{AdeAff-Ag-A(Ansf ApAshA=lAyEatEeEndI$IbeI{Igg ImIpOphyOub!U{UeUlyUmpetU,U`Y2BeIt]Mb!NaN}lRkeyRnRt!1El=EntyI)InI,O1PeP-$:5Ly5B*lla0Ab!Awa*C!Cov D DoFairFoldHappyIf%mIqueItIv 'KnownLo{TilUsu$Veil1Da>GradeHoldOnP Set1B<Ge0A+EEdEfulE![U$0Il.y:C<tCuumGueLidL!yL=NNishP%Rious/Ult3H-!L=tNd%Ntu*NueRbRifyRs]RyS'lT <3Ab!Br<tCiousCt%yDeoEw~a+Nta+Ol(Rtu$RusSaS.Su$T$Vid5C$I)IdLc<oLumeTeYa+:GeG#ItLk~LnutNtRfa*RmRri%ShSp/eT VeY3Al`Ap#ArA'lA` BDd(gEk&dIrdLcome/T_!AtEatEelEnE*IpIsp 0DeD`FeLd~NNdowNeNgNkNn Nt ReSdomSeShT}[5LfM<Nd OdOlRdRkRldRryR`_pE{E,!I,I>Ong::Rd3Ar~ow9UUngU`:3BraRo9NeO";
const checksum = "0x3c8acc1e7b08d8e76f9fda015ef48dc8c710a73cb7e0f77b2c18a9b5a7adde60";
class LangEn extends WordlistOwl {
    constructor() { super("en", words, checksum); }
}
const langEn = new LangEn();

const version$1 = "@ethersproject/wallet@6.0.0-beta.8";

const logger = new Logger(version$1);

const wordlists = Object.freeze({
    en: langEn
});

const Base64 = ")!@#$%^&*(ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
function decodeBits(width, data) {
    const maxValue = (1 << width) - 1;
    const result = [];
    let accum = 0, bits = 0, flood = 0;
    for (let i = 0; i < data.length; i++) {
        // Accumulate 6 bits of data
        accum = ((accum << 6) | Base64.indexOf(data[i]));
        bits += 6;
        // While we have enough for a word...
        while (bits >= width) {
            // ...read the word
            const value = (accum >> (bits - width));
            accum &= (1 << (bits - width)) - 1;
            bits -= width;
            // A value of 0 indicates we exceeded maxValue, it
            // floods over into the next value
            if (value === 0) {
                flood += maxValue;
            }
            else {
                result.push(value + flood);
                flood = 0;
            }
        }
    }
    return result;
}

function decodeOwlA(data, accents) {
    let words = decodeOwl(data).join(",");
    // Inject the accents
    accents.split(/,/g).forEach((accent) => {
        const match = accent.match(/^([a-z]*)([0-9]+)([0-9])(.*)$/);
        if (!match) {
            throw new Error("internal error parsing accents");
        }
        let posOffset = 0;
        const positions = decodeBits(parseInt(match[3]), match[4]);
        const charCode = parseInt(match[2]);
        const regex = new RegExp(`([${match[1]}])`, "g");
        words = words.replace(regex, (all, letter) => {
            const rem = --positions[posOffset];
            if (rem === 0) {
                letter = String.fromCharCode(letter.charCodeAt(0), charCode);
                posOffset++;
            }
            return letter;
        });
    });
    return words.split(",");
}

var __classPrivateFieldSet$6 = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$6 = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WordlistOwlA_accent;
class WordlistOwlA extends WordlistOwl {
    constructor(locale, data, accent, checksum) {
        super(locale, data, checksum);
        _WordlistOwlA_accent.set(this, void 0);
        __classPrivateFieldSet$6(this, _WordlistOwlA_accent, accent, "f");
    }
    get _accent() { return __classPrivateFieldGet$6(this, _WordlistOwlA_accent, "f"); }
    _decodeWords() {
        return decodeOwlA(this._data, this._accent);
    }
}
_WordlistOwlA_accent = new WeakMap();

// Returns a byte with the MSB bits set
function getUpperMask(bits) {
    return ((1 << bits) - 1) << (8 - bits) & 0xff;
}
// Returns a byte with the LSB bits set
function getLowerMask(bits) {
    return ((1 << bits) - 1) & 0xff;
}
function mnemonicToEntropy(mnemonic, wordlist = langEn) {
    logger.assertNormalize("NFKD");
    if (wordlist == null) {
        wordlist = langEn;
    }
    const words = wordlist.split(mnemonic);
    if ((words.length % 3) !== 0 || words.length < 12 || words.length > 24) {
        logger.throwArgumentError("invalid mnemonic length", "mnemonic", "[ REDACTED ]");
    }
    const entropy = arrayify(new Uint8Array(Math.ceil(11 * words.length / 8)));
    let offset = 0;
    for (let i = 0; i < words.length; i++) {
        let index = wordlist.getWordIndex(words[i].normalize("NFKD"));
        if (index === -1) {
            logger.throwArgumentError(`invalid mnemonic word at index ${i}`, "mnemonic", "[ REDACTED ]");
        }
        for (let bit = 0; bit < 11; bit++) {
            if (index & (1 << (10 - bit))) {
                entropy[offset >> 3] |= (1 << (7 - (offset % 8)));
            }
            offset++;
        }
    }
    const entropyBits = 32 * words.length / 3;
    const checksumBits = words.length / 3;
    const checksumMask = getUpperMask(checksumBits);
    const checksum = arrayify(sha256(entropy.slice(0, entropyBits / 8)))[0] & checksumMask;
    if (checksum !== (entropy[entropy.length - 1] & checksumMask)) {
        logger.throwArgumentError("invalid mnemonic checksum", "mnemonic", "[ REDACTED ]");
    }
    return hexlify(entropy.slice(0, entropyBits / 8));
}
function entropyToMnemonic(entropy, wordlist = langEn) {
    if ((entropy.length % 4) || entropy.length < 16 || entropy.length > 32) {
        logger.throwArgumentError("invalid entropy size", "entropy", "[ REDACTED ]");
    }
    if (wordlist == null) {
        wordlist = langEn;
    }
    const indices = [0];
    let remainingBits = 11;
    for (let i = 0; i < entropy.length; i++) {
        // Consume the whole byte (with still more to go)
        if (remainingBits > 8) {
            indices[indices.length - 1] <<= 8;
            indices[indices.length - 1] |= entropy[i];
            remainingBits -= 8;
            // This byte will complete an 11-bit index
        }
        else {
            indices[indices.length - 1] <<= remainingBits;
            indices[indices.length - 1] |= entropy[i] >> (8 - remainingBits);
            // Start the next word
            indices.push(entropy[i] & getLowerMask(8 - remainingBits));
            remainingBits += 3;
        }
    }
    // Compute the checksum bits
    const checksumBits = entropy.length / 4;
    const checksum = parseInt(sha256(entropy).substring(2, 4), 16) & getUpperMask(checksumBits);
    // Shift the checksum into the word indices
    indices[indices.length - 1] <<= checksumBits;
    indices[indices.length - 1] |= (checksum >> (8 - checksumBits));
    return wordlist.join(indices.map((index) => wordlist.getWord(index)));
}
const _guard$1 = {};
class Mnemonic {
    constructor(guard, entropy, phrase, password, wordlist) {
        if (password == null) {
            password = "";
        }
        if (wordlist == null) {
            wordlist = langEn;
        }
        logger.assertPrivate(guard, _guard$1, "Mnemonic");
        defineProperties(this, { phrase, password, wordlist, entropy });
    }
    computeSeed() {
        const salt = toUtf8Bytes("mnemonic" + this.password, UnicodeNormalizationForm.NFKD);
        return pbkdf2(toUtf8Bytes(this.phrase, UnicodeNormalizationForm.NFKD), salt, 2048, 64, "sha512");
    }
    static fromPhrase(phrase, password, wordlist) {
        // Normalize the case and space; throws if invalid
        const entropy = mnemonicToEntropy(phrase, wordlist);
        phrase = entropyToMnemonic(logger.getBytes(entropy), wordlist);
        return new Mnemonic(_guard$1, entropy, phrase, password, wordlist);
    }
    static fromEntropy(_entropy, password, wordlist) {
        const entropy = logger.getBytes(_entropy, "entropy");
        const phrase = entropyToMnemonic(entropy, wordlist);
        return new Mnemonic(_guard$1, hexlify(entropy), phrase, password, wordlist);
    }
    static entropyToPhrase(_entropy, wordlist) {
        const entropy = logger.getBytes(_entropy, "entropy");
        return entropyToMnemonic(entropy, wordlist);
    }
    static phraseToEntropy(phrase, wordlist) {
        return mnemonicToEntropy(phrase, wordlist);
    }
    static isValidMnemonic(phrase, wordlist) {
        try {
            mnemonicToEntropy(phrase, wordlist);
            return true;
        }
        catch (error) { }
        return false;
    }
}

var __classPrivateFieldSet$5 = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$5 = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BaseWallet_signingKey;
class BaseWallet extends AbstractSigner {
    constructor(privateKey, provider) {
        super(provider);
        _BaseWallet_signingKey.set(this, void 0);
        __classPrivateFieldSet$5(this, _BaseWallet_signingKey, privateKey, "f");
        const address = computeAddress(this.signingKey.publicKey);
        defineProperties(this, { address });
    }
    // Store these in getters to reduce visibility in console.log
    get signingKey() { return __classPrivateFieldGet$5(this, _BaseWallet_signingKey, "f"); }
    get privateKey() { return this.signingKey.privateKey; }
    async getAddress() { return this.address; }
    connect(provider) {
        return new BaseWallet(__classPrivateFieldGet$5(this, _BaseWallet_signingKey, "f"), provider);
    }
    async signTransaction(_tx) {
        // Replace any Addressable or ENS name with an address
        const tx = Object.assign({}, _tx, await resolveProperties({
            to: (_tx.to ? resolveAddress(_tx.to, this.provider) : undefined),
            from: (_tx.from ? resolveAddress(_tx.from, this.provider) : undefined)
        }));
        if (tx.from != null) {
            if (getAddress(tx.from) !== this.address) {
                logger.throwArgumentError("transaction from address mismatch", "tx.from", _tx.from);
            }
            delete tx.from;
        }
        // Build the transaction
        const btx = Transaction.from(tx);
        btx.signature = this.signingKey.sign(btx.unsignedHash);
        return btx.serialized;
    }
    async signMessage(message) {
        return this.signingKey.sign(hashMessage(message)).serialized;
    }
    async signTypedData(domain, types, value) {
        // Populate any ENS names
        const populated = await TypedDataEncoder.resolveNames(domain, types, value, async (name) => {
            if (this.provider == null) {
                return logger.throwError("cannot resolve ENS names without a provider", "UNSUPPORTED_OPERATION", {
                    operation: "resolveName",
                    info: { name }
                });
            }
            const address = await this.provider.resolveName(name);
            if (address == null) {
                return logger.throwError("unconfigured ENS name", "UNCONFIGURED_NAME", {
                    value: name
                });
            }
            return address;
        });
        return this.signingKey.sign(TypedDataEncoder.hash(populated.domain, types, populated.value)).serialized;
    }
}
_BaseWallet_signingKey = new WeakMap();

var __classPrivateFieldGet$4 = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet$4 = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _HDNodeWallet_fromSeed, _HDNodeWalletManager_root;
const defaultPath$1 = "m/44'/60'/0'/0/0";
// "Bitcoin seed"
const MasterSecret = new Uint8Array([66, 105, 116, 99, 111, 105, 110, 32, 115, 101, 101, 100]);
const HardenedBit = 0x80000000;
const N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
const Nibbles = "0123456789abcdef";
function zpad(value, length) {
    let result = "";
    while (value) {
        result = Nibbles[value % 16] + result;
        value = Math.trunc(value / 16);
    }
    while (result.length < length * 2) {
        result = "0" + result;
    }
    return "0x" + result;
}
function encodeBase58Check(_value) {
    const value = logger.getBytes(_value);
    const check = dataSlice(sha256(sha256(value)), 0, 4);
    const bytes = concat([value, check]);
    return encodeBase58(bytes);
}
const _guard = {};
function ser_I(index, chainCode, publicKey, privateKey) {
    const data = new Uint8Array(37);
    if (index & HardenedBit) {
        if (privateKey == null) {
            return logger.throwError("cannot derive child of neutered node", "UNSUPPORTED_OPERATION", {
                operation: "deriveChild"
            });
        }
        // Data = 0x00 || ser_256(k_par)
        data.set(arrayify(privateKey), 1);
    }
    else {
        // Data = ser_p(point(k_par))
        data.set(arrayify(publicKey));
    }
    // Data += ser_32(i)
    for (let i = 24; i >= 0; i -= 8) {
        data[33 + (i >> 3)] = ((index >> (24 - i)) & 0xff);
    }
    const I = arrayify(computeHmac("sha512", chainCode, data));
    return { IL: I.slice(0, 32), IR: I.slice(32) };
}
function derivePath(node, path) {
    const components = path.split("/");
    if (components.length === 0 || (components[0] === "m" && node.depth !== 0)) {
        throw new Error("invalid path - " + path);
    }
    if (components[0] === "m") {
        components.shift();
    }
    let result = node;
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.match(/^[0-9]+'$/)) {
            const index = parseInt(component.substring(0, component.length - 1));
            if (index >= HardenedBit) {
                throw new Error("invalid path index - " + component);
            }
            result = result.deriveChild(HardenedBit + index);
        }
        else if (component.match(/^[0-9]+$/)) {
            const index = parseInt(component);
            if (index >= HardenedBit) {
                throw new Error("invalid path index - " + component);
            }
            result = result.deriveChild(index);
        }
        else {
            throw new Error("invalid path component - " + component);
        }
    }
    return result;
}
class HDNodeWallet extends BaseWallet {
    constructor(guard, signingKey, parentFingerprint, chainCode, path, index, depth, mnemonic, provider) {
        super(signingKey, provider);
        logger.assertPrivate(guard, _guard, "HDNodeWallet");
        defineProperties(this, { publicKey: signingKey.compressedPublicKey });
        const fingerprint = dataSlice(ripemd160(sha256(this.publicKey)), 0, 4);
        defineProperties(this, {
            parentFingerprint, fingerprint,
            chainCode, path, index, depth
        });
        defineProperties(this, { mnemonic });
    }
    connect(provider) {
        return new HDNodeWallet(_guard, this.signingKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, this.mnemonic, provider);
    }
    get extendedKey() {
        // We only support the mainnet values for now, but if anyone needs
        // testnet values, let me know. I believe current sentiment is that
        // we should always use mainnet, and use BIP-44 to derive the network
        //   - Mainnet: public=0x0488B21E, private=0x0488ADE4
        //   - Testnet: public=0x043587CF, private=0x04358394
        if (this.depth >= 256) {
            throw new Error("Depth too large!");
        }
        return encodeBase58Check(concat([
            "0x0488ADE4", zpad(this.depth, 1), this.parentFingerprint,
            zpad(this.index, 4), this.chainCode,
            concat(["0x00", this.privateKey])
        ]));
    }
    hasPath() { return (this.path != null); }
    neuter() {
        return new HDNodeVoidWallet(_guard, this.address, this.publicKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, this.provider);
    }
    deriveChild(_index) {
        const index = logger.getNumber(_index, "index");
        if (index > 0xffffffff) {
            throw new Error("invalid index - " + String(index));
        }
        // Base path
        let path = this.path;
        if (path) {
            path += "/" + (index & ~HardenedBit);
            if (index & HardenedBit) {
                path += "'";
            }
        }
        const { IR, IL } = ser_I(index, this.chainCode, this.publicKey, this.privateKey);
        const ki = new SigningKey(toHex((toBigInt(IL) + BigInt(this.privateKey)) % N, 32));
        return new HDNodeWallet(_guard, ki, this.fingerprint, hexlify(IR), path, index, this.depth + 1, this.mnemonic, this.provider);
    }
    derivePath(path) {
        return derivePath(this, path);
    }
    static fromSeed(seed) {
        return __classPrivateFieldGet$4(HDNodeWallet, _a, "m", _HDNodeWallet_fromSeed).call(HDNodeWallet, seed, null);
    }
    static fromPhrase(phrase, password = "", path = defaultPath$1, wordlist = langEn) {
        if (!path) {
            path = defaultPath$1;
        }
        const mnemonic = Mnemonic.fromPhrase(phrase, password, wordlist);
        return __classPrivateFieldGet$4(HDNodeWallet, _a, "m", _HDNodeWallet_fromSeed).call(HDNodeWallet, mnemonic.computeSeed(), mnemonic).derivePath(path);
    }
    static fromMnemonic(mnemonic, path = defaultPath$1) {
        if (!path) {
            path = defaultPath$1;
        }
        return __classPrivateFieldGet$4(HDNodeWallet, _a, "m", _HDNodeWallet_fromSeed).call(HDNodeWallet, mnemonic.computeSeed(), mnemonic).derivePath(path);
    }
    static fromExtendedKey(extendedKey) {
        const bytes = arrayify(decodeBase58(extendedKey)); // @TODO: redact
        if (bytes.length !== 82 || encodeBase58Check(bytes.slice(0, 78)) !== extendedKey) {
            logger.throwArgumentError("invalid extended key", "extendedKey", "[ REDACTED ]");
        }
        const depth = bytes[4];
        const parentFingerprint = hexlify(bytes.slice(5, 9));
        const index = parseInt(hexlify(bytes.slice(9, 13)).substring(2), 16);
        const chainCode = hexlify(bytes.slice(13, 45));
        const key = bytes.slice(45, 78);
        switch (hexlify(bytes.slice(0, 4))) {
            // Public Key
            case "0x0488b21e":
            case "0x043587cf": {
                const publicKey = hexlify(key);
                return new HDNodeVoidWallet(_guard, computeAddress(publicKey), publicKey, parentFingerprint, chainCode, null, index, depth, null);
            }
            // Private Key
            case "0x0488ade4":
            case "0x04358394 ":
                if (key[0] !== 0) {
                    break;
                }
                return new HDNodeWallet(_guard, new SigningKey(key.slice(1)), parentFingerprint, chainCode, null, index, depth, null, null);
        }
        return logger.throwArgumentError("invalid extended key prefix", "extendedKey", "[ REDACTED ]");
    }
    static createRandom(password = "", path = defaultPath$1, wordlist = langEn) {
        if (!path) {
            path = defaultPath$1;
        }
        const mnemonic = Mnemonic.fromEntropy(randomBytes(16), password, wordlist);
        return __classPrivateFieldGet$4(HDNodeWallet, _a, "m", _HDNodeWallet_fromSeed).call(HDNodeWallet, mnemonic.computeSeed(), mnemonic).derivePath(path);
    }
}
_a = HDNodeWallet, _HDNodeWallet_fromSeed = function _HDNodeWallet_fromSeed(_seed, mnemonic) {
    const seed = logger.getBytes(_seed, "seed");
    if (seed.length < 16 || seed.length > 64) {
        throw new Error("invalid seed");
    }
    const I = arrayify(computeHmac("sha512", MasterSecret, seed));
    const signingKey = new SigningKey(hexlify(I.slice(0, 32)));
    return new HDNodeWallet(_guard, signingKey, "0x00000000", hexlify(I.slice(32)), "m", 0, 0, mnemonic, null);
};
class HDNodeVoidWallet extends VoidSigner {
    constructor(guard, address, publicKey, parentFingerprint, chainCode, path, index, depth, provider) {
        super(address, provider);
        logger.assertPrivate(guard, _guard, "HDNodeVoidWallet");
        defineProperties(this, { publicKey });
        const fingerprint = dataSlice(ripemd160(sha256(publicKey)), 0, 4);
        defineProperties(this, {
            publicKey, fingerprint, parentFingerprint, chainCode, path, index, depth
        });
    }
    connect(provider) {
        return new HDNodeVoidWallet(_guard, this.address, this.publicKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, provider);
    }
    get extendedKey() {
        // We only support the mainnet values for now, but if anyone needs
        // testnet values, let me know. I believe current sentiment is that
        // we should always use mainnet, and use BIP-44 to derive the network
        //   - Mainnet: public=0x0488B21E, private=0x0488ADE4
        //   - Testnet: public=0x043587CF, private=0x04358394
        if (this.depth >= 256) {
            throw new Error("Depth too large!");
        }
        return encodeBase58Check(concat([
            "0x0488B21E",
            zpad(this.depth, 1),
            this.parentFingerprint,
            zpad(this.index, 4),
            this.chainCode,
            this.publicKey,
        ]));
    }
    hasPath() { return (this.path != null); }
    deriveChild(_index) {
        const index = logger.getNumber(_index, "index");
        if (index > 0xffffffff) {
            throw new Error("invalid index - " + String(index));
        }
        // Base path
        let path = this.path;
        if (path) {
            path += "/" + (index & ~HardenedBit);
            if (index & HardenedBit) {
                path += "'";
            }
        }
        const { IR, IL } = ser_I(index, this.chainCode, this.publicKey, null);
        const Ki = SigningKey._addPoints(IL, this.publicKey, true);
        const address = computeAddress(Ki);
        return new HDNodeVoidWallet(_guard, address, Ki, this.fingerprint, hexlify(IR), path, index, this.depth + 1, this.provider);
    }
    derivePath(path) {
        return derivePath(this, path);
    }
}
class HDNodeWalletManager {
    constructor(phrase, password = "", path = "m/44'/60'/0'/0", locale = langEn) {
        _HDNodeWalletManager_root.set(this, void 0);
        __classPrivateFieldSet$4(this, _HDNodeWalletManager_root, HDNodeWallet.fromPhrase(phrase, password, path, locale), "f");
    }
    getSigner(index = 0) {
        return __classPrivateFieldGet$4(this, _HDNodeWalletManager_root, "f").deriveChild(index);
    }
}
_HDNodeWalletManager_root = new WeakMap();
function getAccountPath(_index) {
    const index = logger.getNumber(_index, "index");
    if (index < 0 || index >= HardenedBit) {
        logger.throwArgumentError("invalid account index", "index", index);
    }
    return `m/44'/60'/${index}'/0/0`;
}

/*! MIT License. Copyright 2015-2022 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
var __classPrivateFieldSet$3 = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$3 = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AES_key, _AES_Kd, _AES_Ke;
// Number of rounds by keysize
const numberOfRounds = { 16: 10, 24: 12, 32: 14 };
// Round constant words
const rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];
// S-box and Inverse S-box (S is for Substitution)
const S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
const Si = [0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];
// Transformations for encryption
const T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
const T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
const T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
const T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];
// Transformations for decryption
const T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
const T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
const T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
const T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];
// Transformations for decryption key expansion
const U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
const U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
const U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
const U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];
function convertToInt32(bytes) {
    const result = [];
    for (let i = 0; i < bytes.length; i += 4) {
        result.push((bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3]);
    }
    return result;
}
class AES {
    constructor(key) {
        _AES_key.set(this, void 0);
        _AES_Kd.set(this, void 0);
        _AES_Ke.set(this, void 0);
        if (!(this instanceof AES)) {
            throw Error('AES must be instanitated with `new`');
        }
        __classPrivateFieldSet$3(this, _AES_key, new Uint8Array(key), "f");
        const rounds = numberOfRounds[this.key.length];
        if (rounds == null) {
            throw new TypeError('invalid key size (must be 16, 24 or 32 bytes)');
        }
        // encryption round keys
        __classPrivateFieldSet$3(this, _AES_Ke, [], "f");
        // decryption round keys
        __classPrivateFieldSet$3(this, _AES_Kd, [], "f");
        for (let i = 0; i <= rounds; i++) {
            __classPrivateFieldGet$3(this, _AES_Ke, "f").push([0, 0, 0, 0]);
            __classPrivateFieldGet$3(this, _AES_Kd, "f").push([0, 0, 0, 0]);
        }
        const roundKeyCount = (rounds + 1) * 4;
        const KC = this.key.length / 4;
        // convert the key into ints
        const tk = convertToInt32(this.key);
        // copy values into round key arrays
        let index;
        for (let i = 0; i < KC; i++) {
            index = i >> 2;
            __classPrivateFieldGet$3(this, _AES_Ke, "f")[index][i % 4] = tk[i];
            __classPrivateFieldGet$3(this, _AES_Kd, "f")[rounds - index][i % 4] = tk[i];
        }
        // key expansion (fips-197 section 5.2)
        let rconpointer = 0;
        let t = KC, tt;
        while (t < roundKeyCount) {
            tt = tk[KC - 1];
            tk[0] ^= ((S[(tt >> 16) & 0xFF] << 24) ^
                (S[(tt >> 8) & 0xFF] << 16) ^
                (S[tt & 0xFF] << 8) ^
                S[(tt >> 24) & 0xFF] ^
                (rcon[rconpointer] << 24));
            rconpointer += 1;
            // key expansion (for non-256 bit)
            if (KC != 8) {
                for (let i = 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }
                // key expansion for 256-bit keys is "slightly different" (fips-197)
            }
            else {
                for (let i = 1; i < (KC / 2); i++) {
                    tk[i] ^= tk[i - 1];
                }
                tt = tk[(KC / 2) - 1];
                tk[KC / 2] ^= (S[tt & 0xFF] ^
                    (S[(tt >> 8) & 0xFF] << 8) ^
                    (S[(tt >> 16) & 0xFF] << 16) ^
                    (S[(tt >> 24) & 0xFF] << 24));
                for (let i = (KC / 2) + 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }
            }
            // copy values into round key arrays
            let i = 0, r, c;
            while (i < KC && t < roundKeyCount) {
                r = t >> 2;
                c = t % 4;
                __classPrivateFieldGet$3(this, _AES_Ke, "f")[r][c] = tk[i];
                __classPrivateFieldGet$3(this, _AES_Kd, "f")[rounds - r][c] = tk[i++];
                t++;
            }
        }
        // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
        for (let r = 1; r < rounds; r++) {
            for (let c = 0; c < 4; c++) {
                tt = __classPrivateFieldGet$3(this, _AES_Kd, "f")[r][c];
                __classPrivateFieldGet$3(this, _AES_Kd, "f")[r][c] = (U1[(tt >> 24) & 0xFF] ^
                    U2[(tt >> 16) & 0xFF] ^
                    U3[(tt >> 8) & 0xFF] ^
                    U4[tt & 0xFF]);
            }
        }
    }
    get key() { return __classPrivateFieldGet$3(this, _AES_key, "f").slice(); }
    encrypt(plaintext) {
        if (plaintext.length != 16) {
            throw new TypeError('invalid plaintext size (must be 16 bytes)');
        }
        const rounds = __classPrivateFieldGet$3(this, _AES_Ke, "f").length - 1;
        const a = [0, 0, 0, 0];
        // convert plaintext to (ints ^ key)
        let t = convertToInt32(plaintext);
        for (let i = 0; i < 4; i++) {
            t[i] ^= __classPrivateFieldGet$3(this, _AES_Ke, "f")[0][i];
        }
        // apply round transforms
        for (let r = 1; r < rounds; r++) {
            for (let i = 0; i < 4; i++) {
                a[i] = (T1[(t[i] >> 24) & 0xff] ^
                    T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
                    T3[(t[(i + 2) % 4] >> 8) & 0xff] ^
                    T4[t[(i + 3) % 4] & 0xff] ^
                    __classPrivateFieldGet$3(this, _AES_Ke, "f")[r][i]);
            }
            t = a.slice();
        }
        // the last round is special
        const result = new Uint8Array(16);
        let tt = 0;
        for (let i = 0; i < 4; i++) {
            tt = __classPrivateFieldGet$3(this, _AES_Ke, "f")[rounds][i];
            result[4 * i] = (S[(t[i] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (S[(t[(i + 2) % 4] >> 8) & 0xff] ^ (tt >> 8)) & 0xff;
            result[4 * i + 3] = (S[t[(i + 3) % 4] & 0xff] ^ tt) & 0xff;
        }
        return result;
    }
    decrypt(ciphertext) {
        if (ciphertext.length != 16) {
            throw new TypeError('invalid ciphertext size (must be 16 bytes)');
        }
        const rounds = __classPrivateFieldGet$3(this, _AES_Kd, "f").length - 1;
        const a = [0, 0, 0, 0];
        // convert plaintext to (ints ^ key)
        let t = convertToInt32(ciphertext);
        for (let i = 0; i < 4; i++) {
            t[i] ^= __classPrivateFieldGet$3(this, _AES_Kd, "f")[0][i];
        }
        // apply round transforms
        for (let r = 1; r < rounds; r++) {
            for (let i = 0; i < 4; i++) {
                a[i] = (T5[(t[i] >> 24) & 0xff] ^
                    T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
                    T7[(t[(i + 2) % 4] >> 8) & 0xff] ^
                    T8[t[(i + 1) % 4] & 0xff] ^
                    __classPrivateFieldGet$3(this, _AES_Kd, "f")[r][i]);
            }
            t = a.slice();
        }
        // the last round is special
        const result = new Uint8Array(16);
        let tt = 0;
        for (let i = 0; i < 4; i++) {
            tt = __classPrivateFieldGet$3(this, _AES_Kd, "f")[rounds][i];
            result[4 * i] = (Si[(t[i] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (Si[(t[(i + 2) % 4] >> 8) & 0xff] ^ (tt >> 8)) & 0xff;
            result[4 * i + 3] = (Si[t[(i + 1) % 4] & 0xff] ^ tt) & 0xff;
        }
        return result;
    }
}
_AES_key = new WeakMap(), _AES_Kd = new WeakMap(), _AES_Ke = new WeakMap();

class ModeOfOperation {
    constructor(name, key, cls) {
        if (cls && !(this instanceof cls)) {
            throw new Error(`${name} must be instantiated with "new"`);
        }
        Object.defineProperties(this, {
            aes: { enumerable: true, value: new AES(key) },
            name: { enumerable: true, value: name }
        });
    }
}

// Cipher Block Chaining
var __classPrivateFieldSet$2 = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$2 = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CBC_iv, _CBC_lastBlock;
class CBC extends ModeOfOperation {
    constructor(key, iv) {
        super("ECC", key, CBC);
        _CBC_iv.set(this, void 0);
        _CBC_lastBlock.set(this, void 0);
        if (iv) {
            if (iv.length % 16) {
                throw new TypeError("invalid iv size (must be 16 bytes)");
            }
            __classPrivateFieldSet$2(this, _CBC_iv, new Uint8Array(iv), "f");
        }
        else {
            __classPrivateFieldSet$2(this, _CBC_iv, new Uint8Array(16), "f");
        }
        __classPrivateFieldSet$2(this, _CBC_lastBlock, this.iv, "f");
    }
    get iv() { return new Uint8Array(__classPrivateFieldGet$2(this, _CBC_iv, "f")); }
    encrypt(plaintext) {
        if (plaintext.length % 16) {
            throw new TypeError("invalid plaintext size (must be multiple of 16 bytes)");
        }
        const ciphertext = new Uint8Array(plaintext.length);
        for (let i = 0; i < plaintext.length; i += 16) {
            for (let j = 0; j < 16; j++) {
                __classPrivateFieldGet$2(this, _CBC_lastBlock, "f")[j] ^= plaintext[i + j];
            }
            __classPrivateFieldSet$2(this, _CBC_lastBlock, this.aes.encrypt(__classPrivateFieldGet$2(this, _CBC_lastBlock, "f")), "f");
            ciphertext.set(__classPrivateFieldGet$2(this, _CBC_lastBlock, "f"), i);
        }
        return ciphertext;
    }
    decrypt(ciphertext) {
        if (ciphertext.length % 16) {
            throw new TypeError("invalid ciphertext size (must be multiple of 16 bytes)");
        }
        const plaintext = new Uint8Array(ciphertext.length);
        for (let i = 0; i < ciphertext.length; i += 16) {
            const block = this.aes.decrypt(ciphertext.subarray(i, i + 16));
            for (let j = 0; j < 16; j++) {
                plaintext[i + j] = block[j] ^ __classPrivateFieldGet$2(this, _CBC_lastBlock, "f")[j];
                __classPrivateFieldGet$2(this, _CBC_lastBlock, "f")[j] = ciphertext[i + j];
            }
        }
        return plaintext;
    }
}
_CBC_iv = new WeakMap(), _CBC_lastBlock = new WeakMap();

// Cipher Feedback
(window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
(window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};

// Counter Mode
var __classPrivateFieldSet$1 = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$1 = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CTR_remaining, _CTR_remainingIndex, _CTR_counter;
class CTR extends ModeOfOperation {
    constructor(key, initialValue) {
        super("CTR", key, CTR);
        // Remaining bytes for the one-time pad
        _CTR_remaining.set(this, void 0);
        _CTR_remainingIndex.set(this, void 0);
        // The current counter
        _CTR_counter.set(this, void 0);
        __classPrivateFieldSet$1(this, _CTR_counter, new Uint8Array(16), "f");
        __classPrivateFieldGet$1(this, _CTR_counter, "f").fill(0);
        __classPrivateFieldSet$1(this, _CTR_remaining, __classPrivateFieldGet$1(this, _CTR_counter, "f"), "f"); // This will be discarded immediately
        __classPrivateFieldSet$1(this, _CTR_remainingIndex, 16, "f");
        if (initialValue == null) {
            initialValue = 1;
        }
        if (typeof (initialValue) === "number") {
            this.setCounterValue(initialValue);
        }
        else {
            this.setCounterBytes(initialValue);
        }
    }
    get counter() { return new Uint8Array(__classPrivateFieldGet$1(this, _CTR_counter, "f")); }
    setCounterValue(value) {
        if (!Number.isInteger(value) || value < 0 || value > Number.MAX_SAFE_INTEGER) {
            throw new TypeError("invalid counter initial integer value");
        }
        for (let index = 15; index >= 0; --index) {
            __classPrivateFieldGet$1(this, _CTR_counter, "f")[index] = value % 256;
            value = Math.floor(value / 256);
        }
    }
    setCounterBytes(value) {
        if (value.length !== 16) {
            throw new TypeError("invalid counter initial Uint8Array value length");
        }
        __classPrivateFieldGet$1(this, _CTR_counter, "f").set(value);
    }
    increment() {
        for (let i = 15; i >= 0; i--) {
            if (__classPrivateFieldGet$1(this, _CTR_counter, "f")[i] === 255) {
                __classPrivateFieldGet$1(this, _CTR_counter, "f")[i] = 0;
            }
            else {
                __classPrivateFieldGet$1(this, _CTR_counter, "f")[i]++;
                break;
            }
        }
    }
    encrypt(plaintext) {
        var _a, _b;
        const crypttext = new Uint8Array(plaintext);
        for (let i = 0; i < crypttext.length; i++) {
            if (__classPrivateFieldGet$1(this, _CTR_remainingIndex, "f") === 16) {
                __classPrivateFieldSet$1(this, _CTR_remaining, this.aes.encrypt(__classPrivateFieldGet$1(this, _CTR_counter, "f")), "f");
                __classPrivateFieldSet$1(this, _CTR_remainingIndex, 0, "f");
                this.increment();
            }
            crypttext[i] ^= __classPrivateFieldGet$1(this, _CTR_remaining, "f")[__classPrivateFieldSet$1(this, _CTR_remainingIndex, (_b = __classPrivateFieldGet$1(this, _CTR_remainingIndex, "f"), _a = _b++, _b), "f"), _a];
        }
        return crypttext;
    }
    decrypt(ciphertext) {
        return this.encrypt(ciphertext);
    }
}
_CTR_remaining = new WeakMap(), _CTR_remainingIndex = new WeakMap(), _CTR_counter = new WeakMap();

// Output Feedback
(window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
(window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};

function pkcs7Strip(data) {
    if (data.length < 16) {
        throw new TypeError('PKCS#7 invalid length');
    }
    const padder = data[data.length - 1];
    if (padder > 16) {
        throw new TypeError('PKCS#7 padding byte out of range');
    }
    const length = data.length - padder;
    for (let i = 0; i < padder; i++) {
        if (data[length + i] !== padder) {
            throw new TypeError('PKCS#7 invalid padding byte');
        }
    }
    return new Uint8Array(data.subarray(0, length));
}

function looseArrayify(hexString) {
    if (typeof (hexString) === 'string' && hexString.substring(0, 2) !== '0x') {
        hexString = '0x' + hexString;
    }
    return arrayify(hexString);
}
function getPassword(password) {
    if (typeof (password) === 'string') {
        return toUtf8Bytes(password, UnicodeNormalizationForm.NFKC);
    }
    return arrayify(password);
}
function spelunk(object, _path) {
    const match = _path.match(/^([a-z0-9$_.-]*)(:([a-z]+))?(!)?$/i);
    if (match == null) {
        return logger.throwArgumentError("invalid path", "path", _path);
    }
    const path = match[1];
    const type = match[3];
    const reqd = (match[4] === "!");
    let cur = object;
    for (const comp of path.toLowerCase().split('.')) {
        // Search for a child object with a case-insensitive matching key
        if (Array.isArray(cur)) {
            if (!comp.match(/^[0-9]+$/)) {
                break;
            }
            cur = cur[parseInt(comp)];
        }
        else if (typeof (cur) === "object") {
            let found = null;
            for (const key in cur) {
                if (key.toLowerCase() === comp) {
                    found = cur[key];
                    break;
                }
            }
            cur = found;
        }
        else {
            cur = null;
        }
        if (cur == null) {
            break;
        }
    }
    if (reqd && cur == null) {
        logger.throwArgumentError("missing required value", "path", path);
    }
    if (type && cur != null) {
        if (type === "int") {
            if (typeof (cur) === "string" && cur.match(/^-?[0-9]+$/)) {
                return parseInt(cur);
            }
            else if (Number.isSafeInteger(cur)) {
                return cur;
            }
        }
        if (type === "number") {
            if (typeof (cur) === "string" && cur.match(/^-?[0-9.]*$/)) {
                return parseFloat(cur);
            }
        }
        if (type === "data") {
            if (typeof (cur) === "string") {
                return looseArrayify(cur);
            }
        }
        if (type === "array" && Array.isArray(cur)) {
            return cur;
        }
        if (type === typeof (cur)) {
            return cur;
        }
        logger.throwArgumentError(`wrong type found for ${type} `, "path", path);
    }
    return cur;
}

function isCrowdsaleJson(json) {
    try {
        const data = JSON.parse(json);
        if (data.encseed) {
            return true;
        }
    }
    catch (error) { }
    return false;
}
// See: https://github.com/ethereum/pyethsaletool
function decryptCrowdsaleJson(json, _password) {
    const data = JSON.parse(json);
    const password = getPassword(_password);
    // Ethereum Address
    const address = getAddress(spelunk(data, "ethaddr:string!"));
    // Encrypted Seed
    const encseed = looseArrayify(spelunk(data, "encseed:string!"));
    if (!encseed || (encseed.length % 16) !== 0) {
        logger.throwArgumentError("invalid encseed", "json", json);
    }
    const key = arrayify(pbkdf2(password, password, 2000, 32, "sha256")).slice(0, 16);
    const iv = encseed.slice(0, 16);
    const encryptedSeed = encseed.slice(16);
    // Decrypt the seed
    const aesCbc = new CBC(key, iv);
    const seed = pkcs7Strip(arrayify(aesCbc.decrypt(encryptedSeed)));
    // This wallet format is weird... Convert the binary encoded hex to a string.
    let seedHex = "";
    for (let i = 0; i < seed.length; i++) {
        seedHex += String.fromCharCode(seed[i]);
    }
    return { address, privateKey: id(seedHex) };
}

const defaultPath = "m/44'/60'/0'/0/0";
function isKeystoreJson(json) {
    try {
        const data = JSON.parse(json);
        const version = ((data.version != null) ? parseInt(data.version) : 0);
        if (version === 3) {
            return true;
        }
    }
    catch (error) { }
    return false;
}
function decrypt(data, key, ciphertext) {
    const cipher = spelunk(data, "crypto.cipher:string");
    if (cipher === "aes-128-ctr") {
        const iv = spelunk(data, "crypto.cipherparams.iv:data!");
        const aesCtr = new CTR(key, iv);
        return hexlify(aesCtr.decrypt(ciphertext));
    }
    return logger.throwError("unsupported cipher", "UNSUPPORTED_OPERATION", {
        operation: "decrypt"
    });
}
function getAccount(data, _key) {
    const key = logger.getBytes(_key);
    const ciphertext = spelunk(data, "crypto.ciphertext:data!");
    const computedMAC = hexlify(keccak256(concat([key.slice(16, 32), ciphertext]))).substring(2);
    if (computedMAC !== spelunk(data, "crypto.mac:string!").toLowerCase()) {
        return logger.throwArgumentError("incorrect password", "password", "[ REDACTED ]");
    }
    const privateKey = decrypt(data, key.slice(0, 16), ciphertext);
    const address = computeAddress(privateKey);
    if (data.address) {
        let check = data.address.toLowerCase();
        if (check.substring(0, 2) !== "0x") {
            check = "0x" + check;
        }
        if (getAddress(check) !== address) {
            logger.throwArgumentError("keystore address/privateKey mismatch", "address", data.address);
        }
    }
    const account = { address, privateKey };
    // Version 0.1 x-ethers metadata must contain an encrypted mnemonic phrase
    const version = spelunk(data, "x-ethers.version:string");
    if (version === "0.1") {
        const mnemonicKey = key.slice(32, 64);
        const mnemonicCiphertext = spelunk(data, "x-ethers.mnemonicCiphertext:data!");
        const mnemonicIv = spelunk(data, "x-ethers.mnemonicCounter:data!");
        const mnemonicAesCtr = new CTR(mnemonicKey, mnemonicIv);
        account.mnemonic = {
            path: (spelunk(data, "x-ethers.path:string") || defaultPath),
            locale: (spelunk(data, "x-ethers.locale:string") || "en"),
            entropy: hexlify(arrayify(mnemonicAesCtr.decrypt(mnemonicCiphertext)))
        };
    }
    return account;
}
function getKdfParams(data) {
    const kdf = spelunk(data, "crypto.kdf:string");
    if (kdf && typeof (kdf) === "string") {
        const throwError = function (name, value) {
            return logger.throwArgumentError("invalid key-derivation function parameters", name, value);
        };
        if (kdf.toLowerCase() === "scrypt") {
            const salt = spelunk(data, "crypto.kdfparams.salt:data!");
            const N = spelunk(data, "crypto.kdfparams.n:int!");
            const r = spelunk(data, "crypto.kdfparams.r:int!");
            const p = spelunk(data, "crypto.kdfparams.p:int!");
            // Check for all required parameters
            if (!N || !r || !p) {
                return throwError("kdf", kdf);
            }
            // Make sure N is a power of 2
            if ((N & (N - 1)) !== 0) {
                return throwError("N", N);
            }
            const dkLen = spelunk(data, "crypto.kdfparams.dklen:int!");
            if (dkLen !== 32) {
                return throwError("dklen", dkLen);
            }
            return { name: "scrypt", salt, N, r, p, dkLen: 64 };
        }
        else if (kdf.toLowerCase() === "pbkdf2") {
            const salt = spelunk(data, "crypto.kdfparams.salt:data!");
            const prf = spelunk(data, "crypto.kdfparams.prf:string!");
            const algorithm = prf.split("-").pop();
            if (algorithm !== "sha256" && algorithm !== "sha512") {
                return throwError("prf", prf);
            }
            const count = spelunk(data, "crypto.kdfparams.c:int!");
            const dkLen = spelunk(data, "crypto.kdfparams.dklen:int!");
            if (dkLen !== 32) {
                throwError("dklen", dkLen);
            }
            return { name: "pbkdf2", salt, count, dkLen, algorithm };
        }
    }
    return logger.throwArgumentError("unsupported key-derivation function", "kdf", kdf);
}
function decryptKeystoreJsonSync(json, _password) {
    const data = JSON.parse(json);
    const password = getPassword(_password);
    const params = getKdfParams(data);
    if (params.name === "pbkdf2") {
        const { salt, count, dkLen, algorithm } = params;
        const key = pbkdf2(password, salt, count, dkLen, algorithm);
        return getAccount(data, key);
    }
    else if (params.name === "scrypt") {
        const { salt, N, r, p, dkLen } = params;
        const key = scryptSync(password, salt, N, r, p, dkLen);
        return getAccount(data, key);
    }
    throw new Error("unreachable");
}
function stall$1(duration) {
    return new Promise((resolve) => { setTimeout(() => { resolve(); }, duration); });
}
async function decryptKeystoreJson(json, _password, progress) {
    const data = JSON.parse(json);
    const password = getPassword(_password);
    const params = getKdfParams(data);
    if (params.name === "pbkdf2") {
        if (progress) {
            progress(0);
            await stall$1(0);
        }
        const { salt, count, dkLen, algorithm } = params;
        const key = pbkdf2(password, salt, count, dkLen, algorithm);
        if (progress) {
            progress(1);
            await stall$1(0);
        }
        return getAccount(data, key);
    }
    else if (params.name === "scrypt") {
        const { salt, N, r, p, dkLen } = params;
        const key = await scrypt(password, salt, N, r, p, dkLen, progress);
        return getAccount(data, key);
    }
    throw new Error("unreachable");
}

var __classPrivateFieldSet = (window && window.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (window && window.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Wallet_mnemonic;
function tryWallet(value) {
    try {
        if (!value || !value.signingKey) {
            return null;
        }
        const key = trySigningKey(value.signingKey);
        if (key == null || computeAddress(key.publicKey) !== value.address) {
            return null;
        }
        if (value.mnemonic) {
            const wallet = HDNodeWallet.fromMnemonic(value.mnemonic);
            if (wallet.privateKey !== key.privateKey) {
                return null;
            }
        }
        return value;
    }
    catch (e) {
        console.log(e);
    }
    return null;
}
// Try using value as mnemonic to derive the defaultPath HDodeWallet
function tryMnemonic(value) {
    try {
        if (value == null || typeof (value.phrase) !== "string" ||
            typeof (value.password) !== "string" ||
            value.wordlist == null) {
            return null;
        }
        return HDNodeWallet.fromPhrase(value.phrase, value.password, null, value.wordlist);
    }
    catch (error) {
        console.log(error);
    }
    return null;
}
function trySigningKey(value) {
    try {
        if (!value || !isHexString(value.privateKey, 32)) {
            return null;
        }
        const key = value.privateKey;
        if (SigningKey.computePublicKey(key) !== value.publicKey) {
            return null;
        }
        return new SigningKey(key);
    }
    catch (e) {
        console.log(e);
    }
    return null;
}
function stall(duration) {
    return new Promise((resolve) => { setTimeout(() => { resolve(); }, duration); });
}
class Wallet extends BaseWallet {
    constructor(key, provider) {
        let signingKey = null;
        let mnemonic = null;
        // A normal private key
        if (typeof (key) === "string") {
            signingKey = new SigningKey(key);
        }
        // Try Wallet
        if (signingKey == null) {
            const wallet = tryWallet(key);
            if (wallet) {
                signingKey = wallet.signingKey;
                mnemonic = wallet.mnemonic || null;
            }
        }
        // Try Mnemonic, with the defaultPath wallet
        if (signingKey == null) {
            const wallet = tryMnemonic(key);
            if (wallet) {
                signingKey = wallet.signingKey;
                mnemonic = wallet.mnemonic || null;
            }
        }
        // A signing key
        if (signingKey == null) {
            signingKey = trySigningKey(key);
        }
        if (signingKey == null) {
            logger.throwArgumentError("invalid key", "key", "[ REDACTED ]");
        }
        super(signingKey, provider);
        _Wallet_mnemonic.set(this, void 0);
        __classPrivateFieldSet(this, _Wallet_mnemonic, mnemonic, "f");
    }
    // Store this in a getter to reduce visibility in console.log
    get mnemonic() { return __classPrivateFieldGet(this, _Wallet_mnemonic, "f"); }
    connect(provider) {
        return new Wallet(this, provider);
    }
    async encrypt(password, options, progressCallback) {
        throw new Error("TODO");
    }
    encryptSync(password, options) {
        throw new Error("TODO");
    }
    static async fromEncryptedJson(json, password, progress) {
        let account = null;
        if (isKeystoreJson(json)) {
            account = await decryptKeystoreJson(json, password, progress);
        }
        else if (isCrowdsaleJson(json)) {
            if (progress) {
                progress(0);
                await stall(0);
            }
            account = decryptCrowdsaleJson(json, password);
            if (progress) {
                progress(1);
                await stall(0);
            }
        }
        else {
            return logger.throwArgumentError("invalid JSON wallet", "json", "[ REDACTED ]");
        }
        const wallet = new Wallet(account.privateKey);
        if (wallet.address !== account.address) {
            logger.throwArgumentError("address/privateKey mismatch", "json", "[ REDACTED ]");
        }
        // @TODO: mnemonic
        return wallet;
    }
    static fromEncryptedJsonSync(json, password) {
        let account = null;
        if (isKeystoreJson(json)) {
            account = decryptKeystoreJsonSync(json, password);
        }
        else if (isCrowdsaleJson(json)) {
            account = decryptCrowdsaleJson(json, password);
        }
        else {
            return logger.throwArgumentError("invalid JSON wallet", "json", "[ REDACTED ]");
        }
        const wallet = new Wallet(account.privateKey);
        if (wallet.address !== account.address) {
            logger.throwArgumentError("address/privateKey mismatch", "json", "[ REDACTED ]");
        }
        // @TODO: mnemonic
        return wallet;
    }
    static createRandom(provider, password, wordlist) {
        return new Wallet(Mnemonic.fromEntropy(randomBytes(16), password, wordlist), provider);
    }
    static fromMnemonic(mnemonic, provider) {
        return new Wallet(mnemonic, provider);
    }
    static fromPhrase(phrase, provider, password = "", wordlist) {
        return new Wallet(Mnemonic.fromPhrase(phrase, password, wordlist), provider);
    }
}
_Wallet_mnemonic = new WeakMap();

const version = "ethers@6.0.0-beta.9";

var ethers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Interface: Interface,
    getAddress: getAddress,
    getIcapAddress: getIcapAddress,
    getCreateAddress: getCreateAddress,
    getCreate2Address: getCreate2Address,
    isAddressable: isAddressable,
    isAddress: isAddress,
    resolveAddress: resolveAddress,
    arrayify: arrayify,
    decodeBase64: decodeBase64,
    encodeBase64: encodeBase64,
    isHexString: isHexString,
    isBytesLike: isBytesLike,
    concat: concat,
    dataLength: dataLength,
    dataSlice: dataSlice,
    stripZerosLeft: stripZerosLeft,
    hexlify: hexlify,
    quantity: quantity,
    zeroPadBytes: zeroPadBytes,
    zeroPadValue: zeroPadValue,
    BaseContract: BaseContract,
    Contract: Contract,
    ContractEventPayload: ContractEventPayload,
    ContractTransactionReceipt: ContractTransactionReceipt,
    ContractTransactionResponse: ContractTransactionResponse,
    EventLog: EventLog,
    computeHmac: computeHmac,
    keccak256: keccak256,
    ripemd160: ripemd160,
    sha256: sha256,
    sha512: sha512,
    pbkdf2: pbkdf2,
    scrypt: scrypt,
    scryptSync: scryptSync,
    randomBytes: randomBytes,
    lock: lock,
    messagePrefix: messagePrefix,
    id: id,
    hashMessage: hashMessage,
    isValidName: isValidName,
    namehash: namehash,
    dnsEncode: dnsEncode,
    solidityPacked: solidityPacked,
    solidityPackedKeccak256: solidityPackedKeccak256,
    solidityPackedSha256: solidityPackedSha256,
    TypedDataEncoder: TypedDataEncoder,
    isError: isError,
    isCallException: isCallException,
    Logger: Logger,
    formatFixed: formatFixed,
    parseFixed: parseFixed,
    fromTwos: fromTwos,
    toTwos: toTwos,
    mask: mask,
    toArray: toArray,
    toBigInt: toBigInt,
    toHex: toHex,
    toNumber: toNumber,
    decodeBase58: decodeBase58,
    encodeBase58: encodeBase58,
    formatEther: formatEther,
    parseEther: parseEther,
    formatUnits: formatUnits,
    parseUnits: parseUnits,
    FixedFormat: FixedFormat,
    FixedNumber: FixedNumber,
    defineProperties: defineProperties,
    resolveProperties: resolveProperties,
    getStore: getStore,
    setStore: setStore,
    dummyProvider: dummyProvider,
    getDefaultProvider: getDefaultProvider,
    showThrottleMessage: showThrottleMessage,
    AbstractProvider: AbstractProvider,
    UnmanagedSubscriber: UnmanagedSubscriber,
    AbstractSigner: AbstractSigner,
    VoidSigner: VoidSigner,
    WrappedSigner: WrappedSigner,
    EnsResolver: EnsResolver,
    Formatter: Formatter,
    NetworkPlugin: NetworkPlugin,
    GasCostPlugin: GasCostPlugin,
    EnsPlugin: EnsPlugin,
    MaxPriorityFeePlugin: MaxPriorityFeePlugin,
    Network: Network,
    Block: Block,
    FeeData: FeeData,
    Log: Log,
    TransactionReceipt: TransactionReceipt,
    TransactionResponse: TransactionResponse,
    FallbackProvider: FallbackProvider,
    JsonRpcProvider: JsonRpcProvider,
    JsonRpcSigner: JsonRpcSigner,
    StaticJsonRpcProvider: StaticJsonRpcProvider,
    AlchemyProvider: AlchemyProvider,
    AnkrProvider: AnkrProvider,
    CloudflareProvider: CloudflareProvider,
    EtherscanProvider: EtherscanProvider,
    InfuraProvider: InfuraProvider,
    PocketProvider: PocketProvider,
    IpcSocketProvider: IpcSocketProvider,
    SocketProvider: SocketProvider,
    WebSocketProvider: WebSocketProvider,
    encodeRlp: encodeRlp,
    decodeRlp: decodeRlp,
    Signature: Signature$1,
    SigningKey: SigningKey,
    formatBytes32String: formatBytes32String,
    parseBytes32String: parseBytes32String,
    nameprep: nameprep,
    _toEscapedUtf8String: _toEscapedUtf8String,
    toUtf8Bytes: toUtf8Bytes,
    toUtf8CodePoints: toUtf8CodePoints,
    toUtf8String: toUtf8String,
    get UnicodeNormalizationForm () { return UnicodeNormalizationForm; },
    Utf8ErrorFuncs: Utf8ErrorFuncs,
    get Utf8ErrorReason () { return Utf8ErrorReason; },
    accessListify: accessListify,
    computeAddress: computeAddress,
    recoverAddress: recoverAddress,
    Transaction: Transaction,
    defaultPath: defaultPath$1,
    getAccountPath: getAccountPath,
    HDNodeWallet: HDNodeWallet,
    HDNodeVoidWallet: HDNodeVoidWallet,
    HDNodeWalletManager: HDNodeWalletManager,
    Mnemonic: Mnemonic,
    Wallet: Wallet,
    fetchData: fetchData,
    FetchRequest: FetchRequest,
    FetchResponse: FetchResponse,
    wordlists: wordlists,
    Wordlist: Wordlist,
    WordlistOwl: WordlistOwl,
    WordlistOwlA: WordlistOwlA,
    version: version
});

export { AbstractProvider, AbstractSigner, AlchemyProvider, AnkrProvider, BaseContract, Block, CloudflareProvider, Contract, ContractEventPayload, ContractTransactionReceipt, ContractTransactionResponse, EnsPlugin, EnsResolver, EtherscanProvider, EventLog, FallbackProvider, FeeData, FetchRequest, FetchResponse, FixedFormat, FixedNumber, Formatter, GasCostPlugin, HDNodeVoidWallet, HDNodeWallet, HDNodeWalletManager, InfuraProvider, Interface, IpcSocketProvider, JsonRpcProvider, JsonRpcSigner, Log, Logger, MaxPriorityFeePlugin, Mnemonic, Network, NetworkPlugin, PocketProvider, Signature$1 as Signature, SigningKey, SocketProvider, StaticJsonRpcProvider, Transaction, TransactionReceipt, TransactionResponse, TypedDataEncoder, UnicodeNormalizationForm, UnmanagedSubscriber, Utf8ErrorFuncs, Utf8ErrorReason, VoidSigner, Wallet, WebSocketProvider, Wordlist, WordlistOwl, WordlistOwlA, WrappedSigner, _toEscapedUtf8String, accessListify, arrayify, computeAddress, computeHmac, concat, dataLength, dataSlice, decodeBase58, decodeBase64, decodeRlp, defaultPath$1 as defaultPath, defineProperties, dnsEncode, dummyProvider, encodeBase58, encodeBase64, encodeRlp, ethers, fetchData, formatBytes32String, formatEther, formatFixed, formatUnits, fromTwos, getAccountPath, getAddress, getCreate2Address, getCreateAddress, getDefaultProvider, getIcapAddress, getStore, hashMessage, hexlify, id, isAddress, isAddressable, isBytesLike, isCallException, isError, isHexString, isValidName, keccak256, lock, mask, messagePrefix, namehash, nameprep, parseBytes32String, parseEther, parseFixed, parseUnits, pbkdf2, quantity, randomBytes, recoverAddress, resolveAddress, resolveProperties, ripemd160, scrypt, scryptSync, setStore, sha256, sha512, showThrottleMessage, solidityPacked, solidityPackedKeccak256, solidityPackedSha256, stripZerosLeft, toArray, toBigInt, toHex, toNumber, toTwos, toUtf8Bytes, toUtf8CodePoints, toUtf8String, version, wordlists, zeroPadBytes, zeroPadValue };
//# sourceMappingURL=ethers.js.map
