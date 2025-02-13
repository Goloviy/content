import { MathCore } from './MathCore'

export class Vector3 {
  x: number
  y: number
  z: number

  static zero = new Vector3(0, 0, 0)
  static back = new Vector3(0, 0, -1)
  static down = new Vector3(0, -1, 0)
  static forward = new Vector3(0, 0, 1)
  static left = new Vector3(-1, 0, 0)
  static one = new Vector3(1, 1, 1)
  static right = new Vector3(1, 0, 0)
  static up = new Vector3(0, 1, 0)

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  Set(x: number, y: number, z: number) {
    this.x = x ? x : 0
    this.y = y ? y : 0
    this.z = z ? z : 0
  }

  Equals(other: Vector3): boolean {
    return (
      Math.abs(this.x - other.x) < MathCore.numberError &&
      Math.abs(this.y - other.y) < MathCore.numberError &&
      Math.abs(this.z - other.z) < MathCore.numberError
    )
  }

  Magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  SqrMagnitude() {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  Normalize() {
    let l = this.Magnitude()

    if (l < MathCore.numberError) this.Set(0, 0, 0)
    else {
      l = 1 / l
      this.Set(this.x * l, this.y * l, this.z * l)
    }
  }

  Normalized(): Vector3 {
    let l = this.Magnitude()
    const ret = new Vector3()

    if (l !== 0) {
      l = 1 / l
      ret.x = this.x * l
      ret.y = this.y * l
      ret.z = this.z * l
    }

    return ret
  }

  Add(u: Vector3) {
    this.x += u.x
    this.y += u.y
    this.z += u.z

    return this
  }

  static Dot(u: Vector3, v: Vector3) {
    if (v === undefined || u === undefined) return 0

    return u.x * v.x + u.y * v.y + u.z * v.z
  }

  static Angle(u: Vector3, v: Vector3) {
    let d = Vector3.Dot(u.Normalized(), v.Normalized())

    d = MathCore.Clamp(d, -1, 1)

    return MathCore.ToDeg(Math.acos(d))
  }

  static Cross(u: Vector3, v: Vector3): Vector3 {
    return new Vector3(u.y * v.z - u.z * v.y, u.z * v.x - u.x * v.z, u.x * v.y - u.y * v.x)
  }

  static Distance(u: Vector3, v: Vector3) {
    const d = new Vector3(u.x - v.x, u.y - v.y, u.z - v.z)

    return d.Magnitude()
  }

  static Lerp(s: Vector3, e: Vector3, a: number) {
    const t = MathCore.Clamp(a, 0, 1)

    return new Vector3(s.x + (e.x - s.x) * t, s.y + (e.y - s.y) * t, s.z + (e.z - s.z) * t)
  }

  static Nlerp(start: Vector3, end: Vector3, percent: number) {
    const t = MathCore.Clamp(percent, 0, 1)
    const v = Vector3.Lerp(start, end, t)

    v.Normalize()

    return v
  }

  static Slerp(_start: Vector3, _end: Vector3, _percent: number) {
    const ls = _start.Magnitude()
    const le = _end.Magnitude()
    const start = Math.abs(ls) > 0 ? Vector3.Scale(_start, new Vector3(1 / ls, 1 / ls, 1 / ls)) : Vector3.up
    const end = Math.abs(le) > 0 ? Vector3.Scale(_end, new Vector3(1 / le, 1 / le, 1 / le)) : Vector3.up
    const t = MathCore.Clamp(_percent, 0, 1)
    const rot = Quaternion.FromToRotation(start, end)
    const interpolatedRot = Quaternion.Slerp(Quaternion.identity, rot, t)
    const v = Quaternion.MultiplyVec(interpolatedRot, start)
    const lp = MathCore.Lerp(ls, le, t)

    return Vector3.Scale(v, new Vector3(lp, lp, lp))
  }

  static Min(vector1: Vector3, vecor2: Vector3) {
    return new Vector3(Math.min(vector1.x, vecor2.x), Math.min(vector1.y, vecor2.y), Math.min(vector1.z, vecor2.z))
  }

  Max(vector1: Vector3, vecor2: Vector3) {
    return new Vector3(Math.max(vector1.x, vecor2.x), Math.max(vector1.y, vecor2.y), Math.max(vector1.z, vecor2.z))
  }

  MoveTowards(current: Vector3, target: Vector3, maxDistanceDelta: number) {
    const d = new Vector3(target.x - current.x, target.y - current.y, target.z - current.z)
    const m = d.Magnitude()

    if (m < MathCore.numberError) return target
    const dl = Math.min(maxDistanceDelta, m) / m

    return Vector3.Lerp(current, target, dl)
  }

  static OrthoNormalize(normal: Vector3, tangent: Vector3, binormal: Vector3) {
    normal.Normalize()
    const nt: Vector3 = Vector3.Cross(normal, tangent)

    binormal.Set(nt.x, nt.y, nt.z)
    binormal.Normalize()
    const bn: Vector3 = Vector3.Cross(binormal, normal)

    tangent.Set(bn.x, bn.y, bn.z)
    tangent.Normalize()
  }

  static Scale(a: Vector3, b: Vector3) {
    const x: number = b.x
    const y: number = b.y
    const z: number = b.z

    return new Vector3(a.x * x, a.y * y, a.z * z)
  }

  Sub(a: Vector3, b: Vector3) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
  }
}

export class Quaternion {
  static identity: Quaternion = new Quaternion()
  _internalEulerAngles: Vector3 = new Vector3()
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

  static AngleAxis(angle: number, axis: { x: number; y: number; z: number }) {
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

  static MultiplyVec(q: Quaternion, v: Vector3) {
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
