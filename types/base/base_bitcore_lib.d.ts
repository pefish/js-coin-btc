import BaseCoin from './base_coin';
export default class BaseBitcoreLib extends BaseCoin {
    decimals: number;
    _bitcoin: any;
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
     * 根据wif获取address
     * @param wif {string}
     * @param network
     */
    getAddressFromWif(wif: any, network?: string): any;
    /**
     * 生成交易, 单位satoshi
     * @param utxos {array} balance使用satoshi数值string, index使用number. { wif, txid, index/vout, balance/amount[, sequence][, type][, pubkeys] }
     * @param targets {array} 为[]则全部钱打给changeAddress { address, amount[, msg] }
     * @param fee {string} satoshi string
     * @param changeAddress {string} 找零地址
     * @param network {string}
     * @param sign {boolean}
     * @param version {number}
     * @returns {Promise.<*>}
     */
    buildTransaction(utxos: any, targets: any, fee: any, changeAddress: any, network?: string, sign?: boolean, version?: number): {
        txHex: any;
        txId: any;
        fee: any;
        outputWithIndex: any[];
        inputAmount: any;
        changeAmount: any;
        outputAmount: any;
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
