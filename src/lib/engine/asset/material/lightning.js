
export const lightning = () => ({
  id        : 'lightning',
  attributes: [
    'a_position',
    'a_textureCoord'
  ],
  uniforms: [
    'u_positionTexture',
    'u_normalTexture',
    'u_colorTexture',
    'u_cameraPosition',
    'u_pointLightNum',
    'u_pointLightPosition',
    'u_pointLightIntensity',
    'u_pointLightExponent'
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
    #define MAX_LIGHTS 200

    uniform sampler2D u_positionTexture;
    uniform sampler2D u_normalTexture;
    uniform sampler2D u_colorTexture;

    uniform vec3 u_cameraPosition;
    uniform vec3 u_pointLightPosition[MAX_LIGHTS];
    uniform float u_pointLightIntensity[MAX_LIGHTS];
    uniform float u_pointLightExponent[MAX_LIGHTS];

    uniform int  u_pointLightNum;

    in vec2 v_uv;

    layout (location = 0) out vec4 o_deferred;

    void main(void){
      float specIntensity = 40.0;

      vec4 color = texture(u_colorTexture, v_uv);
      vec3 albedo = color.xyz;
      vec3 emission = 10.0 * (color.w) * normalize(albedo);

      vec3 position = texture(u_positionTexture, v_uv).xyz;
      vec3 normal = texture(u_normalTexture, v_uv).xyz;

      if (albedo == vec3(0.0)) {
        discard;
      }

      vec3 viewDir = normalize(u_cameraPosition - position);

      vec3 lightDir;
      float lightDis;
      float lightDecay;
      float lightPower;
      vec3  reflectDir;

      vec3 diffuse = vec3(0.0);
      vec3 specular = vec3(0.0);

      for(int i = 0; i < u_pointLightNum+1; i++){
        lightDir = normalize(u_pointLightPosition[i] - position);
        lightDis = distance(u_pointLightPosition[i], position);
        reflectDir = reflect(-lightDir, normal);
        lightDecay = (u_pointLightExponent[i] > 0.001) ? pow(lightDis, -u_pointLightExponent[i]) : 1.0;
        lightPower = u_pointLightIntensity[i] * lightDecay;
        diffuse += lightPower * albedo * max(0.0, dot(lightDir, normal));
        specular += lightPower * albedo * pow(max(0.0, dot(viewDir, reflectDir)), specIntensity);
      }

      vec3 raw = diffuse + 10.0 * specular + emission;
      o_deferred = vec4(raw, 1.0);
      // o_deferred = vec4(position, 1.0);
      // o_deferred = vec4(0.7);
    }`

})