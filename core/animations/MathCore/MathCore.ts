export class MathCore {
  static PI: number = 3.1415926
  static numberError: number = 1e-6
  /**
   *
   * @param n number to clamp
   * @param min min value
   * @param max max value
   * @returns
   */
  static Clamp = function (n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max)
  }

  /**
   * can work incorrect
   * @param a  start number
   * @param b  end number
   * @param v  interpolation coefficient
   * @returns return interpolated value between a and b
   */
  static InverseLerp = function (a: number, b: number, v: number) {
    if (a === b) return 0

    // let _v = MathCore.Clamp(v, a, b)
    return (v - a) / (b - a)
  }

  static LerpUnclamped = function (a: number, b: number, t: number) {
    return a + (b - a) * t
  }

  static Lerp = function (a: number, b: number, t: number) {
    var _t = MathCore.Clamp(t, 0, 1)

    return a + (b - a) * _t
  }

  static ToDeg = function (r: number) {
    return (r * 180) / MathCore.PI
  }

  static ToRad = function (d: number) {
    return (d / 180) * MathCore.PI
  }
}
