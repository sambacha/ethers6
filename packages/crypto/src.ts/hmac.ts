import { createHmac } from "crypto"; /*-browser*/

import { hexlify } from "@ethersproject/bytes";

import { logger } from "./logger.js";

import type { BytesLike } from "@ethersproject/logger";


let locked = false;

const _computeHmac = function(algorithm: "sha256" | "sha512", key: Uint8Array, data: Uint8Array): BytesLike {
    return "0x" + createHmac(algorithm, key).update(data).digest("hex");
}

let __computeHmac = _computeHmac;

export function computeHmac(algorithm: "sha256" | "sha512", _key: BytesLike, _data: BytesLike): string {
    const key = logger.getBytes(_key, "key");
    const data = logger.getBytes(_data, "data");
    return hexlify(__computeHmac(algorithm, key, data));
}
computeHmac._ = _computeHmac;
computeHmac.lock =  function() { locked = true; }
computeHmac.register = function(func: (algorithm: "sha256" | "sha512", key: Uint8Array, data: Uint8Array) => BytesLike) {
    if (locked) { throw new Error("computeHmac is locked"); }
    __computeHmac = func;
}
Object.freeze(computeHmac);
