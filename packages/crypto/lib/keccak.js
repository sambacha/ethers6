import { keccak_256 } from "@noble/hashes/sha3";
import { hexlify } from "@ethersproject/bytes";
import { logger } from "./logger.js";
let locked = false;
const _keccak256 = function (data) {
    return keccak_256(data);
};
let __keccak256 = _keccak256;
export function keccak256(_data) {
    const data = logger.getBytes(_data, "data");
    return hexlify(__keccak256(data));
}
keccak256._ = _keccak256;
keccak256.lock = function () { locked = true; };
keccak256.register = function (func) {
    if (locked) {
        throw new TypeError("keccak256 is locked");
    }
    __keccak256 = func;
};
Object.freeze(keccak256);
//# sourceMappingURL=keccak.js.map