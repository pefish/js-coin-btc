import '@pefish/js-node-assist'
import BitcoinWalletHelper from './wallet'
import assert from 'assert'

declare global {
  namespace NodeJS {
    interface Global {
      logger: any;
    }
  }
}

describe('bitcoinWalletHelper', () => {

  let walletHelper
  const testnet = 'testnet', mainnet = 'mainnet'

  before(async () => {
    walletHelper = new BitcoinWalletHelper()
  })

  it('verifyAddressType', async () => {
    try {
      const result1 = walletHelper.verifyAddressType(`18cN2hvpn4KHKKuGQMz7wQBDKKumRhN7Z3`, `p2pkh`, mainnet)
      // logger.error(result)
      assert.strictEqual(result1, true)
      const result2 = walletHelper.verifyAddressType(`bc1q2du0uhvgwmj9e7gn9en080j986gtvsa6tl8zc4`, `p2wpkh`, mainnet)
      // logger.error(result)
      assert.strictEqual(result2, true)
      const result3 = walletHelper.verifyAddressType(`36v5uJ54F4VwJU2qzf3t2FQdHgL7d38HUg`, `p2sh(p2wpkh)`, mainnet)
      // logger.error(result)
      assert.strictEqual(result3, true)
      const result4 = walletHelper.verifyAddressType(`bc1q7wewmjmhdm8axyf3s8vyqlr9fqqtpzpfa9m56ttksywxzw0w34vsnhsz57`, `p2wsh(p2ms)`, mainnet)
      // logger.error(result4)
      assert.strictEqual(result4, true)
      const result5 = walletHelper.verifyAddressType(`33ftreLmAd5UfUo36xogBUW29qPN11dWq4`, `p2sh(p2wsh(p2ms))`, mainnet)
      // logger.error(result)
      assert.strictEqual(result5, true)
      const result6 = walletHelper.verifyAddressType(`3AgHM7WNCqxc5AUr1g69uK4ikKCgrqb5cZ`, `p2sh(p2ms)`, mainnet)
      // logger.error(result)
      assert.strictEqual(result6, true)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAddressType', async () => {
    try {
      const result1 = walletHelper.getAddressType(`18cN2hvpn4KHKKuGQMz7wQBDKKumRhN7Z3`, mainnet)
      // logger.error(result)
      assert.strictEqual(result1, `p2pkh`)
      const result2 = walletHelper.getAddressType(`bc1q2du0uhvgwmj9e7gn9en080j986gtvsa6tl8zc4`, mainnet)
      // logger.error(result)
      assert.strictEqual(result2, `p2wpkh`)
      const result3 = walletHelper.getAddressType(`36v5uJ54F4VwJU2qzf3t2FQdHgL7d38HUg`, mainnet)
      // logger.error(result)
      assert.strictEqual(result3.length === 3, true)
      const result4 = walletHelper.getAddressType(`bc1q7wewmjmhdm8axyf3s8vyqlr9fqqtpzpfa9m56ttksywxzw0w34vsnhsz57`, mainnet)
      // logger.error(result4)
      assert.strictEqual(result4, `p2wsh(p2ms)`)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })


  it('isAddress', async () => {
    try {
      const result = walletHelper.isAddress(`36v5uJ54F4VwJU2qzf3t2FQdHgL7d38HUg`, mainnet)
      // logger.error(result)
      assert.strictEqual(result, true)
      const result1 = walletHelper.isAddress(`3AgHM7WNCqxc5AUr1g69uK4ikKCgrqb5cZ`, mainnet)
      // logger.error(result1)
      assert.strictEqual(result1, true)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('convertPub', async () => {
    try {
      const result = walletHelper.convertPub(`ypub`, `xpub6G7UGdTHmM3aX7BQGfX23YMvFXx9sMMTC2xYFDW5JkHC3aLsBCTaeoRevrz315PZRFeBaRdjEQo3kPqHDytwmGaUV9ZjSxqukscuaG5CqVb`)
      // logger.error(result)
      assert.strictEqual(result, 'ypub6awjaJ8Cv2b4NQNX72JeFdTRRW6boyLx79Um2cPxgkf56gA6Rrd9Gs5nx4wczz3UptkzKuEHh59bdgSqwgJxZWG5MVGA2sfQ2bgYxn8rJwt')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('convertPrv', async () => {
    try {
      const result = walletHelper.convertPub(`ypub`, `xprv9s21ZrQH143K3J8How7cEP3KCkTz3R3QiSXFVBXBWAbfwyqFHu1aEMrk8V78fqZpf7LrVYZmyybDNDqZ5QahCtaha9E1i5zm1A9kMrqSFNn`)
      // logger.error(result)
      assert.strictEqual(result, 'ypub6QqdH2c5z79675PskKSEoc5YvkSvPVkkzmy54xpgSWWXssyd66VPQDqMztCzkvNLUUuf9UHG7PhDrwzugmVFkyrTxVEp9KdJCk6dWT1726J')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getSeedByMnemonic', async () => {
    try {
      const result = walletHelper.getSeedByMnemonic(`depth fruit animal borrow room pen nice proud cement limit thank that`, ``)
      // logger.error(result)
      assert.strictEqual(result, '44cbf72322549594ab47801454ced2e970c2a9463d4c37d12951ebc41f56ad2e94024013221e3872a6eef8624f8a9b8a731f038c46689b88975fcb93931a40fd')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('generateMnemonic', async () => {
    try {
      const result = walletHelper.generateMnemonic()
      // logger.error(result)
      assert.strictEqual(result.length > 20, true)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAllFromXpriv', async () => {
    try {
      const result = walletHelper.getAllFromXpriv('xprvA387s7vPvyVHJd6wAdz1gQRBhW7fTtdbpp2wSq6TkQkDAn1idf9L717B5c1yXxGCPFYjwxVSPejzLsnpuk82N9Dpr9bk8SGEwjYN1112VVz', mainnet)
      // logger.error(result)
      assert.strictEqual(result['wif'], 'L5nNnEKwmb1Yxh6neMKn5Srum3NBjTpPtNHFpNPJS3Dqh2yTcsyy')
      assert.strictEqual(result['chainCode'], '6f8847d408fe5c7f695c8140722b113f7b34f1bba27cee489f11c2da677b0ec6')
      assert.strictEqual(result['publicKey'], '02f7166a1fd8dd1b253667c63af6e580d9867abe79e48d4df655c98b71fd81a8e8')
      assert.strictEqual(result['privateKey'], 'ff80e6800f8e0b9c27431f3cf6c4346175eaad12745a91bd41c7141e70c58378')
      assert.strictEqual(result['xpub'], 'xpub6G7UGdTHmM3aX7BQGfX23YMvFXx9sMMTC2xYFDW5JkHC3aLsBCTaeoRevrz315PZRFeBaRdjEQo3kPqHDytwmGaUV9ZjSxqukscuaG5CqVb')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAllFromWif', async () => {
    try {
      const result = walletHelper.getAllFromWif('L5nNnEKwmb1Yxh6neMKn5Srum3NBjTpPtNHFpNPJS3Dqh2yTcsyy', mainnet)
      // logger.error(result)
      assert.strictEqual(result['publicKey'], '02f7166a1fd8dd1b253667c63af6e580d9867abe79e48d4df655c98b71fd81a8e8')
      assert.strictEqual(result['privateKey'], 'ff80e6800f8e0b9c27431f3cf6c4346175eaad12745a91bd41c7141e70c58378')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAllFromPrivateKey', async () => {
    try {
      const result = walletHelper.getAllFromPrivateKey('0xff80e6800f8e0b9c27431f3cf6c4346175eaad12745a91bd41c7141e70c58378', mainnet)
      // logger.error(result)
      assert.strictEqual(result['publicKey'], '02f7166a1fd8dd1b253667c63af6e580d9867abe79e48d4df655c98b71fd81a8e8')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAllFromXpub', async () => {
    try {
      const result = walletHelper.getAllFromXpub(`xpub6G7UGdTHmM3aX7BQGfX23YMvFXx9sMMTC2xYFDW5JkHC3aLsBCTaeoRevrz315PZRFeBaRdjEQo3kPqHDytwmGaUV9ZjSxqukscuaG5CqVb`, mainnet)
      // logger.error(result)
      assert.strictEqual(result['chainCode'], '6f8847d408fe5c7f695c8140722b113f7b34f1bba27cee489f11c2da677b0ec6')
      assert.strictEqual(result['publicKey'], '02f7166a1fd8dd1b253667c63af6e580d9867abe79e48d4df655c98b71fd81a8e8')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('deriveAllByXpubPath', async () => {
    try {
      const result = walletHelper.deriveAllByXpubPath('xpub6G7UGdTHmM3aX7BQGfX23YMvFXx9sMMTC2xYFDW5JkHC3aLsBCTaeoRevrz315PZRFeBaRdjEQo3kPqHDytwmGaUV9ZjSxqukscuaG5CqVb', `0`, mainnet)
      // logger.error(result)
      assert.strictEqual(result[`publicKey`], '021c911e5b000f8820715e7a55a9672fd137e23e374d55396b87d4e555978425df')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('deriveAllByXprivPath', async () => {
    try {
      const result = walletHelper.deriveAllByXprivPath(`xprv9s21ZrQH143K3J8How7cEP3KCkTz3R3QiSXFVBXBWAbfwyqFHu1aEMrk8V78fqZpf7LrVYZmyybDNDqZ5QahCtaha9E1i5zm1A9kMrqSFNn`, `m/44'/0'/0'/0/0`, mainnet)
      // logger.error(result)
      assert.strictEqual(result['wif'], 'L5nNnEKwmb1Yxh6neMKn5Srum3NBjTpPtNHFpNPJS3Dqh2yTcsyy')
      assert.strictEqual(result['xpub'], 'xpub6G7UGdTHmM3aX7BQGfX23YMvFXx9sMMTC2xYFDW5JkHC3aLsBCTaeoRevrz315PZRFeBaRdjEQo3kPqHDytwmGaUV9ZjSxqukscuaG5CqVb')
      assert.strictEqual(result['xpriv'], 'xprvA387s7vPvyVHJd6wAdz1gQRBhW7fTtdbpp2wSq6TkQkDAn1idf9L717B5c1yXxGCPFYjwxVSPejzLsnpuk82N9Dpr9bk8SGEwjYN1112VVz')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAddressFromPublicKey', async () => {
    try {
      const p2pkh = walletHelper.getAddressFromPublicKey('02f7166a1fd8dd1b253667c63af6e580d9867abe79e48d4df655c98b71fd81a8e8', `p2pkh`, mainnet)
      assert.strictEqual(p2pkh, `18cN2hvpn4KHKKuGQMz7wQBDKKumRhN7Z3`)
      const p2wpkh = walletHelper.getAddressFromPublicKey('02f7166a1fd8dd1b253667c63af6e580d9867abe79e48d4df655c98b71fd81a8e8', `p2wpkh`, mainnet)
      assert.strictEqual(p2wpkh, `bc1q2du0uhvgwmj9e7gn9en080j986gtvsa6tl8zc4`)
      const segwit = walletHelper.getAddressFromPublicKey('02f7166a1fd8dd1b253667c63af6e580d9867abe79e48d4df655c98b71fd81a8e8', `p2sh(p2wpkh)`, mainnet)
      // logger.error(segwit)
      assert.strictEqual(segwit, `36v5uJ54F4VwJU2qzf3t2FQdHgL7d38HUg`)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAddressFromPublicKey p2wsh(p2ms)', async () => {
    try {
      const result1 = walletHelper.getAddressFromPublicKey({
        pubkeys: [
          '03b48aaed5afd55af800bf3d7fb9d0b62507548237b10820aaae8b3af192ff33a1',
          '031b022777c4e4ddf7cdbb216c51c9666b4f59636cc11f2ad15022ef5e0f0ca397',
          '028d2d5f8815dda6a5a20635d3c8064ae280cced71580d202367ac819ce2910365',
          '0207e3c205361b2755cf03d2d4eff727f75d505958b4ac42bf915b41bc0a188461'
        ],
        m: 2
      }, `p2wsh(p2ms)`, mainnet)
      // logger.error(result1)
      assert.strictEqual(result1, `bc1q7wewmjmhdm8axyf3s8vyqlr9fqqtpzpfa9m56ttksywxzw0w34vsnhsz57`)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAddressFromPublicKey p2sh(p2wsh(p2ms))', async () => {
    try {
      const result1 = walletHelper.getAddressFromPublicKey({
        pubkeys: [
          '03b48aaed5afd55af800bf3d7fb9d0b62507548237b10820aaae8b3af192ff33a1',
          '031b022777c4e4ddf7cdbb216c51c9666b4f59636cc11f2ad15022ef5e0f0ca397',
          '028d2d5f8815dda6a5a20635d3c8064ae280cced71580d202367ac819ce2910365',
          '0207e3c205361b2755cf03d2d4eff727f75d505958b4ac42bf915b41bc0a188461'
        ],
        m: 2
      }, `p2sh(p2wsh(p2ms))`, mainnet)
      // logger.error(result1)
      assert.strictEqual(result1, `33ftreLmAd5UfUo36xogBUW29qPN11dWq4`)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getAddressFromPublicKey p2sh(p2ms)', async () => {
    try {
      const result1 = walletHelper.getAddressFromPublicKey({
        pubkeys: [
          '03b48aaed5afd55af800bf3d7fb9d0b62507548237b10820aaae8b3af192ff33a1',
          '031b022777c4e4ddf7cdbb216c51c9666b4f59636cc11f2ad15022ef5e0f0ca397',
          '028d2d5f8815dda6a5a20635d3c8064ae280cced71580d202367ac819ce2910365',
          '0207e3c205361b2755cf03d2d4eff727f75d505958b4ac42bf915b41bc0a188461'
        ],
        m: 2
      }, `p2sh(p2ms)`, mainnet)
      // logger.error(result1)
      assert.strictEqual(result1, `3AgHM7WNCqxc5AUr1g69uK4ikKCgrqb5cZ`)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('validateMnemonic', async () => {
    try {
      const result = walletHelper.validateMnemonic('depth fruit animal borrow room pen nice proud cement limit thank that')
      // logger.error(result)
      assert.strictEqual(result, true)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('getMasterPairByMnemonic', async () => {
    try {
      const result = walletHelper.getMasterPairByMnemonic('depth fruit animal borrow room pen nice proud cement limit thank that', '', 'mainnet')
      // global.logger.error(result)
      assert.strictEqual(result[`xpriv`], 'xprv9s21ZrQH143K3J8How7cEP3KCkTz3R3QiSXFVBXBWAbfwyqFHu1aEMrk8V78fqZpf7LrVYZmyybDNDqZ5QahCtaha9E1i5zm1A9kMrqSFNn')
      assert.strictEqual(result[`seed`], '44cbf72322549594ab47801454ced2e970c2a9463d4c37d12951ebc41f56ad2e94024013221e3872a6eef8624f8a9b8a731f038c46689b88975fcb93931a40fd')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('buildTransaction', async () => {
    try {
      const tx = walletHelper.buildTransaction(
        [
          {
            'txid': 'f71885c81df375b17491269c583cb8a1837412d19460880485a5362a53822921',
            'index': 0,
            'balance': '4000000',
            'type': 'p2sh(p2wpkh)',
            'wif': 'cRWu81dLiLXqnwhZjU2UGBjpPR2ERQpXQQrFjJWkPW1jn9pM2QiW'
          },
          {
            'txid': '88f7bb3f720259b2590bc21fb0271dd5caf20c15a3afc371670287e63b1e98d9',
            'index': 0,
            'balance': '6600000',
            'type': 'p2sh(p2wpkh)',
            'wif': 'cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9'
          },
          {
            'txid': '23412e59fd3b2a7f6b2cf91dbf56fac06f740bbec8cf25ce7648a6e1a8284e2b',
            'index': 0,
            'balance': '3400000',
            'type': 'p2sh(p2wpkh)',
            'wif': 'cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9'
          }
        ],
        [],
        '999',
        '2N4fvvwc4dQEQZzMLJNg4TngWWMgRSgHLBn',
        testnet
      )
      assert.strictEqual(tx['txId'], '1de2da16c04f62e8dff1ced47d86d468bb1ff637a1dc42a8c0636853b8ab5dce')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('buildTransaction_multisig_tx', async () => {
    try {
      const tx = walletHelper.buildTransaction(
        [
          {
            'txid': 'a6e7dd5f344e591f9ba4902f150dd1f2b4b0cdbc0c45d0d3b6cae49d6951fe6f',
            'index': 0,
            'balance': '4000000',
            'type': 'p2sh(p2wsh(p2ms))',
            'wif': [
              'cTMF5gLdteTchzQ5c4DLjq58H3RmN9E3kcStVFZh3ch6fQdPN9KU',
              'cVHdZRYNobui1VN7pSnHP2bzKSJVhk85Jn1p2YFMJZXv2SmBfMaW'
            ],
            'pubkeys': [
              '0284f4b79e680518bb8f6f268e2d59a18aa1927c2ebd51355b15021d18e0e44968',
              '035897cfbb81459f28b20cb2808d71acef6810abf9fcf977cee2734cf766c977fc',
              '0201e2e960cf3f05dd8f0a2136d4c430cb45daeb2c537e38a4d653ab9de79b8f75',
            ]
          }
        ],
        [
          {
            'ref': 1,
            'address': '2My1UpKsy9ZTRxEac9B5NC3BrUKqx5CCppp',
            'amount': '1000000'
          }
        ],
        '1000',
        '2N4fbYKCkNLLLfzJH7WfQRwYKpJTz7a5gX6',
        testnet
      )
      // logger.error(JSON.stringify(tx))
      assert.strictEqual(tx['txId'], 'f25671a7bbec794a4b895bb1a0cbc058dc31315ada985a8c8082bf2dd948b54c')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('signTxHex', async () => {
    try {
      const tx = walletHelper.signTxHex(
        '0200000003212982532a36a58504886094d1127483a1b83c589c269174b175f31dc88518f70000000000ffffffffd9981e3be687026771c3afa3150cf2cad51d27b01fc20b59b25902723fbbf7880000000000ffffffff2b4e28a8e1a64876ce25cfc8be0b746fc0fa56bf1df92c6b7f2a3bfd592e41230000000000ffffffff03809698000000000017a9147d558b2f056386e8872e5fe7cd6a1a2527e9fee687809698000000000017a914c80fda0d07bff0f579849ade15848adbbe0ba6938768915b000000000017a9147d558b2f056386e8872e5fe7cd6a1a2527e9fee68700000000',
        [
          {
            'balance': '4000000',
            'type': 'p2sh(p2wpkh)',
            'wif': 'cRWu81dLiLXqnwhZjU2UGBjpPR2ERQpXQQrFjJWkPW1jn9pM2QiW'
          },
          {
            'balance': '6600000',
            'type': 'p2sh(p2wpkh)',
            'wif': 'cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9'
          },
          {
            'balance': '3400000',
            'type': 'p2sh(p2wpkh)',
            'wif': 'cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9'
          }
        ],
        testnet
      )
      // logger.error(tx)
      assert.strictEqual(tx['txId'], '862e9cd3a8d3c23af95c8166a9b0e76ee7f66c7b3227fecf7764abd4b4c586c7')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('decodeTxHex', async () => {
    try {
      const tx = walletHelper.decodeTxHex(
        '0200000001e6354ac7aae96b8c49f6bb4099b703e7bb3f485552d7df29df4e19e17d78660f00000000fdfd000047304402200364ff1f8d638dcf191b9dfbac8adeb8f3c6a026cae9fcb7b7bf810ebf63159a02200984ecfa27a2a767ccf2dae2f9dd3537b6d8cb7d9c107254db633df7b757367801483045022100a2a959e9845a0405c58dc5dba0afecf4604fb0a06dc335cd236b5358d24d15520220622c86d020813e6a5c10121a009a66d6fcf9b030ec9032248398002ea6c70559014c695221026b390a4dd7d4510a5724dc30004f7d5ea417b726fa473edf4302b23c40b2fe5e21031b022777c4e4ddf7cdbb216c51c9666b4f59636cc11f2ad15022ef5e0f0ca3972102603d30c9d52a6f2299aeb2d57826d1f185a33053950981955877be970794d28c53aeffffffff02c02709000000000017a914341a524ec4d39df8f20de8904f1c8f668483802c87407e05000000000017a9148e708e9353853c2d2c37f9b15a85e221a73daf668700000000',
        mainnet
      )
      // global.logger.error(tx)
      assert.strictEqual(tx['txId'], '2423655857d066e2236bbe66ebe8b3289b931fc1ab6705b559b633a1cd686d54')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })
})

