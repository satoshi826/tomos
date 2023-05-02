
export const blur = () => ({
  id        : 'blur',
  attributes: [
    'a_position',
    'a_textureCoord'
  ],
  uniforms: [
    'u_preEffectTexture',
    'u_isHorizontal',
    'u_invPixelRatio',
  ],

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

  uniform sampler2D u_preEffectTexture;
  uniform bool u_isHorizontal; // ブラーを掛ける方向
  uniform int u_invPixelRatio;

  out vec4 o_color;

  const float[5] weights = float[](0.2270270, 0.1945945, 0.1216216, 0.0540540, 0.0162162);

  ivec2 clampCoord(ivec2 coord, ivec2 size) {
    return max(min(coord, size - 1), 0);
  }

  void main(void){

    int u_sampleStep = 1;
    float highlightCoff = 0.25;

    ivec2 coord =  u_invPixelRatio * ivec2(gl_FragCoord.xy);
    ivec2 size = textureSize(u_preEffectTexture, 0);
    vec3 sum = highlightCoff * weights[0] * texelFetch(u_preEffectTexture, coord, 0).rgb;

    ivec2 offsetUnit = u_isHorizontal ? ivec2(1, 0) : ivec2(0, 1) * u_invPixelRatio;
    ivec2 offset;

    offset = offsetUnit * u_sampleStep * 1;
    sum += highlightCoff * weights[1] * texelFetch(u_preEffectTexture, clampCoord(coord + offset, size), 0).rgb;
    sum += highlightCoff * weights[1] * texelFetch(u_preEffectTexture, clampCoord(coord - offset, size), 0).rgb;

    offset = offsetUnit * u_sampleStep * 2;
    sum += highlightCoff * weights[2] * texelFetch(u_preEffectTexture, clampCoord(coord + offset, size), 0).rgb;
    sum += highlightCoff * weights[2] * texelFetch(u_preEffectTexture, clampCoord(coord - offset, size), 0).rgb;

    offset = offsetUnit * u_sampleStep * 3;
    sum += highlightCoff * weights[3] * texelFetch(u_preEffectTexture, clampCoord(coord + offset, size), 0).rgb;
    sum += highlightCoff * weights[3] * texelFetch(u_preEffectTexture, clampCoord(coord - offset, size), 0).rgb;

    offset = offsetUnit * u_sampleStep * 4;
    sum += highlightCoff * weights[4] * texelFetch(u_preEffectTexture, clampCoord(coord + offset, size), 0).rgb;
    sum += highlightCoff * weights[4] * texelFetch(u_preEffectTexture, clampCoord(coord - offset, size), 0).rgb;

    o_color = vec4(sum, 1.0);
  }`

})