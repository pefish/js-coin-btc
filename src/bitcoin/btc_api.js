import HttpRequestUtil from 'p-js-utils/lib/http_request'
import ErrorHelper from 'p-js-error'

export default class BtcApiHelper {
  constructor (url, token = '') {
    // this._baseUrl = (network === 'testnet' ? 'https://api.blockcypher.com/v1/btc/test3' : 'https://api.blockcypher.com/v1/btc/main')
    this._baseUrl = url
    this._token = token
  }

  _buildFullUrl (path) {
    return `${this._baseUrl}${path}?token=${this._token}`
  }

  async sendRawTransaction (txHex) {
    const result = await HttpRequestUtil.postJson(this._buildFullUrl('/txs/push'), null, {
      tx: txHex
    })
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return true
  }

  async getAddressInfo (address) {
    const result = await HttpRequestUtil.getJson(this._buildFullUrl(`/addrs/${address}`), null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }

  async getBalance (address, zeroConfirmation = true) {
    const result = await HttpRequestUtil.getJson(this._buildFullUrl(`/addrs/${address}/balance`), null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return zeroConfirmation === true ? result['balance'].toString().add(result['unconfirmed_balance']) : result['balance'].toString()
  }

  async getUnconfirmedTxs () {
    const result = await HttpRequestUtil.getJson(this._buildFullUrl(`/txs`), null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }

  async getChainInfo () {
    const result = await HttpRequestUtil.getJson(this._buildFullUrl(''), null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }
}
