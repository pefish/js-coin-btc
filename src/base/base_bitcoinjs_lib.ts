import BaseCoin from './base_coin'
import ErrorHelper from '@pefish/js-error'
import BigInteger from 'bigi'
import crypto from 'crypto'
import { BIP32Interface, fromBase58, fromSeed } from 'bip32'
import b58 from 'bs58check'
import { Network, Transaction, TransactionBuilder } from 'bitcoinjs-lib';
import { ECPairInterface } from 'bitcoinjs-lib/types/ecpair';
import { validateMnemonic, mnemonicToSeedSync, generateMnemonic } from 'bip39'

export interface Utxo { txid?: string, wif: string | string[], index?: number, balance: string, sequence?: number, type?: string, pubkeys?: string[], m?: number}

/**
 * 比特币系基类
 * @extends BaseCoin
 */
export default abstract class BaseBitcoinjsLib extends BaseCoin {
  public abstract decimals: number
  public abstract bitcoinLib: any

  public constructor() {
    super()
  }

  /**
   * 随机生成由12个单词组成的bit39标准助记码
   * @returns {*}
   */
  generateMnemonic (): string {
    return generateMnemonic()
  }

  /**
   * 验证是否是bip39标准助记码
   * @param mnemonic
   * @returns {boolean}
   */
  validateMnemonic (mnemonic: string): boolean {
    return validateMnemonic(mnemonic)
  }

  getSeedByMnemonic (mnemonic: string, pass: string = ''): string {
    const seed = mnemonicToSeedSync(mnemonic, pass)
    return seed.toHexString_(false)
  }

  /**
   * 由助记码得到主密钥(bip32、44是xpub和xprv，bip49、141 p2sh(p2wpkh)是ypub和yprv，bip84、141 p2wpkh是zpub和zprv)
   * @param mnemonic
   * @param pass
   * @param network
   * @returns {{seed: string, xpriv, xpub}}
   */
  getMasterPairByMnemonic (mnemonic: string, pass: string = '', network: string = 'testnet'): {
    seed: string,
    xpriv: string,
    xpub: string,
    chainCode: string,
    privateKey: string,
    publicKey: string,
    wif: string
  } {
    const realNetwork = this.parseNetwork(network)
    const seed = mnemonicToSeedSync(mnemonic, pass) // 种子buffer

    const node = fromSeed(seed, realNetwork)
    return {
      seed: seed.toHexString_(false),
      xpriv: node.toBase58(),  // 主私钥, depth为0(BIP32 Root Key)
      xpub: node.neutered().toBase58(),  // 主公钥, neutered是去掉私钥价值
      chainCode: node.chainCode.toHexString_(false),
      privateKey: node.privateKey.toHexString_(false),
      publicKey: node.publicKey.toHexString_(false),
      wif: node.toWIF()
    }
  }

  getMasterPairBySeed (seed: string, network: string = 'testnet'): {
    xpriv: string,
    xpub: string,
    chainCode: string,
    privateKey: string,
    publicKey: string,
    wif: string
  } {
    const realNetwork = this.parseNetwork(network)
    const node = fromSeed(seed.hexToBuffer_(), realNetwork)
    return {
      xpriv: node.toBase58(),  // 主私钥, depth为0(BIP32 Root Key)
      xpub: node.neutered().toBase58(),  // 主公钥, neutered是去掉私钥价值
      chainCode: node.chainCode.toHexString_(false),
      privateKey: node.privateKey.toHexString_(false),
      publicKey: node.publicKey.toHexString_(false),
      wif: node.toWIF()
    }
  }

  /**
   * pub转换
   * @param pubType {string}
   * @param sourcePub {string}
   * @returns {*}
   */
  convertPub (pubType: string, sourcePub: string): string {
    let prefix = ``
    if (pubType === `xpub`) {
      prefix = `0488b21e`
    } else if (pubType === `ypub`) {
      prefix = `049d7cb2`
    } else if (pubType === `zpub`) {
      prefix = `04b24746`
    } else if (pubType === `Ypub`) {
      prefix = `0295b43f`
    } else {
      throw new ErrorHelper(`type error`)
    }
    let data = b58.decode(sourcePub)
    data = data.slice(4)
    data = Buffer.concat([prefix.hexToBuffer_(), data])
    return b58.encode(data)
  }

