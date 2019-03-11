import BaseCoin from "./base_coin";

export default class BaseBitcoinLike extends BaseCoin {
  /**
   * btc单位转化为satoshi单位
   * @param value
   * @returns {_String}
   */
  btcToSatoshi(value) {
    return value.toString().multi(1E8).toString()
  }

  /**
   * satoshi单位转化为btc单位
   * @param value
   * @returns {_String}
   */
  satoshiToBtc(value) {
    return value.toString().div(1E8).toString()
  }
}
