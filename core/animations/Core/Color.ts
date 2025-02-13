import { MathCore } from 'Core/animations/MathCore/MathCore'

export class Color {
  _r: number
  _g: number
  _b: number
  a: number
  r: number = 255
  g: number = 255
  b: number = 255
  rgbAsHex: number

  constructor() {
    this._r = 0
    this._g = 0
    this._b = 0
    this.a = 0
    this.rgbAsHex = 0
  }

  // deserialize(source: any): void {
  //   const c = source['c']
  //   const sColorLen = c.length
  //
  //   if (sColorLen == 1)
  //     switch (c) {
  //       case 'w':
  //         this._r = 1
  //         this._g = 1
  //         this._b = 1
  //         this.a = 1
  //         break
  //       case 'k':
  //         this._r = 0
  //         this._g = 0
  //         this._b = 0
  //         this.a = 1
  //         break
  //       case 'r':
  //         this._r = 1
  //         this._g = 0
  //         this._b = 0
  //         this.a = 1
  //         break
  //       case 'g':
  //         this._r = 0
  //         this._g = 1
  //         this._b = 0
  //         this.a = 1
  //         break
  //       case 'b':
  //         this._r = 0
  //         this._g = 0
  //         this._b = 1
  //         this.a = 1
  //         break
  //     }
  //   else if (sColorLen >= 6) {
  //     this._r = MathCore.Lerp(0, 1, parseInt(c.substring(0, 2), 16) / 255)
  //     this._g = MathCore.Lerp(0, 1, parseInt(c.substring(2, 4), 16) / 255)
  //     this._b = MathCore.Lerp(0, 1, parseInt(c.substring(4, 6), 16) / 255)
  //     if (sColorLen == 6) this.a = 1
  //     else this.a = MathCore.Lerp(0, 1, parseInt(c.substring(6, 8), 16) / 255)
  //   }
  //   this.compute_rgbAsHex()
  // }

  rgbAsString(): string {
    return 'RGB(' + Math.floor(this._r * 255) + ', ' + Math.floor(this._g * 255) + ', ' + Math.floor(this._b * 255) + ')'
  }

  rgbaAsString(): string {
    return (
      'RGBA(' +
      Math.floor(this._r * 255) +
      ', ' +
      Math.floor(this._g * 255) +
      ', ' +
      Math.floor(this._b * 255) +
      ', ' +
      this.a +
      ')'
    )
  }

  compute_rgbAsHex(): void {
    this.rgbAsHex = Math.floor(((this._r * 255) << 16) + ((this._g * 255) << 8) + this._b * 255)
  }

  argbAsHex(): number {
    return Math.floor((this.a << 24) + (this._r << 16) + (this._g << 8) + this._b)
  }

  rgbToHex(): number {
    const toHex = (value: number): string => {
      const hex = Math.floor(value).toString(16)

      return hex.length === 1 ? '0' + hex : hex
    }

    const alphaHex = Math.round(this.a * 255) // Convert alpha to 0-255 range

    return parseInt(`${toHex(this._r)}${toHex(this._g)}${toHex(this._b)}${toHex(alphaHex)}`, 16)
  }

  static Lerp(color1: Color, color2: Color, t: number): Color {
    const ret = new Color()
    const _t: number = MathCore.Clamp(t, 0, 1)

    ret.r = color1.r + (color2.r - color1.r) * _t
    ret.g = color1.g + (color2.g - color1.g) * _t
    ret.b = color1.b + (color2.b - color1.b) * _t
    ret.a = color1.a + (color2.a - color1.a) * _t

    return ret
  }

  static qLerp(target: Color, color1: Color, color2: Color, t: number) {
    const _t = MathCore.Clamp(t, 0, 1)

    target._r = color1._r + (color2._r - color1._r) * _t
    target._g = color1._g + (color2._g - color1._g) * _t
    target._b = color1._b + (color2._b - color1._b) * _t
    target.a = color1.a + (color2.a - color1.a) * _t
  }

  static hexToRgba(hex: string): Color {
    hex = hex.replace(/^#/, '')
    const color = new Color()

    color._r = parseInt(hex.substring(0, 2), 16)
    color._g = parseInt(hex.substring(2, 4), 16)
    color._b = parseInt(hex.substring(4, 6), 16)
    color.a = parseInt(hex.substring(6, 8), 16) / 255

    return color
  }
}

Object.defineProperties(Color.prototype, {
  r: {
    get: function () {
      return this._r
    },
    set: function (nR) {
      this._r = nR
      this.compute_rgbAsHex()
    },
  },
  g: {
    get: function () {
      return this._g
    },
    set: function (nG) {
      this._g = nG
      this.compute_rgbAsHex()
    },
  },
  b: {
    get: function () {
      return this._b
    },
    set: function (nB) {
      this._b = nB
      this.compute_rgbAsHex()
    },
  },
})
