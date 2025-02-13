import {
  BaseTexture,
  Container,
  Container as PixiContainer,
  DisplayObject,
  Graphics,
  InteractionData,
  MaskData,
  Sprite,
  TextStyle,
  Texture as PixiTexture,
  IPointData,
} from 'pixi.js-legacy'

import { Rectangle, Texture } from 'Core/abstractions'

type CursorType =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'verticaltext'
  | 'alias'
  | 'copy'
  | 'move'
  | 'nodrop'
  | 'notallowed'
  | 'eresize'
  | 'nresize'
  | 'neresize'
  | 'nwresize'
  | 'sresize'
  | 'seresize'
  | 'swresize'
  | 'wresize'
  | 'nsresize'
  | 'ewresize'
  | 'neswresize'
  | 'colresize'
  | 'nwseresize'
  | 'rowresize'
  | 'allscroll'
  | 'zoomin'
  | 'zoomout'
  | 'grab'
  | 'grabbing'

type IApplicationOptions = Partial<{
  width: number
  height: number
  view: HTMLCanvasElement
  transparent: boolean
  antialias: boolean
  resolution: number
  backgroundColor: number
  clearBeforeRender: boolean
  forceCanvas: boolean
  preserveDrawingBuffer: boolean
  powerPreference: 'default' | 'high-performance' | 'low-power'
  autoDensity: boolean
}>

type IRemoveChildren = Partial<{
  beginIndex: number
  endIndex: number
}>

type IPointDataOptions = Partial<{
  x: number
  y: number
}>

type IContainerOptions = Partial<{
  name: string
  scale: number
  cursor: CursorType
  interactive: boolean
  zIndex: number
  x: number
  y: number
  width: number
  height: number
  alpha: number
  mask: PixiContainer | MaskData | null
  visible: boolean
  hitArea: PIXI.IHitArea
  sortableChildren: boolean
}>

type CornersTypes =
  | ''
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'bottom'
  | 'right'
  | 'left'
  | 'top-left-and-bottom-right'
  | 'top-right-and-bottom-left'

type IGraphicsOptions = Partial<{
  x: number
  y: number
  width: number
  height: number
  radius: number
  color: number
  alpha: number
  zIndex: number
  name: string
  lineStyle: LineStyleTypes
  tint: number
  cursor: CursorType
  interactive: boolean
  corners: CornersTypes
  mask: PIXI.Container | PIXI.MaskData | null
  visible: boolean
}>

type LineStyleTypes = Partial<{
  width: number
  color: number
  alpha: number
}>

type IDrawRoundedRectangleOptions = Partial<{
  x: number
  y: number
  width: number
  height: number
  radius: number
  corners: CornersTypes
  lineStyle: LineStyleTypes
}>

type IDrawCircleOptions = Partial<{
  x: number
  y: number
  radius: number
}>

type InteractiveElementsType = Container | Sprite | Graphics

type IInteractionEventOptions = {
  stopped: boolean
  target: DisplayObject
  currentTarget: DisplayObject
  type: string
  data: InteractionData
}

type IRectangleOptions = Partial<{
  x: number
  y: number
  width: number
  height: number
}>

type ISpriteOptions = Partial<{
  path: string
  texture: Texture
  x: number
  y: number
  width: number
  height: number
  tint: number
  cursor: CursorType
  interactive: boolean
  zIndex: number
  name: string
  scale: number | null
  rotation: number | null
  alpha: number
  angle: number
  mask: PIXI.Container | PIXI.MaskData | null
  anchor: SetAnchorPropsTypes
}>

type SetAnchorPropsTypes = Partial<{
  x: number
  y: number
}>

type AlignCenterPropsTypes = Partial<{
  parentWidth: number
  parentHeight: number
}>

type ITextOptions = Partial<{
  text: string
  width: number
  height: number
  x: number
  y: number
  style: Partial<TextStyle>
  name: string
  zIndex: number
  tint: number
  resolution: number
  interactive: boolean
  alpha: number
  buttonMode: boolean
  texture: PixiTexture | null
}>

type ITextStyleOptions = Partial<{
  align: 'left' | 'center' | 'right' | 'justify'
  breakWords: boolean
  dropShadow: boolean
  dropShadowAlpha: number
  dropShadowAngle: number
  dropShadowBlur: number
  dropShadowColor: string | number
  dropShadowDistance: number
  fill: string | string[] | number | number[] | CanvasGradient | CanvasPattern
  fillGradientType: number
  fillGradientStops: number[]
  fontFamily: string | string[]
  fontSize: number | string
  fontStyle: 'normal' | 'italic' | 'oblique'
  fontVariant: 'normal' | 'small-caps'
  fontWeight: 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  leading: number
  letterSpacing: number
  lineHeight: number
  lineJoin: string
  miterLimit: number
  padding: number
  stroke: string | number
  strokeThickness: number
  trim: boolean
  textBaseline: string
  whiteSpace: string
  wordWrap: boolean
  wordWrapWidth: number
}>

type ITextureOptions = Partial<{
  width: number
  height: number
  frame: Rectangle
  orig: Rectangle
  trim: Rectangle
  rotate: number
  anchor: IPointData
}> & { texture: BaseTexture }

export type {
  IApplicationOptions,
  IContainerOptions,
  IRectangleOptions,
  ISpriteOptions,
  ITextOptions,
  ITextStyleOptions,
  AlignCenterPropsTypes,
  IRemoveChildren,
  IGraphicsOptions,
  LineStyleTypes,
  CornersTypes,
  IDrawRoundedRectangleOptions,
  IDrawCircleOptions,
  IInteractionEventOptions,
  InteractiveElementsType,
  SetAnchorPropsTypes,
  ITextureOptions,
  IPointDataOptions,
  CursorType,
}
