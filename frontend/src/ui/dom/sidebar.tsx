import {useCameraPosition, useMousePosition, useUserPosition} from '@/domain/hooks'
import {ClassName} from '@/util/type'

export function Sidebar({open}: {open: boolean}) {
  const cameraPosition = useCameraPosition()
  const mousePosition = useMousePosition()
  const userPosition = useUserPosition()

  const openClass : ClassName = open ? 'translate-x-0' : '-translate-x-full'
  const sidebarClassBase : ClassName = 'duration-300 sm:min-w-48 min-w-80 flex flex-col gap-3 h-full p-3 bg-zinc-800-900/50 backdrop-blur-sm pointer-events-auto border-r border-zinc-200/10 z-50 '
  const sidebarClass = sidebarClassBase + openClass

  return (
    <div className={sidebarClass}>
      <div className="card bg-base-100 p-3">
        <div>Camera</div>
        <div>x: {cameraPosition.x.toFixed(2)}</div>
        <div>y: {cameraPosition.y.toFixed(2)}</div>
        <div>z: {cameraPosition.z.toFixed(2)}</div>
      </div>
      <div className="card bg-base-100 p-3">
        <div>Mouse</div>
        <div>x: {mousePosition.x.toFixed(2)}</div>
        <div>y: {mousePosition.y.toFixed(2)}</div>
      </div>
      <div className="card bg-base-100 p-3">
        <div>User</div>
        <div>x: {userPosition.x.toFixed(1)}</div>
        <div>y: {userPosition.y.toFixed(1)}</div>
      </div>
    </div>
  )
}