import { Point as PixiPoint } from 'pixi.js-legacy'

import { InteractiveElements } from 'Core/abstractions'
import type { IPointDataOptions } from 'Core/abstractions/types'

export class Point extends InteractiveElements {
  private readonly _pixiPoint: PixiPoint

  constructor({ x = 0, y = 0 }: IPointDataOptions) {
    super()
    this._pixiPoint = new PixiPoint(x, y)
  }

  get x(): number {
    return this._pixiPoint.x
  }

  set x(value: number) {
    this._pixiPoint.x = value
  }

  get y(): number {
    return this._pixiPoint.y
  }

  set y(value: number) {
    this._pixiPoint.y = value
  }

  get getPixiObject() {
    return this._pixiPoint
  }

  public toString(): string {
    return `Point(${this.x}, ${this.y})`
  }
}
