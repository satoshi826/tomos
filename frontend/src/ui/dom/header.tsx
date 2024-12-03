import {IconButton} from './common/iconButton'

export function Header({toggleOpen}: {toggleOpen: () => void}) {
  return (
    <div className='flex items-center justify-between p-2 bg-gray-50/10 z-20 backdrop-blur-sm border-b border-zinc-500/40'>
      <IconButton onClick={toggleOpen}>menu</IconButton>
      <div>トピック</div>
      <IconButton onClick={(c) => console.log(c)}>account_circle</IconButton>
    </div>
  )
}