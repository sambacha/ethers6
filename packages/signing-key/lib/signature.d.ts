import type { BytesLike } from "@ethersproject/bytes";
import type { Freezable, Frozen } from "@ethersproject/properties";
import type { BigNumberish } from "@ethersproject/logger";
export declare type SignatureLike = Signature | string | {
    r: string;
    s: string;
    v: BigNumberish;
    yParity?: 0 | 1;
    yParityAndS?: string;
} | {
    r: string;
    yParityAndS: string;
    yParity?: 0 | 1;
    s?: string;
    v?: number;
} | {
    r: string;
    s: string;
    yParity: 0 | 1;
    v?: BigNumberish;
    yParityAndS?: string;
};
export declare class Signature implements Freezable<Signature> {
    #private;
    get r(): string;
    set r(value: BytesLike);
    get s(): string;
    set s(value: BytesLike);
    get v(): 27 | 28;
    set v(value: BigNumberish);
    get networkV(): null | bigint;
    get legacyChainId(): null | bigint;
    get yParity(): 0 | 1;
    get yParityAndS(): string;
    get compactSerialized(): string;
    get serialized(): string;
    constructor(guard: any, r: string, s: string, v: 27 | 28);
    clone(): Signature;
    freeze(): Frozen<Signature>;
    isFrozen(): boolean;
    toJSON(): any;
    static create(): Signature;
    static getChainId(v: BigNumberish): bigint;
    static getChainIdV(chainId: BigNumberish, v: 27 | 28): bigint;
    static getNormalizedV(v: BigNumberish): 27 | 28;
    static from(sig: SignatureLike): Signature;
}
//# sourceMappingURL=signature.d.ts.map