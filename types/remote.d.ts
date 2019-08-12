import '@pefish/js-node-assist';
import Client from 'bitcoin-core';
export interface RemoteConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
    ssl?: boolean;
}
export default class Remote {
    client: Client;
    constructor(rpcConfig: RemoteConfig);
    request(method: string, params: any[]): Promise<any>;
}
