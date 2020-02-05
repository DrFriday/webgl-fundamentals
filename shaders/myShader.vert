#version 300 es

in vec4 a_position;

uniform mat4 u_matrix;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
}