/** @module */
import BaseBitcoinjsLib from '../base/base_bitcoinjs_lib'

/**
 * 比特币钱包帮助类
 * @extends BaseBitcoinjsLib
 */
class BitcoinWalletHelper extends BaseBitcoinjsLib {

  constructor () {
    super()
    this._bitcoin = require('bitcoinjs-lib')
  }
}

export default BitcoinWalletHelper
