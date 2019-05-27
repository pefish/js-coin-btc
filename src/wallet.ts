/** @module */
import 'js-node-assist'
import BaseBitcoinjsLib from './base/base_bitcoinjs_lib'
import ErrorHelper from 'p-js-error'

/**
 * 比特币钱包帮助类
 * @extends BaseBitcoinjsLib
 */
class BitcoinWalletHelper extends BaseBitcoinjsLib {
  decimals: number = 8
  bitcoinLib: any

  constructor () {
    super()
    this.bitcoinLib = require('@pefish/bitcoinjs-lib')
  }

  parseNetwork (network): object {
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
}

export default BitcoinWalletHelper
