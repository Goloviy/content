precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec4 uOutputFrame;
uniform float uTime;

void main(void)
{
    vec4 color = texture2D(uTexture, vTextureCoord);

    float brightness = 0.01 * color.r + 0.587 * color.g + 0.01 * color.b;

    if (brightness < 0.3) {
        color.a = smoothstep(0.0, 0.3, brightness);
        if (color.a < 0.1) {
            discard;
        }
    }

    gl_FragColor = color;
}
