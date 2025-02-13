import { WidgetPlayMode } from '../Animators/WidgetColorAnimator'
import { Color } from '../Core/Color'

import type { AnimationCurveType } from './AnimatedObjectTypes'

export type WidgetColorJSON = {
  animationTime: number
  useAnimationCurve: boolean
  playMode: WidgetPlayMode
  colorA: Color
  colorB: Color
  animationCurve: AnimationCurveType
}
