import { useCurrentTopic } from '@/domain/hooks'
import { IconButton } from '../common/iconButton'
import { ProfileButton } from './profile'

function CurrenTopicTitle() {
  const currentTopic = useCurrentTopic()
  return <div>{currentTopic?.title}</div>
}

export function Header({ toggleOpen }: { toggleOpen: () => void }) {
  return (
    <div className="z-20 flex items-center justify-between border-divider-extension border-b bg-base-100 px-3 py-2 backdrop-blur-lg backdrop-saturate-200">
      <IconButton onClick={toggleOpen}>menu</IconButton>
      <CurrenTopicTitle />
      <ProfileButton />
    </div>
  )
}
