import {messageAtom} from '@/domain/hooks'
import {atom, useAtomValue} from 'jotai'
import {MessageView} from '../type'

export const messageViewAtom = atom<MessageView[]>((get) => get(messageAtom).map(({x, y}) => [x, y, 1]))
export const useMessageView = () => useAtomValue(messageViewAtom)