
import { WebSocket } from "ws"; /*-browser*/

import { SocketProvider } from "./provider-socket.js";

import type { Networkish } from "./network.js";

export interface WebSocketLike {
    onopen: null | ((...args: Array<any>) => any);
    onmessage: null | ((...args: Array<any>) => any);
    onerror: null | ((...args: Array<any>) => any);

    readyState: number;

    send(payload: any): void;
    close(code?: number, reason?: string): void;
}

export class WebSocketProvider extends SocketProvider {
    url!: string;

    #websocket: WebSocketLike;
    get websocket(): WebSocketLike { return this.#websocket; }

    constructor(url: string | WebSocketLike, network?: Networkish) {
        super(network);
        if (typeof(url) === "string") {
            this.#websocket = new WebSocket(url);
        } else {
            this.#websocket = url;
        }

        this.websocket.onopen = () => {
            this._start();
        };

        this.websocket.onmessage = (message: { data: string }) => {
            this._processMessage(message.data);
        };
    }

    async _write(message: string): Promise<void> {
        this.websocket.send(message);
    }
}
