export class Keyframe {
  value: number
  time: number
  outTangent: number
  inTangent: number

  constructor(time: number, value: number, inTangent: number, outTangent: number) {
    this.time = time
    this.value = value
    this.inTangent = inTangent !== undefined ? inTangent : 0
    this.outTangent = outTangent ? outTangent : 0
  }
}
