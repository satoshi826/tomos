
export const gBuffer = ({color = [0.5, 0.5, 0.5], emission = 0} = {}) => ({
  id        : 'gBuffer',
  attributes: [
    'a_position',
    'a_normal',
    'a_position_offset'
  ],
  uniforms: [
    'u_mvpMatrix',
    'u_modelMatrix',
    'u_normalMatrix',
    'u_color',
  ],
  uniformValue: {
    u_color: [...color, emission],
  },

  vert: /* glsl */`#version 300 es

  layout(location = 0) in vec3 a_position;
  layout(location = 1) in vec3 a_normal;

  uniform mat4 u_mvpMatrix;
  uniform mat4 u_modelMatrix;
  uniform mat4 u_normalMatrix;

  out vec3 v_position;
  out vec3 v_normal;

  void main(void){
    vec4 position = vec4(a_position, 1.0);
    v_position = (u_modelMatrix * position).xyz;
    v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
    gl_Position = u_mvpMatrix * position;
  }
  `,

  frag: /* glsl */`#version 300 es
  precision highp float;

  in vec3 v_position;
  in vec3 v_normal;

  layout (location = 0) out vec3 o_position;
  layout (location = 1) out vec3 o_normal;
  layout (location = 2) out vec4 o_color;

  uniform vec4 u_color;

  void main(void){
      o_position = v_position;
      o_color = u_color;
      o_normal = normalize(v_normal);
  }`

})