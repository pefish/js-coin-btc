import 'node-assist'
import BitcoinCashWalletHelper from './bitcoin_cash_wallet'
import assert from "assert"


describe('bitcoinCashWalletHelper', () => {

  let walletHelper

  before(async () => {
    walletHelper = new BitcoinCashWalletHelper()
  })

  it('getLegacyAddrFromCashAddr', async () => {
    try {
      const legacyAddr = walletHelper.getLegacyAddrFromCashAddr('bchtest:qzgz8ge8qjys3q67khjwp9p5l00m7s476ut3llpv64')
      assert.strictEqual(legacyAddr, 'mtf6HoSpYT9d19tWMg4HwWAsvJach2Ebb7')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('isAddress', async () => {
    try {
      const result = walletHelper.isAddress('mxVQAALUnmhLP3A59zmmyhAmpED5Dah9rn')
      assert.strictEqual(result, true)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

