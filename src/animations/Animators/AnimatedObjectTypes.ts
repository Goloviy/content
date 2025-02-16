import { BaseTexture, Point, Rectangle, Texture } from 'pixi.js-legacy'

export enum AnimatorType {
  Other = 'Other',
  SpriteFramesAnimator = 'SpriteFramesAnimator',
  TransformAnimator = 'TransformAnimator',
  WidgetColorAnimator = 'WidgetColorAnimator',
  SpineAnimator = 'SpineAnimator',
  All = 'All',
}

export type AnimationCurveType = {
  times: number[]
  values: number[]
  inTangents: number[]
  outTangents: number[] | 'copy'
}

export type CurveType = {
  path: string
  type: string
  propertyName: string
  animationCurve: AnimationCurveType
}

export type AnimationJSON = {
  animationName: string
  scaleX: number
  scaleY: number
  animatorType: AnimatorType
  targetType: TargetType
  animationTime: number
  curvesData: CurveType[]
  animationAtlases: AtlasDataType
  customEvents: CustomEvent[]
}

export type CustomEvent = {
  functionName: string
  time: number
  eventType: CustomEventType
}

export enum CustomEventType {
  CallFunction = 'CallFunction',
  PlayAnimation = 'PlayAnimation',
}

export class AtlasDataType {
  [key: string]: {
    x: number
    y: number
    width: number
    height: number
    paddingLeft: number
    paddingTop: number
    paddingRight: number
    paddingBottom: number
    index: number
    rotate: boolean
  }
}

export class AtlasParser {
  static atlasCache: Map<BaseTexture, Texture[]> = new Map<BaseTexture, Texture[]>()

  static ParseAtlasData(atlas: BaseTexture, atlasData: AtlasDataType, useCache: boolean = true): Texture[] {
    let cacheTextures: Texture[] | undefined = AtlasParser.atlasCache.get(atlas)

    if (useCache && cacheTextures !== undefined) {
      return cacheTextures
    } else {
      cacheTextures = []
      Object.entries(atlasData).forEach(data => {
        const rectFrame = new Rectangle(data[1].x, data[1].y, data[1].width, data[1].height)
        const rectCrop = new Rectangle(
          data[1].x,
          data[1].y,
          data[1].width + data[1].paddingRight + data[1].paddingLeft,
          data[1].height + data[1].paddingBottom + data[1].paddingTop,
        )
        const rectTrim = new Rectangle(data[1].paddingLeft, data[1].paddingTop, data[1].width, data[1].height)

        cacheTextures?.push(new Texture(atlas, rectFrame, rectCrop, rectTrim, 0, new Point(0, 0)))
      })
      AtlasParser.atlasCache.set(atlas, cacheTextures)

      return cacheTextures
    }
  }
}

export enum TargetType {
  This = 'This',
  Parent = 'Parent',
}
