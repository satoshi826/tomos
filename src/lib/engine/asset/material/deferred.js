
export const deferred = () => ({
  id        : 'deferred',
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
    'u_pointLightPosition'
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
    uniform int  u_pointLightNum;

    in vec2 v_uv;

    out vec4 o_color;

    void main(void){
      float specIntensity = 50.0;

      vec3 albedo = texture(u_colorTexture, v_uv).xyz;
      vec3 position = texture(u_positionTexture, v_uv).xyz;
      vec3 normal = texture(u_normalTexture, v_uv).xyz;

      vec3 viewDir = normalize(u_cameraPosition - position);

      vec3 lightDir;
      vec3 reflectDir;

      vec3 diffuse = vec3(0.0);
      vec3 specular = vec3(0.0);

      for(int i = 0; i < u_pointLightNum+1; i++){
        lightDir = normalize(u_pointLightPosition[i] - position);
        reflectDir = reflect(-lightDir, normal);
        diffuse += albedo * max(0.0, dot(lightDir, normal));
        specular +=  albedo * pow(max(0.0, dot(viewDir, reflectDir)), specIntensity);
      }

      // o_color = vec4(diffuse + specular, 1.0);
      o_color = vec4(diffuse + specular, 1.0);
      // o_color = vec4(diffuse + specular, 1.0);
      // o_color = vec4(albedo, 1.0);
    }`

})