  /**
   * prv转换
   * @param prvType
   * @param sourcePrv
   * @returns {*}
   */
  convertPrv (prvType: string, sourcePrv: string): string {
    let prefix = ``
    if (prvType === `xprv`) {
      prefix = `0488ade4`
    } else if (prvType === `yprv`) {
      prefix = `049d7878`
    } else if (prvType === `zprv`) {
      prefix = `04b2430c`
    } else {
      throw new ErrorHelper(`type error`)
    }
    let data = b58.decode(sourcePrv)
    data = data.slice(4)
    data = Buffer.concat([prefix.hexToBuffer_(), data])
    return b58.encode(data)
  }

  /**
   * 由公钥得到node
   * @param xpub
   * @param network
   */
  getNodeFromXpub (xpub: string, network: string = 'testnet'): BIP32Interface {
    const realNetwork = this.parseNetwork(network)
    return fromBase58(xpub, realNetwork).neutered()
  }

  /**
   * 由私钥得到node
   * @param xpriv
   * @param network
   */
  getNodeFromXpriv (xpriv: string, network: string = 'testnet'): BIP32Interface {
    const realNetwork = this.parseNetwork(network)
    return fromBase58(xpriv, realNetwork)
  }

  parseNetwork (network: string): Network {
    if (network === `testnet`) {
      return this.bitcoinLib.networks[`testnet`]
    } else if (network === `mainnet`) {
      return this.bitcoinLib.networks[`bitcoin`]
    } else if (network === `regtest`) {
      return this.bitcoinLib.networks[`regtest`]
    } else {
      throw new ErrorHelper(`network error`)
    }
  }

  getAllFromXpub(xpub: string, network: string = 'testnet'): { chainCode: string, publicKey: string } {
    const node = this.getNodeFromXpub(xpub, network)
    return {
      chainCode: node.chainCode.toHexString_(false),
      publicKey: node.publicKey.toHexString_(false)
    }
  }

  getAllFromWif(wif: string, network: string = 'testnet'): { privateKey: string, publicKey: string } {
    const realNetwork = this.parseNetwork(network)
    const ecPair = this.bitcoinLib.ECPair.fromWIF(wif, realNetwork)
    return {
      privateKey: ecPair.privateKey.toHexString_(false),
      publicKey: ecPair.publicKey.toHexString_(false),
    }
  }

  getAllFromPrivateKey(privateKey: string, network: string, compressed: boolean = true): { privateKey: string, publicKey: string } {
    const realNetwork = this.parseNetwork(network)
    if (privateKey.startsWith(`0x`)) {
      privateKey = privateKey.substring(2, privateKey.length)
    }

    const ecPair = this.bitcoinLib.ECPair.fromPrivateKey(privateKey.hexToBuffer_(), {
      network: realNetwork,
      compressed,
    })
    return {
      privateKey: ecPair.privateKey.toHexString_(false),
      publicKey: ecPair.publicKey.toHexString_(false),
    }
  }

  getAllFromXpriv(xpriv: string, network: string = 'testnet'): {
    xpub: string,
    chainCode: string,
    privateKey: string,
    publicKey: string,
    wif: string
  } {
    const node = this.getNodeFromXpriv(xpriv, network)
    return {
      xpub: node.neutered().toBase58(),
      wif: node.toWIF(),
      privateKey: node.privateKey.toHexString_(false),
      publicKey: node.publicKey.toHexString_(false),
      chainCode: node.chainCode.toHexString_(false),
    }
  }

