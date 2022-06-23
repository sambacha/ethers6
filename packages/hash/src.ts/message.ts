import { concat } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/crypto";
import { toUtf8Bytes } from "@ethersproject/strings";


export const messagePrefix = "\x19Ethereum Signed Message:\n";

export function hashMessage(message: Uint8Array | string): string {
    if (typeof(message) === "string") { message = toUtf8Bytes(message); }
    return keccak256(concat([
        toUtf8Bytes(messagePrefix),
        toUtf8Bytes(String(message.length)),
        message
    ]));
}
