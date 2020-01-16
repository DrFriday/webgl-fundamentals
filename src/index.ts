import { resize } from './CanvasHelpers';
import { randomInt } from './MathHelpers';
import { createProgram, createShader, setRectangle } from './ShaderHelpers';

function main() {
    const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;

    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('No WebGL2 ☹'); // tslint:disable-line
    } else {
        console.log(`Has WebGL2 version ${gl.VERSION}`); // tslint:disable-line
    }

    const vertSource = (require('!!raw-loader!glslify-loader!../res/myShader.vert') as any)
        .default;
    const fragSource = (require('!!raw-loader!glslify-loader!../res/myShader.frag') as any)
        .default;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(
        program,
        'a_position'
    );

    const resolutionUniformLocation = gl.getUniformLocation(
        program,
        'u_resolution'
    );

    const colorLocation = gl.getUniformLocation(program, 'u_color');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Positions in pixels
    const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
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

    // Pass in the canvas resolution so we can convert from
    // pixels to clip space in the shader
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Ask WebGL to execute our GLSL program
    const primitiveType = gl.TRIANGLES;
    const first = 0;
    const count = positions.length / size; // execute our shader 3 times
    gl.drawArrays(primitiveType, first, count);

    // draw 50 random rectangles in random colors
    for (let ii = 0; ii < 50; ++ii) {
        // Put a rectangle in the position buffer
        setRectangle(
            gl,
            randomInt(300),
            randomInt(300),
            randomInt(300),
            randomInt(300)
        );

        // Set a random color.
        gl.uniform4f(
            colorLocation,
            Math.random(),
            Math.random(),
            Math.random(),
            1
        );

        // Draw the rectangle.
        const primitiveType = gl.TRIANGLES;
        const first = 0;
        const count = 6;
        gl.drawArrays(primitiveType, first, count);
    }
}

main();
