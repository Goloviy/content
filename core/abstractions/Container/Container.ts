import { Container as PixiContainer, DisplayObject, MaskData } from 'pixi.js-legacy'

import { InteractiveElements } from 'Core/abstractions'
import type { IContainerOptions, AlignCenterPropsTypes, CursorType } from 'Core/abstractions/types'

import type { Nullable } from 'Types'

export class Container extends InteractiveElements {
  protected _pixiContainer
  private _name: string
  private _x: number
  private _y: number
  private readonly _scale: number | undefined
  private _zIndex: number
  private _width: number | undefined
  private _height: number | undefined
  private _alpha: number
  private _mask: Nullable<PixiContainer | MaskData>
  private _cursor: CursorType
  private _interactive: boolean
  private _visible: boolean
  private _hitArea: Nullable<PIXI.IHitArea>
  private _sortableChildren: boolean

  constructor({
    x = 0,
    y = 0,
    name = '',
    scale,
    cursor = 'default',
    interactive = false,
    zIndex = 0,
    width,
    height,
    alpha = 1,
    mask = null,
    visible = true,
    sortableChildren = false,
  }: IContainerOptions) {
    super()
    this._pixiContainer = new PixiContainer()
    this._interactiveElement = this._pixiContainer
    this._baseElement = this._pixiContainer

    this._name = name
    this._x = x
    this._y = y
    if (scale) this._scale = scale
    this._cursor = cursor
    this._interactive = interactive
    this._zIndex = zIndex
    this._width = width
    this._height = height
    this._alpha = alpha
    this._mask = mask
    this._visible = visible
    this._hitArea = null
    this._sortableChildren = sortableChildren

    this.setup()
  }

  private setup(): void {
    this._pixiContainer.name = this._name
    this._pixiContainer.x = this._x
    this._pixiContainer.y = this._y
    if (this._width) this._pixiContainer.width = this._width
    if (this._mask) this._pixiContainer.mask = this._mask
    if (this._height) this._pixiContainer.height = this._height
    if (this._scale) this._pixiContainer.scale.set(this._scale)

    this._pixiContainer.alpha = this._alpha
    this._pixiContainer.cursor = this._cursor
    this._pixiContainer.interactive = this._interactive
    this._pixiContainer.visible = this._visible
    if (this._zIndex) this._pixiContainer.zIndex = this._zIndex
    this._pixiContainer.sortableChildren = this._sortableChildren
  }

  get name(): string {
    return this._pixiContainer.name
  }

  set name(value: string) {
    this._name = value
    this._pixiContainer.name = this._name
  }

  get x(): number {
    return this._pixiContainer.x
  }

  set x(value: number) {
    this._x = value
    this._pixiContainer.x = this._x
  }

  get y(): number {
    return this._pixiContainer.y
  }

  set y(value: number) {
    this._y = value
    this._pixiContainer.y = this._y
  }

  get cursor(): CursorType {
    return this._pixiContainer.cursor as CursorType
  }

  set cursor(value: CursorType) {
    this._cursor = value
    this._pixiContainer.cursor = this._cursor
  }

  get interactive(): boolean {
    return this._pixiContainer.interactive
  }

  set interactive(value: boolean) {
    this._interactive = value
    this._pixiContainer.interactive = this._interactive
  }

  get visible(): boolean {
    return this._pixiContainer.visible
  }

  set visible(value: boolean) {
    this._visible = value
    this._pixiContainer.visible = this._visible
  }

  get zIndex(): number {
    return this._pixiContainer.zIndex
  }

  set zIndex(value: number) {
    this._zIndex = value
    this._pixiContainer.zIndex = this._zIndex
  }

  get width(): number {
    return this._pixiContainer.width
  }

  set width(value: number) {
    this._width = value
    this._pixiContainer.width = value
  }

  get height(): number {
    return this._pixiContainer.height
  }

  set height(value: number) {
    this._height = value
    this._pixiContainer.height = value
  }

  get hitArea(): PIXI.IHitArea {
    return this._pixiContainer.hitArea
  }

  set hitArea(value: PIXI.IHitArea) {
    this._hitArea = value
    this._pixiContainer.hitArea = this._hitArea
  }

  get alpha(): number {
    return this._pixiContainer.alpha
  }

  set alpha(value: number) {
    this._alpha = value
    this._pixiContainer.alpha = this._alpha
  }

  set mask(value: PIXI.Container | PIXI.MaskData | null) {
    this._mask = value
    this._pixiContainer.mask = value
  }

  setMask(mask: PIXI.Container | PIXI.MaskData | null): void {
    if (this._mask) this._pixiContainer.mask = mask
  }

  get sortableChildren(): boolean {
    return this._pixiContainer.sortableChildren
  }

  set sortableChildren(value: boolean) {
    this._pixiContainer.sortableChildren = value
  }

  get getPixiObject() {
    return this._pixiContainer
  }

  get children() {
    return this._baseElement.children
  }

  get parent() {
    return this._pixiContainer.parent
  }

  getChildByName(name: string, deep: boolean = false): DisplayObject {
    return this._baseElement.getChildByName(name, deep)
  }

  getBounds(): PIXI.Rectangle {
    return this._pixiContainer.getBounds()
  }

  destroy(): void {
    return this._baseElement.destroy()
  }

  public alignCenter({ parentWidth = 0, parentHeight = 0 }: AlignCenterPropsTypes): void {
    this._pixiContainer.position.set(parentWidth / 2, parentHeight / 2)
  }

  public getWidth(): number | undefined {
    return this._width
  }
}
