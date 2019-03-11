import 'node-assist'
import assert from "assert"
import LtcApiHelper from './ltc_api'

describe('ltcApiHelper', () => {

  let helper

  before(async () => {
    helper = new LtcApiHelper('https://api.blockcypher.com/v1/ltc/main')
  })

  it('getBalance', async () => {
    try {
      const result = await helper.getBalance('LajyQBeZaBA1NkZDeY8YT5RYYVRkXMvb2T')
      logger.error('2', result)
      // assert.notStrictEqual(result, undefined)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

