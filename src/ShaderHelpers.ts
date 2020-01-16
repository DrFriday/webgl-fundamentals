export function createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
): WebGLShader {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);

    return undefined;
}

// export function createProgram(gl: WebGL2RenderingContext, vertexShader);