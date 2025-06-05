import { CfgType } from '@/imports'
import { AdapterBase, AdapterType, Contact, Elements, logger, RECV_MSG, registerBot, SendMsgResults, unregisterBot } from 'node-karin'
import { Client } from 'eris'
import { createMessage } from '@/create'
import { KarinConvertAdapter } from './convert'

export class AdapterDiscord extends AdapterBase implements AdapterType {
  super: Client
  constructor (token: string, cfg: CfgType) {
    super()
    this.account.name = 'Discord'
    this.account.uid = ''
    this.account.uin = ''
    this.account.selfId = ''
    this.account.name = 'Discord Bot'
    this.adapter.index = 0
    this.adapter.version = 'v 0.18.0'
    this.adapter.platform = 'discord'
    this.adapter.name = 'Discord Bot'
    this.adapter.standard = 'other'
    this.adapter.protocol = 'other'
    this.adapter.communication = 'other'
    this.super = new Client(token, { intents: ['all'] })
  }

  async init (token: string) {
    this.super.on('ready', () => {
      this.account.uid = `dc_${this.super.user.id}`
      this.account.uin = `dc_${this.super.user.id}`
      this.account.selfId = `dc_${this.super.user.id}`
      this.account.name = this.super.user.username
      this.account.avatar = this.super.user.avatarURL
      const index = registerBot('other', this)
      if (index) this.adapter.index = index
      this.logger('info', `${this.super.user.username} 连接成功~`)
    })
    this.super.on('error', (e) => {
      this.super.disconnect({ reconnect: false })
      unregisterBot('index', this.adapter.index)
      this.logger('error', e)

    })
    this.super.connect().catch((e) => {
      this.logger('error', '连接失败', e)
      this.super.disconnect({ reconnect: false })
    })
    this.super.on('messageCreate', (msg) => {
      createMessage(msg, this)
    })
  }
  logger (level: 'info' | 'error' | 'trace' | 'debug' | 'mark' | 'warn' | 'fatal', ...args: any[]) {
    logger.bot(level, this.account.uid || this.account.uin, ...args)
  }
  async sendMsg (contact: Contact, elements: Array<Elements>) {
    const result: SendMsgResults = {
      messageId: '',
      time: Date.now(),
      rawData: {},
      message_id: '',
      messageTime: Date.now()
    }

    const message = await KarinConvertAdapter(this, elements)
    this.logger('info', contact.subPeer)
    this.logger('info', message)
    const res = contact.scene === 'friend'
      ? undefined
      : await this.super.createMessage(contact.subPeer!.replace(/dc_/, ''), message)
    if (!res) throw new Error('发送消息失败,暂不支持发送私聊消息')

    result.messageId = res.id
    result.rawData = res
    result.time = res.timestamp
    return result

  }
}