  /**
   * 校验地址
   * @param address
   * @param network
   * @returns {*}
   */
  isAddress(address: string, network: string = 'testnet'): boolean {
    return this.verifyAddressType(address, 'p2pkh', network) ||
      this.verifyAddressType(address, 'p2wpkh', network) ||
      this.verifyAddressType(address, 'p2sh(p2wpkh)', network) ||
      this.verifyAddressType(address, 'p2wsh(p2ms)', network) ||
      this.verifyAddressType(address, 'p2sh(p2ms)', network) ||
      this.verifyAddressType(address, 'p2sh(p2wsh(p2ms))', network)
  }

  /**
   * 获取地址的类型
   * @param address
   * @param network
   * @returns {*|string}
   */
  getAddressType (address: string, network: string = 'testnet'): string | null | string[] {
    const realNetwork = this.parseNetwork(network)
    let decode
    try {
      decode = this.bitcoinLib.address.fromBase58Check(address)
    } catch (e) {}
    if (decode && decode.version === realNetwork[`pubKeyHash`]) {
      return 'p2pkh'
    }
    if (decode && decode.version === realNetwork[`scriptHash`]) {
      return ['p2sh(p2wpkh)', 'p2sh(p2ms)', 'p2sh(p2wsh(p2ms))']
    }
    try {
      decode = this.bitcoinLib.address.fromBech32(address)
    } catch (e) {}
    if (decode && decode.version === 0 && decode.data.length === 20) {
      return 'p2wpkh'
    }
    if (decode && decode.version === 0 && decode.data.length === 32) {
      return 'p2wsh(p2ms)'
    }
    return null
  }

  /**
   * 校验地址的类型
   * @param address
   * @param type {string} p2pkh|p2wpkh|p2sh(p2wpkh)|p2wsh(p2ms)|p2sh(p2ms)|p2sh(p2wsh(p2ms))
   * @param network
   * @returns {*|boolean}
   */
  verifyAddressType (address: string, type: string = 'p2pkh', network: string = 'testnet'): boolean {
    const realNetwork = this.parseNetwork(network)
    let decode
    if (type === 'p2pkh') {
      try {
        decode = this.bitcoinLib.address.fromBase58Check(address)
      } catch (e) {}
      if (decode) {
        return decode.version === realNetwork[`pubKeyHash`]
      }
    } else if (type === 'p2sh(p2wpkh)' || type === 'p2sh(p2ms)' || type === 'p2sh(p2wsh(p2ms))') {
      try {
        decode = this.bitcoinLib.address.fromBase58Check(address)
      } catch (e) {}
      if (decode) {
        return decode.version === realNetwork[`scriptHash`]
      }
    } else if (type === 'p2wpkh') {
      try {
        decode = this.bitcoinLib.address.fromBech32(address)
      } catch (e) {}
      if (decode) {
        if (decode.prefix !== realNetwork[`bech32`]) throw new ErrorHelper(address + ' has an invalid prefix')
        if (decode.version === 0) {
          return decode.data.length === 20
        }
      }
    } else if (type === 'p2wsh(p2ms)') {
      try {
        decode = this.bitcoinLib.address.fromBech32(address)
      } catch (e) {}
      if (decode) {
        if (decode.prefix !== realNetwork[`bech32`]) throw new ErrorHelper(address + ' has an invalid prefix')
        if (decode.version === 0) {
          return decode.data.length === 32
        }
      }
    } else {
      throw new ErrorHelper(`${type} type not exists`)
    }
    return false
  }

