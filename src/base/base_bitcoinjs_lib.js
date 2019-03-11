import BaseCoin from './base_coin'
import ErrorHelper from 'p-js-error'
import BigInteger from 'bigi'
import CryptUtil from 'p-js-utils/lib/crypt'
import BaseBitcoinLike from "./base_bitcoin_like"

/**
 * 比特币系基类
 * @extends BaseCoin
 */
export default class BaseBitcoinjsLib extends BaseBitcoinLike {
  constructor() {
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

  getMasterPairBySeedBuffer (seedBuffer, network = 'testnet') {
    const node = this._bitcoin.HDNode.fromSeedBuffer(seedBuffer, this._bitcoin.networks[network])
    return {
      seed: seedBuffer.toString('hex'),
      xpriv: node.toBase58(),
      xpub: node.neutered().toBase58(),
      address: node.keyPair.getAddress(),
      chainCode: node.chainCode.toHexString(false),
      privateKey: node.keyPair.d.toHex(),
      publicKey: node.getPublicKeyBuffer().toHexString(false),
      wif: node.keyPair.toWIF()
    }
  }

  /**
   * 由助记码得到主密钥
   * @param mnemonic
   * @param pass
   * @param network
   * @returns {{seed: string, xpriv, xpub}}
   */
  getMasterPairByMnemonic (mnemonic, pass = '', network = 'testnet') {
    const bip39Lib = require('bip39')
    const seed = bip39Lib.mnemonicToSeed(mnemonic, pass) // 种子buffer
    const node = this._bitcoin.HDNode.fromSeedBuffer(seed, this._bitcoin.networks[network])  // node里面才是主公钥和主私钥
    return {
      seed: seed.toString('hex'),
      xpriv: node.toBase58(),  // 主私钥, depth为0
      xpub: node.neutered().toBase58()  // 主公钥, neutered是去掉私钥价值
    }
  }

  /**
   * 由公钥得到node
   * @param xpub
   * @param network
   */
  getNodeFromXpub (xpub, network = 'testnet') {

    return this._bitcoin.HDNode.fromBase58(xpub, this._bitcoin.networks[network]).neutered()
  }

  /**
   * 由私钥得到node
   * @param xpriv
   * @param network
   */
  getNodeFromXpriv (xpriv, network = 'testnet') {

    return this._bitcoin.HDNode.fromBase58(xpriv, this._bitcoin.networks[network])
  }

  /**
   * xpriv->xpub
   * @param xpriv
   * @param network
   */
  xprivToXpub (xpriv, network = 'testnet') {

    const node = this._bitcoin.HDNode.fromBase58(xpriv, this._bitcoin.networks[network])
    return node.neutered().toBase58()
  }

  getAddressFromXpub(xpub, network = 'testnet') {
    const keyPair = this._bitcoin.HDNode.fromBase58(xpub, this._bitcoin.networks[network]).neutered().keyPair
    return keyPair.getAddress()
  }

  /**
   * wif到address  P2PKH
   * @param wif
   * @param type
   * @param network
   * @returns {*}
   */
  getAddressFromWif(wif, type = 'p2pkh', network = 'testnet') {
    const keyPair = this._bitcoin.ECPair.fromWIF(wif, this._bitcoin.networks[network])
    return this.getAddressFromKeyPair(keyPair, type, network)
  }

  /**
   * 校验地址
   * @param address
   * @param network
   * @returns {*}
   */
  isAddress(address, network = 'testnet') {
    return this.verifyAddressType(address, 'p2pkh', network) ||
      this.verifyAddressType(address, 'p2sh', network) ||
      this.verifyAddressType(address, 'p2sh(p2wpkh)', network) ||
      this.verifyAddressType(address, 'p2sh(multisig)', network) ||
      this.verifyAddressType(address, 'p2wpkh', network) ||
      this.verifyAddressType(address, 'p2wsh', network)
  }

  /**
   * 获取地址的类型
   * @param address
   * @param network
   * @returns {*|string}
   */
  getAddressType(address, network = 'testnet') {
    return this._bitcoin.address.getAddressType(address, this._bitcoin.networks[network])
  }

  /**
   * 校验地址的类型
   * @param address
   * @param type
   * @param network
   * @returns {*|boolean}
   */
  verifyAddressType(address, type = 'p2pkh', network = 'testnet') {
    return this._bitcoin.address.verifyAddressType(address, type, this._bitcoin.networks[network])
  }

  getRedeemScriptBufferFromWif(wif, network = 'testnet') {
    const pubKeyBuffer = this._bitcoin.ECPair.fromWIF(wif, this._bitcoin.networks[network]).getPublicKeyBuffer()
    const pubKeyHash = this._bitcoin.crypto.hash160(pubKeyBuffer)

    return this._bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash)
  }

