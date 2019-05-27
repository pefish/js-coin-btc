import BitcoinWalletHelper from "../src/wallet";

let temp = `5`
if (temp.length % 2 !== 0) {
  temp = '0' + temp
}

console.log(Buffer.from(temp, 'hex'))