  getAddressFromPublicKey(publicKey: string | { pubkeys: string[], m: number}, type: string = 'p2pkh', network: string = 'testnet'): string {
    const realNetwork = this.parseNetwork(network)
    if (type === 'p2pkh') {
      // 常规地址
      return this.bitcoinLib.payments.p2pkh({
        pubkey: (publicKey as string).hexToBuffer_(),
        network: realNetwork
      })[`address`]
    } else if (type === 'p2wpkh') {
      // bitcoind的bech32参数
      return this.bitcoinLib.payments.p2wpkh({
        pubkey: (publicKey as string).hexToBuffer_(),
        network: realNetwork
      })[`address`]
    } else if (type === 'p2sh(p2wpkh)') {
      // 这就是segwit地址，bitcoind的p2sh-segwit参数(p2sh-segwit)
      return this.bitcoinLib.payments.p2sh({
        redeem: this.bitcoinLib.payments.p2wpkh({ pubkey: (publicKey as string).hexToBuffer_(), network: realNetwork }),
        network: realNetwork
      })[`address`]
    } else if (type === 'p2wsh(p2ms)') {
      const {pubkeys, m} = publicKey as { pubkeys: string[], m: number}
      const pubKeysBuffer = pubkeys.map((hex) => {
        return Buffer.from(hex, 'hex')
      })
      return this.bitcoinLib.payments.p2wsh({
        redeem: this.bitcoinLib.payments.p2ms({ m, pubkeys: pubKeysBuffer, network: realNetwork }),
        network: realNetwork
      })[`address`]
    } else if (type === 'p2sh(p2wsh(p2ms))') {
      const {pubkeys, m} = publicKey as { pubkeys: string[], m: number}
      const pubKeysBuffer = pubkeys.map((hex) => {
        return Buffer.from(hex, 'hex')
      })
      return this.bitcoinLib.payments.p2sh({
        redeem: this.bitcoinLib.payments.p2wsh({
          redeem: this.bitcoinLib.payments.p2ms({ m, pubkeys: pubKeysBuffer, network: realNetwork }),
          network: realNetwork
        }),
        network: realNetwork
      })[`address`]
    } else if (type === 'p2sh(p2ms)') {
      // 网上一般用这个
      const {pubkeys, m} = publicKey as { pubkeys: string[], m: number}
      const pubKeysBuffer = pubkeys.map((hex) => {  // pubkeys顺序不一样，生成的地址也不一样，签名时pubkeys的顺序也必须是这样，参与者的签名顺序无关
        return Buffer.from(hex, 'hex')
      })
      return this.bitcoinLib.payments.p2sh({
        redeem: this.bitcoinLib.payments.p2ms({ m, pubkeys: pubKeysBuffer, network: realNetwork }),
        network: realNetwork
      })[`address`]
    } else {
      throw new ErrorHelper('type指定错误')
    }
  }

  /**
   * 由30位mint字符串得到ecpair
   * @param mintStr
   * @param compress 是否进行压缩
   * @param network
   */
  getKeyPairFromMint(mintStr: string, compress: boolean = true, network: string = 'testnet'): ECPairInterface {
    const realNetwork = this.parseNetwork(network)
    const afterSha256 = crypto.createHash('sha256').update(mintStr).digest('hex')
    return new this.bitcoinLib.ECPair(BigInteger.fromBuffer(afterSha256.hexToBuffer_()), null, {
      compressed: compress,
      network: realNetwork
    })
  }

  getPrivateKeyFromMint(mintStr: string): string {
    return crypto.createHash('sha256').update(mintStr).digest('hex')
  }

  /**
   * 由私钥和path推导出下级节点的所有信息，path中带有'的地址称为hardened address
   * @param xpriv
   * @param path
   * @param network
   * @returns {{parentXpriv: *, index: *, xpriv, xpub, address: *, wif}}
   */
  deriveAllByXprivPath(xpriv: string, path: string, network: string = 'testnet'): {
    xpriv: string,
    xpub: string,
    chainCode: string,
    privateKey: string,
    publicKey: string,
    wif: string
  } {
    const node = this.getNodeFromXpriv(xpriv, network)
    const currentNode = node.derivePath(path)
    return {
      xpriv: currentNode.toBase58(), // BIP32 Extended Private Key
      xpub: currentNode.neutered().toBase58(), // BIP32 Extended Public Key
      wif: currentNode.toWIF(),
      chainCode: currentNode.chainCode.toHexString_(false),
      privateKey: currentNode.privateKey.toHexString_(false),
      publicKey: currentNode.publicKey.toHexString_(false)
    }
  }

