// Fills the buffer with the values that define a rectangle.
export function setRectangle(gl, x, y, width, height) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
    // whatever buffer is bound to the `ARRAY_BUFFER` bind point
    // but so far we only have one buffer. If we had more than one
    // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
        gl.STATIC_DRAW
    );
}

export function setGeometry(gl: WebGL2RenderingContext): number {
    const positions = [
        // left column
        0,
        0,
        30,
        0,
        0,
        150,
        0,
        150,
        30,
        0,
        30,
        150,

        // top rung
        30,
        0,
        100,
        0,
        30,
        30,
        30,
        30,
        100,
        0,
        100,
        30,

        // middle rung
        30,
        60,
        67,
        60,
        30,
        90,
        30,
        90,
        67,
        60,
        67,
        90

        // 0,
        // 0,
        // 100,
        // 0,
        // 100,
        // 100
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positions.length;
}
