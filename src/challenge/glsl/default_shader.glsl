precision mediump float;

uniform float time;

const float S = 0.5;

void main() {
    vec2 reg = (vec2(gl_FragCoord.x / 2.0, gl_FragCoord.y / 2.0)
        - vec2(800, 510))
        / (500.0 + 100.0*sin(0.5 * time)*sin(0.37 * time)*cos(0.75 * time));
    float dist = pow(
        0.29 * pow(reg.x, 4.0) +
        0.4 * pow(reg.y, 4.0),
        0.25
    ) / (1.5 * pow(
        0.33 * pow(reg.x - 0.1, 4.0) +
        0.4 * pow(reg.y - 0.1, 4.0),
        0.25
    )) * 0.75;
    gl_FragColor = vec4(S - dist, S - dist, S - dist, 1);
}