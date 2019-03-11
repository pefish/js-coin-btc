import 'node-assist'
import assert from "assert"
import BtcApiHelper from './btc_api'

describe('BtcApiHelper', () => {

  let helper
  const testnet = 'testnet', mainnet = 'mainnet'

  before(async () => {
    helper = new BtcApiHelper('https://api.blockcypher.com/v1/btc/test3')
  })

  // it('sendRawTransaction', async () => {
  //   try {
  //     const result = await helper.sendRawTransaction('0200000000010176931c705ffa2ce17280a5c03d1a3df00de1c814cb8e4910cc5f63bf2e2da23102000000171600149ff0c2908fba5260b78b548e570f0bd319ac789affffffff03888a01000000000017a9146c567b082bde34c520bdebff3899fb743ab04ae687708e01000000000017a9146c567b082bde34c520bdebff3899fb743ab04ae687c69b65280000000017a914c80fda0d07bff0f579849ade15848adbbe0ba693870247304402204e9596a5b4cf00a8dd1b35224ff320c00c360dc4708552540c904051a3df299402203d2a334ebce4f02d123324071aaf1bb1ed247535246cd990bc9db0f07522380901210284f4b79e680518bb8f6f268e2d59a18aa1927c2ebd51355b15021d18e0e4496800000000')
  //     // logger.error(result)
  //     // assert.notStrictEqual(result, undefined)
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })

  it('getAddressInfo', async () => {
    try {
      const result = await helper.getAddressInfo('2NBV483qX29Zd7yCPUUmUCCXpLnu51EExwP')
      logger.error('1', result)
      // assert.notStrictEqual(result, undefined)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getBalance', async () => {
    try {
      const result = await helper.getBalance('2NBV483qX29Zd7yCPUUmUCCXpLnu51EExwP')
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

