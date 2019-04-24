import BitcoinWalletHelper from '../src/bitcoin/bitcoin_wallet'

const walletHelper = new BitcoinWalletHelper()

const result1 = walletHelper.getAddressFromPublicKey({
  pubkeys: [
    "03b48aaed5afd55af800bf3d7fb9d0b62507548237b10820aaae8b3af192ff33a1",
    "031b022777c4e4ddf7cdbb216c51c9666b4f59636cc11f2ad15022ef5e0f0ca397",
    "028d2d5f8815dda6a5a20635d3c8064ae280cced71580d202367ac819ce2910365",
    "0207e3c205361b2755cf03d2d4eff727f75d505958b4ac42bf915b41bc0a188461"
  ],
  m: 2
}, `p2sh(p2ms)`, `mainnet`)
logger.error(result1)


const tx = walletHelper.buildTransaction(
  [
    {
      "txid": "bcfbc1244f3a0d03247680db05bde7a333ae43219ece18ed4948187f4f0e0c38",
      "index": 1,
      "balance": "80000",
      "type": "p2sh(p2ms)",
      "wif": [
        "",
      ],
      "pubkeys": [
        "03b48aaed5afd55af800bf3d7fb9d0b62507548237b10820aaae8b3af192ff33a1",
        "031b022777c4e4ddf7cdbb216c51c9666b4f59636cc11f2ad15022ef5e0f0ca397",
        "028d2d5f8815dda6a5a20635d3c8064ae280cced71580d202367ac819ce2910365",
        "0207e3c205361b2755cf03d2d4eff727f75d505958b4ac42bf915b41bc0a188461"
      ],
      "m": 2,
    }
  ],
  [
    {
      "address": "3Js3b3vkPZLeYsaz4erUGAcGSYQrfpNuAA",
      "amount": "10000"
    }
  ],
  '10000',
  '3AgHM7WNCqxc5AUr1g69uK4ikKCgrqb5cZ',
  `mainnet`
)
logger.error(JSON.stringify(tx))



const tx1 = walletHelper.signTxHex(
  tx[`txHex`],
  [
    {
      "type": "p2sh(p2ms)",
      "m": 2,
      "wif": [
        "",
      ],
      "pubkeys": [
        "03b48aaed5afd55af800bf3d7fb9d0b62507548237b10820aaae8b3af192ff33a1",
        "031b022777c4e4ddf7cdbb216c51c9666b4f59636cc11f2ad15022ef5e0f0ca397",
        "028d2d5f8815dda6a5a20635d3c8064ae280cced71580d202367ac819ce2910365",
        "0207e3c205361b2755cf03d2d4eff727f75d505958b4ac42bf915b41bc0a188461"
      ]
    }
  ],
  `mainnet`
)
logger.error(JSON.stringify(tx1))
