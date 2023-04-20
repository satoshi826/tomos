
export const deffered = () => ({
  id        : 'deffered',
  attributes: [
    'a_position',
    'a_textureCoord'
  ],
  uniforms: [
    'u_texture0',
    'u_texture1',
    'u_texture2',
    'u_pointLightNum',
    'u_pointLightPosition'
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

    #define MAX_LIGHTS 500

    precision highp float;

    in vec2 v_textureCoord;

    uniform sampler2D u_texture0;
    uniform sampler2D u_texture1;
    uniform sampler2D u_texture2;

    uniform vec3 u_pointLightPosition[MAX_LIGHTS];
    uniform int  u_pointLightNum;

    out vec4 outColor;

    void main(void){

      vec4 smpColor0 = texture(u_texture0, v_textureCoord);
      vec4 smpColor1 = texture(u_texture1, v_textureCoord);
      vec4 smpColor2 = texture(u_texture2, v_textureCoord);

      outColor  = vec4(smpColor0.r, smpColor0.g, smpColor0.b,  1.0);
    }`

})