/** @module */

/**
 * usdt rpc调用工具
 */
export default class TetherRpcUtil {
  /**
   * 获取调用器
   * @param rpcConfig
   */
  static getRpcHelper (rpcConfig) {
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
  static async request (rpcClient, method, params) {
    return rpcClient.command(method, ...params)
  }

  /**
   * 创建SimpleSend类型交易的payload
   * @param rpcClient
   * @param amount {string} 发送数量，单位是最小
   * @param tokenType {number} 币种类型
   * @returns {Promise<void>}
   */
  static async createSimpleSendPayload (rpcClient, amount, tokenType = 31) {
    return TetherRpcUtil.request(rpcClient, 'omni_createpayload_simplesend', [
      tokenType,
      amount.unShiftedBy(8)
    ])
  }

  /**
   * 给原生交易附加opreturn
   * @param rpcClient
   * @param txHex
   * @param payload
   * @returns {Promise<void>}
   */
  static async attachOpReturn (rpcClient, txHex, payload) {
    return TetherRpcUtil.request(rpcClient, 'omni_createrawtx_opreturn', [
      txHex,
      payload
    ])
  }

  /**
   * 给原生交易附加接收者
   * @param rpcClient
   * @param txHex
   * @param targetAddress
   * @param amount {string} 单位最小
   * @returns {Promise<void>}
   */
  static async attachReference (rpcClient, txHex, targetAddress, amount = null) {
    const params = [
      txHex,
      targetAddress
    ]
    amount && params.push(amount.unShiftedBy(8).toNumber())
    return TetherRpcUtil.request(rpcClient, 'omni_createrawtx_reference', params)
  }

  /**
   * 给原生交易附加找零
   * @param rpcClient
   * @param txHex
   * @param utxos {array} {txid, vout, scriptPubKey, value}
   * @param changeAddress
   * @param fee
   * @returns {Promise<void>}
   */
  static async attachChangeOutput (rpcClient, txHex, utxos, changeAddress, fee) {
    return TetherRpcUtil.request(rpcClient, 'omni_createrawtx_change', [
      txHex,
      utxos,
      changeAddress,
      fee
    ])
  }

  /**
   * 列出块中所有的交易
   * @param rpcClient
   * @param blockHeight {string | number}
   * @returns {Promise<void>}
   */
  static async listBlockTransactions (rpcClient, blockHeight) {
    return TetherRpcUtil.request(rpcClient, 'omni_listblocktransactions', [
      blockHeight.toNumber()
    ])
  }

  /**
   * 根据txId获取交易
   * @param rpcClient
   * @param txId
   * @returns {Promise<void>}
   */
  static async getTransaction (rpcClient, txId) {
    return TetherRpcUtil.request(rpcClient, 'omni_gettransaction', [
      txId
    ])
  }

  static async getInfo (rpcClient) {
    return TetherRpcUtil.request(rpcClient, 'omni_getinfo', [])
  }

  static async listPendingTxs (rpcClient, address = null) {
    const params = []
    address && params.push(address)
    return TetherRpcUtil.request(rpcClient, 'omni_listpendingtransactions', params)
  }

  /**
   * 获取某种货币的余额
   * @param rpcClient
   * @param address {string}
   * @param currencyId {number}
   * @returns {Promise<void>}
   */
  static async getBalance (rpcClient, address, currencyId) {
    return TetherRpcUtil.request(rpcClient, 'omni_getbalance', [address, currencyId])
  }
}
