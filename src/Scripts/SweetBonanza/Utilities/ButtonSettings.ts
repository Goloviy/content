import { Point } from 'pixi.js-legacy'

export class ButtonSettings {
  x: number = 0
  y: number = 0
  width: number = 300
  height: number = 120
  radius: number = 0
  anchors: Point = new Point(0.5, 0.5)

  constructor(x: number, y: number, width?: number, height?: number, radius?: number, anchors?: Point , color?: number) {
    this.x = x
    this.y = y
    if (width) this.width = width
    if (height) this.height = height
    if (radius) this.radius = radius
    if(anchors) this.anchors = anchors
    if (color) this.color = color
  }

  color: number = 0xffffff
}
