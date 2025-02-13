import { LineStyle, Graphics as PixiGraphics, Container, MaskData } from 'pixi.js-legacy'

import { InteractiveElements } from 'Core/abstractions'
import type {
  IDrawRoundedRectangleOptions,
  LineStyleTypes,
  CursorType,
  IGraphicsOptions,
  IDrawCircleOptions,
} from 'Core/abstractions/types'

import type { Nullable } from 'Types'

export class Graphics extends InteractiveElements {
  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
    this._pixiGraphics.x = this._x
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
    this._pixiGraphics.y = this._y
  }

  get width(): number {
    return this._width
  }

  set width(value: number) {
    this._width = value
    this._pixiGraphics.width = this._width
  }

  get height(): number {
    return this._height
  }

  set height(value: number) {
    this._height = value
    this._pixiGraphics.height = this._height
  }

  get radius(): number {
    return this._radius
  }

  set radius(value: number) {
    this._radius = value
  }

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
    this._pixiGraphics.name = this._name
  }

  get alpha(): number {
    return this._alpha
  }

  set alpha(value: number) {
    this._alpha = value
    this._pixiGraphics.alpha = this._alpha
  }

  get color(): number {
    return this._color
  }

  set color(value: number) {
    this._color = value
  }

  get zIndex(): number {
    return this._zIndex
  }

  set zIndex(value: number) {
    this._zIndex = value
    this._pixiGraphics.zIndex = this._zIndex
  }

  get lineStyle(): PIXI.LineStyle {
    return this._lineStyle
  }

  set lineStyle(value: PIXI.LineStyle) {
    this._lineStyle = value
  }

  get tint(): number {
    return this._tint
  }

  set tint(value: number) {
    this._tint = value
    this._pixiGraphics.tint = this._tint
  }

  get cursor(): CursorType {
    return this._cursor
  }

  set cursor(value: CursorType) {
    this._cursor = value
    this._pixiGraphics.cursor = this._cursor
  }

  get interactive(): boolean {
    return this._interactive
  }

  set interactive(value: boolean) {
    this._interactive = value
    this._pixiGraphics.interactive = this._interactive
  }

  get mask(): Nullable<Container | MaskData> {
    return this._pixiGraphics.mask
  }

  set mask(value: Nullable<Container | MaskData>) {
    this._mask = value
    if (this._mask) this._pixiGraphics.mask = this._mask
  }

  getBounds() {
    return this._pixiGraphics.getBounds()
  }

  get children() {
    return this._baseElement.children
  }

  destroy(): void {
    return this._baseElement.destroy()
  }

  get getPixiObject() {
    return this._pixiGraphics
  }

  private readonly _pixiGraphics
  private _x: number
  private _y: number
  private _width: number
  private _height: number
  private _radius: number
  private _name: string
  private _alpha: number
  private _color: number
  private _zIndex: number
  private _lineStyle: LineStyle
  private _tint: number
  private _cursor: CursorType
  private _interactive: boolean
  private _mask: Nullable<Container | MaskData>
  private _visible: boolean

  constructor({
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    radius = 0,
    name = '',
    alpha = 1,
    color = 0x000000,
    zIndex = 0,
    lineStyle = {},
    tint = 0xffffff,
    cursor = 'default',
    interactive = false,
    mask = null,
    visible = true,
  }: IGraphicsOptions) {
    super()
    this._pixiGraphics = new PixiGraphics()
    this._interactiveElement = this._pixiGraphics
    this._baseElement = this._pixiGraphics

    this._x = x
    this._y = y
    this._width = width
    this._height = height
    this._radius = radius
    this._name = name
    this._alpha = alpha
    this._color = color
    this._zIndex = zIndex
    this._lineStyle = new LineStyle()
    this._tint = tint
    this._cursor = cursor
    this._interactive = interactive
    this._mask = mask
    this._visible = visible

    this.setLineStyle(lineStyle)

    this.setup()
  }

  private setup(): void {
    this._pixiGraphics.name = this._name
    if (this._zIndex !== undefined) this._pixiGraphics.zIndex = this._zIndex
    if (this._tint) this._pixiGraphics.tint = this._tint
    if (this._cursor) this._pixiGraphics.cursor = this._cursor
    if (this._interactive) this._pixiGraphics.interactive = this._interactive
    if (this._mask) this._pixiGraphics.mask = this._mask
    this._pixiGraphics.visible = this._visible
  }

  private setLineStyle({ width = 0, color = 0x000000, alpha = 1 }: LineStyleTypes): void {
    this._lineStyle.width = width
    this._lineStyle.color = color
    this._lineStyle.alpha = alpha
  }

  private drawFullRoundedRect(rectangleOptions: IDrawRoundedRectangleOptions): void {
    const { x = 0, y = 0, width = this._width, height = this._height, radius = 0 } = rectangleOptions

    this._pixiGraphics.drawRoundedRect(x, y, width, height, radius)
  }

  public drawRect(rectangleOptions: IDrawRoundedRectangleOptions): void {
    const { x = 0, y = 0, width = this._width, height = this._height } = rectangleOptions

    this._pixiGraphics.beginFill()
    this._pixiGraphics.drawRect(x, y, width, height)
    this._pixiGraphics.endFill()
  }

  private drawTopRightRoundedRect(rectangleOptions: IDrawRoundedRectangleOptions): void {
    const { x = 0, y = 0, width = this._width, height = this._height, radius = 0 } = rectangleOptions

    this._pixiGraphics.moveTo(x, y)
    this._pixiGraphics.lineTo(x + width - radius, y)
    this._pixiGraphics.arcTo(x + width, y, x + width, y + radius, radius)
    this._pixiGraphics.lineTo(x + width, y + height)
    this._pixiGraphics.lineTo(x, y + height)
  }

  private drawTopLeftRoundedRect(rectangleOptions: IDrawRoundedRectangleOptions): void {
    const { x = 0, y = 0, width = this._width, height = this._height, radius = 0 } = rectangleOptions

    this._pixiGraphics.moveTo(x + width, y)
    this._pixiGraphics.arcTo(x, y, x, y + radius, radius)
    this._pixiGraphics.lineTo(x + width, y + height - 1)

    this._pixiGraphics.moveTo(x, y + radius - 1)
    this._pixiGraphics.lineTo(x, y + height)
    this._pixiGraphics.lineTo(x + width, y + height - 1)
    this._pixiGraphics.lineTo(x + width, y)
  }

  private drawTopRoundedRect(rectangleOptions: IDrawRoundedRectangleOptions): void {
    const { x = 0, y = 0, width = this._width, height = this._height, radius = 0 } = rectangleOptions

    // left top rounded corner
    this._pixiGraphics.moveTo(x + width - radius, y)
    this._pixiGraphics.arcTo(x, y, x, y + radius, radius)

    // right top rounded corner
    this._pixiGraphics.moveTo(x + radius, y)
    this._pixiGraphics.arcTo(x + width, y, x + width, y + radius, radius)

    // space between rounded corners
    this._pixiGraphics.moveTo(x + width / 2, y)
    this._pixiGraphics.lineTo(x, y + radius)
    this._pixiGraphics.lineTo(x + width, y + radius)

    // rest space
    this._pixiGraphics.moveTo(x, y + radius - 1)
    this._pixiGraphics.lineTo(x, y + height)
    this._pixiGraphics.lineTo(x + width, y + height - 1)
    this._pixiGraphics.lineTo(x + width, y + radius - 1)
  }

  private drawBottomRoundedRect(rectangleOptions: IDrawRoundedRectangleOptions): void {
    const { x = 0, y = 0, width = this._width, height = this._height, radius = 0 } = rectangleOptions

    // left bottom rounded corner
    this._pixiGraphics.moveTo(x + width - radius, y + height)
    this._pixiGraphics.arcTo(x, y + height, x, y + height - radius, radius)

    // right bottom rounded corner
    this._pixiGraphics.moveTo(x, y + height)
    this._pixiGraphics.arcTo(x + width, y + height, x + width, y + height - radius, radius)

    // space between rounded corners
    this._pixiGraphics.moveTo(x + width / 2, y + height)
    this._pixiGraphics.lineTo(x, y + height - radius)
    this._pixiGraphics.lineTo(x + width, y + height - radius)

    // rest space
    this._pixiGraphics.moveTo(x, y + height - radius + 1)
    this._pixiGraphics.lineTo(x + width, y + height - radius + 1)
    this._pixiGraphics.lineTo(x + width, y)
    this._pixiGraphics.lineTo(x, y)
  }

  private drawRightRoundedRect(rectangleOptions: IDrawRoundedRectangleOptions): void {
    const { x = 0, y = 0, width = this._width, height = this._height, radius = 0 } = rectangleOptions

    // Начинаем с левой верхней части прямоугольника
    this._pixiGraphics.moveTo(x, y)

    // Линия от левого верхнего угла до правого верхнего со скруглением
    this._pixiGraphics.lineTo(x + width - radius, y)
    this._pixiGraphics.arcTo(x + width, y, x + width, y + radius, radius)

    // Линия от правого верхнего до правого нижнего со скруглением
    this._pixiGraphics.lineTo(x + width, y + height - radius)
    this._pixiGraphics.arcTo(x + width, y + height, x + width - radius, y + height, radius)

    // Линия от правого нижнего до левого нижнего угла
    this._pixiGraphics.lineTo(x, y + height)

    // Завершение, возвращаемся к начальной точке
    this._pixiGraphics.lineTo(x, y)
  }

  private drawLeftRoundedRect(rectangleOptions: IDrawRoundedRectangleOptions): void {
    const { x = 0, y = 0, width = this._width, height = this._height, radius = 0 } = rectangleOptions

    // Начинаем с верхнего правого угла
    this._pixiGraphics.moveTo(x + width, y)

    // Линия от верхнего правого угла до верхнего левого со скруглением
    this._pixiGraphics.lineTo(x + radius, y)
    this._pixiGraphics.arcTo(x, y, x, y + radius, radius)

    // Линия от верхнего левого угла до нижнего левого со скруглением
    this._pixiGraphics.lineTo(x, y + height - radius)
    this._pixiGraphics.arcTo(x, y + height, x + radius, y + height, radius)

    // Линия от нижнего левого угла до нижнего правого
    this._pixiGraphics.lineTo(x + width, y + height)

    // Завершение, возвращаемся к верхнему правому углу
    this._pixiGraphics.lineTo(x + width, y)
  }

  public drawRoundedRectangle(rectangleOptions: IDrawRoundedRectangleOptions): void {
    const { corners, lineStyle } = rectangleOptions

    this._pixiGraphics.beginFill(this._color, this._alpha)

    if (lineStyle) {
      this._pixiGraphics.lineStyle(lineStyle.width, lineStyle.color, lineStyle.alpha)
    } else {
      this._pixiGraphics.lineStyle(this._lineStyle.width, this._lineStyle.color, this._lineStyle.alpha)
    }

    switch (corners) {
      case 'top-right':
        this.drawTopRightRoundedRect(rectangleOptions)
        break
      case 'top-left':
        this.drawTopLeftRoundedRect(rectangleOptions)
        break
      case 'top':
        this.drawTopRoundedRect(rectangleOptions)
        break
      case 'bottom':
        this.drawBottomRoundedRect(rectangleOptions)
        break
      case 'right':
        this.drawRightRoundedRect(rectangleOptions)
        break
      case 'left':
        this.drawLeftRoundedRect(rectangleOptions)
        break
      default:
        this.drawFullRoundedRect(rectangleOptions)
    }

    this._pixiGraphics.endFill()
  }

  public toLocal(position: PIXI.IPointData, from?: PIXI.DisplayObject, point?: PIXI.Point, skipUpdate?: boolean) {
    return this._pixiGraphics.toLocal(position, from, point, skipUpdate)
  }

  public clear(): PIXI.Graphics {
    return this._pixiGraphics.clear()
  }

  public drawHoleCircle(circleOptions: IDrawCircleOptions): void {
    const { x = 0, y = 0, radius = 0 } = circleOptions
    let angleOffset = 0
    let startAngle = 0
    let endAngle = Math.PI * 2

    if (y <= radius) {
      // Нахождения угла для точки на окружности
      angleOffset = Math.asin(y / radius)
      startAngle = -angleOffset
      endAngle = Math.PI + angleOffset
    }

    this._pixiGraphics.beginHole()
    this._pixiGraphics.arc(x, y, radius, startAngle, endAngle)
    this._pixiGraphics.endHole()
  }

  get visible(): boolean {
    return this._pixiGraphics.visible
  }

  set visible(value: boolean) {
    this._visible = value
    this._pixiGraphics.visible = this._visible
  }
}
