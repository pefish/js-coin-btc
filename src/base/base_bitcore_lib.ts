import BaseCoin from './base_coin'

export default abstract class BaseBitcoreLib extends BaseCoin {
  public abstract decimals: number
  public abstract bitcoinLib: any

  constructor() {
    super()
  }

  /**
   * 得到HDPrivateKey实例
   * @param seed {string}
   * @param network
   * @returns {*}
   */
  getHdPrivateKeyBySeed(seed: string, network: string = 'testnet') {
    return this.bitcoinLib.HDPrivateKey.fromSeed(seed, network)
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
   * 生成交易, 单位satoshi
   * @param utxos {array} balance使用satoshi数值string, index使用number. { wif, txid, script, index/vout, balance/amount[, sequence][, type][, pubkeys] }
   * @param targets {array} 为[]则全部钱打给changeAddress { address, amount[, msg] }
   * @param fee {string} satoshi string
   * @param changeAddress {string} 找零地址
   * @returns {Promise.<*>}
   */
  buildTransaction(utxos, targets, fee, changeAddress) {
    const newUtxos = [], privateKeys = []
    let totalUtxoBalance = '0', targetTotalAmount = '0'
    for (const utxo of utxos) {
      let { index, balance: satoshis} = utxo
      const { txid, wif, script } = utxo
      privateKeys.push(this.bitcoinLib.PrivateKey.fromWIF(wif))
      index = (index === undefined ? utxo['vout'] : index)
      satoshis = (satoshis === undefined ? utxo['amount'].shiftedBy_(this.decimals) : satoshis)
      totalUtxoBalance = totalUtxoBalance.add_(satoshis)
      newUtxos.push({
        txid: txid,
        outputIndex: index,
        satoshis: satoshis.toNumber_(),
        script,
      })
    }
    const targetData = []
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      targetData.push({
        address: target.address,
        satoshis: target.amount.toNumber_()
      })
      targetTotalAmount = targetTotalAmount.add_(target.amount)
    }
    if (fee.lt_(1000)) {
      fee = '1000'
    }
    const transaction = this.bitcoinLib.Transaction().from(newUtxos).to(targetData).fee(fee.toNumber_()).change(changeAddress).sign(privateKeys)
    return {
      txHex: transaction.toString(),
      txId: transaction.id,
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
    return this.bitcoinLib.Address.isValid(address, network, type)
  }
}
