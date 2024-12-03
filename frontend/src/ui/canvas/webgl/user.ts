import {Core, Program} from 'glaku'

export const user = (core: Core) => new Program(core, {
  id            : 'user',
  attributeTypes: {a_position: 'vec2'},
  uniformTypes  : {
    u_resolution    : 'vec2',
    u_cameraPosition: 'vec3',
    u_userPosition  : 'vec2'
  },
  vert: /* glsl */ `
    out vec4 v_color;
    out vec2 v_pos;
    void main() {
      float zoom = u_cameraPosition.z/2.;
      float aspect = u_resolution.y / u_resolution.x;
      float scale = .25;
      float cZoom = clamp(zoom, 2., 6.);
      vec2 a = (1.0 < aspect) ? vec2(1.0, 1.0 / aspect) : vec2(aspect, 1.0);
      gl_Position =  vec4(a*(2.*scale*a_position.xy * (zoom/cZoom) - u_cameraPosition.xy + u_userPosition)/zoom, 1.0, 1.0);
    }`,
  frag: /* glsl */ `
    out vec4 color;
    void main() {
      color = vec4(vec3(.5,.5,1.), 1.);
    }
  `
})

