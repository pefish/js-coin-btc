/// <reference types="node" />
import BaseCoin from './base_coin';
import { BIP32Interface } from 'bip32';
import { Network, Transaction, Psbt } from 'bitcoinjs-lib';
export interface Utxo {
    txid?: string;
    wif: string | string[];
    index?: number;
    balance: string;
    sequence?: number;
    type?: string;
    pubkeys?: string[];
    m?: number;
}
/**
 * 比特币系基类
 * @extends BaseCoin
 */
export default abstract class BaseBitcoinjsLib extends BaseCoin {
    abstract decimals: number;
    abstract bitcoinLib: any;
    constructor();
    /**
     * 随机生成由12个单词组成的bit39标准助记码
     * @returns {*}
     */
    generateMnemonic(): string;
    /**
     * 验证是否是bip39标准助记码
     * @param mnemonic
     * @returns {boolean}
     */
    validateMnemonic(mnemonic: string): boolean;
    getSeedByMnemonic(mnemonic: string, pass?: string): string;
    /**
     * 由助记码得到主密钥(bip32、44是xpub和xprv，bip49、141 p2sh(p2wpkh)是ypub和yprv，bip84、141 p2wpkh是zpub和zprv)
     * @param mnemonic
     * @param pass
     * @param network
     * @returns {{seed: string, xpriv, xpub}}
     */
    getMasterPairByMnemonic(mnemonic: string, pass?: string, network?: string): {
        seed: string;
        xpriv: string;
        xpub: string;
        chainCode: string;
        privateKey: string;
        publicKey: string;
        wif: string;
    };
    getMasterPairBySeed(seed: string, network?: string): {
        xpriv: string;
        xpub: string;
        chainCode: string;
        privateKey: string;
        publicKey: string;
        wif: string;
    };
    /**
     * pub转换
     * @param pubType {string}
     * @param sourcePub {string}
     * @returns {*}
     */
    convertPub(pubType: string, sourcePub: string): string;
    /**
     * prv转换
     * @param prvType
     * @param sourcePrv
     * @returns {*}
     */
    convertPrv(prvType: string, sourcePrv: string): string;
    /**
     * 由公钥得到node
     * @param xpub
     * @param network
     */
    getNodeFromXpub(xpub: string, network?: string): BIP32Interface;
    /**
     * 由私钥得到node
     * @param xpriv
     * @param network
     */
    getNodeFromXpriv(xpriv: string, network?: string): BIP32Interface;
    parseNetwork(network: string): Network;
    getAllFromXpub(xpub: string, network?: string): {
        chainCode: string;
        publicKey: string;
    };
    getAllFromWif(wif: string, network?: string): {
        privateKey: string;
        publicKey: string;
    };
    getAllFromPrivateKey(privateKey: string, network: string, compressed?: boolean): {
        privateKey: string;
        publicKey: string;
    };
    getAllFromXpriv(xpriv: string, network?: string): {
        xpub: string;
        chainCode: string;
        privateKey: string;
        publicKey: string;
        wif: string;
    };
    /**
     * 校验地址
     * @param address
     * @param network
     * @returns {*}
     */
    isAddress(address: string, network?: string): boolean;
    /**
     * 获取地址的类型
     * @param address
     * @param network
     * @returns {*|string}
     */
    getAddressType(address: string, network?: string): string | null | string[];
    /**
     * 校验地址的类型
     * @param address
     * @param type {string} p2pkh|p2wpkh|p2sh(p2wpkh)|p2wsh(p2ms)|p2sh(p2ms)|p2sh(p2wsh(p2ms))
     * @param network
     * @returns {*|boolean}
     */
    verifyAddressType(address: string, type?: string, network?: string): boolean;
    getAddressInfoFromPublicKey(publicKey: string | {
        pubkeys: string[];
        m: number;
    }, type?: string, network?: string): {
        address: string;
        redeemScript: string;
    };
    /**
     * 由30位mint字符串得到ecpair
     * @param mintStr
     * @param compress 是否进行压缩
     * @param network
     */
    getKeyPairFromMint(mintStr: string, compress?: boolean, network?: string): any;
    getPrivateKeyFromMint(mintStr: string): string;
    /**
     * 由私钥和path推导出下级节点的所有信息，path中带有'的地址称为hardened address
     * @param xpriv
     * @param path
     * @param network
     * @returns {{parentXpriv: *, index: *, xpriv, xpub, address: *, wif}}
     */
    deriveAllByXprivPath(xpriv: string, path: string, network?: string): {
        xpriv: string;
        xpub: string;
        chainCode: string;
        privateKey: string;
        publicKey: string;
        wif: string;
    };
    /**
     * 使用 xpub 推导，不能推到 hardened address
     * @param xpub
     * @param path
     * @param network
     * @returns {{path: *, xpub: *, chainCode: *, address: *, publicKey: *}}
     */
    deriveAllByXpubPath(xpub: string, path: string, network?: string): {
        chainCode: string;
        publicKey: string;
    };
    getTransactionFromHex(txHex: string): Transaction;
    /**
     * 生成交易, 单位satoshi
     * @param utxos {array} balance使用satoshi数值string, index使用number.
     * @param targets {array} 为[]则全部钱打给changeAddress
     * @param fee {string} satoshi string
     * @param changeAddress {string} 找零地址. 没有零钱的话，这个字段不生效
     * @param network {string}
     * @param sign {boolean}
     * @param version {number}
     * @returns {Promise.<*>}
     */
    buildTransaction(utxos: Utxo[], targets: {
        address: string;
        amount: string;
        msg?: string;
    }[], fee: string, changeAddress: string, network?: string, sign?: boolean, version?: number): {
        txHex: string;
        txId: string;
        fee: string;
        inputAmount: string;
        outputAmount: string;
        changeAmount: string;
    };
    /**
     * 解码原生交易
     * @param txHex
     * @param network
     * @returns {{txId: *, transaction: *}}
     */
    decodeTxHex(txHex: string, network?: string): {
        txHex: string;
        txId: string;
        inputs: {
            hash: string;
            index: number;
            sequence: number;
        }[];
        outputs: {
            value: string;
            index: number;
            address: string;
            script: string;
        }[];
        outputAmount: string;
    };
    /**
     * 输出脚本转化为地址
     * @param outputScript {buffer}
     * @param network
     * @returns {*}
     */
    outputScriptToAddress(outputScript: Buffer, network?: string): string;
    /**
     * 验证交易的签名是否有效
     * @param txHex
     * @param publicKeys 每个utxo的公钥
     * @returns {Promise<void>}
     */
    verifySignatures(txHex: string, publicKeys: string[]): boolean;
    /**
     * 签名原生交易
     * @param txHex
     * @param utxos 对多签地址utxo的签名的顺序不影响交易
     * @param network
     * @returns {Promise<void>}
     */
    signTxHex(txHex: string, utxos: Utxo[], network?: string): {
        txHex: string;
        txId: string;
        inputs: {
            hash: string;
            index: number;
            sequence: number;
        }[];
        outputs: {
            value: string;
            index: number;
            address: string;
            script: string;
        }[];
        outputAmount: string;
    };
    /**
     * 对utxo签名
     * @param txBuilder
     * @param utxos {array} wif [type] [balance] [pubkeys] [m]  pubkeys的顺序必须是生成多签地址时的顺序
     * @param network
     * @returns {*|Transaction}
     * @private
     */
    _signUtxos(txBuilder: Psbt, utxos: Utxo[], network: Network): Transaction;
}
