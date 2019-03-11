import assert from "assert"
import BchApiHelper from './bch_api'

describe('bchApiHelper', () => {

  let helper
  const testnet = 'testnet', mainnet = 'mainnet'

  before(async () => {
    helper = new BchApiHelper('https://bch-chain.api.btc.com/v3')
  })

  it('getBalance', async () => {
    try {
      const result = await helper.getBalance('1Pp2YDycQka3TG1uTvurWjseaV3YXQgjZX')
      logger.error('2', result)
      // assert.notStrictEqual(result, undefined)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getChainInfo', async () => {
    try {
      const result = await helper.getChainInfo()
      logger.error('3', result)
      // assert.notStrictEqual(result, undefined)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

