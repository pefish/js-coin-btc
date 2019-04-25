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

  getSeedByMnemonic (mnemonic, pass = '') {
    const bip39Lib = require('bip39')
    const seed = bip39Lib.mnemonicToSeedSync(mnemonic, pass)
    return seed.toHexString(false)
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
    const node = bip32Lib.fromSeed(seed, this._bitcoin.networks[network])
    return {
      seed: seed.toHexString(false),
      xpriv: node.toBase58(),  // 主私钥, depth为0(BIP32 Root Key)
      xpub: node.neutered().toBase58(),  // 主公钥, neutered是去掉私钥价值
      chainCode: node.chainCode.toHexString(false),
      privateKey: node.privateKey.toHexString(false),
      publicKey: node.publicKey.toHexString(false),
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
    data = Buffer.concat([prefix.hexToBuffer(), data])
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
    data = Buffer.concat([prefix.hexToBuffer(), data])
    return b58.encode(data)
  }

  /**
   * 由公钥得到node
   * @param xpub
   * @param network
   */
  getNodeFromXpub (xpub, network = 'testnet') {
    const bip32Lib = require('bip32')
    return bip32Lib.fromBase58(xpub, this._bitcoin.networks[network]).neutered()
  }

  /**
   * 由私钥得到node
   * @param xpriv
   * @param network
   */
  getNodeFromXpriv (xpriv, network = 'testnet') {
    const bip32Lib = require('bip32')
    return bip32Lib.fromBase58(xpriv, this._bitcoin.networks[network])
  }

  _parseNetwork (network) {
    if (network === `testnet`) {
      return this._bitcoin.networks[`testnet`]
    } else if (network === `mainnet`) {
      return this._bitcoin.networks[`bitcoin`]
    } else if (network === `regtest`) {
      return this._bitcoin.networks[`regtest`]
    } else {
      throw new ErrorHelper(`network error`)
    }
  }

  getAllFromXpub(xpub, network = 'testnet') {
    const node = this.getNodeFromXpub(xpub, network)
    return {
      chainCode: node.chainCode.toHexString(false),
      publicKey: node.publicKey.toHexString(false)
    }
  }

  getAllFromWif(wif, network = 'testnet') {
    network = this._parseNetwork(network)
    const ecPair = this._bitcoin.ECPair.fromWIF(wif, network)
    return {
      privateKey: ecPair.privateKey.toHexString(false),
      publicKey: ecPair.publicKey.toHexString(false),
    }
  }

  getAllFromXpriv(xpriv, network = 'testnet') {
    const node = this.getNodeFromXpriv(xpriv, network)
    return {
      xpub: node.neutered().toBase58(),
      wif: node.toWIF(),
      privateKey: node.privateKey.toHexString(false),
      publicKey: node.publicKey.toHexString(false),
      chainCode: node.chainCode.toHexString(false),
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
    network = this._parseNetwork(network)
    let decode
    try {
      decode = this._bitcoin.address.fromBase58Check(address)
    } catch (e) {}
    if (decode && decode.version === network.pubKeyHash) {
      return 'p2pkh'
    }
    if (decode && decode.version === network.scriptHash) {
      return ['p2sh(p2wpkh)', 'p2sh(p2ms)', 'p2sh(p2wsh(p2ms))']
    }
    try {
      decode = this._bitcoin.address.fromBech32(address)
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
    network = this._parseNetwork(network)
    let decode
    if (type === 'p2pkh') {
      try {
        decode = this._bitcoin.address.fromBase58Check(address)
      } catch (e) {}
      if (decode) {
        return decode.version === network.pubKeyHash
      }
    } else if (type === 'p2sh(p2wpkh)' || type === 'p2sh(p2ms)' || type === 'p2sh(p2wsh(p2ms))') {
      try {
        decode = this._bitcoin.address.fromBase58Check(address)
      } catch (e) {}
      if (decode) {
        return decode.version === network.scriptHash
      }
    } else if (type === 'p2wpkh') {
      try {
        decode = this._bitcoin.address.fromBech32(address)
      } catch (e) {}
      if (decode) {
        if (decode.prefix !== network.bech32) throw new ErrorHelper(address + ' has an invalid prefix')
        if (decode.version === 0) {
          return decode.data.length === 20
        }
      }
    } else if (type === 'p2wsh(p2ms)') {
      try {
        decode = this._bitcoin.address.fromBech32(address)
      } catch (e) {}
      if (decode) {
        if (decode.prefix !== network.bech32) throw new ErrorHelper(address + ' has an invalid prefix')
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
    network = this._parseNetwork(network)
    if (type === 'p2pkh') {
      // 常规地址
      return this._bitcoin.payments.p2pkh({
        pubkey: publicKey.hexToBuffer(),
        network
      })[`address`]
    } else if (type === 'p2wpkh') {
      return this._bitcoin.payments.p2wpkh({
        pubkey: publicKey.hexToBuffer(),
        network
      })[`address`]
    } else if (type === 'p2sh(p2wpkh)') {
      // 这就是segwit地址，bitcoind的p2sh-segwit参数(p2sh-segwit)
      return this._bitcoin.payments.p2sh({
        redeem: this._bitcoin.payments.p2wpkh({ pubkey: publicKey.hexToBuffer(), network }),
        network
      })[`address`]
    } else if (type === 'p2wsh(p2ms)') {
      const {pubkeys, m} = publicKey
      const pubKeysBuffer = pubkeys.map((hex) => {
        return Buffer.from(hex, 'hex')
      })
      return this._bitcoin.payments.p2wsh({
        redeem: this._bitcoin.payments.p2ms({ m, pubkeys: pubKeysBuffer, network }),
        network
      })[`address`]
    } else if (type === 'p2sh(p2wsh(p2ms))') {
      const {pubkeys, m} = publicKey
      const pubKeysBuffer = pubkeys.map((hex) => {
        return Buffer.from(hex, 'hex')
      })
      return this._bitcoin.payments.p2sh({
        redeem: this._bitcoin.payments.p2wsh({
          redeem: this._bitcoin.payments.p2ms({ m, pubkeys: pubKeysBuffer, network }),
          network
        }),
        network
      })[`address`]
    } else if (type === 'p2sh(p2ms)') {
      // 网上一般用这个
      const {pubkeys, m} = publicKey
      const pubKeysBuffer = pubkeys.map((hex) => {  // pubkeys顺序不一样，生成的地址也不一样
        return Buffer.from(hex, 'hex')
      })
      return this._bitcoin.payments.p2sh({
        redeem: this._bitcoin.payments.p2ms({ m, pubkeys: pubKeysBuffer, network }),
        network
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
    return new this._bitcoin.ECPair(BigInteger.fromBuffer(afterSha256.hexToBuffer()), null, {
      compressed: compress,
      network: this._bitcoin.networks[network]
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
      chainCode: currentNode.chainCode.toHexString(false),
      privateKey: currentNode.privateKey.toHexString(false),
      publicKey: currentNode.publicKey.toHexString(false)
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
      chainCode: currentNode.chainCode.toHexString(false),
      publicKey: currentNode.publicKey.toHexString(false)
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

  getTransactionFromHex(txHex) {
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
  buildTransaction(utxos, targets, fee, changeAddress, network = 'testnet', sign = true, version = 2) {
    network = this._parseNetwork(network)
    const txBuilder = new this._bitcoin.TransactionBuilder(network, 3000)
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
      buildedTx = this._signUtxos(txBuilder, utxos, network)
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
  verifySignatures(txHex, publicKeys) {
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
   * @param utxos {array} { wif[, balance][, type][, pubkeys] } 对多签地址utxo的签名的顺序不影响交易
   * @param network
   * @returns {Promise<void>}
   */
  signTxHex(txHex, utxos, network = 'testnet') {
    const realNetwork = this._parseNetwork(network)
    const txBuilder = this._bitcoin.TransactionBuilder.fromTransaction(this._bitcoin.Transaction.fromHex(txHex), realNetwork)
    const buildedTx = this._signUtxos(txBuilder, utxos, realNetwork)
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
      let {wif, type = 'p2pkh', balance, pubkeys, m} = utxo
      if (type === 'p2pkh') {
        const keyPair = this._bitcoin.ECPair.fromWIF(wif, network)
        txBuilder.sign(index, keyPair)
      } else if (type === 'p2sh(p2wpkh)') {
        const keyPair = this._bitcoin.ECPair.fromWIF(wif, network)
        const redeemScriptBuffer = this._bitcoin.payments.p2sh({
          redeem: this._bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network }),
          network
        })[`redeem`][`output`]
        txBuilder.sign(index, keyPair, redeemScriptBuffer, null, balance.toNumber())
      } else if (type === 'p2wsh(p2ms)') {
        const keyPairs = wif.map((wif_) => {
          return this._bitcoin.ECPair.fromWIF(wif_, network)
        })
        const pubKeysBuffer = pubkeys.map((pubkey) => {
          return Buffer.from(pubkey, 'hex')
        })
        const p2sh = this._bitcoin.payments.p2wsh({
          redeem: this._bitcoin.payments.p2ms({ m: m || keyPairs.length, pubkeys: pubKeysBuffer, network }),
          network
        })
        for (let keyPair of keyPairs) {
          txBuilder.sign(index, keyPair, p2sh.redeem.output)
        }
      } else if (type === 'p2sh(p2ms)') {
        const keyPairs = wif.map((wif_) => {
          return this._bitcoin.ECPair.fromWIF(wif_, network)
        })
        const pubKeysBuffer = pubkeys.map((pubkey) => {
          return Buffer.from(pubkey, 'hex')
        })
        const p2sh = this._bitcoin.payments.p2sh({
          redeem: this._bitcoin.payments.p2ms({ m: m || keyPairs.length, pubkeys: pubKeysBuffer, network }),
          network
        })
        for (let keyPair of keyPairs) {
          txBuilder.sign(index, keyPair, p2sh.redeem.output)
        }
      } else if (type === 'p2sh(p2wsh(p2ms))') {
        const keyPairs = wif.map((wif_) => {
          return this._bitcoin.ECPair.fromWIF(wif_, network)
        })
        const pubKeysBuffer = pubkeys.map((pubkey) => {
          return Buffer.from(pubkey, 'hex')
        })
        const p2wsh = this._bitcoin.payments.p2wsh({
          redeem: this._bitcoin.payments.p2ms({ m: m || keyPairs.length, pubkeys: pubKeysBuffer, network }),
          network
        })
        const p2sh = this._bitcoin.payments.p2sh({ redeem: p2wsh, network })
        for (let keyPair of keyPairs) {
          txBuilder.sign(index, keyPair, p2sh.redeem.output, null, balance.toNumber(), p2wsh.redeem.output)
        }
      } else {
        throw new ErrorHelper('utxo中type指定错误')
      }
    })
    return txBuilder.build()
  }
}
