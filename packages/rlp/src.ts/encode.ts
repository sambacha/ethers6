//See: https://github.com/ethereum/wiki/wiki/RLP

import { logger } from "./logger.js";

import type { RlpStructuredData } from "./types.js";


function arrayifyInteger(value: number): Array<number> {
    const result = [];
    while (value) {
        result.unshift(value & 0xff);
        value >>= 8;
    }
    return result;
}

function _encode(object: Array<any> | string): Array<number> {
    if (Array.isArray(object)) {
        let payload: Array<number> = [];
        object.forEach(function(child) {
            payload = payload.concat(_encode(child));
        });

        if (payload.length <= 55) {
            payload.unshift(0xc0 + payload.length)
            return payload;
        }

        const length = arrayifyInteger(payload.length);
        length.unshift(0xf7 + length.length);

        return length.concat(payload);

    }

    const data: Array<number> = Array.prototype.slice.call(logger.getBytes(object, "object"));

    if (data.length === 1 && data[0] <= 0x7f) {
        return data;

    } else if (data.length <= 55) {
        data.unshift(0x80 + data.length);
        return data;
    }

    const length = arrayifyInteger(data.length);
    length.unshift(0xb7 + length.length);

    return length.concat(data);
}

const nibbles = "0123456789abcdef";

export function encodeRlp(object: RlpStructuredData): string {
    let result = "0x";
    for (const v of _encode(object)) {
        result += nibbles[v >> 4];
        result += nibbles[v & 0xf];
    }
    return result;
}
