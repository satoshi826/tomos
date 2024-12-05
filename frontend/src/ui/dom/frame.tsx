import { useState } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'

export function Frame({ children }: React.PropsWithChildren) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 480)
	const toggleOpen = () => setIsSidebarOpen((prev) => !prev)
	return (
		<div className="relative flex h-screen flex-col overflow-hidden">
			<Header toggleOpen={toggleOpen} />
			<div className="pointer-events-none z-10 flex flex-grow">
				<Sidebar open={isSidebarOpen} />
				{children}
			</div>
		</div>
	)
}
