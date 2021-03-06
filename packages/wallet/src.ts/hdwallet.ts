import { arrayify, concat, dataSlice, hexlify } from "@ethersproject/bytes";
import { computeHmac, randomBytes, ripemd160, sha256 } from "@ethersproject/crypto";
import { decodeBase58, encodeBase58, toBigInt, toHex } from "@ethersproject/math";
import { defineProperties } from "@ethersproject/properties";
import { VoidSigner } from "@ethersproject/providers";
import { SigningKey } from "@ethersproject/signing-key";
import { computeAddress } from "@ethersproject/transaction";
import { langEn } from "@ethersproject/wordlists/lib/lang-en.js";

import { logger } from "./logger.js";
import { Mnemonic } from "./mnemonic.js";
import { BaseWallet } from "./base-wallet.js";

import type { BytesLike, Numeric } from "@ethersproject/logger";
import type { Provider } from "@ethersproject/providers";
import type { Wordlist } from "@ethersproject/wordlists";


export const defaultPath = "m/44'/60'/0'/0/0";


// "Bitcoin seed"
const MasterSecret = new Uint8Array([ 66, 105, 116, 99, 111, 105, 110, 32, 115, 101, 101, 100 ]);

const HardenedBit = 0x80000000;

const N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");

const Nibbles = "0123456789abcdef";
function zpad(value: number, length: number): string {
    let result = "";
    while (value) {
        result = Nibbles[value % 16] + result;
        value = Math.trunc(value / 16);
    }
    while (result.length < length * 2) { result = "0" + result; }
    return "0x" + result;
}

function encodeBase58Check(_value: BytesLike): string {
    const value = logger.getBytes(_value);
    const check = dataSlice(sha256(sha256(value)), 0, 4);
    const bytes = concat([ value, check ]);
    return encodeBase58(bytes);
}

const _guard = { };

function ser_I(index: number, chainCode: string, publicKey: string, privateKey: null | string): { IL: Uint8Array, IR: Uint8Array } {
    const data = new Uint8Array(37);

    if (index & HardenedBit) {
        if (privateKey == null) {
            return logger.throwError("cannot derive child of neutered node", "UNSUPPORTED_OPERATION", {
                operation: "deriveChild"
            });
        }

        // Data = 0x00 || ser_256(k_par)
        data.set(arrayify(privateKey), 1);

    } else {
        // Data = ser_p(point(k_par))
        data.set(arrayify(publicKey));
    }

    // Data += ser_32(i)
    for (let i = 24; i >= 0; i -= 8) { data[33 + (i >> 3)] = ((index >> (24 - i)) & 0xff); }
    const I = arrayify(computeHmac("sha512", chainCode, data));

    return { IL: I.slice(0, 32), IR: I.slice(32) };
}

