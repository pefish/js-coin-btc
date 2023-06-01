import assert from 'assert'
import BtcApiHelper from './api'

describe('BtcApiHelper', () => {

  let helper: BtcApiHelper
  const testnet = 'testnet', mainnet = 'mainnet'

  before(async () => {
    helper = new BtcApiHelper('https://api.blockcypher.com/v1/btc/test3')
  })

  it('sendRawTransaction', async () => {
    try {
      const result = await helper.sendRawTransaction('0200000004801e33fe04d54a3d051f38dc28acce33408e70533c3ea3903003fa2ab3b17279030000006a473044022042f44ceb0b6ad5ad5f401229249cfc7e3858f8476ee8517daa50dffbfb1f26d80220764c042c50c9c90b3872ee8d3d685414b4ce7c3e8a8172f3eebdfd19699b4760012103bf7ca83b3abcf9c4c6da8fcb407e34814bb39a0a463e0937834bfc69ad2f70aefeffffff801e33fe04d54a3d051f38dc28acce33408e70533c3ea3903003fa2ab3b17279060000006a47304402202d11329571849c8f797a5f40f5fc107878767d603a914e558f20fa577bea23f1022061403f01537accdf41d979e3cbf2ca8dbc0b67e1ba1da128fa158daa4f111e2a012103d89549a603de3252c37c8e0894557c998677ea7e8cdc3a5404d8cae928c826c1feffffff5dfa3b2752e1ef9272045dd0501b0118e3673184f3b628326e29b61156850970010000006a47304402200eedd5fe79da51d2f1584af606bdca7159d6b6b764061b00a03c0c372e3d798b022047bb71775f2291ff2706791f1b1392cb4334ce1cd7f58bfe0a303ea7b555a32c012102470bca296acb595316d59874bfad6a67e707f64b6a16032fbe45325a5fd2f36efeffffff801e33fe04d54a3d051f38dc28acce33408e70533c3ea3903003fa2ab3b17279000000006a47304402206b248023aae77381d688b545163ab24d3ef974c1fa62a7f3ae5288fc0b61ba8a022076c028e93406567739c944d2a80ed7c8ea345b7565bd92512122b4c5f76f322b01210319765746013ba8cfea4e1f3a5b5d7fce1e406bd158b90aa03d3d5ff7428569affeffffff01b0f5e01a0000000017a9148d5ead745127f0fdd0f8b4c3bf3987f90f75cc348700000000')
      console.error(result)
      // assert.notStrictEqual(result, undefined)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  // it('getAddressInfo', async () => {
  //   try {
  //     const result = await helper.getAddressInfo('2NBV483qX29Zd7yCPUUmUCCXpLnu51EExwP')
  //     global.logger.error('1', result)
  //     // assert.notStrictEqual(result, undefined)
  //   } catch (err) {
  //     global.logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })

  it('getBalance', async () => {
    try {
      const result = await helper.getBalance('2NBV483qX29Zd7yCPUUmUCCXpLnu51EExwP')
      console.error('2', result)
      // assert.notStrictEqual(result, undefined)
    } catch (err) {
      console.error(err)
      assert.throws(() => {}, err)
    }
  })

  // it('getChainInfo', async () => {
  //   try {
  //     const result = await helper.getChainInfo()
  //     global.logger.error('3', result)
  //     // assert.notStrictEqual(result, undefined)
  //   } catch (err) {
  //     global.logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
})

