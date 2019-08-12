import HttpRequestUtil from '@pefish/js-util-httprequest'
import ErrorHelper from '@pefish/js-error'

export default class BtcApiHelper {
  baseUrl: string
  token: string

  constructor (url, token = '') {
    // this._baseUrl = (network === 'testnet' ? 'https://api.blockcypher.com/v1/btc/test3' : 'https://api.blockcypher.com/v1/btc/main')
    this.baseUrl = url
    this.token = token
  }

  private buildFullUrl (path: string): string {
    return `${this.baseUrl}${path}?token=${this.token}`
  }

  async sendRawTransaction (txHex: string) {
    const result = await HttpRequestUtil.postJson(this.buildFullUrl('/txs/push'), null, {
      tx: txHex
    })
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
  }

  async getAddressInfo (address: string): Promise<any> {
    const result = await HttpRequestUtil.getJson(this.buildFullUrl(`/addrs/${address}`), null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }

  async getBalance (address: string, zeroConfirmation: boolean = true): Promise<string> {
    const result = await HttpRequestUtil.getJson(this.buildFullUrl(`/addrs/${address}/balance`), null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return zeroConfirmation === true ? result['balance'].toString().add(result['unconfirmed_balance']) : result['balance'].toString()
  }

  async getUnconfirmedTxs (): Promise<any[]> {
    const result = await HttpRequestUtil.getJson(this.buildFullUrl(`/txs`), null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }

  async getChainInfo (): Promise<any> {
    const result = await HttpRequestUtil.getJson(this.buildFullUrl(''), null, {})
    if (result['error']) {
      throw new ErrorHelper(result['error']['message'])
    }
    return result
  }
}
