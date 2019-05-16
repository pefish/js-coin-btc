import BitcoinWalletHelper from "../src/wallet";

const mainnet = `test`
const walletHelper = new BitcoinWalletHelper()
const result = walletHelper.getAllFromWif('L5nNnEKwmb1Yxh6neMKn5Srum3NBjTpPtNHFpNPJS3Dqh2yTcsyy', mainnet)

const p2pkh = walletHelper.getAddressFromPublicKey(result['publicKey'], `p2pkh`, mainnet)
console.log(`p2pkh`, p2pkh)

const a = walletHelper.getAddressFromPublicKey(result['publicKey'], `p2sh(p2wpkh)`, mainnet)
console.log(`a`, a)

const b = walletHelper.getAddressFromPublicKey(result['publicKey'], `p2wpkh`, mainnet)
console.log(`b`, b)
