import { createHmac } from "crypto"; /*-browser*/
import { hexlify } from "@ethersproject/bytes";
import { logger } from "./logger.js";
let locked = false;
const _computeHmac = function (algorithm, key, data) {
    return "0x" + createHmac(algorithm, key).update(data).digest("hex");
};
let __computeHmac = _computeHmac;
export function computeHmac(algorithm, _key, _data) {
    const key = logger.getBytes(_key, "key");
    const data = logger.getBytes(_data, "data");
    return hexlify(__computeHmac(algorithm, key, data));
}
computeHmac._ = _computeHmac;
computeHmac.lock = function () { locked = true; };
computeHmac.register = function (func) {
    if (locked) {
        throw new Error("computeHmac is locked");
    }
    __computeHmac = func;
};
Object.freeze(computeHmac);
//# sourceMappingURL=hmac.js.map