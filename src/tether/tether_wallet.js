import BaseBitcoinjsLib from '../base/base_bitcoinjs_lib'
import TetherRpcUtil from './tether_rpc'
import ErrorHelper from 'p-js-error'

export default class TetherWalletHelper extends BaseBitcoinjsLib {
  constructor () {
    super()
    this._bitcoin = require('btc-bitcoinjs-lib')
  }

  /**
   * 获取usdt测试币
   * @param utxos
   * @param fee
   * @param changeAddress
   * @param amount {string} 获取多少.单位shatoshi
   * @returns {Promise<*>}
   */
  async getTestnetCoin (utxos, fee, changeAddress, amount) {
    return this.buildTransaction(
      utxos,
      [
        {
          address: 'moneyqMan7uh8FqdCA2BV5yZ8qVrc9ikLP',
          amount: amount.div(1E2)
        }
      ],
      fee,
      changeAddress,
      'testnet'
    )
  }

  /**
   * 发送tether货币
   * @param rpcClient
   * @param amount {string} 单位最小
   * @param tokenType {number} 货币类型
   * @param utxos {array} 输入
   * @param targetAddress {string} usdt打给谁
   * @param targetAmount {string} 目标地址btc，单位shatoxi，null是取最小数值
   * @param changeAddress {string} btc找零给谁
   * @param fee {string} 支付的BTC手续费. 单位最小
   * @param targets {array} btc还要打给谁
   * @param network
   * @returns {Promise<*>}
   */
  async buildSimpleSendTx (rpcClient, amount, tokenType, utxos, targetAddress, targetAmount, changeAddress, fee, targets = [], network = 'testnet') {
    if (utxos.length === 0) {
      throw new ErrorHelper(`没有输入`)
    }
    const payload = await TetherRpcUtil.createSimpleSendPayload(rpcClient, amount, tokenType)
    utxos.forEach((utxo) => {
      const { balance, index } = utxo
      utxo['value'] = this.satoshiToBtc(balance)
      utxo['vout'] = index
    })
    const unsignedRawTx = await rpcClient.createRawTransaction(utxos, {})
    const unsignedRawTxWithOpReturn = await TetherRpcUtil.attachOpReturn(rpcClient, unsignedRawTx, payload)
    let withReference = await TetherRpcUtil.attachReference(rpcClient, unsignedRawTxWithOpReturn, targetAddress, targetAmount)
    for (let {address, amount} of targets) {
      withReference = await TetherRpcUtil.attachReference(rpcClient, withReference, address, amount)
    }
    const withChange = await TetherRpcUtil.attachChangeOutput(rpcClient, withReference, utxos, changeAddress, fee.unShiftedBy(8))
    let result = await this.signTxHex(withChange, utxos, network)
    let inputAmount = '0'
    utxos.forEach((utxo) => {
      inputAmount = inputAmount.add(utxo['balance'])
    })

    result[`fee`] = fee.unShiftedBy(8)
    result[`inputAmount`] = inputAmount.unShiftedBy(8)
    return result
  }
}
