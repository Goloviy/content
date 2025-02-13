import type { AnimatorType } from 'Core/animations/ObjectTypes/AnimatedObjectTypes'

export interface IAnimator {
  Play(): void

  Stop(): void

  Reset(): void

  SetTimeScale(ts: number): void

  animatorType: AnimatorType
  animationTime: number
  currentTime: number
  isPlaying: boolean
  timeScale: number
  completeCallback: (() => void) | undefined
  runtimeCallback: (() => void) | null
  startedCallback: (() => void) | null
}
