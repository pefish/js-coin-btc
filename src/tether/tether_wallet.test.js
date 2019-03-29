import 'node-assist'
import TetherWalletHelper from './tether_wallet'
import TetherRpcUtil from './tether_rpc'
import assert from 'assert'

describe('usdtWalletHelper', () => {

  let walletHelper, rpcClient

  before(async () => {
    walletHelper = new TetherWalletHelper()
    rpcClient = TetherRpcUtil.getRpcHelper({
      "host": "47.99.166.159",
      "port": 18336,
      "username": "test",
      "password": "123456789",
      "ssl": false
    })
  })

  // it('getTestnetCoin', async () => {
  //   try {
  //     const wif = 'cTbPjYiTine9tXFffSGZzxURoVqTYS69VV4W8jbjxesKUHtTqAvT',
  //       senderAddress = '2My1UpKsy9ZTRxEac9B5NC3BrUKqx5CCppp'
  //     const unspents = await rpcClient.listUnspent(0, 999999, [
  //       senderAddress
  //     ])
  //     const utxos = []
  //     unspents.forEach(({txid, vout, amount}) => {
  //       utxos.push({
  //         txid,
  //         balance: walletHelper.btcToSatoshi(amount),
  //         index: vout,
  //         wif,
  //         type: 'p2sh(p2wpkh)',
  //       })
  //     })
  //
  //     const tx = await walletHelper.getTestnetCoin(
  //       utxos,
  //       '5000',
  //       senderAddress,
  //       walletHelper.btcToSatoshi(5)
  //     )
  //     // logger.error(tx)
  //     assert.strictEqual(tx['outputWithIndex'][0]['address'], 'moneyqMan7uh8FqdCA2BV5yZ8qVrc9ikLP')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {
  //     }, err)
  //   }
  // })

  // it('getTestnetCoin', async () => {
  //   try {
  //     const wif = 'cRbAJvdCbZFk8bJLw1QhC6nNLuMKGm8gsgrUGxQxr3279LMQJfEN',
  //       senderAddress = '2N2khm3ZXhHPrK3GKkVysdwTyA9jMqy5Yk6'
  //     const unspents = await remoteClient.listUnspent(0, 999999, [
  //       senderAddress
  //     ])
  //     logger.error('a', unspents)
  //     const utxos = []
  //     unspents.forEach(({txid, vout, amount}) => {
  //       utxos.push({
  //         txid,
  //         balance: walletHelper.btcToSatoshi(amount),
  //         index: vout,
  //         wif,
  //         type: 'p2sh(p2wpkh)',
  //       })
  //     })
  //
  //     const tx = await walletHelper.getTestnetCoin(
  //       utxos,
  //       '5000',
  //       senderAddress,
  //       walletHelper.btcToSatoshi(49)
  //     )
  //     logger.error(tx)
  //     // assert.strictEqual(tx['outputWithIndex'][0]['address'], 'moneyqMan7uh8FqdCA2BV5yZ8qVrc9ikLP')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {
  //     }, err)
  //   }
  // })

  it('buildSimpleSendTx', async () => {
    try {
      const senderAddress = '2N2khm3ZXhHPrK3GKkVysdwTyA9jMqy5Yk6'
      const utxos = [
        {
          txid: 'fa9ab58c784916f0262b702fe439c6914c555db7d5a116258135e94d2c107478',
          balance: '621067344',
          index: 1,
          wif: 'cRbAJvdCbZFk8bJLw1QhC6nNLuMKGm8gsgrUGxQxr3279LMQJfEN',
          scriptPubKey: 'a914684c60ac409ba0937cc5e1b9f9db2e5839600e1987',
          type: 'p2sh(p2wpkh)'
        }
      ]

      const tx = await walletHelper.buildSimpleSendTx(
        rpcClient,
        '100000',
        2,
        [ { txid: '03f4382c460816f8d536d5aa81bd067f94bb9ed8278eb3c8f202a3bfd2a3a31e',
        index: 1,
        balance: '24560000',
        wif: 'cTMF5gLdteTchzQ5c4DLjq58H3RmN9E3kcStVFZh3ch6fQdPN9KU',
        scriptPubKey: 'a914c80fda0d07bff0f579849ade15848adbbe0ba69387',
        type: 'p2sh(p2wpkh)' } ],
        '2NFPRnfbSXDozGNS8T13hUUj8qgCBK88ayi',
        `546`,
        '2NBV483qX29Zd7yCPUUmUCCXpLnu51EExwP',
        '10000',
        [],
        'testnet',
      )
      logger.error(tx)
      // assert.strictEqual(tx['txId'], 'a64f2266d55ab475762631e5bd38f839884982cbb47f34ca9ed16a4b4cf93249')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })

  // it('buildSimpleSendTx', async () => {
  //   try {
  //     const senderAddress = '2My1UpKsy9ZTRxEac9B5NC3BrUKqx5CCppp'
  //     const utxos = [
  //       {
  //         txid: '0c0b6a46a7d8d3f63ccd6ac7a6c5d692065b2c0785bb46cbc148993f432052ad',
  //         balance: '278703016',
  //         index: 0,
  //         wif: 'cTbPjYiTine9tXFffSGZzxURoVqTYS69VV4W8jbjxesKUHtTqAvT',
  //         scriptPubKey: 'a9143f374f2dd228895b26f1766f46c5088c5e34d94c87',
  //         type: 'p2sh(p2wpkh)'
  //       }
  //     ]
  //
  //     const tx = await walletHelper.buildSimpleSendTx(
  //       remoteClient,
  //       '1',
  //       31,
  //       utxos,
  //       '2N4fvvwc4dQEQZzMLJNg4TngWWMgRSgHLBn',
  //       null,
  //       senderAddress,
  //       '0.0006',
  //       true
  //     )
  //     // logger.error(tx)
  //     assert.strictEqual(tx['txId'], 'a64f2266d55ab475762631e5bd38f839884982cbb47f34ca9ed16a4b4cf93249')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {
  //     }, err)
  //   }
  // })
})

