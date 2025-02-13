import { areaKeyToPosition } from '@/domain/hooks'
import { Position } from '@/domain/types'
import { client } from '@/infra/api'
import { topics } from '@/infra/components/messages'
import { resultToJson } from '@/infra/util'
import { CFRS } from './observer'

export default {}

const cfrs = new CFRS()

console.log('cfrs worker')

type ReceiveData =
  | {
      type: 'get'
      key: string
    }
  | {
      type: 'fetch'
      method: 'topics'
      param: object
    }

type FetchMethod = 'topics'

// const fetchers = {
//   topics,
// }

// biome-ignore lint/suspicious/noGlobalAssign: <explanation>
onmessage = async ({ data: d }: { data: ReceiveData }) => {
  console.log('worker onmessage', d)
  // if (d.type === 'get') {
  //   const { key } = d
  //   const data = cfrs.get(key)()
  //   self.postMessage({ type: 'send', key, data })
  // }
  // if (d.type === 'fetch') {
  //   const { method, param } = d
  //   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //   const promiseKey = fetchers[method].paramToKey(param as any)
  //   const fetcher = fetchers[method].fetcher
  //   const keyValue = fetchers[method].keyValue
  //   cfrs.fetch({ promiseKey, fetcher, keyValue, ttl: 1000 * 10 })
  //   console.log('fetch', promiseKey)
  // }
}