  /**
   * 使用 xpub 推导，不能推到 hardened address
   * @param xpub
   * @param path
   * @param network
   * @returns {{path: *, xpub: *, chainCode: *, address: *, publicKey: *}}
   */
  deriveAllByXpubPath(xpub: string, path: string, network: string = 'testnet'): {
    chainCode: string,
    publicKey: string
  } {
    const node = this.getNodeFromXpub(xpub, network)
    const currentNode = node.derivePath(path).neutered()
    return {
      chainCode: currentNode.chainCode.toHexString_(false),
      publicKey: currentNode.publicKey.toHexString_(false)
    }
  }

  getTransactionFromHex(txHex: string): Transaction {
    // 未签名的txHex将取不到input
    return this.bitcoinLib.Transaction.fromHex(txHex)
  }

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
  buildTransaction(
    utxos: Utxo[],
    targets: {address: string, amount: string, msg?: string}[],
    fee: string,
    changeAddress: string,
    network: string = 'testnet',
    sign: boolean = true,
    version: number = 2
  ): { txHex: string, txId: string, fee: string, inputAmount: string, outputAmount: string, changeAmount: string} {
    const realNetwork = this.parseNetwork(network)
    const txBuilder = new this.bitcoinLib.TransactionBuilder(realNetwork, 3000)
    txBuilder.setVersion(version)
    let totalUtxoBalance = '0'

    if (utxos.length === 0) {
      throw new ErrorHelper(`没有输入`)
    }

    if (fee.gt_(`10000000`)) {
      throw new ErrorHelper(`手续费过高，请检查`)
    }

    for (const utxo of utxos) {
      const {txid, index, balance, sequence} = utxo
      if (sequence !== undefined) {
        txBuilder.addInput(txid, index, sequence)
      } else {
        txBuilder.addInput(txid, index)
      }
      totalUtxoBalance = totalUtxoBalance.add_(balance)
    }

    let targetTotalAmount = '0'
    // 计算要发送出去的总额
    targets.forEach((target) => {
      const {amount} = target
      targetTotalAmount = targetTotalAmount.add_(amount.toString())
    })

    // 添加其他输出
    for (const target of targets) {
      const {address, amount, msg} = target
      let outputScript = address
      if (address === null && msg) {
        // OP_RETURN
        outputScript = this.bitcoinLib.script.nullData.output.encode(Buffer.from(msg, 'utf8'))
      }
      try {
        txBuilder.addOutput(outputScript, amount.toNumber_())
      } catch (err) {
        throw new ErrorHelper('构造output出错' + err['message'], 0, JSON.stringify(target), err)
      }
    }
    if (fee.lt_(1000)) {
      fee = '1000'
    }
    // 添加找零的输出
    const changeAmount = totalUtxoBalance.sub_(targetTotalAmount).sub_(fee.toString())
    if (changeAmount.lt_(0)) {
      throw new ErrorHelper(`balance not enough`)
    }
    if (changeAmount !== '0') {
      const amount = totalUtxoBalance.sub_(targetTotalAmount).sub_(fee.toString())
      txBuilder.addOutput(changeAddress, amount.toNumber_())
    }
    let buildedTx = null
    if (sign) {
      // 签名
      buildedTx = this._signUtxos(txBuilder, utxos, realNetwork)
    } else {
      buildedTx = txBuilder.buildIncomplete()
    }
    return {
      txHex: buildedTx.toHex(),
      txId: buildedTx.getId(),
      fee,
      inputAmount: totalUtxoBalance.toString(),
      outputAmount: targetTotalAmount.toString(),
      changeAmount: changeAmount.toString(),
    }
  }

