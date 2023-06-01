import assert from 'assert'
import Remote from "./remote";

declare global {
  namespace NodeJS {
    interface Global {
      logger: any;
    }
  }
}

describe('Remote', () => {

  let rpcClient

  before(async () => {
    rpcClient = new Remote({
      'host': '34.80.28.139',
      'port': 18332,
      'username': 'btc',
      'password': 'btc',
      'ssl': false
    })
  })

  it('listunspent', async () => {
    try {
      const result = await rpcClient.request( 'listunspent', [
        0,
        99999999,
        [`3EgAiNoL4hsm5MNRJQg9qZw72DVSV7f8bk`],
        true,
        {
          minimumAmount: 0.0006
        }
      ])
      global.logger.error(result)
      // assert.notStrictEqual(result, undefined)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

