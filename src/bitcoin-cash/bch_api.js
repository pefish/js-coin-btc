import HttpRequestUtil from 'p-js-utils/lib/http_request'
import ErrorHelper from 'p-js-error'

export default class BchApiHelper {
  constructor (url) {
    // 只支持mainnet
    // https://bch-chain.api.btc.com/v3
    this._baseUrl = url
  }

  async getBalance (address, zeroConfirmation = true) {
    const result = await HttpRequestUtil.getJson(this._baseUrl + `/address/${address}`, null, {})
    if (result['err_no'] !== 0 || !result['data']) {
      throw new ErrorHelper(`获取余额失败 ${JSON.stringify(result)}`)
    }
    return zeroConfirmation === true ? result['data']['balance'].toString() : result['data']['balance'].toString().sub(result['data']['unconfirmed_received'])
  }

  async getUnconfirmedTxs () {
    const result = await HttpRequestUtil.getJson(this._baseUrl + `/tx/unconfirmed`, null, {})
    if (result['err_no'] !== 0 || !result['data']) {
      throw new ErrorHelper(`获取未确认交易失败 ${JSON.stringify(result)}`)
    }
    return result['data']
  }

  async getChainInfo () {
    const result = await HttpRequestUtil.getJson(this._baseUrl + `/block/latest`, null, {})
    if (result['err_no'] !== 0 || !result['data']) {
      throw new ErrorHelper(`获取chain info失败 ${JSON.stringify(result)}`)
    }
    return result['data']
  }
}
