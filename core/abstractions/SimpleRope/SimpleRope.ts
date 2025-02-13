import { SimpleRope as PixiSimpleRope, Texture } from 'pixi.js-legacy'

import { Point } from 'Core/abstractions'

export class SimpleRope {
  private _pixiRope: PixiSimpleRope
  private readonly _texture: Texture
  private _points: Point[]

  constructor(texture: Texture, points: Point[]) {
    this._texture = texture
    this._points = points
    this._pixiRope = this.createRope(points)
  }

  private createRope(points: Point[]): PixiSimpleRope {
    return new PixiSimpleRope(
      this._texture,
      points.map(point => point.getPixiObject),
    )
  }

  get points(): Point[] {
    return this._points
  }

  set points(value: Point[]) {
    this._points = value
    this._pixiRope = this.createRope(value) // Create a new rope with the updated points
  }

  get getPixiObject(): PixiSimpleRope {
    return this._pixiRope
  }

  public updatePoints(newPoints: Point[]) {
    this.points = newPoints // This will update the rope with new points
  }
}
