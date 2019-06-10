import HttpRequestUtil from '@pefish/js-util-httprequest'
import ErrorHelper from '@pefish/js-error'

export default class LtcApiHelper {
  constructor (url) {
    // 只支持mainnet
    // this._baseUrl = (network === 'testnet' ? 'https://api.blockcypher.com/v1/ltc/test3' : 'https://api.blockcypher.com/v1/ltc/main')
    this._baseUrl = url
  }

  async sendRawTransaction (txHex) {
    const result = await HttpRequestUtil.postJson(this._baseUrl + '/txs/push', null, {
      tx: txHex
    })
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return true
  }

  async getAddressInfo (address) {
    const result = await HttpRequestUtil.getJson(this._baseUrl + `/addrs/${address}`, null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }

  async getBalance (address, zeroConfirmation = true) {
    const result = await HttpRequestUtil.getJson(this._baseUrl + `/addrs/${address}/balance`, null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return zeroConfirmation === true ? result['balance'].toString().add(result['unconfirmed_balance']) : result['balance'].toString()
  }

  async getChainInfo () {
    const result = await HttpRequestUtil.getJson(this._baseUrl, null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }
}
