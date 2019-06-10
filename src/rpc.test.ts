import '@pefish/js-node-assist'
import BitcoinRpcUtil from './rpc'
import assert from 'assert'

declare global {
  namespace NodeJS {
    interface Global {
      logger: any;
    }
  }
}

describe('bitcoinRpcUtil', () => {

  let rpcClient
  const testnet = 'testnet', mainnet = 'mainnet'

  before(async () => {
    rpcClient = BitcoinRpcUtil.getRpcHelper({
      'host': '35.201.199.198',
      'port': 8336,
      'username': 'lbtc',
      'password': '',
      'ssl': false
    })
  })

  it('request', async () => {
    try {
      const result = await BitcoinRpcUtil.request(rpcClient, 'signrawtransaction', [
        `02ff000001bf640c32a7c7d98fe5a666a55d4519f2892a25e18aae982bd547bc13f53af46a0100000000ffffffff02a0860100000000001976a914fbe6e17f956c4e1a815d581d48a88a1862ab117788ac10cc8e03000000001976a9140a022ab7c3fd12494c65964ac1d5e1ce4fdf1d7288ac00000000`,
        [],
        [
          '**'
        ]
      ])
      global.logger.error(result)
      assert.notStrictEqual(result, undefined)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

