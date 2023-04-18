
export const basic = ({color = [0.5, 0.5, 0.5, 1.0]} = {}) => ({
  id        : 'basic',
  attributes: [
    'a_position',
  ],
  uniform: [
    'u_mvpMatrix',
    'u_color'
  ],
  uniformValue: {
    u_color: color
  },

  vert: /* glsl */`#version 300 es
  layout(location = 0) in vec3 a_position;
  uniform mat4 u_mvpMatrix;
  void main(void){
    gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
  }
  `,

  frag: /* glsl */`#version 300 es

  precision highp float;
  uniform   vec4 u_color;
  out vec4 outColor;
  void main(void){
      outColor = u_color;
  }`

})