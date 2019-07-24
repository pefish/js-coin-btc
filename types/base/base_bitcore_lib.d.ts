import BaseCoin from './base_coin';
export default abstract class BaseBitcoreLib extends BaseCoin {
    abstract decimals: number;
    abstract bitcoinLib: any;
    constructor();
    /**
     * 得到HDPrivateKey实例
     * @param seed {string}
     * @param network
     * @returns {*}
     */
    getHdPrivateKeyBySeed(seed: any, network?: string): any;
    /**
     *
     * @param seed {string} 不带
     * @param path
     * @param network
     * @returns {{seed: *, xpriv: *, xpub: *, address: string, chainCode, privateKey: *, publicKey: *, wif: *}}
     */
    deriveAllBySeedPath(seed: any, path: any, network?: string): {
        seed: any;
        xpriv: any;
        xpub: any;
        address: any;
        chainCode: any;
        privateKey: any;
        publicKey: any;
        wif: any;
    };
    /**
     * 生成交易, 单位satoshi
     * @param utxos {array} balance使用satoshi数值string, index使用number. { wif, txid, script, index/vout, balance/amount[, sequence][, type][, pubkeys] }
     * @param targets {array} 为[]则全部钱打给changeAddress { address, amount[, msg] }
     * @param fee {string} satoshi string
     * @param changeAddress {string} 找零地址
     * @returns {Promise.<*>}
     */
    buildTransaction(utxos: any, targets: any, fee: any, changeAddress: any): {
        txHex: any;
        txId: any;
    };
    /**
     * 校验地址
     * @param address
     * @param network
     * @param type
     * @returns {*}
     */
    isAddress(address: any, network?: string, type?: string): any;
}
