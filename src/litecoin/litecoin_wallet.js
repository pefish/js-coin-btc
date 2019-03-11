/** @module */
import BaseBitcoinjsLib from '../base/base_bitcoinjs_lib'

/**
 * 莱特币钱包帮助类
 * @extends BaseBitcoinjsLib
 */
class LitecoinWalletHelper extends BaseBitcoinjsLib {

  constructor () {
    super()
    this._bitcoin = require('ltc-bitcoinjs-lib')
  }
}

export default LitecoinWalletHelper
