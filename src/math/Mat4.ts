export default class Mat4 {
    /**
     * Muliply two 4x4 matricies together.
     */
    public static multiply(a: number[], b: number[]) {
        const b00 = b[0 * 4 + 0];
        const b01 = b[0 * 4 + 1];
        const b02 = b[0 * 4 + 2];
        const b03 = b[0 * 4 + 3];
        const b10 = b[1 * 4 + 0];
        const b11 = b[1 * 4 + 1];
        const b12 = b[1 * 4 + 2];
        const b13 = b[1 * 4 + 3];
        const b20 = b[2 * 4 + 0];
        const b21 = b[2 * 4 + 1];
        const b22 = b[2 * 4 + 2];
        const b23 = b[2 * 4 + 3];
        const b30 = b[3 * 4 + 0];
        const b31 = b[3 * 4 + 1];
        const b32 = b[3 * 4 + 2];
        const b33 = b[3 * 4 + 3];
        const a00 = a[0 * 4 + 0];
        const a01 = a[0 * 4 + 1];
        const a02 = a[0 * 4 + 2];
        const a03 = a[0 * 4 + 3];
        const a10 = a[1 * 4 + 0];
        const a11 = a[1 * 4 + 1];
        const a12 = a[1 * 4 + 2];
        const a13 = a[1 * 4 + 3];
        const a20 = a[2 * 4 + 0];
        const a21 = a[2 * 4 + 1];
        const a22 = a[2 * 4 + 2];
        const a23 = a[2 * 4 + 3];
        const a30 = a[3 * 4 + 0];
        const a31 = a[3 * 4 + 1];
        const a32 = a[3 * 4 + 2];
        const a33 = a[3 * 4 + 3];
        const dst = [];
        dst[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        dst[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        dst[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        dst[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        dst[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        dst[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        dst[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        dst[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        dst[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        dst[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
        return dst;
    }

    public static translate(
        m: number[],
        tx: number,
        ty: number,
        tz: number
    ): number[] {
        return Mat4.multiply(m, Mat4.translation(tx, ty, tz));
    }

    public static xRotate(m: number[], angleInRadians: number): number[] {
        return Mat4.multiply(m, Mat4.xRotation(angleInRadians));
    }

    public static yRotate(m: number[], angleInRadians: number): number[] {
        return Mat4.multiply(m, Mat4.yRotation(angleInRadians));
    }

    public static zRotate(m: number[], angleInRadians: number): number[] {
        return Mat4.multiply(m, Mat4.zRotation(angleInRadians));
    }

    public static scale(
        m: number[],
        sx: number,
        sy: number,
        sz: number
    ): number[] {
        return Mat4.multiply(m, Mat4.scaling(sx, sy, sz));
    }

    public static identity(): number[] {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }

    /**
     * DEPRECEATED - depth
     * @param width Width
     * @param height Height
     * @param depth Depth
     */
    public static projection(
        width: number,
        height: number,
        depth: number
    ): number[] {
        // Note: This matrix flips the Y axis so that 0 is at the top.
        return [
            2 / width,
            0,
            0,
            0,
            0,
            -2 / height,
            0,
            0,
            0,
            0,
            2 / depth,
            0,
            -1,
            1,
            0,
            1
        ];
    }

    public static orthographic(
        left: number,
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number
    ) {
        return [
            2 / (right - left),
            0,
            0,
            0,
            0,
            2 / (top - bottom),
            0,
            0,
            0,
            0,
            2 / (near - far),
            0,

            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1
        ];
    }

    public static perspective(
        fieldOfViewInRadians: number,
        aspect: number,
        near: number,
        far: number
    ): number[] {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        const rangeInv = 1.0 / (near - far);

        return [
            f / aspect,
            0,
            0,
            0,
            0,
            f,
            0,
            0,
            0,
            0,
            (near + far) * rangeInv,
            -1,
            0,
            0,
            near * far * rangeInv * 2,
            0
        ];
    }

    private static translation(tx: number, ty: number, tz: number): number[] {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
    }

    private static xRotation(angleInRadians: number): number[] {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
    }

    private static yRotation(angleInRadians: number): number[] {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
    }

    private static zRotation(angleInRadians: number): number[] {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }

    private static scaling(sx: number, sy: number, sz: number): number[] {
        return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
    }
}
