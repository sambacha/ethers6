import { ripemd160 as noble_ripemd160 } from "@noble/hashes/ripemd160";

import { hexlify } from "@ethersproject/bytes";
import { logger } from "./logger.js";

import type { BytesLike } from "@ethersproject/logger";

let locked = false;

const _ripemd160 = function(data: Uint8Array): Uint8Array {
    return noble_ripemd160(data);
}

let __ripemd160: (data: Uint8Array) => BytesLike = _ripemd160;

export function ripemd160(_data: BytesLike): string {
    const data = logger.getBytes(_data, "data");
    return hexlify(__ripemd160(data));
}
ripemd160._ = _ripemd160;
ripemd160.lock = function(): void { locked = true; }
ripemd160.register = function(func: (data: Uint8Array) => BytesLike) {
    if (locked) { throw new TypeError("ripemd160 is locked"); }
    __ripemd160 = func;
}
Object.freeze(ripemd160);
