// import vertSource from 'raw-loader!glslify-loader!./res/myShader.vert';
import { resize } from './CanvasHelpers';
import { createProgram, createShader } from './ShaderHelpers';
// import temp from '../res/myShader.vert';
// import txt from 'raw-loader!../res/myShader.vert';

function main() {
    const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;

    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('No WebGL2 ☹');
    } else {
        console.log(`Has WebGL2 version ${gl.VERSION}`);
    }

    const vertSource = (require('!!raw-loader!glslify-loader!../res/myShader.vert') as any)
        .default;
    const fragSource = (require('!!raw-loader!glslify-loader!../res/myShader.frag') as any)
        .default;

    // console.log({ vertSource, fragSource });

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

    console.log(vertexShader);
    console.log(fragmentShader);

    const program = createProgram(gl, vertexShader, fragmentShader);

    console.log(program);

    const positionAttributeLocation = gl.getAttribLocation(
        program,
        'a_position'
    );

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [0, 0, 0, 0.5, 0.7, 0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // vertex array object
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const size = 2; // 2 components per iteration, will set z and w to default values
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
    );

    resize(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // Ask WebGL to execute our GLSL program
    const primitiveType = gl.TRIANGLES;
    const first = 0;
    const count = 3; // execute our shader 3 times
    gl.drawArrays(primitiveType, first, count);
}

main();
