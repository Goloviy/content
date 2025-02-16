import { MathCore } from '../MathCore/MathCore'
import { AnimationCurveType } from './AnimatedObjectTypes'

import { Keyframe } from './KeyFrame'

export class AnimationCurve {
  keys: Keyframe[]
  private _lastKey: number

  constructor(keys?: Keyframe[]) {
    this._lastKey = 0
    this.keys = []
    let undefined

    if (keys === undefined) return
    this.addKeys(keys)
  }

  static linear(timeStart: number, valueStart: number, timeEnd: number, valueEnd: number) {
    const k0 = new Keyframe(timeStart, valueStart, 0, 0)
    const k1 = new Keyframe(timeEnd, valueEnd, 0, 0)

    return new AnimationCurve([k0, k1])
  }

  clearKeys(): void {
    this.keys = []
  }

  addKeys(keys: Keyframe[]): void {
    let i = keys.length

    while (i--) this.addKey(keys[i])
    this.sortKeys()
  }

  addKey(key: Keyframe): void {
    this.keys.push(key)
  }

  sortKeys(): void {
    this.keys.sort(function (a, b) {
      return a.time - b.time
    })
  }

  deserialize(inputJson: AnimationCurveType): void {
    let i: number
    const times: number[] = []

    const source: AnimationCurveType = inputJson

    // times undefined in most cases
    for (i = 0; i < source.times.length; i++) times.push(source.times[i])
    const values: number[] = []

    for (i = 0; i < source.values.length; i++) values.push(source.values[i])
    let trimmed: number

    trimmed = values[values.length - 1]
    while (values.length < times.length) values.push(trimmed)
    const inTs: number[] = []

    for (i = 0; i < source.inTangents.length; i++) inTs.push(source.inTangents[i])
    trimmed = inTs[inTs.length - 1]
    while (inTs.length < times.length) inTs.push(trimmed)
    const outTs: number[] = []

    if (source.outTangents == 'copy') for (i = 0; i < inTs.length; i++) outTs.push(inTs[i])
    else {
      for (i = 0; i < source.outTangents.length; i++) outTs.push(source.outTangents[i])
      trimmed = outTs[outTs.length - 1]
      while (outTs.length < times.length) outTs.push(trimmed)
    }
    for (i = 0; i < times.length; i++) {
      const key = new Keyframe(times[i], values[i], inTs[i], outTs[i])

      this.addKey(key)
    }
  }

  Evaluate(animTime?: number): number {
    const time = animTime ? animTime : 0

    const len = this.keys.length

    if (len === 1) return this.keys[0].value
    let i: number,
      k0: Keyframe = new Keyframe(0, 0, 0, 0),
      k1: Keyframe = new Keyframe(0, 0, 0, 0)

    this._lastKey = Math.min(this._lastKey, len - 1)
    if (time <= this.keys[0].time) return this.keys[0].value
    else if (time >= this.keys[len - 1].time) return this.keys[len - 1].value
    const start = this.keys[this._lastKey].time <= time ? this._lastKey : 0

    for (i = start; i < len - 1; i++)
      if (this.keys[i].time <= time && this.keys[i + 1].time > time) {
        k0 = this.keys[i]
        k1 = this.keys[i + 1]
        this._lastKey = i
        break
      }
    if (!isFinite(k0.outTangent) || !isFinite(k1.inTangent)) return k0.value
    const t = MathCore.InverseLerp(k0.time, k1.time, time)
    const dt = k1.time - k0.time
    const m0 = k0.outTangent * dt
    const m1 = k1.inTangent * dt
    const t2 = t * t
    const t3 = t2 * t
    const a = 2 * t3 - 3 * t2 + 1
    const b = t3 - 2 * t2 + t
    const c = t3 - t2
    const d = -2 * t3 + 3 * t2

    return a * k0.value + b * m0 + c * m1 + d * k1.value
  }
}
