import { MathCore } from '../AnimatedObject/MathCore/MathCore'

export class SimpleColor {
  
  a: number
  r: number
  g: number
  b: number
  rgbAsHex: number

  constructor() {
    this.r = 1
    this.g = 1
    this.b = 1
    this.a = 1
    this.rgbAsHex = 1
  }

 

  rgbAsString() {
    return 'RGB(' + Math.floor(this.r * 255) + ', ' + Math.floor(this.g * 255) + ', ' + Math.floor(this.b * 255) + ')'
  }

  rgbaAsString() {
    let ret =
      'RGBA(' +
      Math.floor(this.r * 255) +
      ', ' +
      Math.floor(this.g * 255) +
      ', ' +
      Math.floor(this.b * 255) +
      ', ' +
      this.a +
      ')'
    return ret
  }

  compute_rgbAsHex() {
    this.rgbAsHex = Math.floor(((this.r * 255) << 16) + ((this.g * 255) << 8) + this.b * 255)
  }

  argbAsHex() {
    return Math.floor(((this.a * 255) << 24) + ((this.r * 255) << 16) + ((this.g * 255) << 8) + this.b * 255)
  }

  static Lerp(color1: SimpleColor, color2: SimpleColor, t: number): SimpleColor {
    let ret = new SimpleColor()
    let _t: number = MathCore.Clamp(t, 0, 1)
    ret.r = color1.r + (color2.r - color1.r) * _t
    ret.g = color1.g + (color2.g - color1.g) * _t
    ret.b = color1.b + (color2.b - color1.b) * _t
    ret.a = color1.a + (color2.a - color1.a) * _t
    return ret
  }

  static qLerp(target: SimpleColor, color1: SimpleColor, color2: SimpleColor, t: number) {
    let _t = MathCore.Clamp(t, 0, 1)
    target.r = color1.r + (color2.r - color1.r) * _t
    target.g = color1.g + (color2.g - color1.g) * _t
    target.b = color1.b + (color2.b - color1.b) * _t
    target.a = color1.a + (color2.a - color1.a) * _t
  }
}
