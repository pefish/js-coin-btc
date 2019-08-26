export default class BtcApiHelper {
    baseUrl: string;
    token: string;
    constructor(url: string, token?: string);
    private buildFullUrl;
    sendRawTransaction(txHex: string): Promise<void>;
    getAddressInfo(address: string): Promise<any>;
    getBalance(address: string, zeroConfirmation?: boolean): Promise<string>;
    getUnconfirmedTxs(): Promise<any[]>;
    getChainInfo(): Promise<any>;
}
