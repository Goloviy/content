import { MathCore } from './MathCore'
import { Vector3 } from './Vector3'

export class Quaternion {
  static identity: Quaternion = new Quaternion()
  _internalEulerAngles: Vector3
  x: number = 0
  y: number = 0
  z: number = 0
  w: number = 0
  eulerAnglesAreDirty: boolean = false

  constructor(x?: number | undefined, y?: number | undefined, z?: number | undefined, w?: number | undefined) {
    this.Set(x, y, z, w)
    this._internalEulerAngles = new Vector3(0, 0, 0)
  }

  Set(x?: number | undefined, y?: number | undefined, z?: number | undefined, w?: number | undefined) {
    this.x = x ? x : 0
    this.y = y ? y : 0
    this.z = z ? z : 0
    this.w = w ? w : 0
  }

  static Euler(a?: Vector3 | undefined): Quaternion | undefined
  static Euler(
    a?: Vector3 | undefined,
    p?: number | undefined,
    y?: number | undefined,
    r?: number | undefined,
  ): Quaternion | undefined {
    if (p === undefined || y === undefined || r === undefined) {
      if (a !== undefined) {
        y = a.y
        r = a.z
        p = a.x
      } else return undefined
    }
    var q = new Quaternion()
    var a1 = MathCore.ToRad(p / 2)
    var a2 = MathCore.ToRad(y / 2)
    var a3 = MathCore.ToRad(r / 2)
    var c1 = Math.cos(a1)
    var c2 = Math.cos(a2)
    var c3 = Math.cos(a3)
    var s1 = Math.sin(a1)
    var s2 = Math.sin(a2)
    var s3 = Math.sin(a3)

    q.x = s1 * c2 * c3 + c1 * s2 * s3
    q.y = c1 * s2 * c3 - s1 * c2 * s3
    q.z = c1 * c2 * s3 - s1 * s2 * c3
    q.w = c1 * c2 * c3 + s1 * s2 * s3
    q.eulerAnglesAreDirty = true

    return q
  }

  static AngleAxis(angle: number, axis: Vector3) {
    var halfAngle = MathCore.ToRad(angle) / 2
    var s = Math.sin(halfAngle)
    var ret = new Quaternion(axis.x * s, axis.y * s, axis.z * s, Math.cos(halfAngle))

    return ret
  }

  static Dot(q1: Quaternion, q2: Quaternion) {
    return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w
  }

  static FromToRotation(from: Vector3, to: Vector3) {
    var ret = new Quaternion()

    ret.SetFromToRotation(from, to)

    return ret
  }

  static Inverse(q: Quaternion) {
    return Quaternion.Conjugate(q).Normalize()
  }

  static Conjugate(q: Quaternion) {
    const ret = new Quaternion()

    ret.Set(-q.x, -q.y, -q.z, q.w)

    return ret
  }

  static Lerp(s: Quaternion, e: Quaternion, a: number) {
    var t = MathCore.Clamp(a, 0, 1)
    var ret = new Quaternion(s.x + (e.x - s.x) * t, s.y + (e.y - s.y) * t, s.z + (e.z - s.z) * t, s.w + (e.w - s.w) * t)

    ret.Normalize()

    return ret
  }

  static Slerp(from: Quaternion, to: Quaternion, t: number) {
    var ret = new Quaternion()

    if (t <= 0) {
      ret.Set(from.x, from.y, from.z, from.w)

      return ret
    } else if (t >= 1) {
      ret.Set(to.x, to.y, to.z, to.w)

      return ret
    }
    var x = from.x,
      y = from.y,
      z = from.z,
      w = from.w
    var cosHalfTheta = Quaternion.Dot(from, to)
    var qf = new Quaternion()

    if (cosHalfTheta < 0) {
      qf.Set(-to.x, -to.y, -to.z, -to.w)
      cosHalfTheta = -cosHalfTheta
    } else qf.Set(to.x, to.y, to.z, to.w)
    if (cosHalfTheta >= 1) {
      ret.Set(x, y, z, w)

      return ret
    }
    var halfTheta = Math.acos(cosHalfTheta)
    var sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta)

