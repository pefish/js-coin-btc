import BaseCoin from './base_coin'

export default class BaseBitcoreLib extends BaseCoin {
  constructor() {
    super()
    this.decimals = 8
  }

  /**
   * 得到HDPrivateKey实例
   * @param seed {string}
   * @param network
   * @returns {*}
   */
  getHdPrivateKeyBySeed(seed, network = 'testnet') {
    return this._bitcoin.HDPrivateKey.fromSeed(seed, network)
  }

  /**
   *
   * @param seed {string} 不带
   * @param path
   * @param network
   * @returns {{seed: *, xpriv: *, xpub: *, address: string, chainCode, privateKey: *, publicKey: *, wif: *}}
   */
  deriveAllBySeedPath(seed, path, network = 'testnet') {
    const masterHdPrivateKey = this.getHdPrivateKeyBySeed(seed, network)
    const hdPrivateKeyObj = masterHdPrivateKey.derive(path)
    const hdPublicKeyObj = hdPrivateKeyObj.hdPublicKey
    const privateKeyObj = hdPrivateKeyObj.privateKey
    const publicKeyObj = privateKeyObj.toPublicKey()
    return {
      seed: seed,
      xpriv: hdPrivateKeyObj.toString(),
      xpub: hdPublicKeyObj.toString(),
      address: publicKeyObj.toAddress(network).toString(),
      chainCode: hdPrivateKeyObj.toObject().chainCode,
      privateKey: privateKeyObj.toString(),
      publicKey: publicKeyObj.toString(),
      wif: privateKeyObj.toWIF()
    }
  }

  /**
   *根据wif获取address
   * @param wif {string}
   * @param network
   */
  getAddressFromWif(wif, network = 'testnet') {
    const privateKeyObj = this._bitcoin.PrivateKey.fromWIF(wif)
    const publicKeyObj = privateKeyObj.toPublicKey()
    return publicKeyObj.toAddress(network).toString()
  }

  getAddressfromScriptHash(wif, network = 'testnet') {
    const privateKeyObj = this._bitcoin.PrivateKey.fromWIF(wif)
    const publicKeyObj = privateKeyObj.toPublicKey()
    const pubKeyHash = this._bitcoin.crypto.Hash.ripemd160(publicKeyObj.toBuffer())
    logger.error(publicKeyObj.toBuffer())
    const scriptHash = this._bitcoin.Address.fromScriptHash(new Buffer(publicKeyObj.toString(), 'hex'), network)
    logger.error(scriptHash)
  }

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
  async buildTransaction(utxos, targets, fee, changeAddress, network = 'testnet', sign = true, version = 2) {
    let newUtxos = [],privateKeys = [], outputWithIndex = [], totalUtxoBalance = '0',
      targetTotalAmount = '0', changeAmount = '0'
    for (let utxo of utxos) {
      let {txid, index, balance: satoshis, wif} = utxo
      privateKeys.push(this._bitcoin.PrivateKey.fromWIF(wif))
      index = (index === undefined ? utxo['vout'] : index)
      satoshis = (satoshis === undefined ? utxo['amount'].shiftedBy(this.decimals) : satoshis)
      const address = await this.getAddressFromWif(wif, network)
      const script = this._bitcoin.Script.buildPublicKeyHashOut(address).toString()
      totalUtxoBalance = totalUtxoBalance.add(satoshis)
      newUtxos.push({
        txid: txid,
        outputIndex: index,
        satoshis: satoshis.toNumber(),
        script: script
      })
    }
    let targetData = []
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      targetData.push({
        address: target.address,
        satoshis: target.amount.toNumber()
      })
      targetTotalAmount = targetTotalAmount.add(target.amount)
      outputWithIndex.push({
        index: i,
        address: target.address,
        amount: target.amount,
        ref_id: target.ref_id
      })
    }
    if (fee.lt(1000)) {
      fee = '1000'
    }
    const transaction = this._bitcoin.Transaction().from(newUtxos).to(targetData).fee(fee.toNumber()).change(changeAddress).sign(privateKeys)
    // 添加找零的输出
    changeAmount = totalUtxoBalance.sub(targetTotalAmount).sub(fee.toString())
    if (changeAmount !== '0') {
      const amount = totalUtxoBalance.sub(targetTotalAmount).sub(fee.toString()).toNumber()
      outputWithIndex.push({
        address: changeAddress,
        amount,
        index: targets.length,
      })
    }
    const changeAmountReturn = transaction.getChangeOutput() ? transaction.getChangeOutput().satoshis.toString() : '0'
    const Fee = transaction.getFee().toString()
    return {
      txHex: transaction.toString(),
      txId: transaction.id,
      fee,
      outputWithIndex,
      inputAmount: transaction.inputAmount.toString(),
      changeAmount: changeAmountReturn,
      outputAmount: transaction.inputAmount.toString().sub(changeAmountReturn).sub(Fee).toString()
    }
  }

  /**
   * 校验地址
   * @param address
   * @param network
   * @param type
   * @returns {*}
   */
  isAddress(address, network = 'testnet', type = 'pubkeyhash') {
    return this._bitcoin.Address.isValid(address, network, type)
  }
}
