import type { CustomEvent } from './AnimatedObjectTypes'

type MultiAnimatedObjectJSON = {
  structure: MultiStructureJSON[]
  animations: MultiAnimation[]
}

type MultiTransformJSON = {
  structure: TransformJson[]
  containerWidth: number
  containerHeight: number
}

interface MultiStructureJSON extends TransformJson {
  startSpriteIndex: number
  startAlpha: number
  defaultAfterAnim: boolean
  childs: MultiStructureJSON[]
}

interface TransformJson {
  objectName: string
  posX: number
  posY: number
  pivotX: number
  pivotY: number
  scaleX: number
  scaleY: number
  anchorMin?: Vector2
  anchorMax?: Vector2
  rot: number
  childs: TransformJson[]
}

type Vector2 = {
  X: number
  Y: number
}

type MultiAnimation = {
  animationName: string
  animationTime: number
  subAnims: MultiSubAnim[]
  customEvents: CustomEvent[]
}

type MultiSubAnim = {
  animationName: string
  animationTime: number
  path: number[]
  startTime: number
}

export type {
  MultiSubAnim,
  MultiAnimation,
  Vector2,
  TransformJson,
  MultiStructureJSON,
  MultiTransformJSON,
  MultiAnimatedObjectJSON,
}
