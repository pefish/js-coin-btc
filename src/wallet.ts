/** @module */
import 'js-node-assist'
import BaseBitcoinjsLib from './base/base_bitcoinjs_lib'

/**
 * 比特币钱包帮助类
 * @extends BaseBitcoinjsLib
 */
class BitcoinWalletHelper extends BaseBitcoinjsLib {
  decimals: number = 8
  bitcoinLib: any

  constructor () {
    super()
    this.bitcoinLib = require('btc-bitcoinjs-lib')
  }
}

export default BitcoinWalletHelper
