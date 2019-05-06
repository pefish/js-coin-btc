/** @module */
import 'js-node-assist';
import BaseBitcoinjsLib from './base/base_bitcoinjs_lib';
/**
 * 比特币钱包帮助类
 * @extends BaseBitcoinjsLib
 */
declare class BitcoinWalletHelper extends BaseBitcoinjsLib {
    decimals: number;
    bitcoinLib: any;
    constructor();
}
export default BitcoinWalletHelper;
