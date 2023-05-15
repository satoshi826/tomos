
export const insideOut = (mesh) => {

  const setNormal = mesh.setNormal
  mesh.setNormal = function() {
    setNormal.call(this)
    this.matrix.normal.forEach((val, i) => this.matrix.normal[i] = -val)
  }

  const render = mesh.material.render
  mesh.material.render = function(...args) {
    this.core.gl.disable(this.core.gl.CULL_FACE)
    render.call(this, ...args)
    this.core.gl.enable(this.core.gl.CULL_FACE)
  }
}


