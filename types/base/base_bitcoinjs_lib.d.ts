import BaseCoin from './base_coin';
/**
 * 比特币系基类
 * @extends BaseCoin
 */
export default class BaseBitcoinjsLib extends BaseCoin {
    decimals: number;
    _bitcoin: any;
    constructor();
    /**
     * 随机生成由12个单词组成的bit39标准助记码
     * @returns {*}
     */
    generateMnemonic(): any;
    /**
     * 验证是否是bip39标准助记码
     * @param mnemonic
     * @returns {boolean}
     */
    validateMnemonic(mnemonic: any): any;
    getSeedByMnemonic(mnemonic: any, pass?: string): any;
    /**
     * 由助记码得到主密钥(bip32、44是xpub和xprv，bip49、141 p2sh(p2wpkh)是ypub和yprv，bip84、141 p2wpkh是zpub和zprv)
     * @param mnemonic
     * @param pass
     * @param network
     * @returns {{seed: string, xpriv, xpub}}
     */
    getMasterPairByMnemonic(mnemonic: any, pass?: string, network?: string): {
        seed: any;
        xpriv: any;
        xpub: any;
        chainCode: any;
        privateKey: any;
        publicKey: any;
        wif: any;
    };
    getMasterPairBySeed(seed: any, network?: string): {
        xpriv: any;
        xpub: any;
        chainCode: any;
        privateKey: any;
        publicKey: any;
        wif: any;
    };
    /**
     * pub转换
     * @param pubType {string}
     * @param sourcePub {string}
     * @returns {*}
     */
    convertPub(pubType: any, sourcePub: any): any;
    /**
     * prv转换
     * @param prvType
     * @param sourcePrv
     * @returns {*}
     */
    convertPrv(prvType: any, sourcePrv: any): any;
    /**
     * 由公钥得到node
     * @param xpub
     * @param network
     */
    getNodeFromXpub(xpub: any, network?: string): any;
    /**
     * 由私钥得到node
     * @param xpriv
     * @param network
     */
    getNodeFromXpriv(xpriv: any, network?: string): any;
    _parseNetwork(network: any): object;
    getAllFromXpub(xpub: any, network?: string): {
        chainCode: any;
        publicKey: any;
    };
    getAllFromWif(wif: any, network?: string): {
        privateKey: any;
        publicKey: any;
    };
    getAllFromXpriv(xpriv: any, network?: string): {
        xpub: any;
        wif: any;
        privateKey: any;
        publicKey: any;
        chainCode: any;
    };
    /**
     * 校验地址
     * @param address
     * @param network
     * @returns {*}
     */
    isAddress(address: any, network?: string): boolean;
    /**
     * 获取地址的类型
     * @param address
     * @param network
     * @returns {*|string}
     */
    getAddressType(address: any, network?: string): string[] | "p2pkh" | "p2wpkh" | "p2wsh(p2ms)";
    /**
     * 校验地址的类型
     * @param address
     * @param type {string} p2pkh|p2wpkh|p2sh(p2wpkh)|p2wsh(p2ms)|p2sh(p2ms)|p2sh(p2wsh(p2ms))
     * @param network
     * @returns {*|boolean}
     */
    verifyAddressType(address: any, type?: string, network?: string): boolean;
    getAddressFromPublicKey(publicKey: any, type?: string, network?: string): any;
    /**
     * 由30位mint字符串得到ecpair
     * @param mintStr
     * @param compress 是否进行压缩
     * @param network
     */
    getKeyPairFromMint(mintStr: any, compress?: boolean, network?: string): any;
    getPrivateKeyFromMint(mintStr: any): any;
    /**
     * 由私钥和path推导出下级节点的所有信息，path中带有'的地址称为hardened address
     * @param xpriv
     * @param path
     * @param network
     * @returns {{parentXpriv: *, index: *, xpriv, xpub, address: *, wif}}
     */
    deriveAllByXprivPath(xpriv: any, path: any, network?: string): {
        path: any;
        xpriv: any;
        xpub: any;
        wif: any;
        chainCode: any;
        privateKey: any;
        publicKey: any;
    };
    /**
     * 使用 xpub 推导，不能推到 hardened address
     * @param xpub
     * @param path
     * @param network
     * @returns {{path: *, xpub: *, chainCode: *, address: *, publicKey: *}}
     */
    deriveAllByXpubPath(xpub: any, path: any, network?: string): {
        path: any;
        chainCode: any;
        publicKey: any;
    };
    /**
     * 根据输出最小数额以及输出最大个数构造目标
     * @param utxos
     * @param targetAddress
     * @param outputMinAmount
     * @param outputMaxNum
     * @param fee
     * @returns {Promise.<Array>}
     */
    constructTargets(utxos: any, targetAddress: any, outputMinAmount: any, outputMaxNum: any, fee: any): any[];
    getTransactionFromHex(txHex: any): any;
    /**
     * 生成交易, 单位satoshi
     * @param utxos {array} balance使用satoshi数值string, index使用number. { wif, txid, index/vout, balance/amount[, sequence][, type][, pubkeys] }
     * @param targets {array} 为[]则全部钱打给changeAddress { address, amount[, msg] }
     * @param fee {string} satoshi string
     * @param changeAddress {string} 找零地址. 没有零钱的话，这个字段不生效
     * @param network {string}
     * @param sign {boolean}
     * @param version {number}
     * @returns {Promise.<*>}
     */
    buildTransaction(utxos: any, targets: any, fee: any, changeAddress: any, network?: string, sign?: boolean, version?: number): {
        txHex: any;
        txId: any;
        fee: any;
        inputAmount: string;
        outputAmount: string;
        changeAmount: string;
        outputWithIndex: any[];
    };
    /**
     * 解码原生交易
     * @param txHex
     * @param network
     * @returns {{txId: *, transaction: *}}
     */
    decodeTxHex(txHex: any, network?: string): {
        txHex: any;
        txId: any;
        inputs: any[];
        outputs: any[];
        outputAmount: string;
    };
    /**
     * 输出脚本转化为地址
     * @param outputScript {buffer}
     * @param network
     * @returns {*}
     */
    outputScriptToAddress(outputScript: any, network?: string): any;
    /**
     * 验证交易的签名是否有效
     * @param txHex
     * @param publicKeys 每个utxo的公钥
     * @returns {Promise<void>}
     */
    verifySignatures(txHex: any, publicKeys: any): boolean;
    /**
     * 签名原生交易
     * @param txHex
     * @param utxos {array} { wif[, balance][, type][, pubkeys] } 对多签地址utxo的签名的顺序不影响交易
     * @param network
     * @returns {Promise<void>}
     */
    signTxHex(txHex: any, utxos: any, network?: string): {
        txHex: any;
        txId: any;
        inputs: any[];
        outputs: any[];
        outputAmount: string;
    };
    /**
     * 对utxo签名
     * @param txBuilder
     * @param utxos {array} wif [type] [balance] [pubkeys] [m]
     * @param network
     * @returns {*|Transaction}
     * @private
     */
    _signUtxos(txBuilder: any, utxos: any, network: any): any;
}
