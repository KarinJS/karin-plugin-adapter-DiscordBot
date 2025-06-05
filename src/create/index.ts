import { AdapterConvertKarin } from '@/core/convert'
import { AdapterDiscord } from '@/core/index'
import Eris, { DMChannel } from 'eris'
import { contactGuild, createGuildMessage, senderGuild } from 'node-karin'

/**
 * 创建事件
 * @param event - 事件
 * @param bot - Bot实例
 */
export const createMessage = async (msg: Eris.Message<Eris.PossiblyUncachedTextableChannel>, bot: AdapterDiscord) => {
  switch (msg.type) {
    case 0:
      if ('guild' in msg.channel) {
        const perm = msg.member?.id === msg.member?.guild.ownerID ? 'owner' : 'member'
        const a = msg.member?.permissions
        const contact = contactGuild(`dc_${msg.guildID}`, `dc_${msg.channel.id}`, msg.channel.guild.name, msg.channel.name)
        const sender = senderGuild(msg.author.id, perm, `${msg.member?.globalName}-${msg.member?.username}`, 'unknown', 0)
        createGuildMessage({
          time: msg.timestamp,
          eventId: `message:${msg.id}`,
          rawEvent: msg,
          srcReply: (elements) => bot.sendMsg(contact, elements),
          bot,
          messageId: msg.id,
          messageSeq: msg.timestamp,
          elements: await AdapterConvertKarin(bot, msg),
          contact,
          sender
        })
      } else {

      }
  }
}