type HDNodeLike<T> = { depth: number, deriveChild: (i: number) => T };
function derivePath<T extends HDNodeLike<T>>(node: T, path: string): T {
    const components = path.split("/");

    if (components.length === 0 || (components[0] === "m" && node.depth !== 0)) {
        throw new Error("invalid path - " + path);
    }

    if (components[0] === "m") { components.shift(); }

    let result: T = node;
    for (let i = 0; i < components.length; i++) {
        const component = components[i];

        if (component.match(/^[0-9]+'$/)) {
            const index = parseInt(component.substring(0, component.length - 1));
            if (index >= HardenedBit) { throw new Error("invalid path index - " + component); }
            result = result.deriveChild(HardenedBit + index);

        } else if (component.match(/^[0-9]+$/)) {
            const index = parseInt(component);
            if (index >= HardenedBit) { throw new Error("invalid path index - " + component); }
            result = result.deriveChild(index);

        } else {
            throw new Error("invalid path component - " + component);
        }
    }

    return result;
}


export interface HDNodeWithPath {
    path: string;
}

export class HDNodeWallet extends BaseWallet {
    readonly publicKey!: string;

    readonly fingerprint!: string;
    readonly parentFingerprint!: string;

    readonly mnemonic!: null | Mnemonic;

    readonly chainCode!: string;

    readonly path!: null | string;
    readonly index!: number;
    readonly depth!: number;

    constructor(guard: any, signingKey: SigningKey, parentFingerprint: string, chainCode: string, path: null | string, index: number, depth: number, mnemonic: null | Mnemonic, provider: null | Provider) {
        super(signingKey, provider);
        logger.assertPrivate(guard, _guard, "HDNodeWallet");

        defineProperties<HDNodeWallet>(this, { publicKey: signingKey.compressedPublicKey });

        const fingerprint = dataSlice(ripemd160(sha256(this.publicKey)), 0, 4);
        defineProperties<HDNodeWallet>(this, {
            parentFingerprint, fingerprint,
            chainCode, path, index, depth
        });

        defineProperties<HDNodeWallet>(this, { mnemonic });
    }

    connect(provider: null | Provider): HDNodeWallet {
        return new HDNodeWallet(_guard, this.signingKey, this.parentFingerprint,
            this.chainCode, this.path, this.index, this.depth, this.mnemonic, provider);
    }

    get extendedKey(): string {
        // We only support the mainnet values for now, but if anyone needs
        // testnet values, let me know. I believe current sentiment is that
        // we should always use mainnet, and use BIP-44 to derive the network
        //   - Mainnet: public=0x0488B21E, private=0x0488ADE4
        //   - Testnet: public=0x043587CF, private=0x04358394

        if (this.depth >= 256) { throw new Error("Depth too large!"); }

        return encodeBase58Check(concat([
            "0x0488ADE4", zpad(this.depth, 1), this.parentFingerprint,
            zpad(this.index, 4), this.chainCode,
            concat([ "0x00", this.privateKey ])
        ]));
    }

    hasPath(): this is { path: string } { return (this.path != null); }

    neuter(): HDNodeVoidWallet {
        return new HDNodeVoidWallet(_guard, this.address, this.publicKey,
            this.parentFingerprint, this.chainCode, this.path, this.index,
            this.depth, this.provider);
    }

    deriveChild(_index: Numeric): HDNodeWallet {
        const index = logger.getNumber(_index, "index");
        if (index > 0xffffffff) { throw new Error("invalid index - " + String(index)); }

        // Base path
        let path = this.path;
        if (path) {
            path += "/" + (index & ~HardenedBit);
            if (index & HardenedBit) { path += "'"; }
        }

        const { IR, IL } = ser_I(index, this.chainCode, this.publicKey, this.privateKey);
        const ki = new SigningKey(toHex((toBigInt(IL) + BigInt(this.privateKey)) % N, 32));

        return new HDNodeWallet(_guard, ki, this.fingerprint, hexlify(IR),
            path, index, this.depth + 1, this.mnemonic, this.provider);

    }

    derivePath(path: string): HDNodeWallet {
        return derivePath<HDNodeWallet>(this, path);
    }

    static #fromSeed(_seed: BytesLike, mnemonic: null | Mnemonic): HDNodeWallet {
        const seed = logger.getBytes(_seed, "seed");
        if (seed.length < 16 || seed.length > 64) {
            throw new Error("invalid seed");
        }

        const I: Uint8Array = arrayify(computeHmac("sha512", MasterSecret, seed));
        const signingKey = new SigningKey(hexlify(I.slice(0, 32)));

        return new HDNodeWallet(_guard, signingKey, "0x00000000", hexlify(I.slice(32)),
            "m", 0, 0, mnemonic, null);
    }

    static fromSeed(seed: BytesLike): HDNodeWallet {
        return HDNodeWallet.#fromSeed(seed, null);
    }

    static fromPhrase(phrase: string, password = "", path: null | string = defaultPath, wordlist: Wordlist = langEn): HDNodeWallet {
        if (!path) { path = defaultPath; }
        const mnemonic = Mnemonic.fromPhrase(phrase, password, wordlist)
        return HDNodeWallet.#fromSeed(mnemonic.computeSeed(), mnemonic).derivePath(path);
    }

    static fromMnemonic(mnemonic: Mnemonic, path: null | string = defaultPath): HDNodeWallet {
        if (!path) { path = defaultPath; }
        return HDNodeWallet.#fromSeed(mnemonic.computeSeed(), mnemonic).derivePath(path);
    }

    static fromExtendedKey(extendedKey: string): HDNodeWallet | HDNodeVoidWallet {
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
            case "0x0488b21e": case "0x043587cf": {
                const publicKey = hexlify(key);
                return new HDNodeVoidWallet(_guard, computeAddress(publicKey), publicKey,
                    parentFingerprint, chainCode, null, index, depth, null);
            }

            // Private Key
            case "0x0488ade4": case "0x04358394 ":
                if (key[0] !== 0) { break; }
                return new HDNodeWallet(_guard, new SigningKey(key.slice(1)),
                    parentFingerprint, chainCode, null, index, depth, null, null);
        }


        return logger.throwArgumentError("invalid extended key prefix", "extendedKey", "[ REDACTED ]");
    }

    static createRandom(password = "", path: null | string = defaultPath, wordlist: Wordlist = langEn): HDNodeWallet {
        if (!path) { path = defaultPath; }
        const mnemonic = Mnemonic.fromEntropy(randomBytes(16), password, wordlist)
        return HDNodeWallet.#fromSeed(mnemonic.computeSeed(), mnemonic).derivePath(path);
    }
}

