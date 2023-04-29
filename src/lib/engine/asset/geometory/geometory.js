
export const geo = {

  plane() {

    const pos = [
      -1.0, 1.0, 0.0,
      1.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0,
    ]

    const nor = [
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0
    ]

    const st = [
      0.0, 1.0,
      1.0, 1.0,
      0.0, 0.0,
      1.0, 0.0
    ]

    const index = [
      2, 1, 0,
      1, 2, 3
    ]

    return {position: pos, normal: nor, textureCoord: st, index}
  },

  torus(row, column, irad, orad) {
    let position = [], normal = [], index = [], st = []
    let i, ii, r, rr
    for(i = 0; i <= row; i++) {
      r = Math.PI * 2 / row * i
      rr = Math.cos(r)
      let ry = Math.sin(r)
      for(ii = 0; ii <= column; ii++) {
        let tr = Math.PI * 2 / column * ii
        let tx = (rr * irad + orad) * Math.cos(tr)
        let ty = ry * irad
        let tz = (rr * irad + orad) * Math.sin(tr)
        let rx = rr * Math.cos(tr)
        let rz = rr * Math.sin(tr)
        let rs = 1 / column * ii
        let rt = 1 / row * i + 0.5
        rt = (rt > 1.0) ? rt - 1.0 : rt
        position.push(tx, ty, tz)
        normal.push(rx, ry, rz)
        st.push(rs, rt)
      }
    }
    for(i = 0; i < row; i++) {
      for(ii = 0; ii < column; ii++) {
        r = (column + 1) * i + ii
        index.push(r, r + column + 1, r + 1)
        index.push(r + column + 1, r + column + 2, r + 1)
      }
    }
    return {position, normal, index}
  },

  sphere(row, column, rad) {
    let pos = [], nor = [], idx = [], st = []
    let i, ii, r
    for(i = 0; i <= row; i++) {
      r = Math.PI / row * i
      let ry = Math.cos(r)
      let rr = Math.sin(r)
      for(ii = 0; ii <= column; ii++) {
        let tr = Math.PI * 2 / column * ii
        let tx = rr * rad * Math.cos(tr)
        let ty = ry * rad
        let tz = rr * rad * Math.sin(tr)
        let rx = rr * Math.cos(tr)
        let rz = rr * Math.sin(tr)
        pos.push(tx, ty, tz)
        nor.push(rx, ry, rz)
        st.push(1 - 1 / column * ii, 1 / row * i)
      }
    }
    r = 0
    for(i = 0; i < row; i++) {
      for(ii = 0; ii < column; ii++) {
        r = (column + 1) * i + ii
        idx.push(r, r + 1, r + column + 2)
        idx.push(r, r + column + 2, r + column + 1)
      }
    }
    return {position: pos, normal: nor, textureCoord: st, index: idx}
  },

  cube() {
    let pos = [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, // v0-v1-v2-v3 front
      1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, // v0-v3-v4-v5 right
      1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, // v0-v5-v6-v1 top
      -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, // v1-v6-v7-v2 left
      -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, // v7-v4-v3-v2 bottom
      1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1] // v4-v7-v6-v5 back

    let nor = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // v0-v1-v2-v3 front
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // v0-v5-v6-v1 top
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // v1-v6-v7-v2 left
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // v7-v4-v3-v2 bottom
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1] // v4-v7-v6-v5 back

    let st = [1, 1, 0, 1, 0, 0, 1, 0, // v0-v1-v2-v3 front
      0, 1, 0, 0, 1, 0, 1, 1, // v0-v3-v4-v5 right
      1, 0, 1, 1, 0, 1, 0, 0, // v0-v5-v6-v1 top
      1, 1, 0, 1, 0, 0, 1, 0, // v1-v6-v7-v2 left
      0, 0, 1, 0, 1, 1, 0, 1, // v7-v4-v3-v2 bottom
      0, 0, 1, 0, 1, 1, 0, 1] // v4-v7-v6-v5 back

    let idx = [0, 1, 2, 0, 2, 3, // front
      4, 5, 6, 4, 6, 7, // right
      8, 9, 10, 8, 10, 11, // top
      12, 13, 14, 12, 14, 15, // left
      16, 17, 18, 16, 18, 19, // bottom
      20, 21, 22, 20, 22, 23] // back

    return {position: pos, normal: nor, textureCoord: st, index: idx}
  }

}
