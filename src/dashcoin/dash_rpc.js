import TetherRpcUtil from "../tether/tether_rpc";

/**
 * dash rpc调用工具
 */
export default class DashRpcUtil {
  /**
   * 获取调用器
   * @param rpcConfig
   */
  static getRpcHelper(rpcConfig) {
    const Client = require('bitcoin-core')
    return new Client(rpcConfig)
  }

  /**
   * 发送rpc请求
   * @param rpcClient
   * @param method {string} 方法名
   * @param params {array} 参数
   * @returns {Promise<void>}
   */
  static async request(rpcClient, method, params) {
    return rpcClient.command(method, ...params)
  }

  /**
   * Returns an object containing governance parameters
   * @param rpcClient
   * @returns {Promise<void>}
   */
  static async getgovernanceinfo(rpcClient) {
    return TetherRpcUtil.request(rpcClient, 'getgovernanceinfo', [])
  }

  /**
   * Returns an object containing mixing pool related information
   * @param rpcClient
   * @returns {Promise<void>}
   */
  static async getpoolinfo(rpcClient) {
    return TetherRpcUtil.request(rpcClient, 'getpoolinfo', [])
  }

  /**
   *Returns the absolute maximum sum of superblock payments allowed
   * @param rpcClient
   * @returns {Promise<void>}
   */
  static async getsuperblockbudget(rpcClient, index) {
    return TetherRpcUtil.request(rpcClient, 'getsuperblockbudget', [index])
  }

}