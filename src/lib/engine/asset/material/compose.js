
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
    'u_depthTexture',
    'u_near',
    'u_far'
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
  uniform sampler2D u_depthTexture;
  uniform float u_near;
  uniform float u_far;

  out vec4 o_color;

  float convertToLinearDepth(float d, float near, float far){
    return (2.0 * near) / (far + near - d * (far - near));
  }

  void main(void){

    vec3 preEffect = texture(u_preEffectTexture, v_uv).rgb;
    vec3 blur1 = texture(u_blurTexture1, v_uv).rgb;
    vec3 blur2 = texture(u_blurTexture2, v_uv).rgb;
    vec3 blur3 = texture(u_blurTexture3, v_uv).rgb;
    float depth = texture(u_depthTexture, v_uv).x;

    float depthLinear = convertToLinearDepth(depth, u_near, u_far);
    vec3 fog = vec3(0.3, 0.3, 0.3);

    float target = 0.12;

    float dofPower = depthLinear-target;
    dofPower = (dofPower < 0.0) ? 100.0 * -dofPower : 4.0 * dofPower;
    float dofPowerNormal =  dofPower / (1.0 + dofPower);

    vec3 toneMapBlur = blur1 / (1.0 + blur1);

    vec3 toneMapPreEffect = preEffect / (1.0 + preEffect);
    vec3 bloom = 0.055 * (1.0 * blur1 + 1.5 * blur2 + 0.25 * blur3);
    vec3 toneMapPreBloom = bloom / (1.0 + bloom);
    vec3 outputBase = (toneMapPreEffect + toneMapPreBloom) + 0.02;
    vec3 outputDof = dofPowerNormal * toneMapBlur + (1.0 - dofPowerNormal) * outputBase;
    vec3 outputC = mix(outputBase, toneMapBlur, dofPowerNormal);
    vec3 outputFog = mix(outputC, fog, depthLinear * 0.5);

    o_color = vec4(outputFog, 1.0);
    // o_color = vec4(vec3(depthLinear), 1.0);
    // o_color = vec4(depthLinear*(toneMapPreEffect + toneMapPreBloom) + 0.01, 1.0);
    // o_color = vec4(vec3(depthLinear), 1.0);
  }`

})