const SAMPLE_RATIO = 2;

class ShaderWrapper {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    shader: WebGLShader;
    resUniform: WebGLUniformLocation;
    timeUniform: WebGLUniformLocation;
    resolution: [number, number];

    constructor(canvas: HTMLCanvasElement, rawShader: string) {
        this.canvas = canvas;
        const resolution = canvas.getBoundingClientRect()
        this.resolution = [resolution.width, resolution.height];
        
        this.canvas.width = this.resolution[0] * SAMPLE_RATIO;
        this.canvas.height = this.resolution[1] * SAMPLE_RATIO;
        window.addEventListener('resize', (_) => {
            const resolution = canvas.getBoundingClientRect()
            this.resolution = [resolution.width, resolution.height];
            this.canvas.width = resolution.width * SAMPLE_RATIO;
            this.canvas.height = resolution.height * SAMPLE_RATIO;
        })

        this.gl = canvas.getContext('webgl');
        if (this.gl == null) {
            throw 'Could not initialize webgl context';
        }
        
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        const frag = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(frag, rawShader);
        this.gl.compileShader(frag);
        if (!this.gl.getShaderParameter(frag, this.gl.COMPILE_STATUS)) {
            throw this.gl.getShaderInfoLog(frag);
        }

        const vert = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vert, `#version 100
        attribute vec4 aVertexPosition;
        void main() {
        gl_Position = aVertexPosition;
        }`);
        this.gl.compileShader(vert);
        if (!this.gl.getShaderParameter(vert, this.gl.COMPILE_STATUS)) {
            throw this.gl.getShaderInfoLog(vert);
        }

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vert);
        this.gl.attachShader(this.program, frag);
        this.gl.linkProgram(this.program);

        const vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        const vertices = new Uint8Array([
          1,
          -1,
          0,
          1,
          1,
          0,
          -1,
          -1,
          0,
          -1,
          1,
          0
        ]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const loc = this.gl.getAttribLocation(this.program, 'aVertexPosition');
        this.gl.vertexAttribPointer(loc, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(loc);
        this.resUniform = this.gl.getUniformLocation(this.program, 'res');
        this.timeUniform = this.gl.getUniformLocation(this.program, 'time');

        this.draw();
    }

    draw() {
        const viewport_size = [this.resolution[0] * SAMPLE_RATIO, this.resolution[1] * SAMPLE_RATIO];
        this.gl.viewport(0, 0, viewport_size[0], viewport_size[1]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);
        this.gl.uniform2f(this.resUniform, viewport_size[0], viewport_size[1]);
        this.gl.uniform1f(this.timeUniform, new Date().getSeconds());
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        window.requestAnimationFrame(this.draw);
    }
}