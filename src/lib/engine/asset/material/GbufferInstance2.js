
export const gBufferInstance = ({color = [0.5, 0.5, 0.5]} = {}) => ({
  id        : 'gBufferInstance2',
  attributes: [
    'a_position',
    'a_normal'
  ],
  uniforms           : ['u_vpMatrix'],
  instancedAttributes: [
    'a_instance_color',
    'a_instance_modelMatrix',
    'a_instance_normalMatrix'
  ],
  instancedValue: {
    a_instance_color: color
  },
  vert: /* glsl */`#version 300 es

  layout(location = 0) in vec3 a_position;
  layout(location = 1) in vec3 a_normal;
  layout(location = 4) in vec3 a_instance_color;
  layout(location = 5) in mat4 a_instance_modelMatrix;
  layout(location = 9) in mat4 a_instance_normalMatrix;

  uniform mat4 u_vpMatrix;

  out vec3 v_position;
  out vec3 v_normal;
  out vec3 v_color;

  void main(void){
    vec4 position = vec4(a_position, 1.0);
    v_position = (a_instance_modelMatrix * position).xyz;
    v_normal = (a_instance_normalMatrix * vec4(a_normal, 0.0)).xyz;
    v_color = a_instance_color;
    gl_Position = u_vpMatrix * a_instance_modelMatrix * position;
  }
  `,

  frag: /* glsl */`#version 300 es
  precision highp float;

  in vec3 v_position;
  in vec3 v_normal;
  in vec3 v_color;

  layout (location = 0) out vec3 o_position;
  layout (location = 1) out vec3 o_normal;
  layout (location = 2) out vec4 o_color;

  void main(void){
      o_position = v_position;
      o_color = vec4(v_color, 1.0);
      o_normal = normalize(v_normal);
  }`

})