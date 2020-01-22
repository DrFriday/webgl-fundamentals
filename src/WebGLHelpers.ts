export interface IHash<T> {
    [details: string]: T;
}

export interface IRenderContext {
    vao: WebGLVertexArrayObject;
    program: WebGLProgram;
    // attributeLocations: number[];
    uniformLocations: IHash<WebGLUniformLocation>;
    count: number;
    positionBuffer: WebGLBuffer;
}

export function setGeometry(gl: WebGL2RenderingContext): number {
    const positions = [
        // // left column
        // 0,
        // 0,
        // 30,
        // 0,
        // 0,
        // 150,
        // 0,
        // 150,
        // 30,
        // 0,
        // 30,
        // 150,

        // // top rung
        // 30,
        // 0,
        // 100,
        // 0,
        // 30,
        // 30,
        // 30,
        // 30,
        // 100,
        // 0,
        // 100,
        // 30,

        // // middle rung
        // 30,
        // 60,
        // 67,
        // 60,
        // 30,
        // 90,
        // 30,
        // 90,
        // 67,
        // 60,
        // 67,
        // 90

        0,
        0,
        100,
        0,
        100,
        100
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positions.length;
}
