import { useCurrentTopic } from '@/domain/hooks'
import { IconButton } from './common/iconButton'

const onClick = (c: unknown) => console.log(c)

function CurrenTopicTitle() {
  const currentTopic = useCurrentTopic()
  return <div>{currentTopic?.title}</div>
}

export function Header({ toggleOpen }: { toggleOpen: () => void }) {
  return (
    <div className="z-20 flex items-center justify-between border-zinc-50/20 border-b bg-zinc-500/30 px-3 py-2 backdrop-blur-lg">
      <IconButton onClick={toggleOpen}>menu</IconButton>
      <CurrenTopicTitle />
      <IconButton onClick={onClick}>account_circle</IconButton>
    </div>
  )
}
