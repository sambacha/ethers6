var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TokenString_instances, _TokenString_offset, _TokenString_tokens, _TokenString_subTokenString, _ParamType_instances, _ParamType_walkAsync;
import { defineProperties } from "@ethersproject/properties";
import { logger } from "./logger.js";
;
export var FormatType;
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
;
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
const regexNumber = new RegExp("^([0-9]+)");
const regexIdentifier = new RegExp("^([a-zA-Z$_][a-zA-Z0-9$_]*)");
const regexType = new RegExp("^(address|bool|bytes([0-9]*)|string|u?int([0-9]*))");
export class TokenString {
    constructor(tokens) {
        _TokenString_instances.add(this);
        _TokenString_offset.set(this, void 0);
        _TokenString_tokens.set(this, void 0);
        __classPrivateFieldSet(this, _TokenString_offset, 0, "f");
        __classPrivateFieldSet(this, _TokenString_tokens, tokens.slice(), "f");
    }
    get offset() { return __classPrivateFieldGet(this, _TokenString_offset, "f"); }
    get length() { return __classPrivateFieldGet(this, _TokenString_tokens, "f").length - __classPrivateFieldGet(this, _TokenString_offset, "f"); }
    clone() { return new TokenString(__classPrivateFieldGet(this, _TokenString_tokens, "f")); }
    reset() { __classPrivateFieldSet(this, _TokenString_offset, 0, "f"); }
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
        const result = __classPrivateFieldGet(this, _TokenString_instances, "m", _TokenString_subTokenString).call(this, __classPrivateFieldGet(this, _TokenString_offset, "f") + 1, top.match + 1);
        __classPrivateFieldSet(this, _TokenString_offset, top.match + 1, "f");
        return result;
    }
    // Pops and returns the items within "(" ITEM1 "," ITEM2 "," ... ")"
    popParams() {
        const top = this.peek();
        if (top.type !== "OPEN_PAREN") {
            throw new Error("bad start");
        }
        const result = [];
        while (__classPrivateFieldGet(this, _TokenString_offset, "f") < top.match - 1) {
            const link = this.peek().linkNext;
            result.push(__classPrivateFieldGet(this, _TokenString_instances, "m", _TokenString_subTokenString).call(this, __classPrivateFieldGet(this, _TokenString_offset, "f") + 1, link));
            __classPrivateFieldSet(this, _TokenString_offset, link, "f");
        }
        __classPrivateFieldSet(this, _TokenString_offset, top.match + 1, "f");
        return result;
    }
    // Returns the top Token, throwing if out of tokens
    peek() {
        if (__classPrivateFieldGet(this, _TokenString_offset, "f") >= __classPrivateFieldGet(this, _TokenString_tokens, "f").length) {
            throw new Error("out-of-bounds");
        }
        return __classPrivateFieldGet(this, _TokenString_tokens, "f")[__classPrivateFieldGet(this, _TokenString_offset, "f")];
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
        __classPrivateFieldSet(this, _TokenString_offset, (_a = __classPrivateFieldGet(this, _TokenString_offset, "f"), _a++, _a), "f");
        return result;
    }
    toString() {
        const tokens = [];
        for (let i = __classPrivateFieldGet(this, _TokenString_offset, "f"); i < __classPrivateFieldGet(this, _TokenString_tokens, "f").length; i++) {
            const token = __classPrivateFieldGet(this, _TokenString_tokens, "f")[i];
            tokens.push(`${token.type}:${token.text}`);
        }
        return `<TokenString ${tokens.join(" ")}>`;
    }
}
_TokenString_offset = new WeakMap(), _TokenString_tokens = new WeakMap(), _TokenString_instances = new WeakSet(), _TokenString_subTokenString = function _TokenString_subTokenString(from = 0, to = 0) {
    return new TokenString(__classPrivateFieldGet(this, _TokenString_tokens, "f").slice(from, to).map((t) => {
        return Object.freeze(Object.assign({}, t, {
            match: (t.match - from),
            linkBack: (t.linkBack - from),
            linkNext: (t.linkNext - from),
        }));
        return t;
    }));
};
export function lex(text) {
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
                    (tokens[tokens.length - 1]).value = logger.getNumber(value);
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
        match = cur.match(regexNumber);
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
            return logger.getBigInt(tokens.pop().text);
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
        return logger.throwArgumentError("invalid type", "type", type);
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
            logger.throwArgumentError("invalid bytes length", "type", type);
        }
    }
    else if (match[3]) {
        // intXX or uintXX
        const size = parseInt(match[3]);
        if (size === 0 || size > 256 || size % 8) {
            logger.throwArgumentError("invalid numeric width", "type", type);
        }
    }
    return type;
}
// Make the Fragment constructors effectively private
const _guard = {};
const internal = Symbol.for("_ethers_internal");
const ParamTypeInternal = "_ParamTypeInternal";
export class ParamType {
    constructor(guard, name, type, baseType, indexed, components, arrayLength, arrayChildren) {
        _ParamType_instances.add(this);
        logger.assertPrivate(guard, _guard, "ParamType");
        Object.defineProperty(this, internal, { value: ParamTypeInternal });
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
            logger.throwArgumentError("invalid format type", "format", format);
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
        __classPrivateFieldGet(this, _ParamType_instances, "m", _ParamType_walkAsync).call(this, promises, value, process, (value) => {
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
            logger.throwArgumentError("invalid name", "obj.name", name);
        }
        let indexed = obj.indexed;
        if (indexed != null) {
            if (!allowIndexed) {
                logger.throwArgumentError("parameter cannot be indexed", "obj.indexed", obj.indexed);
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
            return new ParamType(_guard, name, type, "array", indexed, null, arrayLength, arrayChildren);
        }
        if (type.substring(0, 5) === "tuple(" || type[0] === "(") {
            const comps = (obj.components != null) ? obj.components.map((c) => ParamType.from(c)) : null;
            const tuple = new ParamType(_guard, name, type, "tuple", indexed, comps, null, null);
            // @TODO: use lexer to validate and normalize type
            return tuple;
        }
        type = verifyBasicType(obj.type);
        return new ParamType(_guard, name, type, type, indexed, null, null, null);
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
            arrayChildren = new ParamType(_guard, "", type, baseType, null, comps, arrayLength, arrayChildren);
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
        return new ParamType(_guard, name, type, baseType, indexed, comps, arrayLength, arrayChildren);
    }
    static isParamType(value) {
        return (value && value[internal] === ParamTypeInternal);
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
            __classPrivateFieldGet(childType, _ParamType_instances, "m", _ParamType_walkAsync).call(childType, promises, value, process, (value) => {
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
            __classPrivateFieldGet((_a = components[index]), _ParamType_instances, "m", _ParamType_walkAsync).call(_a, promises, value, process, (value) => {
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
export var FragmentType;
(function (FragmentType) {
    FragmentType["constructor"] = "constructor";
    FragmentType["error"] = "error";
    FragmentType["event"] = "event";
    FragmentType["function"] = "function";
    FragmentType["struct"] = "struct";
})(FragmentType || (FragmentType = {}));
;
export class Fragment {
    constructor(guard, type, inputs) {
        logger.assertPrivate(guard, _guard, "Fragment");
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
export class NamedFragment extends Fragment {
    constructor(guard, type, name, inputs) {
        super(guard, type, inputs);
        inputs = Object.freeze(inputs.slice());
        defineProperties(this, { name });
    }
}
function joinParams(format, params) {
    return "(" + params.map((p) => p.format(format)).join((format === FormatType.full) ? ", " : ",") + ")";
}
export class ErrorFragment extends NamedFragment {
    constructor(guard, name, inputs) {
        super(guard, FragmentType.error, name, inputs);
    }
    format(format = FormatType.sighash) {
        if (!FormatType[format]) {
            logger.throwArgumentError("invalid format type", "format", format);
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
        return new ErrorFragment(_guard, name, inputs);
    }
}
export class EventFragment extends NamedFragment {
    constructor(guard, name, inputs, anonymous) {
        super(guard, FragmentType.event, name, inputs);
        defineProperties(this, { anonymous });
    }
    format(format = FormatType.sighash) {
        if (!FormatType[format]) {
            logger.throwArgumentError("invalid format type", "format", format);
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
        return new EventFragment(_guard, name, inputs, anonymous);
    }
}
export class ConstructorFragment extends Fragment {
    constructor(guard, type, inputs, payable, gas) {
        super(guard, type, inputs);
        defineProperties(this, { payable, gas });
    }
    format(format = FormatType.sighash) {
        if (!FormatType[format]) {
            logger.throwArgumentError("invalid format type", "format", format);
        }
        if (format === FormatType.sighash) {
            logger.throwError("cannot format a constructor for sighash", "UNSUPPORTED_OPERATION", {
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
        return new ConstructorFragment(_guard, FragmentType.constructor, inputs, payable, gas);
    }
}
export class FunctionFragment extends NamedFragment {
    constructor(guard, name, stateMutability, inputs, outputs, gas) {
        super(guard, FragmentType.function, name, inputs);
        outputs = Object.freeze(outputs.slice());
        const constant = (stateMutability === "view" || stateMutability === "pure");
        const payable = (stateMutability === "payable");
        defineProperties(this, { constant, gas, outputs, payable, stateMutability });
    }
    format(format = FormatType.sighash) {
        if (!FormatType[format]) {
            logger.throwArgumentError("invalid format type", "format", format);
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
        return new FunctionFragment(_guard, name, mutability, inputs, outputs, gas);
    }
}
export class StructFragment extends NamedFragment {
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
        return new StructFragment(_guard, FragmentType.struct, name, inputs);
    }
}
//# sourceMappingURL=fragments.js.map