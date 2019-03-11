/** @module */
import BaseBitcoinjsLib from '../base/base_bitcoinjs_lib'

/**
 * 比特现金钱包帮助类
 * @extends BaseBitcoinjsLib
 */
class BitcoinCashWalletHelper extends BaseBitcoinjsLib {

  constructor () {
    super()
    this._bitcoin = require('bcc-bitcoinjs-lib')
  }

  async _signUtxos (tx, utxos, network) {
    tx.enableBitcoinCash(true)
    const hashType = this._bitcoin.Transaction.SIGHASH_ALL | this._bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143
    utxos.forEach((utxo, index) => {
      const { balance, wif } = utxo
      const keyPair = this._bitcoin.ECPair.fromWIF(wif, this._bitcoin.networks[network])
      tx.sign(index, keyPair, null, hashType, balance.toNumber())
    })
    return tx.build()
  }

  /**
   * 获取地址格式。Format.Cashaddr  Format.Bitpay 。。。
   * @param addr
   * @returns {string}
   */
  detectAddressFormat (addr) {
    const bchaddr = require('bchaddrjs')
    return bchaddr.detectAddressFormat(addr)
  }

  detectAddressNetwork (addr) {
    const bchaddr = require('bchaddrjs')
    return bchaddr.detectAddressNetwork(addr)
  }

  detectAddressType (addr) {
    const bchaddr = require('bchaddrjs')
    return bchaddr.detectAddressType(addr)
  }

  getLegacyAddrFromCashAddr (cashAddress) {
    const bchaddr = require('bchaddrjs')
    return bchaddr.toLegacyAddress(cashAddress)
  }

  getBitpayAddrFromLegacyAddr (legacyAddr) {
    const bchaddr = require('bchaddrjs')
    return bchaddr.toBitpayAddress(legacyAddr)
  }

  getCashAddrFromLegacyAddr (legacyAddr) {
    const bchaddr = require('bchaddrjs')
    return bchaddr.toCashAddress(legacyAddr)
  }
}

export default BitcoinCashWalletHelper

