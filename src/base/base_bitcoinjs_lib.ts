import BaseCoin from './base_coin'
import ErrorHelper from 'p-js-error'
import BigInteger from 'bigi'
import CryptUtil from 'p-js-utils/lib/crypt'

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
  generateMnemonic () {
    const bip39Lib = require('bip39')
    return bip39Lib.generateMnemonic()
  }

  /**
   * 验证是否是bip39标准助记码
   * @param mnemonic
   * @returns {boolean}
   */
  validateMnemonic (mnemonic) {
    const bip39Lib = require('bip39')
    return bip39Lib.validateMnemonic(mnemonic)
  }

  getSeedByMnemonic (mnemonic, pass = '') {
    const bip39Lib = require('bip39')
    const seed = bip39Lib.mnemonicToSeedSync(mnemonic, pass)
    return seed.toHexString_(false)
  }

  /**
   * 由助记码得到主密钥(bip32、44是xpub和xprv，bip49、141 p2sh(p2wpkh)是ypub和yprv，bip84、141 p2wpkh是zpub和zprv)
   * @param mnemonic
   * @param pass
   * @param network
   * @returns {{seed: string, xpriv, xpub}}
   */
  getMasterPairByMnemonic (mnemonic, pass = '', network = 'testnet') {
    const bip39Lib = require('bip39')
    const seed = bip39Lib.mnemonicToSeedSync(mnemonic, pass) // 种子buffer

    const bip32Lib = require('bip32')
    const node = bip32Lib.fromSeed(seed, this.bitcoinLib.networks[network])
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

  getMasterPairBySeed (seed, network = 'testnet') {
    const bip32Lib = require('bip32')
    const node = bip32Lib.fromSeed(seed.hexToBuffer_(), this.bitcoinLib.networks[network])
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
  convertPub (pubType, sourcePub) {
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
    const b58 = require('bs58check')
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
  convertPrv (prvType, sourcePrv) {
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
    const b58 = require('bs58check')
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
  getNodeFromXpub (xpub, network = 'testnet') {
    const bip32Lib = require('bip32')
    return bip32Lib.fromBase58(xpub, this.bitcoinLib.networks[network]).neutered()
  }

  /**
   * 由私钥得到node
   * @param xpriv
   * @param network
   */
  getNodeFromXpriv (xpriv, network = 'testnet') {
    const bip32Lib = require('bip32')
    return bip32Lib.fromBase58(xpriv, this.bitcoinLib.networks[network])
  }

  _parseNetwork (network): object {
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

  getAllFromXpub(xpub, network = 'testnet') {
    const node = this.getNodeFromXpub(xpub, network)
    return {
      chainCode: node.chainCode.toHexString_(false),
      publicKey: node.publicKey.toHexString_(false)
    }
  }

  getAllFromWif(wif, network = 'testnet') {
    const realNetwork = this._parseNetwork(network)
    const ecPair = this.bitcoinLib.ECPair.fromWIF(wif, realNetwork)
    return {
      privateKey: ecPair.privateKey.toHexString_(false),
      publicKey: ecPair.publicKey.toHexString_(false),
    }
  }

  getAllFromPrivateKey(privateKey, network, compressed = true) {
    const realNetwork = this._parseNetwork(network)
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

  getAllFromXpriv(xpriv, network = 'testnet') {
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
  isAddress(address, network = 'testnet') {
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
  getAddressType (address, network = 'testnet') {
    const realNetwork = this._parseNetwork(network)
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
  verifyAddressType (address, type = 'p2pkh', network = 'testnet') {
    const realNetwork = this._parseNetwork(network)
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

  getAddressFromPublicKey(publicKey, type = 'p2pkh', network = 'testnet') {
    const realNetwork = this._parseNetwork(network)
    if (type === 'p2pkh') {
      // 常规地址
      return this.bitcoinLib.payments.p2pkh({
        pubkey: publicKey.hexToBuffer_(),
        realNetwork
      })[`address`]
    } else if (type === 'p2wpkh') {
      return this.bitcoinLib.payments.p2wpkh({
        pubkey: publicKey.hexToBuffer_(),
        realNetwork
      })[`address`]
    } else if (type === 'p2sh(p2wpkh)') {
      // 这就是segwit地址，bitcoind的p2sh-segwit参数(p2sh-segwit)
      return this.bitcoinLib.payments.p2sh({
        redeem: this.bitcoinLib.payments.p2wpkh({ pubkey: publicKey.hexToBuffer_(), realNetwork }),
        realNetwork
      })[`address`]
    } else if (type === 'p2wsh(p2ms)') {
      const {pubkeys, m} = publicKey
      const pubKeysBuffer = pubkeys.map((hex) => {
        return Buffer.from(hex, 'hex')
      })
      return this.bitcoinLib.payments.p2wsh({
        redeem: this.bitcoinLib.payments.p2ms({ m, pubkeys: pubKeysBuffer, realNetwork }),
        realNetwork
      })[`address`]
    } else if (type === 'p2sh(p2wsh(p2ms))') {
      const {pubkeys, m} = publicKey
      const pubKeysBuffer = pubkeys.map((hex) => {
        return Buffer.from(hex, 'hex')
      })
      return this.bitcoinLib.payments.p2sh({
        redeem: this.bitcoinLib.payments.p2wsh({
          redeem: this.bitcoinLib.payments.p2ms({ m, pubkeys: pubKeysBuffer, realNetwork }),
          realNetwork
        }),
        realNetwork
      })[`address`]
    } else if (type === 'p2sh(p2ms)') {
      // 网上一般用这个
      const {pubkeys, m} = publicKey
      const pubKeysBuffer = pubkeys.map((hex) => {  // pubkeys顺序不一样，生成的地址也不一样
        return Buffer.from(hex, 'hex')
      })
      return this.bitcoinLib.payments.p2sh({
        redeem: this.bitcoinLib.payments.p2ms({ m, pubkeys: pubKeysBuffer, realNetwork }),
        realNetwork
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
  getKeyPairFromMint(mintStr, compress = true, network = 'testnet') {
    const afterSha256 = CryptUtil.sha256(mintStr)
    return new this.bitcoinLib.ECPair(BigInteger.fromBuffer(afterSha256.hexToBuffer_()), null, {
      compressed: compress,
      network: this.bitcoinLib.networks[network]
    })
  }

  getPrivateKeyFromMint(mintStr) {
    return CryptUtil.sha256(mintStr)
  }

  /**
   * 由私钥和path推导出下级节点的所有信息，path中带有'的地址称为hardened address
   * @param xpriv
   * @param path
   * @param network
   * @returns {{parentXpriv: *, index: *, xpriv, xpub, address: *, wif}}
   */
  deriveAllByXprivPath(xpriv, path, network = 'testnet') {
    const node = this.getNodeFromXpriv(xpriv, network)
    const currentNode = node.derivePath(path)
    return {
      path: path,
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
  deriveAllByXpubPath(xpub, path, network = 'testnet') {
    const node = this.getNodeFromXpub(xpub, network)
    const currentNode = node.derivePath(path).neutered()
    return {
      path,
      chainCode: currentNode.chainCode.toHexString_(false),
      publicKey: currentNode.publicKey.toHexString_(false)
    }
  }

  /**
   * 根据输出最小数额以及输出最大个数构造目标
   * @param utxos
   * @param targetAddress
   * @param outputMinAmount
   * @param outputMaxNum
   * @param fee
   * @returns {Promise.<Array>}
   */
  constructTargets(utxos, targetAddress, outputMinAmount, outputMaxNum, fee) {
    const targets = []
    fee = fee.toString()
    outputMinAmount = outputMinAmount.toString()
    outputMaxNum = outputMaxNum.toString()
    let totalUtxoBalance = '0'
    for (const utxo of utxos) {
      const {balance} = utxo
      totalUtxoBalance = totalUtxoBalance.add_(balance.toString())
    }
    const totalUtxoNotFee = totalUtxoBalance.sub_(fee)
    if (totalUtxoNotFee.div_(outputMinAmount).lt_(outputMaxNum)) {
      const counter = parseInt(totalUtxoNotFee.div_(outputMinAmount))
      for (let i = 0; i < counter; i++) {
        targets.push({
          address: targetAddress,
          amount: outputMinAmount.unShiftedBy_(this.decimals)
        })
      }
      const tail = totalUtxoNotFee.sub_(outputMinAmount.multi_(counter.toString()))
      if (tail.gt_('0')) {
        targets.push({
          address: targetAddress,
          amount: tail.unShiftedBy_(this.decimals)
        })
      }
    } else {
      const amountPer = parseInt(totalUtxoNotFee.div_(outputMaxNum))
      for (let i = 0; i < outputMaxNum; i++) {
        targets.push({
          address: targetAddress,
          amount: amountPer.toString().unShiftedBy_(this.decimals)
        })
      }
      const tail = totalUtxoNotFee.sub_(amountPer.toString().multi_(outputMaxNum))
      if (tail.gt_(0)) {
        targets.push({
          address: targetAddress,
          amount: tail.unShiftedBy_(this.decimals)
        })
      }
    }
    return targets
  }

  getTransactionFromHex(txHex) {
    // 未签名的txHex将取不到input
    return this.bitcoinLib.Transaction.fromHex(txHex)
  }

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
  buildTransaction(utxos, targets, fee, changeAddress, network = 'testnet', sign = true, version = 2) {
    const realNetwork = this._parseNetwork(network)
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

    const outputWithIndex = []

    // 添加其他输出
    for (const target of targets) {
      const {address, amount, msg} = target
      let outputScript = address
      if (address === null && msg) {
        // OP_RETURN
        outputScript = this.bitcoinLib.script.nullData.output.encode(Buffer.from(msg, 'utf8'))
      }
      let index = null
      try {
        index = txBuilder.addOutput(outputScript, amount.toNumber_())
        outputWithIndex.push(Object.assign(target, {
          index
        }))
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
      const index = txBuilder.addOutput(changeAddress, amount.toNumber_())
      outputWithIndex.push({
        address: changeAddress,
        amount,
        index
      })
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
      outputWithIndex
    }
  }

  /**
   * 解码原生交易
   * @param txHex
   * @param network
   * @returns {{txId: *, transaction: *}}
   */
  decodeTxHex(txHex, network = 'testnet') {
    const tx = this.bitcoinLib.Transaction.fromHex(txHex)
    const inputs = [], outputs = []
    let outputAmount = '0'
    for (const input of tx.ins) {
      inputs.push({
        hash: input['hash'].reverse().toHexString_(false),
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
  outputScriptToAddress(outputScript, network = 'testnet') {
    return this.bitcoinLib.address.fromOutputScript(outputScript, this.bitcoinLib.networks[network])
  }

  /**
   * 验证交易的签名是否有效
   * @param txHex
   * @param publicKeys 每个utxo的公钥
   * @returns {Promise<void>}
   */
  verifySignatures(txHex, publicKeys) {
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
   * @param utxos {array} { wif[, balance][, type][, pubkeys] } 对多签地址utxo的签名的顺序不影响交易
   * @param network
   * @returns {Promise<void>}
   */
  signTxHex(txHex, utxos, network = 'testnet') {
    const realNetwork = this._parseNetwork(network)
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
   * @param utxos {array} wif [type] [balance] [pubkeys] [m]
   * @param network
   * @returns {*|Transaction}
   * @private
   */
  _signUtxos(txBuilder, utxos, network) {
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
        const keyPairs = wif.map((wif_) => {
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
        const keyPairs = wif.map((wif_) => {
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
        const keyPairs = wif.map((wif_) => {
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
