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
