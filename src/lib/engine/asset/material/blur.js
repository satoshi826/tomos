
export const blur = () => ({
  id        : 'blur',
  attributes: [
    'a_position',
    'a_textureCoord'
  ],
  uniform: [
    'u_texture',
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
  uniform sampler2D u_texture;
  out vec4 outColor;
  void main(void){
    vec4 smpColor = texture(u_texture, v_textureCoord);
    outColor  = vec4(smpColor.rrra);
  }`

})