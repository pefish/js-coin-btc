/** @module */
import '@pefish/js-node-assist';
import BaseBitcoinjsLib from './base/base_bitcoinjs_lib';
import Remote, { RemoteConfig } from './remote';
import { Network } from 'bitcoinjs-lib';
/**
 * 比特币钱包帮助类
 * @extends BaseBitcoinjsLib
 */
declare class BitcoinWalletHelper extends BaseBitcoinjsLib {
    decimals: number;
    bitcoinLib: any;
    remoteClient: Remote;
    constructor();
    initRemoteClient(config: RemoteConfig): void;
    parseNetwork(network: string): Network;
}
export default BitcoinWalletHelper;
