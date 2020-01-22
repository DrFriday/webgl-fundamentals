import { resize } from './CanvasHelpers';
import { setGeometry } from './GeometrySetters';
import { randomInt } from './MathHelpers';
import { createProgram, createShader } from './ShaderHelpers';
import { IRenderContext } from './WebGLHelpers';

const translation = [100, 100];
const width = 100;
const height = 30;

function main() {
    const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;

    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('No WebGL2 ☹'); // tslint:disable-line
    } else {
        console.log(`Has WebGL2 version ${gl.VERSION}`); // tslint:disable-line
    }

    const vertSource = (require('../shaders/myShader.vert') as any).default;
    const fragSource = (require('../shaders/myShader.frag') as any).default;

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

    const translationLocation = gl.getUniformLocation(program, 'u_translation');

    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Positions in pixels
    const numPositions = setGeometry(gl);

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

    const renderObject: IRenderContext = {
        // attributeLocations: [positionAttributeLocation],
        count: numPositions / size,
        positionBuffer,
        program,
        uniformLocations: {
            color: colorLocation,
            resolution: resolutionUniformLocation,
            translation: translationLocation
        },
        vao
    };

    drawScene(gl, renderObject);
}

function drawScene(gl: WebGL2RenderingContext, rc: IRenderContext): void {
    // Begin refactor
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program
    gl.useProgram(rc.program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(rc.vao);

    // Pass in the canvas resolution so we can convert from
    // pixels to clip space in the shader
    gl.uniform2f(
        rc.uniformLocations.resolution,
        gl.canvas.width,
        gl.canvas.height
    );

    // Set a color
    gl.uniform4f(
        rc.uniformLocations.color,
        Math.random(),
        Math.random(),
        Math.random(),
        1
    );

    // Set the translation
    gl.uniform2fv(rc.uniformLocations.translation, translation);

    // Update the position buffer with rectangle positions
    gl.bindBuffer(gl.ARRAY_BUFFER, rc.positionBuffer);
    // setRectangle(gl, translation[0], translation[1], width, height);

    // // Ask WebGL to execute our GLSL program
    const primitiveType = gl.TRIANGLES;
    const first = 0;
    gl.drawArrays(primitiveType, first, rc.count);
}

main();
