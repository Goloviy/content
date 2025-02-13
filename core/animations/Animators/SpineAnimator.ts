import { Spine } from 'pixi-spine'

import { IAnimator } from 'Core/animations/Core/IAnimator'

import { AnimatorType } from '../ObjectTypes/AnimatedObjectTypes'

export class SpineAnimator implements IAnimator {
  currentAnimationName: string = ''
  isLooping: boolean = false
  spineObject: Spine

  constructor(spineObject: Spine, animationName?: string, looping?: boolean) {
    this.spineObject = spineObject
    if (animationName) this.currentAnimationName = animationName
    if (looping) this.isLooping = looping
  }

  Play(): void {
    if (GLOBAL_TIME_SCALE) {
      this.timeScale *= GLOBAL_TIME_SCALE
      console.log(this.timeScale)
    }
    this.spineObject.state.timeScale = this.timeScale
    this.PlaySpine(this.currentAnimationName, this.isLooping)
  }

  PlaySpine(animName: string, looping: boolean = false): void {
    this.spineObject.state.setAnimation(0, animName, looping)
    this.currentAnimationName = animName
  }

  Stop(): void {
    this.spineObject.state.timeScale = 0
    this.currentAnimationName = ''
  }

  Reset(): void {
    this.spineObject.state.setEmptyAnimation(0, 0)
    this.currentAnimationName = ''
  }

  SetTimeScale(ts: number): void {
    this.timeScale = ts
  }

  SetProgress(progress: number): void {
    this.spineObject.state.tracks[0].trackTime *= progress
  }

  SetAnimation(animName: string, looping: boolean = false): void {
    this.spineObject.state.setAnimation(0, animName, looping)
  }

  GetCurrentAnimation() {
    return this.currentAnimationName
  }

  animatorType: AnimatorType = AnimatorType.SpineAnimator
  animationTime: number = 0
  currentTime: number = 0
  isPlaying: boolean = false
  timeScale: number = 1
  completeCallback: (() => void) | undefined
  runtimeCallback: (() => void) | null = null
  startedCallback: (() => void) | null = null
}
