export const grainShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0.0 },
    uGrainIntensity: { value: 0.5 },
    uGrainSize: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrainIntensity;
    uniform float uGrainSize;

    void main() {
      vec2 uv = vUv;

      // Create grain effect
      vec2 grain = vec2(
        fract(sin(dot(uv * 100.0, vec2(12.9898, 78.233))) * 43758.5453),
        fract(sin(dot(uv * 100.0, vec2(37.582, 23.140))) * 43758.5453)
      );

      grain = (grain - 0.5) * uGrainIntensity;
      vec4 color = texture2D(tDiffuse, uv + grain * uGrainSize);

      gl_FragColor = color;
    }
  `,
};
