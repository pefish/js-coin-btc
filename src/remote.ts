import '@pefish/js-node-assist'
import Client from 'bitcoin-core'

export interface RemoteConfig {
  host: string
  port: number,
  username?: string,
  password?: string,
  ssl?: boolean
}

export default class Remote {

  client: Client

  constructor (rpcConfig: RemoteConfig) {
    this.client = new Client(rpcConfig)
  }

  async request (method, params) {
    return this.client.command(method, ...params)
  }
}
