// GLSL ES 3.00 sources for the hero particle field.
// Simulation runs entirely on the GPU via transform feedback:
// positions/velocities ping-pong between buffer pairs, the fragment
// stage never sees the physics.

export const UPDATE_VS = /* glsl */ `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_pos;
layout(location = 1) in vec2 a_vel;
layout(location = 2) in vec2 a_target;
layout(location = 3) in float a_seed;

uniform float u_dt;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_mouseActive;
uniform float u_scatter;
uniform float u_aspect;
uniform vec4  u_pulse; // xy: center (clip), z: age (s), w: strength

out vec2 v_pos;
out vec2 v_vel;

void main() {
  float dtN = clamp(u_dt * 60.0, 0.25, 2.0);
  vec2 pos = a_pos;
  vec2 vel = a_vel;

  // Spring toward the glyph target. Scroll melts the grip away.
  float grip = mix(0.016, 0.0004, u_scatter);
  vec2 acc = (a_target - pos) * grip;

  // Per-particle wander; becomes turbulence once scattered.
  float t = u_time * 0.6 + a_seed * 6.2831853;
  float wander = mix(0.00012, 0.0032, u_scatter);
  acc += vec2(sin(t + pos.y * 3.0), cos(t * 1.37 + pos.x * 3.0)) * wander;

  // Pointer repulsion, aspect-corrected so the field is circular.
  vec2 d = (pos - u_mouse) * vec2(u_aspect, 1.0);
  float r2 = dot(d, d);
  float push = u_mouseActive * exp(-r2 / 0.0484) * 0.016;
  acc += normalize(d + 1e-6) * push;

  // Click shockwave: an expanding gaussian ring.
  vec2 pd = (pos - u_pulse.xy) * vec2(u_aspect, 1.0);
  float pl = length(pd);
  float ring = exp(-pow((pl - u_pulse.z * 1.7) * 9.0, 2.0));
  acc += normalize(pd + 1e-6) * ring * u_pulse.w * 0.05;

  vel = (vel + acc * dtN) * pow(0.90, dtN);
  float sp = length(vel);
  if (sp > 0.028) vel *= 0.028 / sp;
  pos += vel * dtN;

  v_pos = pos;
  v_vel = vel;
  gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // rasterizer is discarded
  gl_PointSize = 1.0;
}
`;

export const UPDATE_FS = /* glsl */ `#version 300 es
precision highp float;
out vec4 o;
void main() { o = vec4(0.0); }
`;

export const RENDER_VS = /* glsl */ `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_pos;
layout(location = 1) in vec2 a_vel;
layout(location = 2) in float a_seed;

uniform float u_dpr;
uniform float u_scatter;

out float v_speed;
out float v_seed;

void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  float base = 1.05 + a_seed * 1.55;
  gl_PointSize = (base + u_scatter * 0.7) * u_dpr;
  v_speed = length(a_vel);
  v_seed = a_seed;
}
`;

export const RENDER_FS = /* glsl */ `#version 300 es
precision highp float;

in float v_speed;
in float v_seed;
out vec4 o;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.12, length(p));

  vec3 bone = vec3(0.93, 0.91, 0.87);
  vec3 warm = vec3(1.00, 0.72, 0.01);
  vec3 cool = vec3(0.35, 0.78, 0.95);

  vec3 col = bone;
  if (v_seed < 0.14) col = warm;
  else if (v_seed > 0.92) col = cool;

  // Fast particles run hot.
  float energy = clamp(v_speed * 110.0, 0.0, 1.0);
  col = mix(col * 0.95, col * 1.55, energy);

  o = vec4(col, a * 0.9);
}
`;