  /**
   * 解码原生交易
   * @param txHex
   * @param network
   * @returns {{txId: *, transaction: *}}
   */
  decodeTxHex(txHex: string, network: string = 'testnet'): {
    txHex: string,
    txId: string,
    inputs: { hash: string, index: number, sequence: number }[],
    outputs: { value: string, index: number, address: string, script: string }[],
    outputAmount: string
  } {
    const tx = this.bitcoinLib.Transaction.fromHex(txHex)
    const inputs = [], outputs = []
    let outputAmount = '0'
    for (const input of tx.ins) {
      inputs.push({
        hash: input['hash'].reverseBuffer_().toHexString_(false),
        index: input['index'],
        sequence: input['sequence']
      })
    }
    for (let i = 0; i < tx.outs.length; i++) {
      const output = tx.outs[i]
      const value = output['value'].toString().unShiftedBy_(this.decimals)
      const tempOutput = {
        value,
        index: i
      }
      try {
        tempOutput['address'] = this.outputScriptToAddress(output['script'], network)
      } catch (err) {
        tempOutput['script'] = output['script'].toHexString_(false)
      }

      outputs.push(tempOutput)
      outputAmount = outputAmount.add_(value)
    }
    return {
      txHex: tx.toHex(),
      txId: tx.getId(),
      inputs,
      outputs,
      outputAmount
    }
  }

  /**
   * 输出脚本转化为地址
   * @param outputScript {buffer}
   * @param network
   * @returns {*}
   */
  outputScriptToAddress(outputScript: Buffer, network: string = 'testnet'): string {
    const realNetwork = this.parseNetwork(network)
    return this.bitcoinLib.address.fromOutputScript(outputScript, realNetwork)
  }

  /**
   * 验证交易的签名是否有效
   * @param txHex
   * @param publicKeys 每个utxo的公钥
   * @returns {Promise<void>}
   */
  verifySignatures(txHex: string, publicKeys: string[]): boolean {
    const keyPairs = publicKeys.map((publicKey) => {
      return this.bitcoinLib.ECPair.fromPublicKeyBuffer(Buffer.from(publicKey, 'hex'))
    })
    const tx = this.bitcoinLib.Transaction.fromHex(txHex)
    for (let i = 0; i < tx.ins.length; i++) {
      const input = tx.ins[i]
      const keyPair = keyPairs[i]
      const prevOutScript = this.bitcoinLib.address.toOutputScript(keyPair.getAddress()) // 得到utxo的输出脚本
      const scriptSig = this.bitcoinLib.script.pubKeyHash.input.decode(input.script) // 得到本交易的输入脚本
      const ss = this.bitcoinLib.ECSignature.parseScriptSignature(scriptSig.signature) // 解析输入脚本的签名
      const hash = tx.hashForSignature(i, prevOutScript, ss.hashType) // 得到utxo的待签名hash
      if (scriptSig.pubkey.toString('hex') !== keyPair.getPublicKeyBuffer().toString('hex')) {
        // 核对输入脚本中的公钥
        return false
      }
      if (keyPair.verify(hash, ss.signature) !== true) {
        // 核对输入脚本的签名
        return false
      }
    }
    return true
  }

  /**
   * 签名原生交易
   * @param txHex
   * @param utxos 对多签地址utxo的签名的顺序不影响交易
   * @param network
   * @returns {Promise<void>}
   */
  signTxHex(txHex: string, utxos: Utxo[], network: string = 'testnet'): {
    txHex: string;
    txId: string;
    inputs: { hash: string, index: number, sequence: number }[];
    outputs: { value: string, index: number, address: string, script: string }[];
    outputAmount: string;
  } {
    const realNetwork = this.parseNetwork(network)
    const txBuilder = this.bitcoinLib.TransactionBuilder.fromTransaction(this.bitcoinLib.Transaction.fromHex(txHex), realNetwork)
    const buildedTx = this._signUtxos(txBuilder, utxos, realNetwork)
    const inputs = [], outputs = []
    let outputAmount = '0'
    for (const input of buildedTx.ins) {
      inputs.push({
        hash: input['hash'].reverseBuffer_().toHexString_(false),
        index: input['index'],
        sequence: input['sequence']
      })
    }
    for (let i = 0; i < buildedTx.outs.length; i++) {
      const output = buildedTx.outs[i]
      const value = output['value'].toString().unShiftedBy_(this.decimals)
      const tempOutput = {
        value,
        index: i
      }
      try {
        tempOutput['address'] = this.outputScriptToAddress(output['script'], network)
      } catch (err) {
        tempOutput['script'] = output['script'].toHexString_(false)
      }

      outputs.push(tempOutput)
      outputAmount = outputAmount.add_(value)
    }
    return {
      txHex: buildedTx.toHex(),
      txId: buildedTx.getId(),
      inputs,
      outputs,
      outputAmount
    }
  }

