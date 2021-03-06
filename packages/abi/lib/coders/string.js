import { toUtf8Bytes, toUtf8String } from "@ethersproject/strings";
import { Typed } from "../typed.js";
import { DynamicBytesCoder } from "./bytes.js";
export class StringCoder extends DynamicBytesCoder {
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
//# sourceMappingURL=string.js.map