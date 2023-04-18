
export const qtn = {

  reset(dest) {
    dest[0] = 0; dest[1] = 0; dest[2] = 0; dest[3] = 1
    return dest
  },

  create() {
    let dest = new Float32Array(4)
    return dest
  },

  inverse(qtn, dest) {
    dest[0] = -qtn[0]
    dest[1] = -qtn[1]
    dest[2] = -qtn[2]
    dest[3] = qtn[3]
    return dest
  },

  normalize(dest) {
    let x = dest[0], y = dest[1], z = dest[2], w = dest[3]
    let l = Math.sqrt(x * x + y * y + z * z + w * w)
    if(l === 0) {
      dest[0] = 0
      dest[1] = 0
      dest[2] = 0
      dest[3] = 0
    }else{
      l = 1 / l
      dest[0] = x * l
      dest[1] = y * l
      dest[2] = z * l
      dest[3] = w * l
    }
    return dest
  },

  mul(qtn1, qtn2, dest) {
    let ax = qtn1[0], ay = qtn1[1], az = qtn1[2], aw = qtn1[3]
    let bx = qtn2[0], by = qtn2[1], bz = qtn2[2], bw = qtn2[3]
    dest[0] = ax * bw + aw * bx + ay * bz - az * by
    dest[1] = ay * bw + aw * by + az * bx - ax * bz
    dest[2] = az * bw + aw * bz + ax * by - ay * bx
    dest[3] = aw * bw - ax * bx - ay * by - az * bz
  },

  rot(angle, axis, dest) {
    let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2])
    if(!sq) {
      return null
    }
    let a = axis[0], b = axis[1], c = axis[2]
    if(sq !== 1) {
      sq = 1 / sq; a *= sq; b *= sq; c *= sq
    }
    let s = Math.sin(angle * 0.5)
    dest[0] = a * s
    dest[1] = b * s
    dest[2] = c * s
    dest[3] = Math.cos(angle * 0.5)
  },

  toVec(vec, qtn, dest) {
    let qp = this.create()
    let qq = this.create()
    let qr = this.create()
    this.inverse(qtn, qr)
    qp[0] = vec[0]
    qp[1] = vec[1]
    qp[2] = vec[2]
    this.mul(qr, qp, qq)
    this.mul(qq, qtn, qr)
    dest[0] = qr[0]
    dest[1] = qr[1]
    dest[2] = qr[2]
    return dest
  },

  toMat(qtn, dest) {
    let x = qtn[0], y = qtn[1], z = qtn[2], w = qtn[3]
    let x2 = x + x, y2 = y + y, z2 = z + z
    let xx = x * x2, xy = x * y2, xz = x * z2
    let yy = y * y2, yz = y * z2, zz = z * z2
    let wx = w * x2, wy = w * y2, wz = w * z2
    dest[0] = 1 - (yy + zz)
    dest[1] = xy - wz
    dest[2] = xz + wy
    dest[3] = 0
    dest[4] = xy + wz
    dest[5] = 1 - (xx + zz)
    dest[6] = yz - wx
    dest[7] = 0
    dest[8] = xz - wy
    dest[9] = yz + wx
    dest[10] = 1 - (xx + yy)
    dest[11] = 0
    dest[12] = 0
    dest[13] = 0
    dest[14] = 0
    dest[15] = 1
  },

  slerp(qtn1, qtn2, time, dest) {
    let ht = qtn1[0] * qtn2[0] + qtn1[1] * qtn2[1] + qtn1[2] * qtn2[2] + qtn1[3] * qtn2[3]
    let hs = 1.0 - ht * ht
    if(hs <= 0.0) {
      dest[0] = qtn1[0]
      dest[1] = qtn1[1]
      dest[2] = qtn1[2]
      dest[3] = qtn1[3]
    }else{
      hs = Math.sqrt(hs)
      if(Math.abs(hs) < 0.0001) {
        dest[0] = (qtn1[0] * 0.5 + qtn2[0] * 0.5)
        dest[1] = (qtn1[1] * 0.5 + qtn2[1] * 0.5)
        dest[2] = (qtn1[2] * 0.5 + qtn2[2] * 0.5)
        dest[3] = (qtn1[3] * 0.5 + qtn2[3] * 0.5)
      }else{
        let ph = Math.acos(ht)
        let pt = ph * time
        let t0 = Math.sin(ph - pt) / hs
        let t1 = Math.sin(pt) / hs
        dest[0] = qtn1[0] * t0 + qtn2[0] * t1
        dest[1] = qtn1[1] * t0 + qtn2[1] * t1
        dest[2] = qtn1[2] * t0 + qtn2[2] * t1
        dest[3] = qtn1[3] * t0 + qtn2[3] * t1
      }
    }
  }

}
