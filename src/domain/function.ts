// import type {
//   Infra,
//   Message,
//   MessageCommand,
//   MessageId,
//   Topic,
//   TopicId
// } from './type'

import {maxMultiple} from '@/util/function'
import {Multiple10} from './type'

export const numberToMultiple10 = (num: number): Multiple10 => maxMultiple(num, 10)

// export const commandToMessage = (commands: MessageCommand[]): Record<MessageId, Message> => {
//   return {} as Record<MessageId, Message>
// }

// export const messageToTopic = (message: Message[]): Record<TopicId, Topic> => {
//   return {} as Record<TopicId, Topic>
// }

// export const positionToMessageLocation = () => {

// }

// export const getMessage = (infra: Infra) => (params): Message[] => {
//   return infra.getMessage(params)
// }
