
export const compose = () => ({
  id        : 'composer',
  attributes: [
    'a_position',
    'a_textureCoord'
  ],
  uniforms: [
    'u_preEffectTexture',
    'u_blurTexture1',
    'u_blurTexture2',
    'u_blurTexture3',
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
  uniform sampler2D u_blurTexture1;
  uniform sampler2D u_blurTexture2;
  uniform sampler2D u_blurTexture3;

  out vec4 o_color;

  void main(void){

    vec3 preEffect = texture(u_preEffectTexture, v_uv).rgb;
    vec3 blur1 = texture(u_blurTexture1, v_uv).rgb;
    vec3 blur2 = texture(u_blurTexture2, v_uv).rgb;
    vec3 blur3 = texture(u_blurTexture3, v_uv).rgb;

    vec3 toneMapPreEffect = preEffect / (1.0 + preEffect);

    vec3 bloom =  (1.0 * blur1 + 2.0 * blur2 + 0.25 * blur3);
    vec3 toneMapPreBloom = bloom / (1.0 + bloom);

    o_color = vec4(toneMapPreEffect + toneMapPreBloom + 0.01, 1.0);
  }`

})