let id = 0

export class Geometory {
  constructor(core, {position, normal, textureCoord, index} = {}) {

    this.id = id++
    this.index = index
    this.idxLen = index?.length,
    this.posLen = position.length / 3
    this.attributes = {
      a_position    : position,
      a_normal      : normal,
      a_textureCoord: textureCoord
    }
    core.setVao(this)

  }
}