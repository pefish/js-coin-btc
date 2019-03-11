import 'node-assist'
import LitecoinWalletHelper from './litecoin_wallet'
import assert from "assert"


describe('litecoinWalletHelper', () => {

  let walletHelper
  const testnet = 'litecoin_testnet', mainnet = 'litecoin_mainnet'

  before(async () => {
    walletHelper = new LitecoinWalletHelper()
  })

  it('geneAddress', async () => {
    try {
      const masterPair = walletHelper.getMasterPairBySeedBuffer('da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173'.hexToBuffer(), testnet)
      const result = walletHelper.deriveAllByXprivPath(masterPair['xpriv'], 'm/0/0', testnet)
      const segwitAddress1 = walletHelper.getAddressFromPublicKey(result['publicKey'], 'p2sh(p2wpkh)', testnet)
      // logger.error(result, segwitAddress1)
      assert.strictEqual(result['address'], 'mv6e9rWT1y4EzN4CHj81Piw6p9Y3ispJ45')
      assert.strictEqual(segwitAddress1, 'QeqpF4hm3FciG9xS6aoVGtyFVBLtrmGN6w')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('geneSeed', async () => {
    try {
      const result = walletHelper.getSeedHexByMnemonic('test', 'test')
      assert.strictEqual(result, 'da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getMasterPair', async () => {
    try {
      const masterPairTestnet = walletHelper.getMasterPairBySeedBuffer('da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173'.hexToBuffer(), testnet)
      assert.strictEqual(masterPairTestnet['xpriv'], 'ttpv96BtqegdxXceRrGox6egQyzpUDT9qfozYkDZEJRiuyTfazoH6JoPPuqxhr4GjrJpc7rstc5iF2oeYL7saSuyuN9E5bSxvZywZxLWD1Lj1fd')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('buildTransaction', async () => {
    try {
      const tx = await walletHelper.buildTransaction(
        [ { "txid": "8359c36609ef22e214642504da5efff4cc5d48d6252f7bf7d1de6f96403003ee",
          "index": 2,
          "balance": "830656387",
          "type": "p2sh(p2wpkh)",
          "wif": "cTMF5gLdteTchzQ5c4DLjq58H3RmN9E3kcStVFZh3ch6fQdPN9KU" } ],
        [],
        '30000',
        'mv6e9rWT1y4EzN4CHj81Piw6p9Y3ispJ45',
        testnet
      )
      // logger.error(tx)
      assert.strictEqual(tx['txId'], '457ca5b92c66a5fc8b4ec21a3139b02e3be952a57d71a79ba0b593886ffae84c')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

