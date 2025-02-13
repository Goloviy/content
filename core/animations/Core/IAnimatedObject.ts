import { BaseTexture, Container, Sprite } from 'Core/abstractions'
import type { IAnimator } from 'Core/animations/Core/IAnimator'
import { AnimationJSON } from 'Core/animations/ObjectTypes/AnimatedObjectTypes'

import type { Nullable } from 'Types'

import { AnimationQueuePair } from './AnimatedObject'

import type { IPoolObject } from '../../../utils/objectPool'

export interface IAnimatedObject extends IPoolObject {
  objectName: string
  sprite: Nullable<Sprite>
  container: Container
  penultimateCallback: Nullable<() => void>
  endSequenceCallback: Nullable<() => void>
  runtimeCallback: Nullable<() => void>
  startedCallback: Nullable<() => void>
  stopDelay?: () => void

  getCurrentAnimator(): Nullable<IAnimator>

  setCurrentAnimProgress(progress: number): void

  getCurrentAnimation(): string

  addAnimationToPlayQueue(animationName: string, isLooping?: boolean | number): void

  addAnimationPair(animationJSON: AnimationJSON, baseTexture?: BaseTexture): void

  isPlaying(): boolean

  onAnimatorPlayingComplete(): void

  playWithDelay(animName: string, delay: number): void

  playAnimationQueuePairs(pairs: AnimationQueuePair[]): void

  setTimeScale(ts: number): void
}
