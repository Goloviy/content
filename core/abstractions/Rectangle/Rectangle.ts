import { Rectangle as PixiRectangle } from 'pixi.js-legacy'

import type { IRectangleOptions } from 'Core/abstractions/types'

export class Rectangle {
  private _x: number = 0
  private _y: number = 0
  private _width: number = 0
  private _height: number = 0
  private _pixiRectangle = new PixiRectangle(0, 0, 0, 0)

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  get width(): number {
    return this._width
  }

  set width(value: number) {
    this._width = value
  }

  get height(): number {
    return this._height
  }

  set height(value: number) {
    this._height = value
  }

  get getPixiObject() {
    return this._pixiRectangle
  }

  constructor({ x = 0, y = 0, width = 0, height = 0 }: IRectangleOptions) {
    this._x = x
    this._y = y
    this._width = width
    this._height = height

    this.setup()
    this.contains(x, y)
  }

  private setup(): void {
    this._pixiRectangle = new PixiRectangle(this._x, this._y, this._width, this._height)
  }

  contains(x: number, y: number): boolean {
    return this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y
  }
}
