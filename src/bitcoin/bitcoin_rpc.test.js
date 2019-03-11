import 'node-assist'
import BitcoinRpcUtil from './BitcoinRpcUtil'
import assert from "assert"

describe('bitcoinRpcUtil', () => {

  let rpcClient
  const testnet = 'testnet', mainnet = 'mainnet'

  before(async () => {
    rpcClient = BitcoinRpcUtil.getRpcHelper({
      "host": "47.52.247.51/btc",
      "port": 80,
      "username": "test",
      "password": "123456789",
      "ssl": false
    })
  })

  it('request', async () => {
    try {
      const result = await BitcoinRpcUtil.request(rpcClient, 'listunspent', [
        0,
        9999999,
        [
          '2My1UpKsy9ZTRxEac9B5NC3BrUKqx5CCppp'
        ]
      ])
      assert.notStrictEqual(result, undefined)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

