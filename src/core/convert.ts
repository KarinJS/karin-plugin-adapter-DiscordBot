import { AdapterDiscord } from '@/core'
import Eris, { AdvancedMessageContent, MessageContent } from 'eris'
import { Elements, segment } from 'node-karin'

/**
 * dc格式消息转换为Karin格式
 * @returns Karin格式消息
 */
export async function AdapterConvertKarin (bot: AdapterDiscord, data: Eris.Message<Eris.PossiblyUncachedTextableChannel>): Promise<Array<Elements>> {
  const elements = []
  if (data.attachments.length > 0) {
    for (const i of data.attachments) {
      const reg = new RegExp('image/(.*)')
      reg.test(i.content_type || '') ? elements.push(segment.image(i.url)) : ''
    }
  }
  if (data.content) elements.push(segment.text(data.content))
  return elements
}

export async function KarinConvertAdapter (bot: AdapterDiscord, data: Array<Elements>): Promise<any> {
  let elements: MessageContent = {
    content: '',
    messageReference: undefined,
    file: [],
    components: [],
    embeds: []
  }
  for (const i of data) {
    switch (i.type) {
      case 'text':
        elements.content = elements.content + i.text
        break
      case 'image':
        elements.embeds?.push({ image: { url: i.file } })
        break
      case 'video':
        if (Array.isArray(elements.file)) elements.file?.push({ file: i.file, name: i.name || 'video.mp4' })
        break
      case 'reply':
        elements.messageReference = {
          messageID: i.messageId,
          failIfNotExists: false
        }
        break
    }
  }
  return elements
}