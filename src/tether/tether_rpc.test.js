import 'node-assist'
import TetherRpcUtil from './tether_rpc'
import assert from 'assert'

describe('usdtRpcUtil', () => {

  let rpcClient
  const testnet = 'testnet', mainnet = 'mainnet'

  before(async () => {
    rpcClient = TetherRpcUtil.getRpcHelper({
      "host": "47.99.166.159",
      "port": 18336,
      "username": "test",
      "password": "123456789",
      "ssl": false
    })
  })

  // it('listUnspent', async () => {
  //   try {
  //     const result = await TetherRpcUtil.request(rpcClient, 'listunspent', [
  //       0,
  //       9999999,
  //       [
  //         '2My1UpKsy9ZTRxEac9B5NC3BrUKqx5CCppp'
  //       ]
  //     ])
  //     // logger.error(result)
  //     assert.strictEqual(result instanceof Array, true)
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it('createSimpleSendPayload', async () => {
  //   try {
  //     const payload = await TetherRpcUtil.createSimpleSendPayload(rpcClient, '1')
  //     assert.strictEqual(payload, '000000000000001f0000000000000001')
  //
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it('listBlockTransactions', async () => {
  //   try {
  //     const txs = await TetherRpcUtil.listBlockTransactions(rpcClient, 1292009)
  //     // logger.error(txs)
  //     assert.strictEqual(txs.length, 2)
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it('getTransaction', async () => {
  //   try {
  //     const tx = await TetherRpcUtil.getTransaction(rpcClient, '0c0b6a46a7d8d3f63ccd6ac7a6c5d692065b2c0785bb46cbc148993f432052ad')
  //     // logger.error(tx)
  //     assert.strictEqual(tx['txid'], '0c0b6a46a7d8d3f63ccd6ac7a6c5d692065b2c0785bb46cbc148993f432052ad')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })

  it('getInfo', async () => {
    try {
      const info = await TetherRpcUtil.getInfo(rpcClient)
      // logger.error(info)
      assert.notStrictEqual(info['block'], undefined)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  // it('listPendingTxs', async () => {
  //   try {
  //     const txs = await TetherRpcUtil.listPendingTxs(rpcClient)
  //     // logger.error(txs)
  //     assert.strictEqual(txs instanceof Array, true)
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it('getBalance', async () => {
  //   try {
  //     const result = await TetherRpcUtil.getBalance(rpcClient, '2My1UpKsy9ZTRxEac9B5NC3BrUKqx5CCppp', 1)
  //     assert.strictEqual(result['balance'].gt(0), true)
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
})

