
import * as secp256k1 from "@noble/secp256k1";

import { arrayify, concat, dataLength, hexlify } from "@ethersproject/bytes";
import { computeHmac } from "@ethersproject/crypto";
import { toHex } from "@ethersproject/math";

import type { BytesLike } from "@ethersproject/bytes";
import type { Frozen } from "@ethersproject/properties";

import { Signature } from "./signature.js";
import { logger } from "./logger.js";

import type { SignatureLike } from "./signature.js";


// Make noble-secp256k1 sync
secp256k1.utils.hmacSha256Sync = function(key: Uint8Array, ...messages: Array<Uint8Array>): Uint8Array {
    return arrayify(computeHmac("sha256", key, concat(messages)));
}

export class SigningKey {
    #privateKey: string;

    constructor(privateKey: BytesLike) {
        logger.assertArgument((dataLength(privateKey) === 32), "invalid private key length", "privateKey", "[REDACTED]");
        this.#privateKey = hexlify(privateKey);
    }

    get privateKey(): string { return this.#privateKey; }
    get publicKey(): string { return SigningKey.computePublicKey(this.#privateKey); }
    get compressedPublicKey(): string { return SigningKey.computePublicKey(this.#privateKey, true); }

    sign(digest: BytesLike): Frozen<Signature> {
        logger.assertArgument((dataLength(digest) === 32), "invalid digest length", "digest", digest);

        const [ sigDer, recid ] = secp256k1.signSync(arrayify(digest), arrayify(this.#privateKey), {
            recovered: true,
            canonical: true
        });

        const sig = secp256k1.Signature.fromHex(sigDer);

        return Signature.from({
            r: toHex("0x" + sig.r.toString(16), 32),
            s: toHex("0x" + sig.s.toString(16), 32),
            v: (recid ? 0x1c: 0x1b)
        }).freeze();
    }

    computeShardSecret(other: BytesLike): string {
        const pubKey = SigningKey.computePublicKey(other);
        return hexlify(secp256k1.getSharedSecret(arrayify(this.#privateKey), pubKey));
    }

    static computePublicKey(key: BytesLike, compressed?: boolean): string {
        let bytes = logger.getBytes(key, "key");

        if (bytes.length === 32) {
            const pubKey = secp256k1.getPublicKey(bytes, !!compressed);
            return hexlify(pubKey);
        }

        if (bytes.length === 64) {
            const pub = new Uint8Array(65);
            pub[0] = 0x04;
            pub.set(bytes, 1);
            bytes = pub;
        }

        const point = secp256k1.Point.fromHex(bytes);
        return hexlify(point.toRawBytes(compressed));
    }

    static recoverPublicKey(digest: BytesLike, signature: SignatureLike): string {
        const sig = Signature.from(signature);
        const der = secp256k1.Signature.fromCompact(arrayify(concat([ sig.r, sig.s ]))).toDERRawBytes();

        const pubKey = secp256k1.recoverPublicKey(arrayify(digest), der, sig.yParity);
        if (pubKey != null) { return hexlify(pubKey); }

        return logger.throwArgumentError("invalid signautre for digest", "signature", signature);
    }

    static _addPoints(p0: BytesLike, p1: BytesLike, compressed?: boolean): string {
        const pub0 = secp256k1.Point.fromHex(SigningKey.computePublicKey(p0).substring(2));
        const pub1 = secp256k1.Point.fromHex(SigningKey.computePublicKey(p1).substring(2));
        return "0x" + pub0.add(pub1).toHex(!!compressed)
    }
}

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
