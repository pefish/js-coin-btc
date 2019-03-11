/** @module */
import BaseBitcoinjsLib from '../base/base_bitcoinjs_lib'

/**
 * uload钱包帮助类
 * @extends BaseBitcoinjsLib
 */
class UloadWalletHelper extends BaseBitcoinjsLib {

  constructor () {
    super()
    this._bitcoin = require('uload-bitcoinjs-lib')
  }
}

export default UloadWalletHelper
