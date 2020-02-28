const SAMPLE_RATIO = 2;

class ShaderWrapper {
    public canvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;
    public program: WebGLProgram;
    public shader: WebGLShader;

    public resUniform: WebGLUniformLocation;
    public timeUniform: WebGLUniformLocation;
    public resolution: [number, number];

    constructor(canvas: HTMLCanvasElement, rawShader: string) {
        this.canvas = canvas;
        const resolution = canvas.getBoundingClientRect();
        this.resolution = [resolution.width, resolution.height];

        this.canvas.width = this.resolution[0] * SAMPLE_RATIO;
        this.canvas.height = this.resolution[1] * SAMPLE_RATIO;
        window.addEventListener('resize', (_) => {
            const newResolution = canvas.getBoundingClientRect();
            this.resolution = [newResolution.width, newResolution.height];
            this.canvas.width = newResolution.width * SAMPLE_RATIO;
            this.canvas.height = newResolution.height * SAMPLE_RATIO;
        });

        this.gl = canvas.getContext('webgl')!;
        if (this.gl == null) {
            throw new Error('Could not initialize webgl context');
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.shader = this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
        this.gl.shaderSource(this.shader, rawShader);
        this.gl.compileShader(this.shader);
        if (!this.gl.getShaderParameter(this.shader, this.gl.COMPILE_STATUS)) {
            throw this.gl.getShaderInfoLog(this.shader);
        }

        const vert = this.gl.createShader(this.gl.VERTEX_SHADER)!;
        this.gl.shaderSource(vert, `#version 100
        attribute vec4 aVertexPosition;
        void main() {
        gl_Position = aVertexPosition;
        }`);
        this.gl.compileShader(vert);
        if (!this.gl.getShaderParameter(vert, this.gl.COMPILE_STATUS)) {
            throw this.gl.getShaderInfoLog(vert);
        }

        this.program = this.gl.createProgram()!;
        this.gl.attachShader(this.program, vert);
        this.gl.attachShader(this.program, this.shader);
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
            0,
        ]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const loc = this.gl.getAttribLocation(this.program, 'aVertexPosition');
        this.gl.vertexAttribPointer(loc, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(loc);
        this.resUniform = this.gl.getUniformLocation(this.program, 'res')!;
        this.timeUniform = this.gl.getUniformLocation(this.program, 'time')!;

        this.draw();
    }

    public draw() {
        const viewportSize = [this.resolution[0] * SAMPLE_RATIO, this.resolution[1] * SAMPLE_RATIO];
        this.gl.viewport(0, 0, viewportSize[0], viewportSize[1]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);
        this.gl.uniform2f(this.resUniform, viewportSize[0], viewportSize[1]);
        this.gl.uniform1f(this.timeUniform, new Date().getSeconds());
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        window.requestAnimationFrame(this.draw.bind(this));
    }

    public updateShader(newShaderText: string) {
        this.gl.detachShader(this.program, this.shader);
        const newShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
        this.gl.shaderSource(newShader, newShaderText);
        this.gl.compileShader(newShader);
        if (!this.gl.getShaderParameter(newShader, this.gl.COMPILE_STATUS)) {
            window.alert(this.gl.getShaderInfoLog(newShader));
            return;
        }
        this.gl.attachShader(this.program, newShader);
        this.gl.linkProgram(this.program);
        this.resUniform = this.gl.getUniformLocation(this.program, 'res')!;
        this.timeUniform = this.gl.getUniformLocation(this.program, 'time')!;
        this.shader = newShader;
    }
}
