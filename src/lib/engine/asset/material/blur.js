
export const blur = ({pixelRatio}) => ({
  id        : 'blur',
  attributes: [
    'a_position',
    'a_textureCoord'
  ],
  uniforms: [
    'u_texture',
    'u_isHorizontal',
    'u_invPixelRatio',
  ],
  uniformValue: {
    u_invPixelRatio: 1 / pixelRatio
  },

  vert: /* glsl */`#version 300 es

  layout(location = 0) in vec3 a_position;
  layout(location = 3) in vec2 a_textureCoord;

  out vec2 v_textureCoord;

  void main(void){
    v_textureCoord  = a_textureCoord;
    gl_Position = vec4(a_position, 1.0);
  }
  `,

  frag: /* glsl */`#version 300 es
  precision highp float;

  in vec2 v_textureCoord;

  uniform sampler2D u_texture;
  uniform bool u_isHorizontal; // ブラーを掛ける方向
  uniform int u_invPixelRatio;

  out vec4 o_color;

  const float[5] weights = float[](0.2270270, 0.1945945, 0.1216216, 0.0540540, 0.0162162);

  ivec2 clampCoord(ivec2 coord, ivec2 size) {
    return max(min(coord, size - 1), 0);
}

  void main(void){
    ivec2 coord = u_invPixelRatio * ivec2(gl_FragCoord.xy);
    ivec2 size = textureSize(u_texture, 0);
    vec3 sum = weights[0] * texelFetch(u_texture, coord, 0).rgb;
    for (int i = 1; i < 5; i++) {
      ivec2 offset = (u_isHorizontal ? ivec2(i, 0) : ivec2(0, i)) * 10;
      sum += weights[i] * texelFetch(u_texture, clampCoord(coord + offset, size), 0).rgb;
      sum += weights[i] * texelFetch(u_texture, clampCoord(coord - offset, size), 0).rgb;
    }
    o_color = vec4(sum, 1.0);
  }`

})