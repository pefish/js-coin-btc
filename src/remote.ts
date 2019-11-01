import '@pefish/js-node-assist'
import Client from 'bitcoin-core'
import ErrorHelper from '@pefish/js-error';

export interface RemoteConfig {
  host: string
  port: number,
  username?: string,
  password?: string,
  ssl?: boolean
}

export default class Remote {

  client: Client

  constructor (rpcConfig: RemoteConfig) {
    this.client = new Client(rpcConfig)
  }

  async request (method: string, params: any[]): Promise<any> {
    return this.client.command(method, ...params)
  }

  /**
   * 评估交易手续费
   * @param txSize raw transaction的字节数，长度除以2
   * @param upNetworkFee 上限
   * @param downNetworkFee 下限
   */
  public async estimateNetworkFee (txSize: string, upNetworkFee: string, downNetworkFee: string = `0.00004`): Promise<string> {
    let networkFee: string
    let feerate = (await this.client.estimateSmartFee(20)).feerate.toString();
    if (feerate.lt_(0)) {
      throw new ErrorHelper(`estimateSmartFee access error`)
    }
    const proposeNetworkFee = feerate.multi_(txSize).div_(1000).multi_(1.2)
    if (!feerate) {
      networkFee = downNetworkFee.add_(upNetworkFee).div_(2)
    } else if (proposeNetworkFee.lt_(downNetworkFee)) {
      networkFee = downNetworkFee
    } else if (proposeNetworkFee.gt_(upNetworkFee)) {
      networkFee = upNetworkFee;
    } else {
      networkFee = proposeNetworkFee
    }
    return networkFee
  }
}
