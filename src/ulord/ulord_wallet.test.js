import 'node-assist'
import UloadWalletHelper from './ulord_wallet'
import assert from "assert"


describe('uloadWalletHelper', () => {

  let walletHelper
  const testnet = 'testnet', mainnet = 'mainnet'

  before(async () => {
    walletHelper = new UloadWalletHelper()
  })

  it('geneAddress', async () => {
    try {
      const masterPair = walletHelper.getMasterPairBySeedBuffer('da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173'.hexToBuffer(), testnet)
      const result = walletHelper.deriveAllByXprivPath(masterPair['xpriv'], 'm/0/0', testnet)
      // logger.error(result)
      assert.strictEqual(result['address'], 'uZX6rvAvWPrtXbhqkhT4c773mjRyAwWriL')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('geneAddress regtest', async () => {
    try {
      const masterPair = walletHelper.getMasterPairBySeedBuffer('da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173'.hexToBuffer(), 'regtest')
      const result = walletHelper.deriveAllByXprivPath(masterPair['xpriv'], 'm/0/0', 'regtest')
      logger.error(walletHelper.deriveAllByXprivPath(masterPair['xpriv'], 'm/0/0', 'regtest'))
      logger.error(walletHelper.deriveAllByXprivPath(masterPair['xpriv'], 'm/0/1', 'regtest'))
      logger.error(walletHelper.deriveAllByXprivPath(masterPair['xpriv'], 'm/0/2', 'regtest'))
      logger.error(walletHelper.deriveAllByXprivPath(masterPair['xpriv'], 'm/0/3', 'regtest'))

      // logger.error(result)
      assert.strictEqual(result['address'], 'yau8i19ocCVehw6hztnFTMpv4n1QK2Wwwr')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  // it('geneAddress1', async () => {
  //   try {
  //     const seed = walletHelper.getSeedHexByMnemonic('my name is joy, human effort is the decisive factor.', '')
  //     const masterPair = walletHelper.getMasterPairBySeedBuffer(seed.hexToBuffer(), mainnet)
  //     const result = walletHelper.deriveAllByXprivPath(masterPair['xpriv'], 'm/0/0', mainnet)
  //     logger.error(result)
  //     // assert.strictEqual(result['address'], 'uZX6rvAvWPrtXbhqkhT4c773mjRyAwWriL')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })

  it('getAddressFromWif', async () => {
    try {
      const address = walletHelper.getAddressFromWif('cTMF5gLdteTchzQ5c4DLjq58H3RmN9E3kcStVFZh3ch6fQdPN9KU')
      // logger.error(address)
      assert.strictEqual(address, 'uZX6rvAvWPrtXbhqkhT4c773mjRyAwWriL')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('buildTransaction1', async () => {
    try {
      const tx = await walletHelper.buildTransaction(
        [
          {
            "txid": "4ec21d8fb12c16867afa61bce987dfd4f54bec590f9e1f7e486c60a8a6e96ae4",
            "index": 1,
            "balance": "10000000000",
            "type": "p2pkh",
            "wif": "cTJromTCvTrx3X3ZJdN1cZS8zGYrbvivxrr35U7AWH2Mg7ZxMp2F"
          },
        ],
        [
          {
            address: 'uMGo8QVMV5nNhZdpmuawoBPuyMEefvbb3Q',
            amount: walletHelper.btcToSatoshi('10')
          }
        ],
        '10000',
        'uTh2WbS67K71GzaZ4dxWYCGP2KLgQmmij6',
        testnet
      )
      // logger.error(tx)
      assert.strictEqual(tx['txId'], 'fc6ad65921baf1284840f4e701f1e622ca8409c34f30e44f78bbb94cc538b5ad')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAddressType', async () => {
    try {
      const result = await walletHelper.getAddressType(
        'uZX6rvAvWPrtXbhqkhT4c773mjRyAwWriL',
        testnet
      )
      // logger.error(result)
      assert.strictEqual(result, 'p2pkh')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

