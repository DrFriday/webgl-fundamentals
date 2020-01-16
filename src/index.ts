// import vertSource from 'raw-loader!glslify-loader!./res/myShader.vert';
import { createShader } from './ShaderHelpers';

function main() {
    const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;

    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('No WebGL2 ☹');
    } else {
        console.log(`Has WebGL2 version ${gl.VERSION}`);
    }

    const vertSource = (require('raw-loader!glslify-loader!../res/myShader.vert') as any)
        .default;
    const fragSource = (require('raw-loader!glslify-loader!../res/myShader.frag') as any)
        .default;

    console.log({ vertSource, fragSource });

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

    console.log(vertexShader);
    console.log(fragmentShader);
}

main();
