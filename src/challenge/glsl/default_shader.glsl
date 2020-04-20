precision mediump float;

uniform float time;

void main() {
    gl_FragColor = vec4(gl_FragCoord.xy / 300.0, 1, 1);
}