import { resize } from './CanvasHelpers';
import { set3dF, setGeometry } from './GeometrySetters';
import Mat3 from './math/Mat3';
import Mat4 from './math/Mat4';
import { createProgram, createShader } from './ShaderHelpers';
import { IRenderContext } from './WebGLHelpers';

const translation = [45, 150, 0];
const degreeToRadians = (angle: number) => (angle * Math.PI) / 180;
const rotations = [32, 25, 328].map(degreeToRadians);
const scale = [1.23, 1, 1];

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

    const colorLocation = gl.getUniformLocation(program, 'u_color');

    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

    // =====================================================
    //  Setting position data
    // =====================================================
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Positions in pixels
    const numPositions = set3dF(gl);

    // vertex array object
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionLocation);

    const size = 3; // 2 components per iteration, will set z and w to default values
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
            matrix: matrixLocation
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
    gl.clearColor(1, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program
    gl.useProgram(rc.program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(rc.vao);

    // =====================================================
    //  Setting globals for shader
    // =====================================================

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
    // https://webgl2fundamentals.org/webgl/lessons/webgl-2d-matrices.html
    // =====================================================

    // 1. Change screen to client width and height
    let matrix = Mat4.projection(
        (gl.canvas as any).clientWidth,
        (gl.canvas as any).clientHeight,
        400
    );

    // 2. Move grid to new point
    matrix = Mat4.translate(
        matrix,
        translation[0],
        translation[1],
        translation[2]
    );

    // 3. Rotate the grid
    // matrix = Mat4.rotate(matrix, rotationInRadians);
    matrix = Mat4.xRotate(matrix, rotations[0]);
    matrix = Mat4.yRotate(matrix, rotations[1]);
    matrix = Mat4.zRotate(matrix, rotations[2]);

    // 4. Scale grid
    matrix = Mat4.scale(matrix, scale[0], scale[1], scale[2]);

    // 5. Set the grid!
    gl.uniformMatrix4fv(rc.uniformLocations.matrix, false, matrix);

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
