import { Text, AnimatedSprite, Sprite, Container, Texture, Graphics } from 'Core/abstractions'

import { Optional } from 'Types'

interface IAnimation {
  play(): this
  stop(): this
}

type AnimationProps<AnimObject extends AnimObjectKeys = 'Sprite'> = {
  animObject?: AnimObjectsTypes[AnimObject]
  targetValues?: AnimationValues<AnimObject>
  duration?: number
  delay?: number
  onComplete?: () => void
  onUpdate?: (progress: number) => void
  onStop?: () => void
  infinity?: boolean

  /** Start animation immediately */
  playNow?: boolean

  /** Takes the number of repetitions of the current animation */
  repeat?: number

  /** Prop for animation Easing function */
  easing?: EasingType

  /** This property allows you to test animation */
  debug?: boolean
}

type AnimObjectsTypes = {
  Text: Text
  AnimatedSprite: AnimatedSprite
  Sprite: Sprite
  Container: Container
  Texture: Texture
  Graphics: Graphics
}

type AnimationValues<AnimObject extends AnimObjectKeys = 'Sprite'> = Optional<AnimObjectsTypes[AnimObject]>

type AnimObjectKeys = keyof AnimObjectsTypes

type EasingType = 'None' | 'In' | 'Out' | 'InOut'

type EasingFunc = (t: number) => number

type EasingT = {
  [key in EasingType]: EasingFunc
}

export type { IAnimation, AnimationProps, AnimObjectsTypes, AnimObjectKeys, EasingT, EasingType, EasingFunc, AnimationValues }
