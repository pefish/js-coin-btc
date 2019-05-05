export default class BtcApiHelper {
    _baseUrl: string;
    _token: string;
    constructor(url: any, token?: string);
    _buildFullUrl(path: any): string;
    sendRawTransaction(txHex: any): Promise<boolean>;
    getAddressInfo(address: any): Promise<any>;
    getBalance(address: any, zeroConfirmation?: boolean): Promise<any>;
    getUnconfirmedTxs(): Promise<any>;
    getChainInfo(): Promise<any>;
}
