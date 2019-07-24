import BitcoinWalletHelper from "../src/wallet";
import assert from "assert";

const walletHelper = new BitcoinWalletHelper()
const result = walletHelper.getAllFromWif('KxssBSfj5fpRSz9JzUAorL9aNansgNGLEUA8tXMLm4fTCfUAWnQu', `mainnet`)
const p2pkh = walletHelper.getAddressFromPublicKey(result[`publicKey`], `p2pkh`, `mainnet`)
global.logger.error(p2pkh)
