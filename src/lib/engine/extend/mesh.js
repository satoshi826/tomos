import {mat} from '@engine/function/matrix'

export const insideOut = (mesh) => {
  mesh.setNormal = function() {
    let {model, normal} = this.matrix
    mat.inv(model, normal)
    mat.trans(normal, normal)
    normal.forEach((val, i) => normal[i] = -val)
  }
  mesh.material.render = function({idxLen}) {
    this.core.gl.disable(this.core.gl.CULL_FACE)
    this.texture.forEach((tex) => {
      this.core.useTexture(tex)
    })
    this.core.gl.drawElements(this.core.gl.TRIANGLES, idxLen, this.core.gl.UNSIGNED_SHORT, 0)
    this.core.gl.enable(this.core.gl.CULL_FACE)
  }
}
