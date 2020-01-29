import { resize } from './CanvasHelpers';
import { setGeometry } from './GeometrySetters';
import Mat3 from './Mat3';
import { createProgram, createShader } from './ShaderHelpers';
import { IRenderContext } from './WebGLHelpers';

const translation = [257, 150];
const rotationInDegrees = -46;
const rotationInRadians = (rotationInDegrees * Math.PI) / 180;
const scale = [2.69, 1];

function main() {
    const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;

    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('No WebGL2 ☹'); // tslint:disable-line
        return;
    } else {
        console.log(`Has WebGL2 version ${gl.VERSION}`); // tslint:disable-line
    }

    // =====================================================
    //  Creating the WebGL program
    // =====================================================
    const vertSource = (require('../shaders/myShader.vert') as any).default;
    const fragSource = (require('../shaders/myShader.frag') as any).default;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

    const program = createProgram(gl, vertexShader, fragmentShader);

    // =====================================================
    //  Getting locations
    // =====================================================
    const positionLocation = gl.getAttribLocation(program, 'a_position');

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    const colorLocation = gl.getUniformLocation(program, 'u_color');

    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

    // =====================================================
    //  Setting position data
    // =====================================================
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Positions in pixels
    const numPositions = setGeometry(gl);

    // vertex array object
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionLocation);

    const size = 2; // 2 components per iteration, will set z and w to default values
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation,
        size,
        type,
        normalize,
        stride,
        offset
    );

    // =====================================================
    //  Rendering setup and actual rendering
    // =====================================================
    resize(gl.canvas as HTMLCanvasElement);

    const renderObject: IRenderContext = {
        count: numPositions / size,
        positionBuffer,
        program,
        uniformLocations: {
            color: colorLocation,
            matrix: matrixLocation,
            resolution: resolutionLocation
        },
        vao
    };

    drawScene(gl, renderObject);
}

function drawScene(gl: WebGL2RenderingContext, rc: IRenderContext): void {
    // =====================================================
    //  Resetting canvas
    // =====================================================
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program
    gl.useProgram(rc.program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(rc.vao);

    // =====================================================
    //  Setting globals for shader
    // =====================================================

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

    // =====================================================
    //  Matricies
    // =====================================================
    const translationMatrix = Mat3.translate(translation[0], translation[1]);
    const rotationMatrix = Mat3.rotation(rotationInRadians);
    const scaleMatrix = Mat3.scaling(scale[0], scale[1]);
    const moveOriginMatrix = Mat3.translate(-50, -75);

    // Multiply the matrices.
    // const matrix = Mat3.multiply(
    //     Mat3.multiply(translationMatrix, rotationMatrix),
    //     scaleMatrix
    // );

    let matrix = Mat3.identity();
    matrix = Mat3.multiply(matrix, translationMatrix);
    matrix = Mat3.multiply(matrix, rotationMatrix);
    matrix = Mat3.multiply(matrix, scaleMatrix);
    matrix = Mat3.multiply(matrix, moveOriginMatrix);

    gl.uniformMatrix3fv(rc.uniformLocations.matrix, false, matrix);

    // =====================================================
    //  Draw the things
    // =====================================================

    // Update the position buffer with rectangle positions
    gl.bindBuffer(gl.ARRAY_BUFFER, rc.positionBuffer);

    // Draw the geometry. Set in setGeometry
    const primitiveType = gl.TRIANGLES;
    const first = 0;
    gl.drawArrays(primitiveType, first, rc.count);
}

main();
