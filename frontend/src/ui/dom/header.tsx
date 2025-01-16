import { IconButton } from './common/iconButton'

const onClick = (c: unknown) => console.log(c)

export function Header({ toggleOpen }: { toggleOpen: () => void }) {
  return (
    <div className="z-20 flex items-center justify-between border-zinc-500/40 border-b bg-gray-50/10 p-2 backdrop-blur-sm">
      <IconButton onClick={toggleOpen}>menu</IconButton>
      <div>トピック</div>
      <IconButton onClick={onClick}>account_circle</IconButton>
    </div>
  )
}
