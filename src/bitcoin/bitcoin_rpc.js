/** @module */

/**
 * bitcoin rpc调用工具
 */
export default class BitcoinRpcUtil {
  /**
   * 获取调用器
   * @param rpcConfig
   */
  static getRpcHelper (rpcConfig) {
    const Client = require('bitcoin-core')
    return new Client(rpcConfig)
  }

  static async request (client, method, params) {
    return client.command(method, ...params)
  }
}
