import { Text as PixiText, TextStyle, Texture } from 'pixi.js-legacy'

import { InteractiveElements } from 'Core/abstractions'
import type { AlignCenterPropsTypes, ITextOptions, SetAnchorPropsTypes } from 'Core/abstractions/types'

export class Text extends InteractiveElements {
  get width(): number {
    return this._pixiText.width
  }

  set width(value: number) {
    this._width = value
    this._pixiText.width = this._width
  }

  get height(): number {
    return this._pixiText.height
  }

  set height(value: number) {
    this._height = value
    this._pixiText.height = this._height
  }

  get text(): string {
    return this._pixiText.text
  }

  set text(value: string) {
    this._text = value
    this._pixiText.text = this._text
  }

  get x(): number {
    return this._pixiText.x
  }

  set x(value: number) {
    this._x = value
    this._pixiText.x = this._x
  }

  get y(): number {
    return this._pixiText.y
  }

  set y(value: number) {
    this._y = value
    this._pixiText.y = this._y
  }

  get style() {
    return this._pixiText.style
  }

  set style(value) {
    this._style = value
    this._pixiText.style = this._style
  }

  get zIndex() {
    return this._pixiText.zIndex
  }

  set zIndex(value: number) {
    this._zIndex = value
    this._pixiText.zIndex = this._zIndex
  }

  get name() {
    return this._pixiText.name
  }

  set name(value: string) {
    this._name = value
    this._pixiText.name = this._name
  }

  get tint() {
    return this._pixiText.tint
  }

  set tint(value: number) {
    this._tint = value
  }

  get interactive(): boolean {
    return this._pixiText.interactive
  }

  set interactive(value: boolean) {
    this._interactive = value
    this._pixiText.interactive = this._interactive
  }

  get alpha(): number {
    return this._pixiText.alpha
  }

  set alpha(value: number) {
    this._alpha = value
    this._pixiText.alpha = this._alpha
  }

  get buttonMode(): boolean {
    return this._pixiText.buttonMode
  }

  set buttonMode(value: boolean) {
    this._buttonMode = value
    this._pixiText.buttonMode = this._buttonMode
  }

  get resolution(): number {
    return this._pixiText.resolution
  }

  get texture(): Texture {
    return this._pixiText.texture
  }

  get children() {
    return this._baseElement.children
  }

  destroy(): void {
    return this._baseElement.destroy()
  }

  set resolution(value: number) {
    this._resolution = value
    this._pixiText.resolution = this._resolution
  }

  private readonly _pixiText

  get getPixiObject() {
    return this._pixiText
  }

  private _width
  private _height
  private _text
  private _x
  private _y
  private _style
  private _zIndex
  private _name
  private _tint
  private _resolution
  private _interactive
  private _alpha
  private _buttonMode
  private readonly _texture

  constructor({
    width = 0,
    height = 0,
    text = '',
    x = 0,
    y = 0,
    style = new TextStyle({}),
    zIndex = 0,
    name = '',
    tint = 0xffffff,
    resolution = 2,
    texture = null,
    interactive = false,
    alpha = 1,
    buttonMode = false,
  }: ITextOptions) {
    super()

    this._pixiText = new PixiText(text, style)
    this._interactiveElement = this._pixiText
    this._baseElement = this._pixiText

    this._width = width
    this._height = height
    this._text = text
    this._x = x
    this._y = y
    this._style = style
    this._zIndex = zIndex
    this._name = name
    this._tint = tint
    this._resolution = resolution
    this._interactive = interactive
    this._alpha = alpha
    this._buttonMode = buttonMode
    this._texture = texture

    this.setup()
  }

  private setup(): void {
    this._pixiText.resolution = this._resolution
    this._pixiText.name = this._name
    this._pixiText.x = this._x
    this._pixiText.y = this._y
    this._pixiText.zIndex = this._zIndex

    if (this._tint) this._pixiText.tint = this._tint
    if (this._interactive) this._pixiText.interactive = this._interactive
    if (this._alpha) this._pixiText.alpha = this._alpha
    if (this._buttonMode) this._pixiText.buttonMode = this._buttonMode
    if (this._texture) this._pixiText.texture = this._texture
  }

  public setAnchor({ x = 0, y = 0 }: SetAnchorPropsTypes): void {
    this._pixiText.anchor.set(x, y)
  }

  public alignCenter({ parentWidth = 0, parentHeight = 0 }: AlignCenterPropsTypes): void {
    this._pixiText.anchor.set(0.5, 0.5)
    this._pixiText.position.set(parentWidth / 2, parentHeight / 2)
  }
}
