import 'node-assist'
import BitcoinWalletHelper from './bitcoin_wallet'
import assert from "assert"


describe('bitcoinWalletHelper', () => {

  let walletHelper
  const testnet = 'testnet', mainnet = 'mainnet'

  before(async () => {
    walletHelper = new BitcoinWalletHelper()
  })

  // it('getMasterPairByMnemonic', async () => {
  //   try {
  //     const result = walletHelper.getMasterPairByMnemonic('basket actual', '', 'mainnet')
  //     logger.error(result)
  //     // assert.strictEqual(result, 'da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it('geneSeed', async () => {
  //   try {
  //     const result = walletHelper.getSeedHexByMnemonic('test', 'test')
  //     // logger.error(result)
  //     assert.strictEqual(result, 'da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  it('getAddressFromWif', async () => {
    try {
      const result = walletHelper.getAddressFromWif('cPo4ftCfL4i1HfEpHYZ8v74Gv3faFnYV5Mfw1QtAiXCNYH1aZ7vW', "p2sh(p2wpkh)", 'mainnet')
      logger.error(result)
      // assert.strictEqual(result, 'da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173')
    } catch (err) {
      logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  // it('geneAddress', async () => {
  //   try {
  //     const masterPair = walletHelper.getMasterPairBySeedBuffer('da2a48a1b9fbade07552281143814b3cd7ba4b53a7de5241439417b9bb540e229c45a30b0ce32174aaccc80072df7cbdff24f0c0ae327cd5170d1f276b890173'.hexToBuffer(), testnet)
  //     const result = walletHelper.deriveAllByXprivPath(masterPair['xpriv'], 'm/0/0', testnet)
  //     const segwitAddress1 = walletHelper.getAddressFromPublicKey(result['publicKey'], 'p2sh(p2wpkh)', testnet)
  //      logger.error(result, segwitAddress1)
  //     assert.strictEqual(result['address'], 'mv6e9rWT1y4EzN4CHj81Piw6p9Y3ispJ45')
  //     assert.strictEqual(segwitAddress1, '2NBV483qX29Zd7yCPUUmUCCXpLnu51EExwP')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })

  // it('buildTransaction1', async () => {
  //   try {
  //     const tx = await walletHelper.buildTransaction(
  //       [
  //         {
  //           "txid": "f71885c81df375b17491269c583cb8a1837412d19460880485a5362a53822921",
  //           "index": 0,
  //           "balance": "4000000",
  //           "type": "p2sh(p2wpkh)",
  //           "wif": "cRWu81dLiLXqnwhZjU2UGBjpPR2ERQpXQQrFjJWkPW1jn9pM2QiW"
  //         },
  //         {
  //           "txid": "88f7bb3f720259b2590bc21fb0271dd5caf20c15a3afc371670287e63b1e98d9",
  //           "index": 0,
  //           "balance": "6600000",
  //           "type": "p2sh(p2wpkh)",
  //           "wif": "cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9"
  //         },
  //         {
  //           "txid": "23412e59fd3b2a7f6b2cf91dbf56fac06f740bbec8cf25ce7648a6e1a8284e2b",
  //           "index": 0,
  //           "balance": "3400000",
  //           "type": "p2sh(p2wpkh)",
  //           "wif": "cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9"
  //         }
  //       ],
  //       [],
  //       '999',
  //       '2N4fvvwc4dQEQZzMLJNg4TngWWMgRSgHLBn',
  //       testnet
  //     )
  //     assert.strictEqual(tx['txId'], '1de2da16c04f62e8dff1ced47d86d468bb1ff637a1dc42a8c0636853b8ab5dce')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it('buildTransaction2', async () => {
  //   try {
  //     const tx = await walletHelper.buildTransaction(
  //       [
  //         {
  //           "txid": "f71885c81df375b17491269c583cb8a1837412d19460880485a5362a53822921",
  //           "index": 0,
  //           "balance": "4000000",
  //           "type": "p2sh(p2wpkh)",
  //           "wif": "cRWu81dLiLXqnwhZjU2UGBjpPR2ERQpXQQrFjJWkPW1jn9pM2QiW"
  //         },
  //         {
  //           "txid": "88f7bb3f720259b2590bc21fb0271dd5caf20c15a3afc371670287e63b1e98d9",
  //           "index": 0,
  //           "balance": "6600000",
  //           "type": "p2sh(p2wpkh)",
  //           "wif": "cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9"
  //         },
  //         {
  //           "txid": "23412e59fd3b2a7f6b2cf91dbf56fac06f740bbec8cf25ce7648a6e1a8284e2b",
  //           "index": 0,
  //           "balance": "3400000",
  //           "type": "p2sh(p2wpkh)",
  //           "wif": "cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9"
  //         }
  //       ],
  //       [
  //         {
  //           "ref": 1,
  //           "address": "2N4fvvwc4dQEQZzMLJNg4TngWWMgRSgHLBn",
  //           "amount": "10000000"
  //         },
  //         {
  //           "ref": 2,
  //           "address": "2NBV483qX29Zd7yCPUUmUCCXpLnu51EExwP",
  //           "amount": "10000000"
  //         }
  //       ],
  //       '999',
  //       '2N4fvvwc4dQEQZzMLJNg4TngWWMgRSgHLBn',
  //       testnet
  //     )
  //     // logger.error(tx)
  //     assert.strictEqual(tx['outputWithIndex'].length, 3)
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it ('getMultisigAddressFromPublicKeys', async () => {
  //   try {
  //     const address = await walletHelper.getAddressFromPublicKey({
  //       pubkeys: [
  //         "0284f4b79e680518bb8f6f268e2d59a18aa1927c2ebd51355b15021d18e0e44968",
  //         "035897cfbb81459f28b20cb2808d71acef6810abf9fcf977cee2734cf766c977fc",
  //         "0201e2e960cf3f05dd8f0a2136d4c430cb45daeb2c537e38a4d653ab9de79b8f75"
  //       ],
  //       m: 2
  //     }, 'p2sh(p2wsh)_multisig', testnet)
  //     assert.strictEqual(address, '2N4fbYKCkNLLLfzJH7WfQRwYKpJTz7a5gX6')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it('buildTransaction_multisig_tx', async () => {
  //   try {
  //     const tx = await walletHelper.buildTransaction(
  //       [
  //         {
  //           "txid": "a6e7dd5f344e591f9ba4902f150dd1f2b4b0cdbc0c45d0d3b6cae49d6951fe6f",
  //           "index": 0,
  //           "balance": "4000000",
  //           "type": "p2sh(p2wsh)_multisig",
  //           "wif": [
  //             "cTMF5gLdteTchzQ5c4DLjq58H3RmN9E3kcStVFZh3ch6fQdPN9KU",
  //             "cVHdZRYNobui1VN7pSnHP2bzKSJVhk85Jn1p2YFMJZXv2SmBfMaW"
  //           ],
  //           "pubkeys": [
  //             "0284f4b79e680518bb8f6f268e2d59a18aa1927c2ebd51355b15021d18e0e44968",
  //             "035897cfbb81459f28b20cb2808d71acef6810abf9fcf977cee2734cf766c977fc",
  //             "0201e2e960cf3f05dd8f0a2136d4c430cb45daeb2c537e38a4d653ab9de79b8f75"
  //           ]
  //         }
  //       ],
  //       [
  //         {
  //           "ref": 1,
  //           "address": "2My1UpKsy9ZTRxEac9B5NC3BrUKqx5CCppp",
  //           "amount": "1000000"
  //         }
  //       ],
  //       '1000',
  //       '2N4fbYKCkNLLLfzJH7WfQRwYKpJTz7a5gX6',
  //       testnet
  //     )
  //     assert.strictEqual(tx['txId'], 'f25671a7bbec794a4b895bb1a0cbc058dc31315ada985a8c8082bf2dd948b54c')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it('signTxHex', async () => {
  //   try {
  //     const tx = await walletHelper.signTxHex(
  //       '0200000003212982532a36a58504886094d1127483a1b83c589c269174b175f31dc88518f70000000000ffffffffd9981e3be687026771c3afa3150cf2cad51d27b01fc20b59b25902723fbbf7880000000000ffffffff2b4e28a8e1a64876ce25cfc8be0b746fc0fa56bf1df92c6b7f2a3bfd592e41230000000000ffffffff03809698000000000017a9147d558b2f056386e8872e5fe7cd6a1a2527e9fee687809698000000000017a914c80fda0d07bff0f579849ade15848adbbe0ba6938768915b000000000017a9147d558b2f056386e8872e5fe7cd6a1a2527e9fee68700000000',
  //       [
  //         {
  //           "balance": "4000000",
  //           "type": "p2sh(p2wpkh)",
  //           "wif": "cRWu81dLiLXqnwhZjU2UGBjpPR2ERQpXQQrFjJWkPW1jn9pM2QiW"
  //         },
  //         {
  //           "balance": "6600000",
  //           "type": "p2sh(p2wpkh)",
  //           "wif": "cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9"
  //         },
  //         {
  //           "balance": "3400000",
  //           "type": "p2sh(p2wpkh)",
  //           "wif": "cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9"
  //         }
  //       ],
  //       testnet
  //     )
  //     // logger.error(tx)
  //     assert.strictEqual(tx['txId'], '862e9cd3a8d3c23af95c8166a9b0e76ee7f66c7b3227fecf7764abd4b4c586c7')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it('decodeTxHex', async () => {
  //   try {
  //     const tx = await walletHelper.decodeTxHex(
  //       '0200000003212982532a36a58504886094d1127483a1b83c589c269174b175f31dc88518f70000000000ffffffffd9981e3be687026771c3afa3150cf2cad51d27b01fc20b59b25902723fbbf7880000000000ffffffff2b4e28a8e1a64876ce25cfc8be0b746fc0fa56bf1df92c6b7f2a3bfd592e41230000000000ffffffff03809698000000000017a9147d558b2f056386e8872e5fe7cd6a1a2527e9fee687809698000000000017a914c80fda0d07bff0f579849ade15848adbbe0ba6938768915b000000000017a9147d558b2f056386e8872e5fe7cd6a1a2527e9fee68700000000',
  //       testnet
  //     )
  //     // logger.error(tx)
  //     assert.strictEqual(tx['txId'], 'd1af47bfbf8b19443b19477b8d529e847cb3c1b6084262ff0f008634642f647b')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
  //
  // it('getAddressType', async () => {
  //   try {
  //     const result = await walletHelper.getAddressType(
  //       'n3gHdVvxFSU4hYpHgw7Hj3Gn3QUVJTWBKY',
  //       testnet
  //     )
  //     // logger.error(result)
  //     assert.strictEqual(result, 'p2pkh')
  //   } catch (err) {
  //     logger.error(err)
  //     assert.throws(() => {}, err)
  //   }
  // })
})

