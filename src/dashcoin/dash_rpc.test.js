import 'node-assist'
import DashRpcUtil from './dash_rpc'
import assert from 'assert'

describe('dashRpcUtil', () => {

  let rpcClient
  const testnet = 'testnet', mainnet = 'mainnet'

  before(async () => {
    rpcClient = DashRpcUtil.getRpcHelper({
      "host": "0.0.0.0",
      "port": 19998,
      "username": "test",
      "password": "123456789",
      "ssl": false
    })
  })

  it('listUnspent', async () => {
    try {
      const result = await DashRpcUtil.request(rpcClient, 'listunspent', [
        0,
        9999999,
        [
          'yNiGGDjTR2TN4toeDR36yh4CX7qDamLbQ3'
        ]
      ])
      //logger.error(result)
      assert.strictEqual(result instanceof Array, true)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })

  it('getgovernanceinfo', async () => {
    try {
      const governanceinfo = await DashRpcUtil.getgovernanceinfo(rpcClient)
      assert.notEqual(governanceinfo, undefined)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })
  it('getpoolinfo', async () => {
    try {
      const poolinfo = await DashRpcUtil.getpoolinfo(rpcClient)
      assert.notEqual(poolinfo, undefined)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })
  it('getsuperblockbudget', async () => {
    try {
      const superblockbudget = await DashRpcUtil.getsuperblockbudget(rpcClient,1)
      assert.notEqual(superblockbudget, undefined)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })
})