    if (Math.abs(sinHalfTheta) < 0.001) {
      ret.Set(0.5 * (x + qf.x), 0.5 * (y + qf.y), 0.5 * (z + qf.z), 0.5 * (w + qf.w))

      return ret
    }
    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta
    var ratioB = Math.sin(t * halfTheta) / sinHalfTheta

    ret.Set(x * ratioA + qf.x * ratioB, y * ratioA + qf.y * ratioB, z * ratioA + qf.z * ratioB, w * ratioA + qf.w * ratioB)

    return ret
  }

  static LookRotation(forward: Vector3, up: Vector3) {
    var ret = new Quaternion()

    ret.SetLookRotation(forward, up)
    ret.Normalize()

    return ret
  }

  static Multiply(q1: Quaternion, q2: Quaternion) {
    return new Quaternion(
      q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
      q1.w * q2.y + q1.y * q2.w + q1.z * q2.x - q1.x * q2.z,
      q1.w * q2.z + q1.z * q2.w + q1.x * q2.y - q1.y * q2.x,
      q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
    ).Normalize()
  }

  static MultiplyVec(q: Quaternion, v: Quaternion) {
    var x = v.x
    var y = v.y
    var z = v.z
    var qx = q.x
    var qy = q.y
    var qz = q.z
    var qw = q.w
    var ix = qw * x + qy * z - qz * y
    var iy = qw * y + qz * x - qx * z
    var iz = qw * z + qx * y - qy * x
    var iw = -qx * x - qy * y - qz * z

    return new Vector3(
      ix * qw + iw * -qx + iy * -qz - iz * -qy,
      iy * qw + iw * -qy + iz * -qx - ix * -qz,
      iz * qw + iw * -qz + ix * -qy - iy * -qx,
    )
  }

  Normalize() {
    var l = this.Length()

    if (l === 0) {
      this.x = 0
      this.y = 0
      this.z = 0
      this.w = 1
    } else {
      l = 1 / l
      this.x *= l
      this.y *= l
      this.z *= l
      this.w *= l
    }
    this.eulerAnglesAreDirty = true

    return this
  }

  Equals(x: number, y: number, z: number, w: number) {
    var v = new Quaternion(x, y, z, w)

    return (
      Math.abs(this.x - v.x) < MathCore.numberError &&
      Math.abs(this.y - v.y) < MathCore.numberError &&
      Math.abs(this.z - v.z) < MathCore.numberError &&
      Math.abs(this.w - v.w) < MathCore.numberError
    )
  }

  Length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
  }

  SetFromToRotation(fromDirection: Vector3, toDirection: Vector3): this {
    var v1 = new Vector3()
    var r = Vector3.Dot(fromDirection, toDirection) + 1

    if (r < MathCore.numberError) {
      r = 0
      if (Math.abs(fromDirection.x) > Math.abs(fromDirection.z)) v1.Set(-fromDirection.y, fromDirection.x, 0)
      else v1.Set(0, -fromDirection.z, fromDirection.y)
    } else {
      const tempvector = Vector3.Cross(fromDirection, toDirection)

      v1.Set(tempvector.x, tempvector.y, tempvector.z)
    }
    this.x = v1.x
    this.y = v1.y
    this.z = v1.z
    this.w = r
    this.Normalize()
    this.eulerAnglesAreDirty = true

    return this
  }

  SetLookRotation(view: Vector3, up: Vector3): this {
    var forward = view.Normalized()

    if (up === undefined) up = Vector3.up
    var right = new Vector3()

    Vector3.OrthoNormalize(up, forward, right)
    this.w = Math.sqrt(1 + right.x + up.y + forward.z) * 0.5
    var wRecip = 0.25 / this.w

    this.x = (forward.y - up.z) * wRecip
    this.y = (right.z - forward.x) * wRecip
    this.z = (up.x - right.y) * wRecip
    this.eulerAnglesAreDirty = true

    return this
  }
}