export class HDNodeVoidWallet extends VoidSigner {
    readonly publicKey!: string;

    readonly fingerprint!: string;
    readonly parentFingerprint!: string;

    readonly chainCode!: string;

    readonly path!: null | string;
    readonly index!: number;
    readonly depth!: number;

    constructor(guard: any, address: string, publicKey: string, parentFingerprint: string, chainCode: string, path: null | string, index: number, depth: number, provider: null | Provider) {
        super(address, provider);
        logger.assertPrivate(guard, _guard, "HDNodeVoidWallet");

        defineProperties<HDNodeVoidWallet>(this, { publicKey });

        const fingerprint = dataSlice(ripemd160(sha256(publicKey)), 0, 4);
        defineProperties<HDNodeVoidWallet>(this, {
            publicKey, fingerprint, parentFingerprint, chainCode, path, index, depth
        });
    }

    connect(provider: null | Provider): HDNodeVoidWallet {
        return new HDNodeVoidWallet(_guard, this.address, this.publicKey,
            this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, provider);
    }

    get extendedKey(): string {
        // We only support the mainnet values for now, but if anyone needs
        // testnet values, let me know. I believe current sentiment is that
        // we should always use mainnet, and use BIP-44 to derive the network
        //   - Mainnet: public=0x0488B21E, private=0x0488ADE4
        //   - Testnet: public=0x043587CF, private=0x04358394

        if (this.depth >= 256) { throw new Error("Depth too large!"); }

        return encodeBase58Check(concat([
            "0x0488B21E",
            zpad(this.depth, 1),
            this.parentFingerprint,
            zpad(this.index, 4),
            this.chainCode,
            this.publicKey,
        ]));
    }

    hasPath(): this is { path: string } { return (this.path != null); }

    deriveChild(_index: Numeric): HDNodeVoidWallet {
        const index = logger.getNumber(_index, "index");
        if (index > 0xffffffff) { throw new Error("invalid index - " + String(index)); }

        // Base path
        let path = this.path;
        if (path) {
            path += "/" + (index & ~HardenedBit);
            if (index & HardenedBit) { path += "'"; }
        }

        const { IR, IL } = ser_I(index, this.chainCode, this.publicKey, null);
        const Ki = SigningKey._addPoints(IL, this.publicKey, true);

        const address = computeAddress(Ki);

        return new HDNodeVoidWallet(_guard, address, Ki, this.fingerprint, hexlify(IR),
            path, index, this.depth + 1, this.provider);

    }

    derivePath(path: string): HDNodeVoidWallet {
        return derivePath<HDNodeVoidWallet>(this, path);
    }
}

export class HDNodeWalletManager {
    #root: HDNodeWallet;

    constructor(phrase: string, password = "", path = "m/44'/60'/0'/0", locale: Wordlist = langEn) {
        this.#root = HDNodeWallet.fromPhrase(phrase, password, path, locale);
    }

    getSigner(index = 0): HDNodeWallet {
        return this.#root.deriveChild(index);
    }
}

export function getAccountPath(_index: Numeric): string {
    const index = logger.getNumber(_index, "index");
    if (index < 0 || index >= HardenedBit) {
        logger.throwArgumentError("invalid account index", "index", index);
    }
    return `m/44'/60'/${ index }'/0/0`;
}

