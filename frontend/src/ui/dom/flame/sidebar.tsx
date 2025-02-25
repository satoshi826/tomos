import { useCameraPosition, useMousePosition, useUserPosition } from '@/domain/hooks'
import type { ClassName } from '@/util/type'
import { cva } from 'class-variance-authority'
import { Card } from '../common/card'

const baseStyles: ClassName =
  'duration-300 sm:min-w-72 min-w-90 flex flex-col gap-3 h-full p-3 bg-base-300 backdrop-blur-md backdrop-saturate-200 pointer-events-auto border-r border-divider z-50 '

const sidebarStyles = cva(baseStyles, {
  variants: {
    open: {
      true: 'translate-x-0',
      false: '-translate-x-full',
    },
  },
  defaultVariants: {
    open: true,
  },
})

export function Sidebar({ open }: { open: boolean }) {
  const cameraPosition = useCameraPosition()
  const mousePosition = useMousePosition()
  const userPosition = useUserPosition()

  return (
    <div className={sidebarStyles({ open })}>
      <Card>
        <div>Camera</div>
        <div>x: {cameraPosition.x.toFixed(2)}</div>
        <div>y: {cameraPosition.y.toFixed(2)}</div>
        <div>z: {cameraPosition.z.toFixed(2)}</div>
      </Card>
      <Card>
        <div>Mouse</div>
        <div>x: {mousePosition.x.toFixed(2)}</div>
        <div>y: {mousePosition.y.toFixed(2)}</div>
      </Card>
      <Card>
        <div>User</div>
        <div>x: {userPosition.x.toFixed(1)}</div>
        <div>y: {userPosition.y.toFixed(1)}</div>
      </Card>
    </div>
  )
}
