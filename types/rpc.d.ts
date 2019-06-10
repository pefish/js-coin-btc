/** @module */
import '@pefish/js-node-assist';
/**
 * bitcoin rpc调用工具
 */
export default class BitcoinRpcUtil {
    /**
     * 获取调用器
     * @param rpcConfig
     */
    static getRpcHelper(rpcConfig: any): any;
    static request(client: any, method: any, params: any): Promise<any>;
}
