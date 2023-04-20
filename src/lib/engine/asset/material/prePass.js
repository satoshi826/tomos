
export const prePass = ({color = [0.5, 0.5, 0.5, 1.0]} = {}) => ({
  id        : 'prePass',
  attributes: [
    'a_position',
    'a_normal'
  ],
  uniforms: [
    'u_mvpMatrix',
    'u_color',
    'u_normalMatrix'
  ],
  uniformValue: {
    u_color: color
  },

  vert: /* glsl */`#version 300 es

  layout(location = 0) in vec3 a_position;
  layout(location = 1) in vec3 a_normal;

  uniform mat4 u_mvpMatrix;

  out vec3 v_position;
  out vec3 v_normal;

  void main(void){
    vec4 position = vec4(a_position, 1.0);
    v_position = a_position;
    v_normal = a_normal;
    gl_Position = u_mvpMatrix * position;
  }
  `,

  frag: /* glsl */`#version 300 es
  precision highp float;

  in vec3 v_position;
  in vec3 v_normal;

  layout (location = 0) out vec4 outColor0;
  layout (location = 1) out vec4 outColor1;
  layout (location = 2) out vec4 outColor2;

  uniform   vec4 u_color;

  void main(void){
      outColor0 = u_color;
      outColor1 = vec4(v_position, 1.0);
      outColor2 = vec4(v_normal, 1.0);
  }`

})