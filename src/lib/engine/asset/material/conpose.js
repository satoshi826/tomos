
export const compose = () => ({
  id        : 'composer',
  attributes: [
    'a_position',
    'a_textureCoord'
  ],
  uniforms: [
    'u_preEffectTexture',
    'u_blurTexture'
  ],

  vert: /* glsl */`#version 300 es

  layout(location = 0) in vec3 a_position;
  layout(location = 3) in vec2 a_textureCoord;

  out vec2 v_uv;

  void main(void){
    v_uv  = a_textureCoord;
    gl_Position = vec4(a_position, 1.0);
  }
  `,

  frag: /* glsl */`#version 300 es
  precision highp float;

  in vec2 v_uv;

  uniform sampler2D u_preEffectTexture;
  uniform sampler2D u_blurTexture;

  out vec4 o_color;

  void main(void){

    vec3 preEffect = texture(u_preEffectTexture, v_uv).rgb;
    vec3 blur = texture(u_blurTexture, v_uv).rgb;

    o_color = vec4(preEffect + blur, 1.0);
    // o_color = vec4(gammaCorrection, 1.0);

  }`

})