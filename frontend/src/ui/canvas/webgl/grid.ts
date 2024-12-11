import { type Core, Program } from 'glaku'

export const grid = (core: Core) =>
  new Program(core, {
    id: 'grid',
    attributeTypes: {
      a_position: 'vec2',
      a_textureCoord: 'vec2',
    },
    uniformTypes: {
      u_resolution: 'vec2',
      u_camera: 'vec3',
    },
    vert: /* glsl */ `
    out vec4 v_color;
    out vec2 v_pos;
    void main() {
      gl_Position = vec4(a_position, 1.0, 1.0);
      v_pos = a_position;
    }`,
    frag: /* glsl */ `
    out vec4 color;
    in vec2 v_pos;

    const float GRID_POWER = 2.0;
    const float GRID_WIDTH = .004;

    float log10(float x){
      return log2(x) / log2(10.0);
    }

    float grid(vec2 p, float unit, float scale){
      float unitLog = log10(unit);
      float scaleLog = log10(scale);
      float gridPower = max((GRID_POWER+unitLog-scaleLog)*.75, .0);
      float gridV = smoothstep(1.-(scale*GRID_WIDTH/unit), 1., abs(2./unit*mod(p.x,unit)-1.));
      float gridH = smoothstep(1.-(scale*GRID_WIDTH/unit), 1., abs(2./unit*mod(p.y,unit)-1.));
      return .25*gridPower*(gridV+gridH);
    }

    float getGrids(vec2 currentP, float scale){
      float grid1 = grid(currentP,1.,scale);
      float grid2 = grid(currentP,10.,scale);
      float grid3 = grid(currentP,100.,scale);
      float grid4 = grid(currentP,1000.,scale);
      float grids = grid4+grid3+grid2+grid1;
      return grids;
    }

    void main() {
      float scale = u_camera.z;
      vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
      vec2 currentP = (scale * .5 * p) + u_camera.xy;
      float grids = getGrids(currentP, scale);
      color = vec4(vec3(grids), 1.0);
    }
  `,
  })
