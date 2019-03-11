import 'node-assist'
import DashWalletHelper from './dash_wallet'
import assert from "assert"


describe('bitcoinWalletHelper', () => {

  let walletHelper
  const testnet = 'testnet'

  before(async () => {
    walletHelper = new DashWalletHelper()
  })
  it('deriveAllBySeedPath', async () => {
    try {
      const seed = walletHelper.getSeedHexByMnemonic('test', 'test')
      const result = walletHelper.deriveAllBySeedPath('da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173', 'm/0/67', testnet)
      // logger.error(result)
      assert.strictEqual(result.address, 'ycffwqvNHLqqXznxNsjtyBsk85Kak7remh')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })
  it('getAddressFromWif', async () => {
    try {
      const address = walletHelper.getAddressFromWif('cSaxktKqGQ6Jr8rFSEqkagTY1taHqGhGuXgPoNpxdJhM8BuMH172', 'testnet')
      assert.strictEqual(address, 'yNiGGDjTR2TN4toeDR36yh4CX7qDamLbQ3')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })

  it('buildTransaction', async () => {
    try {
      const transaction = await walletHelper.buildTransaction([
        {
          "wif": "cW5p3xM7uYSpUZrEMo5fiiX8H41NbzYyupkxma4VK9gcRALR3QoA",
          "txid": "6cfdd8ef16fa2dc828948cb1df1712dd69bb6c0da35b12bd8f71dd64f8d12f9a",
          "index":0,
          "script": "",
          "balance": "10000000"
        },
        {
          "wif": "cVVQVE5iCMDop8bssyA81p5EZ3uvX7cLwYwURcERykXW8CCyoLg4",
          "txid": "0d2c246df0b05141f1ec1c8a4beed1cc7ab97224004ae9a098c35ef1a06cb0d9",
          "index":0,
          "script": "",
          "balance": "10000000"
        }
      ], [], '1000', 'yXhXtJdc2FSpXZzG6KwipbpwcTUB9VyFZh', testnet)
      assert.strictEqual(transaction['txId'], 'f18b578de9198b1600218fbd7747118b8054f4d025d186c8e0170c48087eb631')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })
  it('isAddress', async () => {
    try {
      const result = walletHelper.isAddress('yfn9HuoCdBggjZrYkepru7xAL6GdJZ731u',testnet,'pubkeyhash')
      logger.error(result)
      assert.strictEqual(result, true)
    } catch (err) {
      logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })
})