  /**
   * 对utxo签名
   * @param txBuilder
   * @param utxos {array} wif [type] [balance] [pubkeys] [m]  pubkeys的顺序必须是生成多签地址时的顺序
   * @param network
   * @returns {*|Transaction}
   * @private
   */
  _signUtxos(txBuilder: TransactionBuilder, utxos: Utxo[], network: Network): Transaction {
    // logger.error(arguments)
    utxos.map((utxo, index) => {
      const {wif, type = 'p2wpkh', balance, pubkeys, m} = utxo
      if (type === 'p2wpkh') {
        const keyPair = this.bitcoinLib.ECPair.fromWIF(wif, network)
        txBuilder.sign(index, keyPair)
      } else if (type === 'p2sh(p2wpkh)') {
        const keyPair = this.bitcoinLib.ECPair.fromWIF(wif, network)
        const redeemScriptBuffer = this.bitcoinLib.payments.p2sh({
          redeem: this.bitcoinLib.payments.p2wpkh({ pubkey: keyPair.publicKey, network }),
          network
        })[`redeem`][`output`]
        txBuilder.sign(index, keyPair, redeemScriptBuffer, null, balance.toNumber_())
      } else if (type === 'p2wsh(p2ms)') {
        const keyPairs = (wif as string[]).map((wif_) => {
          return this.bitcoinLib.ECPair.fromWIF(wif_, network)
        })
        const pubKeysBuffer = pubkeys.map((pubkey) => {
          return Buffer.from(pubkey, 'hex')
        })
        const p2sh = this.bitcoinLib.payments.p2wsh({
          redeem: this.bitcoinLib.payments.p2ms({ m: m || keyPairs.length, pubkeys: pubKeysBuffer, network }),
          network
        })
        for (const keyPair of keyPairs) {
          txBuilder.sign(index, keyPair, p2sh.redeem.output)
        }
      } else if (type === 'p2sh(p2ms)') {
        const keyPairs = (wif as string[]).map((wif_) => {
          return this.bitcoinLib.ECPair.fromWIF(wif_, network)
        })
        const pubKeysBuffer = pubkeys.map((pubkey) => {
          return Buffer.from(pubkey, 'hex')
        })
        const p2sh = this.bitcoinLib.payments.p2sh({
          redeem: this.bitcoinLib.payments.p2ms({ m: m || keyPairs.length, pubkeys: pubKeysBuffer, network }),
          network
        })
        for (const keyPair of keyPairs) {
          txBuilder.sign(index, keyPair, p2sh.redeem.output)
        }
      } else if (type === 'p2sh(p2wsh(p2ms))') {
        const keyPairs = (wif as string[]).map((wif_) => {
          return this.bitcoinLib.ECPair.fromWIF(wif_, network)
        })
        const pubKeysBuffer = pubkeys.map((pubkey) => {
          return Buffer.from(pubkey, 'hex')
        })
        const p2wsh = this.bitcoinLib.payments.p2wsh({
          redeem: this.bitcoinLib.payments.p2ms({ m: m || keyPairs.length, pubkeys: pubKeysBuffer, network }),
          network
        })
        const p2sh = this.bitcoinLib.payments.p2sh({ redeem: p2wsh, network })
        for (const keyPair of keyPairs) {
          txBuilder.sign(index, keyPair, p2sh.redeem.output, null, balance.toNumber_(), p2wsh.redeem.output)
        }
      } else {
        throw new ErrorHelper('utxo中type指定错误')
      }
    })
    return txBuilder.build()
  }
}
