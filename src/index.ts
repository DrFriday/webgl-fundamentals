import { resize } from './CanvasHelpers';
import { setColors } from './ColorSetters';
import { set3dF } from './GeometrySetters';
import Mat4 from './math/Mat4';
import { createProgram, createShader } from './ShaderHelpers';
import { IRenderContext } from './WebGLHelpers';

const translation = [61, 150, 32];
const degreeToRadians = (angle: number) => (angle * Math.PI) / 180;
const rotations = [41, 10, 313].map(degreeToRadians);
const scale = [1, 1, 1];
let renderingContextData: IRenderContext;
let globalGL2: WebGL2RenderingContext;

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

    const colorLocation = gl.getAttribLocation(program, 'a_color');

    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

    // =====================================================
    //  Setup for position and color
    // =====================================================
    const size = 3; // 3 components per iteration

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

    {
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
    }

    // =====================================================
    //  Setting color data
    // =====================================================

    // create the color buffer, make it the current ARRAY_BUFFER
    // and copy in the color values
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl);

    // Turn on the attribute
    gl.enableVertexAttribArray(colorLocation);

    {
        // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
        const type = gl.UNSIGNED_BYTE; // the data is 8bit unsigned bytes
        const normalize = true; // convert from 0-255 to 0.0-1.0
        const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next color
        const offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(
            colorLocation,
            size,
            type,
            normalize,
            stride,
            offset
        );
    }

    // =====================================================
    //  Rendering setup and actual rendering
    // =====================================================
    resize(gl.canvas as HTMLCanvasElement);

    renderingContextData = {
        count: numPositions / size,
        positionBuffer,
        program,
        uniformLocations: {
            // color: colorLocation,
            matrix: matrixLocation
        },
        vao
    };

    globalGL2 = gl;

    drawScene(globalGL2, renderingContextData);

    // =====================================================
    //  Attacht listeners to user input
    // =====================================================

    // =================
    //  Translations
    // =================

    const updateTranslation = (index: number) => (ev: Event) => {
        const newValue = (ev.target as HTMLInputElement).value;
        translation[index] = parseInt(newValue, 10);
        drawScene(globalGL2, renderingContextData);
    };

    document
        .getElementById('x-translation')
        .addEventListener('input', updateTranslation(0));

    document
        .getElementById('y-translation')
        .addEventListener('input', updateTranslation(1));

    document
        .getElementById('z-translation')
        .addEventListener('input', updateTranslation(2));

    // =================
    //  Angle
    // =================

    const updateAngle = (index: number) => (ev: Event) => {
        const newValue = (ev.target as HTMLInputElement).value;
        rotations[index] = degreeToRadians(parseInt(newValue, 10));
        drawScene(globalGL2, renderingContextData);
    };

    document
        .getElementById('x-angle')
        .addEventListener('input', updateAngle(0));

    document
        .getElementById('y-angle')
        .addEventListener('input', updateAngle(1));

    document
        .getElementById('z-angle')
        .addEventListener('input', updateAngle(2));
}

function drawScene(gl: WebGL2RenderingContext, rc: IRenderContext): void {
    // =====================================================
    //  Resetting canvas
    // =====================================================
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(1, 0, 0, 0);
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // tslint:disable-line

    // Tell it to use our program
    gl.useProgram(rc.program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(rc.vao);

    // =====================================================
    //  Setting globals for shader
    // =====================================================

    // // Set a color
    // gl.uniform4f(
    //     rc.uniformLocations.color,
    //     Math.random(),
    //     Math.random(),
    //     Math.random(),
    //     1
    // );

    // =====================================================
    //  Matricies
    // https://webgl2fundamentals.org/webgl/lessons/webgl-2d-matrices.html
    // =====================================================

    // 1. Change screen to client width and height
    const left = 0;
    const right = (gl.canvas as any).clientWidth;
    const bottom = (gl.canvas as any).clientHeight;
    const top = 0;
    const near = 400;
    const far = -400;
    let matrix = Mat4.orthographic(left, right, bottom, top, near, far);

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

    // "culling" back facing triangles.
    // "Culling" in this case is a fancy word for "not drawing".
    gl.enable(gl.CULL_FACE);

    // Z-Buffer
    gl.enable(gl.DEPTH_TEST);

    // Update the position buffer with rectangle positions
    gl.bindBuffer(gl.ARRAY_BUFFER, rc.positionBuffer);

    // Draw the geometry. Set in setGeometry
    const primitiveType = gl.TRIANGLES;
    const first = 0;
    gl.drawArrays(primitiveType, first, rc.count);
}

main();
