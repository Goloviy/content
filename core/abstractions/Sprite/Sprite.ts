import { Container, MaskData, Sprite as PixiSprite, Texture as PixiTexture } from 'pixi.js-legacy'

import { InteractiveElements, Texture } from 'Core/abstractions'
import type { AlignCenterPropsTypes, ISpriteOptions, SetAnchorPropsTypes, CursorType } from 'Core/abstractions/types'

import type { Nullable } from 'Types'

export class Sprite extends InteractiveElements {
  set texture(value: Texture) {
    this._texture = value
    this._pixiSprite.texture = this._texture.getPixiObject
  }

  set pixiTexture(value: PixiTexture) {
    this._pixiSprite.texture = value
  }

  get x(): number {
    return this._pixiSprite.x
  }

  set x(value: number) {
    this._x = value
    this._pixiSprite.x = this._x
  }

  get y(): number {
    return this._pixiSprite.y
  }

  set y(value: number) {
    this._y = value
    this._pixiSprite.y = this._y
  }

  get width(): number {
    return this._pixiSprite.width
  }

  set width(value: number) {
    this._width = value
    this._pixiSprite.width = this._width
  }

  get height(): number {
    return this._pixiSprite.height
  }

  set height(value: number) {
    this._height = value
    this._pixiSprite.height = this._height
  }

  get tint(): number {
    return this._pixiSprite.tint
  }

  set tint(value: number) {
    this._tint = value
    this._pixiSprite.tint = this._tint
  }

  get cursor(): CursorType {
    return this._pixiSprite.cursor as CursorType
  }

  set cursor(value: CursorType) {
    this._cursor = value
    this._pixiSprite.cursor = this._cursor
  }

  get interactive(): boolean {
    return this._pixiSprite.interactive
  }

  set interactive(value: boolean) {
    this._interactive = value
    this._pixiSprite.interactive = this._interactive
  }

  get alpha(): Nullable<number> {
    return this._pixiSprite.alpha
  }

  set alpha(value: number) {
    this._alpha = value
    this._pixiSprite.alpha = this._alpha
  }

  get angle(): Nullable<number> {
    return this._pixiSprite.angle
  }

  set angle(value: number) {
    this._angle = value
    this._pixiSprite.angle = this._angle
  }

  get zIndex(): number {
    return this._pixiSprite.zIndex
  }

  set zIndex(value: number) {
    this._zIndex = value
    this._pixiSprite.zIndex = this._zIndex
  }

  get name(): string {
    return this._pixiSprite.name
  }

  set name(value: string) {
    this._name = value
    this._pixiSprite.name = this._name
  }

  get rotation(): number {
    return this._pixiSprite.rotation
  }

  set rotation(value: number) {
    this._rotation = value
    this._pixiSprite.rotation = value
  }

  get mask(): Nullable<Container | MaskData> {
    return this._pixiSprite.mask
  }

  set mask(value: Nullable<Container | MaskData>) {
    this._mask = value
    if (this._mask) this._pixiSprite.mask = this._mask
  }

  get children() {
    return this._baseElement.children
  }

  readonly _pixiSprite

  get getPixiObject() {
    return this._pixiSprite
  }

  private readonly _path?: string
  private _texture?: Texture
  private _x: number
  private _y: number
  private _width: number
  private _height: number
  private _tint: number
  private _zIndex: number
  private _name: string
  private readonly _scale: Nullable<number>
  private _rotation: Nullable<number>
  private _cursor: CursorType
  private _interactive: boolean
  private _alpha: number
  private _angle: number
  private _mask: Nullable<Container | MaskData>
  private readonly _anchor: SetAnchorPropsTypes

  constructor({
    path,
    texture,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    tint = 0xffffff,
    cursor = 'default',
    interactive = false,
    zIndex = 0,
    name = '',
    scale = null,
    rotation = null,
    alpha = 1,
    angle = 0,
    mask = null,
    anchor = { x: 0, y: 0 },
  }: ISpriteOptions) {
    super()
    const defaultTexture = Texture.EMPTY

    this._pixiSprite = new PixiSprite(path ? Texture.from(path).getPixiObject : texture?.getPixiObject || defaultTexture)
    this._interactiveElement = this._pixiSprite
    this._baseElement = this._pixiSprite

    this._path = path
    this._texture = texture
    this._x = x
    this._y = y
    this._width = width
    this._height = height
    this._tint = tint
    this._cursor = cursor
    this._interactive = interactive
    this._zIndex = zIndex
    this._name = name
    this._scale = scale
    this._rotation = rotation
    this._alpha = alpha
    this._angle = angle
    this._mask = mask
    this._anchor = anchor

    this.setup()
  }

  private setup(): void {
    this._pixiSprite.texture = this._path ? Texture.from(this._path).getPixiObject : this._texture?.getPixiObject || Texture.EMPTY

    this._pixiSprite.name = this._name
    this._pixiSprite.x = this._x
    this._pixiSprite.y = this._y
    if (this._width) this._pixiSprite.width = this._width
    if (this._height) this._pixiSprite.height = this._height
    if (this._scale) this._pixiSprite.scale.set(this._scale)
    if (this._rotation) this._pixiSprite.rotation = this._rotation
    if (this._mask) this._pixiSprite.mask = this._mask
    if (this._anchor) this._pixiSprite.anchor.set(this._anchor.x, this._anchor.y)

    this._pixiSprite.tint = this._tint
    this._pixiSprite.cursor = this._cursor
    this._pixiSprite.interactive = this._interactive
    this._pixiSprite.alpha = this._alpha
    this._pixiSprite.angle = this._angle
    if (this._zIndex) this._pixiSprite.zIndex = this._zIndex
  }

  public setAnchor({ x = 0, y = 0 }: SetAnchorPropsTypes): void {
    this._pixiSprite.anchor.set(x, y)
  }

  public alignCenter({ parentWidth = 0, parentHeight = 0 }: AlignCenterPropsTypes): void {
    this._pixiSprite.anchor.set(0.5, 0.5)
    this._pixiSprite.position.set(parentWidth / 2, parentHeight / 2)
  }

  public getChildByName(name: string, deep: boolean = false): Sprite {
    return this._baseElement.getChildByName(name, deep) as unknown as Sprite
  }

  public toLocal(position: PIXI.IPointData, from?: PIXI.DisplayObject, point?: PIXI.Point, skipUpdate?: boolean): PIXI.Point {
    return this._pixiSprite.toLocal(position, from, point, skipUpdate)
  }
}
