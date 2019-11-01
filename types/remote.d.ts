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
    /**
     * 评估交易手续费
     * @param txSize raw transaction的字节数，长度除以2
     * @param upNetworkFee 上限
     * @param downNetworkFee 下限
     */
    estimateNetworkFee(txSize: string, upNetworkFee: string, downNetworkFee?: string): Promise<string>;
}
