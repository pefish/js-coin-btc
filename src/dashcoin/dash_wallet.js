import BaseBitcoreLib from "../base/base_bitcore_lib";

export default class DashWalletHelper extends BaseBitcoreLib {
  constructor() {
    super()
    this._bitcoin = require('dashcore-lib')
  }
}