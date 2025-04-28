import { Core, Loop, Renderer, State, Vao, plane2D } from 'glaku'
import type { CameraPosition } from 'shared/types'
import type { MessageView } from '../../type'
import { grid } from './grid'
import { message } from './message'
import { user } from './user'
export default {}

const mouseState = new State({ x: 0, y: 0 })
const cameraState = new State<CameraPosition>({ x: 0, y: 0, z: 1 })
const resizeState = new State({ width: 1, height: 1 })
const messageState = new State<MessageView[]>([])

const hoge = () => {
  console.log('hoge')
}

const main = async (canvas: OffscreenCanvas) => {
  const core = new Core({
    canvas,
    resizeListener: (handler) => {
      resizeState.on(handler)
    },
  })

  const planeVao = new Vao(core, plane2D())
  // const messageVAO = new Vao(core, plane2D())

  const gridProgram = grid(core)
  const userProgram = user(core)
  const messageProgram = message(core)

  userProgram.setUniform({ u_userPosition: [0, 0] })

  const renderer = new Renderer(core, { backgroundColor: [0, 0, 0, 1.0] })
  renderer.render(planeVao, gridProgram)

  resizeState.on(({ width, height }) => {
    gridProgram.setUniform({ u_resolution: [width, height] })
    messageProgram.setUniform({ u_resolution: [width, height] })
    userProgram.setUniform({ u_resolution: [width, height] })
    renderer.render(planeVao, gridProgram)
    // renderer.render(planeVao, userProgram)
  })

  cameraState.on(({ x, y, z }) => {
    // hoge({ x, y, z })
    gridProgram.setUniform({ u_camera: [x, y, z] })
    messageProgram.setUniform({ u_camera: [x, y, z] })
    userProgram.setUniform({ u_cameraPosition: [x, y, z] })
    renderer.render(planeVao, gridProgram)
    // renderer.render(planeVao, userProgram)
  })

  new Loop({
    callback: () => renderer.render(planeVao, gridProgram),
  }).start()

  // messageState.on((messageView) => {
  //   console.log(messageView)
  // })
}

// biome-ignore lint/suspicious/noGlobalAssign: <explanation>
onmessage = async ({ data }) => {
  const { canvas, mouse, resize, camera, message } = data
  if (mouse) mouseState.set(mouse)
  if (resize) resizeState.set(resize)
  if (camera) cameraState.set(camera)
  if (message) messageState.set(message)
  if (canvas) main(canvas)
}
