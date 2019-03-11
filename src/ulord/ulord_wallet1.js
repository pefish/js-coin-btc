import BaseBitcoreLib from "../base/base_bitcore_lib";

export default class UlordWalletHelper1 extends BaseBitcoreLib {
  constructor() {
    super()
    this._bitcoin = require('ulord-bitcore-lib')
  }
}