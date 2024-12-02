import {useState} from 'react'
import {Header} from './header'
import {Sidebar} from './sidebar'

export function Frame({children}: React.PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 480)
  const toggleOpen = () => setIsSidebarOpen((prev) => !prev)
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <Header toggleOpen={toggleOpen}/>
      <div className="flex flex-grow z-10 pointer-events-none">
        <Sidebar open={isSidebarOpen}/>
        {children}
      </div>
    </div>
  )
}