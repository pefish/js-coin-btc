/** @module */
import '@pefish/js-node-assist'
import BaseBitcoinjsLib from './base/base_bitcoinjs_lib'
import ErrorHelper from '@pefish/js-error'
import Remote, { RemoteConfig } from './remote'
import * as bitcoinLib from '@pefish/bitcoinjs-lib';
import { Network } from '@pefish/bitcoinjs-lib'

/**
 * 比特币钱包帮助类
 * @extends BaseBitcoinjsLib
 */
class BitcoinWalletHelper extends BaseBitcoinjsLib {
  decimals: number = 8
  bitcoinLib: any
  remoteClient: Remote

  constructor () {
    super()
    this.bitcoinLib = bitcoinLib
  }

  initRemoteClient (config: RemoteConfig): void {
    this.remoteClient = new Remote(config)
  }

  parseNetwork (network: string): Network {
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
