
onmessage = ({data}) => {
  if(data.mul) mul(...data.mul)
  if(data.inv) inv(data.inv)
}

function create() {
  return new Float32Array(16)
}

function reset(dest) {
  dest[0] = 1; dest[1] = 0; dest[2] = 0; dest[3] = 0
  dest[4] = 0; dest[5] = 1; dest[6] = 0; dest[7] = 0
  dest[8] = 0; dest[9] = 0; dest[10] = 1; dest[11] = 0
  dest[12] = 0; dest[13] = 0; dest[14] = 0; dest[15] = 1
  return dest
}

function mul(mat1, mat2) {
  let dest = reset(create())
  const
    a = mat1[0], b = mat1[1], c = mat1[2], d = mat1[3],
    e = mat1[4], f = mat1[5], g = mat1[6], h = mat1[7],
    i = mat1[8], j = mat1[9], k = mat1[10], l = mat1[11],
    m = mat1[12], n = mat1[13], o = mat1[14], p = mat1[15],
    A = mat2[0], B = mat2[1], C = mat2[2], D = mat2[3],
    E = mat2[4], F = mat2[5], G = mat2[6], H = mat2[7],
    I = mat2[8], J = mat2[9], K = mat2[10], L = mat2[11],
    M = mat2[12], N = mat2[13], O = mat2[14], P = mat2[15]
  dest[0] = A * a + B * e + C * i + D * m
  dest[1] = A * b + B * f + C * j + D * n
  dest[2] = A * c + B * g + C * k + D * o
  dest[3] = A * d + B * h + C * l + D * p
  dest[4] = E * a + F * e + G * i + H * m
  dest[5] = E * b + F * f + G * j + H * n
  dest[6] = E * c + F * g + G * k + H * o
  dest[7] = E * d + F * h + G * l + H * p
  dest[8] = I * a + J * e + K * i + L * m
  dest[9] = I * b + J * f + K * j + L * n
  dest[10] = I * c + J * g + K * k + L * o
  dest[11] = I * d + J * h + K * l + L * p
  dest[12] = M * a + N * e + O * i + P * m
  dest[13] = M * b + N * f + O * j + P * n
  dest[14] = M * c + N * g + O * k + P * o
  dest[15] = M * d + N * h + O * l + P * p
  self.postMessage(dest)
}

function inv(mat) {
  let dest = reset(create())
  let a = mat[0], b = mat[1], c = mat[2], d = mat[3],
    e = mat[4], f = mat[5], g = mat[6], h = mat[7],
    i = mat[8], j = mat[9], k = mat[10], l = mat[11],
    m = mat[12], n = mat[13], o = mat[14], p = mat[15],
    q = a * f - b * e, r = a * g - c * e,
    s = a * h - d * e, t = b * g - c * f,
    u = b * h - d * f, v = c * h - d * g,
    w = i * n - j * m, x = i * o - k * m,
    y = i * p - l * m, z = j * o - k * n,
    A = j * p - l * n, B = k * p - l * o,
    ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w)
  dest[0] = (f * B - g * A + h * z) * ivd
  dest[1] = (-b * B + c * A - d * z) * ivd
  dest[2] = (n * v - o * u + p * t) * ivd
  dest[3] = (-j * v + k * u - l * t) * ivd
  dest[4] = (-e * B + g * y - h * x) * ivd
  dest[5] = (a * B - c * y + d * x) * ivd
  dest[6] = (-m * v + o * s - p * r) * ivd
  dest[7] = (i * v - k * s + l * r) * ivd
  dest[8] = (e * A - f * y + h * w) * ivd
  dest[9] = (-a * A + b * y - d * w) * ivd
  dest[10] = (m * u - n * s + p * q) * ivd
  dest[11] = (-i * u + j * s - l * q) * ivd
  dest[12] = (-e * z + f * x - g * w) * ivd
  dest[13] = (a * z - b * x + c * w) * ivd
  dest[14] = (-m * t + n * r - o * q) * ivd
  dest[15] = (i * t - j * r + k * q) * ivd
  self.postMessage(dest)
}