  getAddressFromKeyPair(keyPair, type = 'p2pkh', network = 'testnet') {
    return this.getAddressFromPublicKey(this.getPublicKeyFromKeyPair(keyPair), type, network)
  }

  getAddressFromPublicKey(publicKey, type = 'p2pkh', network = 'testnet') {
    network = this._bitcoin.networks[network]
    if (type === 'p2pkh') {
      // 常规地址，已测试
      const keyPair = this._bitcoin.ECPair.fromPublicKeyBuffer(publicKey.hexToBuffer(), network)
      return keyPair.getAddress()
    } else if (type === 'p2wpkh') {
      // bitcoind的bech32参数
      const pubKeyHash = this._bitcoin.crypto.hash160(publicKey.hexToBuffer())
      const scriptPubKey = this._bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash)
      return this._bitcoin.address.fromOutputScript(scriptPubKey, network)
    } else if (type === 'p2wsh') {
      const pubKeyHash = this._bitcoin.crypto.sha256(publicKey.hexToBuffer())
      const redeemScript = this._bitcoin.script.witnessScriptHash.output.encode(pubKeyHash)
      return this._bitcoin.address.fromOutputScript(redeemScript, network)
    } else if (type === 'p2sh') {
      const pubKeyHash = this._bitcoin.crypto.hash160(publicKey.hexToBuffer())
      const scriptPubKey = this._bitcoin.script.scriptHash.output.encode(this._bitcoin.crypto.hash160(pubKeyHash))
      return this._bitcoin.address.fromOutputScript(scriptPubKey, network)
    } else if (type === 'p2sh(p2wpkh)') {
      // 这就是segwit地址，bitcoind的p2sh-segwit参数
      const pubKeyHash = this._bitcoin.crypto.hash160(publicKey.hexToBuffer())
      const redeemScriptBuffer = this._bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash)
      const scriptPubKey = this._bitcoin.script.scriptHash.output.encode(this._bitcoin.crypto.hash160(redeemScriptBuffer))
      return this._bitcoin.address.fromOutputScript(scriptPubKey, network)
    } else if (type === 'p2sh(p2wsh)') {
      const pubKeyHash = this._bitcoin.crypto.sha256(publicKey.hexToBuffer())
      const redeemScriptBuffer = this._bitcoin.script.witnessScriptHash.output.encode(pubKeyHash)
      const scriptPubKey = this._bitcoin.script.scriptHash.output.encode(this._bitcoin.crypto.hash160(redeemScriptBuffer))
      return this._bitcoin.address.fromOutputScript(scriptPubKey, network)
    } else if (type === 'p2sh_multisig') {
      const {pubkeys, m} = publicKey
      const pubKeysBuffer = pubkeys.map((hex) => {
        return Buffer.from(hex, 'hex')
      })
      const redeemScript = this._bitcoin.script.multisig.output.encode(m, pubKeysBuffer) // 至少需要m个签名才能消费
      const scriptPubKey = this._bitcoin.script.scriptHash.output.encode(this._bitcoin.crypto.hash160(redeemScript))
      return this._bitcoin.address.fromOutputScript(scriptPubKey, network)
    } else if (type === 'p2sh(p2wpkh)_multisig') {
      const {pubkeys, m} = publicKey
      const pubKeysBuffer = pubkeys.map((hex) => {
        return Buffer.from(hex, 'hex')
      })
      const witnessScript = this._bitcoin.script.multisig.output.encode(m, pubKeysBuffer) // 至少需要m个签名才能消费

      const redeemScriptBuffer = this._bitcoin.script.witnessPubKeyHash.output.encode(witnessScript)
      const scriptPubKey = this._bitcoin.script.scriptHash.output.encode(this._bitcoin.crypto.hash160(redeemScriptBuffer))
      return this._bitcoin.address.fromOutputScript(scriptPubKey, network)
    } else if (type === 'p2sh(p2wsh)_multisig') {
      const {pubkeys, m} = publicKey
      const pubKeysBuffer = pubkeys.map((hex) => {
        return Buffer.from(hex, 'hex')
      })
      const witnessScript = this._bitcoin.script.multisig.output.encode(m, pubKeysBuffer) // 至少需要m个签名才能消费

      const witnessScriptHash = this._bitcoin.crypto.sha256(witnessScript)
      const redeemScript = this._bitcoin.script.witnessScriptHash.output.encode(witnessScriptHash)

      const scriptPubKey = this._bitcoin.script.scriptHash.output.encode(this._bitcoin.crypto.hash160(redeemScript))
      return this._bitcoin.address.fromOutputScript(scriptPubKey, network)
    } else {
      throw new ErrorHelper('type指定错误')
    }
  }

  /**
   * 从私钥得到wif
   * 由左32位(即privateKey)和wif标记(即版本，每个网络特定)以及checksum进行base58-check编码
   * @param xpriv
   * @param network
   */
  getWifFromXpriv(xpriv, network = 'testnet') {

    const keyPair = this._bitcoin.HDNode.fromBase58(xpriv, this._bitcoin.networks[network]).keyPair
    return keyPair.toWIF()
  }

  getKeyPairFromWif(wif, network = 'testnet') {
    return this._bitcoin.ECPair.fromWIF(wif, this._bitcoin.networks[network])
  }

  getPrivateKeyFromXpriv(xpriv, network = 'testnet') {
    const keyPair = this._bitcoin.HDNode.fromBase58(xpriv, this._bitcoin.networks[network]).keyPair
    return keyPair.d.toHex()
  }

  /**
   * 由30位mint字符串得到ecpair
   * @param mintStr
   * @param compress 是否进行压缩
   * @param network
   */
  getKeyPairFromMint(mintStr, compress = true, network = 'testnet') {
    const afterSha256 = CryptUtil.sha256(mintStr)
    return new this._bitcoin.ECPair(BigInteger.fromBuffer(afterSha256.hexToBuffer()), null, {
      compressed: compress,
      network: this._bitcoin.networks[network]
    })
  }

  getPrivateKeyFromMint(mintStr) {
    return CryptUtil.sha256(mintStr)
  }

  getAllFromXpriv(xpriv, network = 'testnet') {
    const node = this._bitcoin.HDNode.fromBase58(xpriv, this._bitcoin.networks[network])
    return {
      address: node.keyPair.getAddress(),
      wif: node.keyPair.toWIF(),
      chainCode: node.chainCode.toHexString(false),
      privateKey: node.keyPair.d.toHex(),
      publicKey: node.keyPair.getPublicKeyBuffer().toHexString(false)
    }
  }

  getPublicKeyFromWif(wif, network = 'testnet') {
    const keyPair = this.getKeyPairFromWif(wif, network)
    return keyPair.getPublicKeyBuffer().toHexString(false)
  }

  getPublicKeyFromKeyPair(keyPair, network = 'testnet') {
    return keyPair.getPublicKeyBuffer().toHexString(false)
  }

  getPublicKeyFromPrivateKey(privateKey, compress = true, network = 'testnet') {
    const keyPair = new this._bitcoin.ECPair(BigInteger.fromBuffer(privateKey.hexToBuffer()), null, {
      compressed: compress,
      network: this._bitcoin.networks[network]
    })
    return keyPair.getPublicKeyBuffer().toHexString(false)
  }

  /**
   * 由私钥得到ecpair
   * @param xpriv
   * @param network
   * @returns {*}
   */
  getKeyPairFromXpriv(xpriv, network = 'testnet') {

    return this._bitcoin.HDNode.fromBase58(xpriv, this._bitcoin.networks[network]).keyPair
  }

  /**
   * 根据ecpair(左32位私钥得到的)得到地址、公钥wif、wif
   * @param keyPair
   * @returns {{address: string, wif: string}}
   */
  getAllFromKeyPair(keyPair) {
    return {
      address: keyPair.getAddress(),
      wif: keyPair.toWIF(),
      privateKey: keyPair.d.toHex(),
      publicKey: keyPair.getPublicKeyBuffer().toHexString(false)
    }
  }

  /**
   * 由公钥和index推导出下级address
   * @param xpub
   * @param index
   * @param network
   * @returns {*}
   */
  deriveAddressByXpubIndex(xpub, index, network = 'testnet') {

    const node = this._bitcoin.HDNode.fromBase58(xpub, this._bitcoin.networks[network]).neutered()
    return node.derive(index).getAddress()
  }

  /**
   * 由私钥和index推导出下级节点的所有信息
   * @param xpriv
   * @param index
   * @param network
   * @returns {{parentXpriv: *, index: *, xpriv, xpub, address: *, wif}}
   */
  deriveAllByXprivIndex(xpriv, index, network = 'testnet') {
    const node = this._bitcoin.HDNode.fromBase58(xpriv, this._bitcoin.networks[network])
    const currentNode = node.derive(index)
    return {
      parentXpriv: xpriv,
      index: index,
      xpriv: currentNode.toBase58(),
      xpub: currentNode.neutered().toBase58(),
      address: currentNode.keyPair.getAddress(),
      wif: currentNode.keyPair.toWIF(),
      privateKey: currentNode.keyPair.d.toHex(),
      publicKey: currentNode.keyPair.getPublicKeyBuffer().toHexString(false)
    }
  }

  /**
   * 由私钥和path推导出下级节点的所有信息
   * @param xpriv
   * @param path
   * @param network
   * @returns {{parentXpriv: *, index: *, xpriv, xpub, address: *, wif}}
   */
  deriveAllByXprivPath(xpriv, path, network = 'testnet') {

    const node = this._bitcoin.HDNode.fromBase58(xpriv, this._bitcoin.networks[network])
    const currentNode = node.derivePath(path)
    return {
      parentXpriv: xpriv,
      path: path,
      xpriv: currentNode.toBase58(),
      xpub: currentNode.neutered().toBase58(),
      address: currentNode.keyPair.getAddress(),
      wif: currentNode.keyPair.toWIF(),
      privateKey: currentNode.keyPair.d.toHex(),
      publicKey: currentNode.keyPair.getPublicKeyBuffer().toHexString(false)
    }
  }

  /**
   * 由私钥和index推导出下级wif
   * @param xpriv
   * @param index
   * @param network
   */
  deriveWifByXprivIndex(xpriv, index, network = 'testnet') {

    const node = this._bitcoin.HDNode.fromBase58(xpriv, this._bitcoin.networks[network])
    return node.derive(index).keyPair.toWIF()
  }

  /**
   * 由私钥和path推导出wif
   * @param xpriv
   * @param path
   * @param network
   */
  deriveWifByXprivPath(xpriv, path, network = 'testnet') {

    const node = this._bitcoin.HDNode.fromBase58(xpriv, this._bitcoin.networks[network])
    const subNode = node.derivePath(path)
    return subNode.keyPair.toWIF()
  }

  /**
   * 由公钥和path推导出公钥
   * @param xpub
   * @param path
   * @param network
   */
  deriveXpubByXpubPath(xpub, path, network = 'testnet') {

    const node = this._bitcoin.HDNode.fromBase58(xpub, this._bitcoin.networks[network]).neutered()
    const subNode = node.derivePath(path)
    return subNode.neutered().toBase58()
  }

  /**
   * 由公钥和path推导出address
   * @param xpub
   * @param path
   * @param network
   * @returns {*}
   */
  deriveAddressByXpubPath(xpub, path, network = 'testnet') {

    const node = this._bitcoin.HDNode.fromBase58(xpub, this._bitcoin.networks[network]).neutered()
    const subNode = node.derivePath(path)
    return subNode.getAddress()
  }

  /**
   * 由公钥和path区间推导出多个地址
   * @param xpub
   * @param pathSpan
   * @param network
   * @returns {Promise.<Array>}
   */
  async deriveAddressesByXpubPath(xpub, pathSpan, network = 'testnet') {
    // logger.error(arguments)
    const pos = pathSpan.lastIndexOf('/')
    const pre = pathSpan.substring(0, pos + 1)
    const span = pathSpan.substring(pos + 1, pathSpan.length)
    const start = parseInt(span.split('~')[0]), end = parseInt(span.split('~')[1])
    // logger.error(start)
    const results = []
    const ProgressBar = require('../progress_bar').default
    const pb = new ProgressBar('生成进度', 50, end - start)
    for (let i = start; i < end; i++) {
      const path = `${pre}${i}`
      const address = this.getAddressFromXpubByPath(xpub, path, network)
      results.push({
        path: path,
        address: address
      })
      pb.render({completed: i - start})
    }
    pb.render({completed: end - start})
    return results
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
  async constructTargets(utxos, targetAddress, outputMinAmount, outputMaxNum, fee) {
    const targets = []
    fee = fee.toString()
    outputMinAmount = outputMinAmount.toString()
    outputMaxNum = outputMaxNum.toString()
    let totalUtxoBalance = '0'
    for (let utxo of utxos) {
      const {balance} = utxo
      totalUtxoBalance = totalUtxoBalance.add(balance.toString())
    }
    const totalUtxoNotFee = totalUtxoBalance.sub(fee)
    if (totalUtxoNotFee.div(outputMinAmount).lt(outputMaxNum)) {
      const counter = parseInt(totalUtxoNotFee.div(outputMinAmount).toNumber())
      for (let i = 0; i < counter; i++) {
        targets.push({
          address: targetAddress,
          amount: this.satoshiToBtc(outputMinAmount)
        })
      }
      const tail = totalUtxoNotFee.sub(outputMinAmount.multi(counter.toString()))
      if (tail.gt('0')) {
        targets.push({
          address: targetAddress,
          amount: this.satoshiToBtc(tail)
        })
      }
    } else {
      const amountPer = parseInt(totalUtxoNotFee.div(outputMaxNum).toNumber())
      for (let i = 0; i < outputMaxNum; i++) {
        targets.push({
          address: targetAddress,
          amount: this.satoshiToBtc(amountPer)
        })
      }
      const tail = totalUtxoNotFee.minus(amountPer.toString().multi(outputMaxNum))
      if (tail > 0) {
        targets.push({
          address: targetAddress,
          amount: this.satoshiToBtc(tail)
        })
      }
    }
    return targets
  }

  async getTransactionfromHex(txHex) {
    // 未签名的txHex将取不到input
    return this._bitcoin.Transaction.fromHex(txHex)
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
  async buildTransaction(utxos, targets, fee, changeAddress, network = 'testnet', sign = true, version = 2) {
    // logger.error(arguments)
    const txBuilder = new this._bitcoin.TransactionBuilder(this._bitcoin.networks[network], 3000)
    txBuilder.setVersion(version)
    let totalUtxoBalance = '0'

    if (utxos.length === 0) {
      throw new ErrorHelper(`没有输入`)
    }

    if (fee.gt(`10000000`)) {
      throw new ErrorHelper(`手续费过高，请检查`)
    }

    for (let utxo of utxos) {
      let {txid, index, balance, sequence} = utxo
      index = (index === undefined ? utxo['vout'] : index)
      balance = (balance === undefined ? this.btcToSatoshi(utxo['amount']) : balance)
      if (sequence !== undefined) {
        txBuilder.addInput(txid, index, sequence)
      } else {
        txBuilder.addInput(txid, index)
      }
      totalUtxoBalance = totalUtxoBalance.add(balance)
    }

    let targetTotalAmount = '0'
    // 计算要发送出去的总额
    targets.forEach((target) => {
      const {amount} = target
      targetTotalAmount = targetTotalAmount.add(amount.toString())
    })

    const outputWithIndex = []

    // 添加其他输出
    for (let target of targets) {
      const {address, amount, msg} = target
      let outputScript = address
      if (address === null && msg) {
        // OP_RETURN
        outputScript = this._bitcoin.script.nullData.output.encode(Buffer.from(msg, 'utf8'))
      }
      let index = null
      try {
        index = txBuilder.addOutput(outputScript, amount.toNumber())
        outputWithIndex.push(Object.assign(target, {
          index
        }))
      } catch (err) {
        throw new ErrorHelper('构造output出错' + err['message'], 0, JSON.stringify(target), err)
      }
    }
    if (fee.lt(1000)) {
      fee = '1000'
    }
    // 添加找零的输出
    const changeAmount = totalUtxoBalance.sub(targetTotalAmount).sub(fee.toString())
    if (changeAmount.lt(0)) {
      throw new ErrorHelper(`balance not enough`)
    }
    if (changeAmount !== '0') {
      const amount = totalUtxoBalance.sub(targetTotalAmount).sub(fee.toString())
      const index = txBuilder.addOutput(changeAddress, amount.toNumber())
      outputWithIndex.push({
        address: changeAddress,
        amount,
        index
      })
    }
    let buildedTx = null
    if (sign) {
      // 签名
      buildedTx = await this._signUtxos(txBuilder, utxos, network)
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
  async decodeTxHex(txHex, network = 'testnet') {
    const tx = this._bitcoin.Transaction.fromHex(txHex)
    let inputs = [], outputs = [], outputAmount = '0'
    for (let input of tx.ins) {
      inputs.push({
        hash: input['hash'].reverse().toHexString(false),
        index: input['index'],
        sequence: input['sequence']
      })
    }
    for (let i = 0; i < tx.outs.length; i++) {
      const output = tx.outs[i]
      const value = this.satoshiToBtc(output['value'])
      const tempOutput = {
        value,
        index: i
      }
      try {
        tempOutput['address'] = this.outputScriptToAddress(output['script'], network)
      } catch (err) {
        tempOutput['script'] = output['script'].toHexString(false)
      }

      outputs.push(tempOutput)
      outputAmount = outputAmount.add(value)
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
    return this._bitcoin.address.fromOutputScript(outputScript, this._bitcoin.networks[network])
  }

  /**
   * 验证交易的签名是否有效
   * @param txHex
   * @param publicKeys 每个utxo的公钥
   * @returns {Promise<void>}
   */
  async verifySignatures(txHex, publicKeys) {
    const keyPairs = publicKeys.map((publicKey) => {
      return this._bitcoin.ECPair.fromPublicKeyBuffer(Buffer.from(publicKey, 'hex'))
    })
    const tx = this._bitcoin.Transaction.fromHex(txHex)
    for (let i = 0; i < tx.ins.length; i++) {
      const input = tx.ins[i]
      const keyPair = keyPairs[i]
      const prevOutScript = this._bitcoin.address.toOutputScript(keyPair.getAddress()) // 得到utxo的输出脚本
      const scriptSig = this._bitcoin.script.pubKeyHash.input.decode(input.script) // 得到本交易的输入脚本
      const ss = this._bitcoin.ECSignature.parseScriptSignature(scriptSig.signature) // 解析输入脚本的签名
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
   * @param utxos {array} { wif[, balance][, type][, pubkeys] }
   * @param network
   * @returns {Promise<void>}
   */
  async signTxHex(txHex, utxos, network = 'testnet') {
    const txBuilder = this._bitcoin.TransactionBuilder.fromTransaction(this._bitcoin.Transaction.fromHex(txHex), this._bitcoin.networks[network])
    const buildedTx = await this._signUtxos(txBuilder, utxos, network)
    let inputs = [], outputs = [], outputAmount = '0'
    for (let input of buildedTx.ins) {
      inputs.push({
        hash: input['hash'].reverseBuffer().toHexString(false),
        index: input['index'],
        sequence: input['sequence']
      })
    }
    for (let i = 0; i < buildedTx.outs.length; i++) {
      const output = buildedTx.outs[i]
      const value = this.satoshiToBtc(output['value'])
      const tempOutput = {
        value,
        index: i
      }
      try {
        tempOutput['address'] = this.outputScriptToAddress(output['script'], network)
      } catch (err) {
        tempOutput['script'] = output['script'].toHexString(false)
      }

      outputs.push(tempOutput)
      outputAmount = outputAmount.add(value)
    }
    return {
      txHex: buildedTx.toHex(),
      txId: buildedTx.getId(),
      inputs,
      outputs,
      outputAmount
    }
  }

  async _signUtxos(txBuilder, utxos, network) {
    // logger.error(arguments)
    utxos.map((utxo, index) => {
      let {wif, type = 'p2pkh', balance, pubkeys} = utxo
      balance = (balance === undefined ? this.btcToSatoshi(utxo['amount']) : balance)
      if (type === 'p2pkh') {
        // P2PKH地址
        const keyPair = this._bitcoin.ECPair.fromWIF(wif, this._bitcoin.networks[network])
        txBuilder.sign(index, keyPair)
      } else if (type === 'p2sh(p2wpkh)') {
        // P2SH(P2WPKH)地址
        const keyPair = this._bitcoin.ECPair.fromWIF(wif, this._bitcoin.networks[network])
        const redeemScriptBuffer = this.getRedeemScriptBufferFromWif(wif, network)
        txBuilder.sign(index, keyPair, redeemScriptBuffer, null, balance.toNumber())
      } else if (type === 'p2sh_multisig') {
        // 多签名，P2SH(multisig)地址
        const keyPairs = wif.map((wif_) => {
          return this._bitcoin.ECPair.fromWIF(wif_, this._bitcoin.networks[network])
        })
        const pubKeysBuffer = pubkeys.map((pubkey) => {
          return Buffer.from(pubkey, 'hex')
        })
        const redeemScriptBuffer = this._bitcoin.script.multisig.output.encode(1, pubKeysBuffer)
        for (let keyPair of keyPairs) {
          txBuilder.sign(index, keyPair, redeemScriptBuffer)
        }
      } else if (type === 'p2sh(p2wsh)_multisig') {
        const keyPairs = wif.map((wif_) => {
          return this._bitcoin.ECPair.fromWIF(wif_, this._bitcoin.networks[network])
        })
        const pubKeysBuffer = pubkeys.map((pubkey) => {
          return Buffer.from(pubkey, 'hex')
        })
        const witnessScriptBuffer = this._bitcoin.script.multisig.output.encode(keyPairs.length, pubKeysBuffer)
        const redeemScriptBuffer = this._bitcoin.script.witnessScriptHash.output.encode(this._bitcoin.crypto.sha256(witnessScriptBuffer))
        for (let keyPair of keyPairs) {
          txBuilder.sign(index, keyPair, redeemScriptBuffer, null, balance.toNumber(), witnessScriptBuffer)
        }
      } else {
        throw new ErrorHelper('utxo中type指定错误')
      }
    })
    return txBuilder.build()
  }
}
