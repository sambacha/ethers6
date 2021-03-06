import { defineProperties } from "@ethersproject/properties";

import { logger } from "./logger.js";

import { BigNumberish } from "@ethersproject/logger";

import type { Network } from "./network.js";
import type { Provider } from "./provider.js";


const EnsAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

export class NetworkPlugin {
    readonly name!: string;

    constructor(name: string) {
        defineProperties<NetworkPlugin>(this, { name });
    }

    clone(): NetworkPlugin {
        return new NetworkPlugin(this.name);
    }

    validate(network: Network): NetworkPlugin {
        return this;
    }
}

// Networks can use this plugin to override calculations for the
// intrinsic gas cost of a transaction for networks that differ
// from the latest hardfork on Ethereum mainnet.
export type GasCostParameters = {
    txBase?: number;
    txCreate?: number;
    txDataZero?: number;
    txDataNonzero?: number;
    txAccessListStorageKey?: number;
    txAccessListAddress?: number;
};

export class GasCostPlugin extends NetworkPlugin {
    readonly effectiveBlock!: number;

    readonly txBase!: number;
    readonly txCreate!: number;
    readonly txDataZero!: number;
    readonly txDataNonzero!: number;
    readonly txAccessListStorageKey!: number;
    readonly txAccessListAddress!: number;

    constructor(effectiveBlock: number = 0, costs?: GasCostParameters) {
        super(`org.ethers.plugins.gas-cost#${ (effectiveBlock || 0) }`);

        const props: Record<string, number> = { effectiveBlock };
        function set(name: keyof GasCostParameters, nullish: number): void {
            let value = (costs || { })[name];
            if (value == null) { value = nullish; }
            if (typeof(value) !== "number") {
                logger.throwArgumentError(`invalud value for ${ name }`, "costs", costs);
            }
            props[name] = value;
        }

        set("txBase", 21000);
        set("txCreate", 32000);
        set("txDataZero", 4);
        set("txDataNonzero", 16);
        set("txAccessListStorageKey", 1900);
        set("txAccessListAddress", 2400);

        defineProperties<GasCostPlugin>(this, props);
    }

    clone(): GasCostPlugin {
        return new GasCostPlugin(this.effectiveBlock, this);
    }
}

// Networks shoudl use this plugin to specify the contract address
// and network necessary to resolve ENS names.
export class EnsPlugin extends NetworkPlugin {

    // The ENS contract address
    readonly address!: string;

    // The network ID that the ENS contract lives on
    readonly targetNetwork!: number;

    constructor(address?: null | string, targetNetwork?: null | number) {
        super("org.ethers.plugins.ens");
        defineProperties<EnsPlugin>(this, {
            address: (address || EnsAddress),
            targetNetwork: ((targetNetwork == null) ? 1: targetNetwork)
        });
    }

    clone(): EnsPlugin {
        return new EnsPlugin(this.address, this.targetNetwork);
    }

    validate(network: Network): this {
        network.formatter.address(this.address);
        return this;
    }
}

export class MaxPriorityFeePlugin extends NetworkPlugin {
    readonly priorityFee!: bigint;

    constructor(priorityFee: BigNumberish) {
        super("org.ethers.plugins.max-priority-fee");
        defineProperties<MaxPriorityFeePlugin>(this, {
            priorityFee: logger.getBigInt(priorityFee)
        });
    }

    async getPriorityFee(provider: Provider): Promise<bigint> {
        return this.priorityFee;
    }

    clone(): MaxPriorityFeePlugin {
        return new MaxPriorityFeePlugin(this.priorityFee);
    }
}
