import BitcoinWalletHelper from '../src/bitcoin/bitcoin_wallet'

const walletHelper = new BitcoinWalletHelper()

// const result1 = walletHelper.getAddressFromPublicKey({
//   pubkeys: [
//     "03b48aaed5afd55af800bf3d7fb9d0b62507548237b10820aaae8b3af192ff33a1",
//     "031b022777c4e4ddf7cdbb216c51c9666b4f59636cc11f2ad15022ef5e0f0ca397",
//     "028d2d5f8815dda6a5a20635d3c8064ae280cced71580d202367ac819ce2910365",
//     "0207e3c205361b2755cf03d2d4eff727f75d505958b4ac42bf915b41bc0a188461"
//   ],
//   m: 2
// }, `p2sh(p2ms)`, `mainnet`)
// logger.error(result1)
//
//
// const tx = walletHelper.buildTransaction(
//   [
//     {
//       "txid": "bcfbc1244f3a0d03247680db05bde7a333ae43219ece18ed4948187f4f0e0c38",
//       "index": 1,
//       "balance": "80000",
//       "type": "p2sh(p2ms)",
//       "wif": [
//         "",
//       ],
//       "pubkeys": [
//         "03b48aaed5afd55af800bf3d7fb9d0b62507548237b10820aaae8b3af192ff33a1",
//         "031b022777c4e4ddf7cdbb216c51c9666b4f59636cc11f2ad15022ef5e0f0ca397",
//         "028d2d5f8815dda6a5a20635d3c8064ae280cced71580d202367ac819ce2910365",
//         "0207e3c205361b2755cf03d2d4eff727f75d505958b4ac42bf915b41bc0a188461"
//       ],
//       "m": 2,
//     }
//   ],
//   [
//     {
//       "address": "3Js3b3vkPZLeYsaz4erUGAcGSYQrfpNuAA",
//       "amount": "10000"
//     }
//   ],
//   '10000',
//   '3AgHM7WNCqxc5AUr1g69uK4ikKCgrqb5cZ',
//   `mainnet`
// )
// logger.error(JSON.stringify(tx))

// const txHex = tx[`txHex`]

const txHex = `0200000001c6625e482b12fd108b6187295bbeb3cb2aefe1367997489b8e5fc614b11ccddd02000000d600473044022009136f1f9e57f1e0191bd49c2e9fb976c647d8f047529966152954e9500d74e502200afc325806e94ebbada96c19611451fd2633513b3dcc516cfaa53ea7752d3e91014c8b522103b48aaed5afd55af800bf3d7fb9d0b62507548237b10820aaae8b3af192ff33a121031b022777c4e4ddf7cdbb216c51c9666b4f59636cc11f2ad15022ef5e0f0ca39721028d2d5f8815dda6a5a20635d3c8064ae280cced71580d202367ac819ce2910365210207e3c205361b2755cf03d2d4eff727f75d505958b4ac42bf915b41bc0a18846154aeffffffff03220200000000000017a914f0a25d6ed3dfbf3bea054cc36ed2fd377facfff3870000000000000000166a146f6d6e69000000000000001f0000000000989680fe4b00000000000017a91462959750756425624f4d5b0d65184d43cdbb55138700000000`
const tx1 = walletHelper.signTxHex(
  txHex,
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

