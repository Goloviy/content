import { Spine, type IAnimationStateListener, type ISkeletonData, type IAnimation, type ITrackEntry } from 'pixi-spine'
import { Container as PixiContainer, DisplayObject } from 'pixi.js-legacy'

import { Container, Sprite } from 'Core/abstractions'
import { Transform } from 'Core/abstractions/Transform/Transform'
import { SpineAnimator } from 'Core/animations/Animators/SpineAnimator'
import { TransformAnimator } from 'Core/animations/Animators/TransformAnimator'
import { Delay } from 'Core/animations/Core/Delay'
import type { IAnimatedObject } from 'Core/animations/Core/IAnimatedObject'

import type { Nullable } from 'Types'

import { AnimationJSON, AnimatorType, TargetType } from '../ObjectTypes/AnimatedObjectTypes'

import { AnimationPair, AnimationQueuePair } from './AnimatedObject'

import type { IAnimator } from './IAnimator'
import type { IEvent } from '@pixi-spine/base'

type NullableFunction = Nullable<() => void>

export class SpineObject implements IAnimatedObject {
  objectName: string = ''
  // @ts-ignore
  sprite: Sprite | Container | null = null
  container: Container
  animationsQueue: string[] = []
  penultimateCallback: NullableFunction = null
  endSequenceCallback: NullableFunction = null
  runtimeCallback: NullableFunction = null
  startedCallback: NullableFunction = null
  animationPairs: AnimationPair[] = []
  stopDelay?: (() => void) | undefined = undefined
  spineObject: Spine | undefined
  baseScaleX: number = 1
  baseScaleY: number = 1
  timeScale: number = 1
  spineAnimator: Nullable<SpineAnimator> = null
  otherAnimators: IAnimator[] = []
  pixiContainer: PixiContainer
  // @ts-ignore
  private currentAnimationName: string = ''
  // @ts-ignore
  private animationTime: number = 0

  public constructor(animationJSON: ISkeletonData, baseScaleX: number, baseScaleY: number)
  public constructor(animationJSON?: ISkeletonData, baseScaleX?: number, baseScaleY?: number)

  public constructor(animationJSON?: ISkeletonData, baseScaleX?: number, baseScaleY?: number) {
    this.pixiContainer = new PixiContainer()
    this.pixiContainer.pivot.x = 0
    this.pixiContainer.pivot.y = 0
    this.container = new Container({})
    if (animationJSON) this.setupData(animationJSON, baseScaleX, baseScaleY)
  }

  public setupData(animationJSON: ISkeletonData, baseScaleX: number = 1, baseScaleY: number = 1): void {
    // this.spineObject = SpineStorage.Spines.get(animationJSON)
    if (animationJSON === undefined) {
      // debugger
      console.error('debugger')
    }
    this.baseScaleX = baseScaleX ? baseScaleX : 1
    this.baseScaleY = baseScaleY ? baseScaleY : 1

    this.container.setScale({ x: this.baseScaleX, y: this.baseScaleY })
    this.spineObject = new Spine(animationJSON)
    // this.container.x += this.spineObject.stateData.skeletonData.width / 2

    this.container.addChild(this.pixiContainer)

    if (this.spineObject) this.pixiContainer.addChild(this.spineObject as unknown as DisplayObject)
    // this.container.getPixiObject.addChild(this.spineObject as unknown as PixiContainer)
    this.sprite = this.pixiContainer as unknown as Container
    // this.sprite = app.getPixiObject.renderer.generateTexture(this.spineObject, SCALE_MODES.LINEAR, 360)

    // this.pixiContainer.y += this.spineObject.stateData.skeletonData.height / 2 / 0.6
    this.objectName = this.spineObject?.spineData.name ? this.spineObject.spineData.name : ''
    // if (this.sprite) this.container.addChild(this.sprite)
  }

  getCurrentAnimator(): Nullable<IAnimator> {
    return this.spineAnimator
  }

  setCurrentAnimProgress(progress: number): void {
    this.spineAnimator?.SetProgress(progress)
  }

  getCurrentAnimation(): string {
    return this.spineAnimator?.currentAnimationName ? this.spineAnimator.currentAnimationName : ''
  }

  addAnimationToPlayQueue(animationName: string, isLooping?: boolean): void {
    let hasSpine: boolean = false

    this.spineObject?.stateData.skeletonData.animations.forEach((skeletonAnim: IAnimation) => {
      if (skeletonAnim.name === animationName) hasSpine = true
    })

    if (this.spineAnimator === null && this.spineObject !== undefined) {
      this.spineAnimator = new SpineAnimator(this.spineObject)
    }
    if (hasSpine && this.spineAnimator) {
      this.spineAnimator.PlaySpine(animationName, isLooping)
      const spineCompleteListener = new SpineTracker()

      spineCompleteListener.complete = () => this.onAnimatorPlayingComplete()
      this.spineObject?.state.addListener(spineCompleteListener)
    } else {
      this.animationsQueue.push(animationName)
      if (isLooping) this.Play(animationName, isLooping)
      else this.Play(animationName)
    }
  }

  private Play(animName: string, isLooping?: boolean): void {
    if (this.animationsQueue.length === 0) return

    this.Stop()
    this.currentAnimationName = animName
    this.SelectAnimatorAndPlay(animName, isLooping)
  }

  private Stop(): void {
    this.otherAnimators = []
  }

  private SelectAnimatorAndPlay(animationName: string, isLooping?: boolean): void {
    let animator: IAnimator

    this.animationPairs.forEach(animationPair => {
      if (animationName === animationPair.animationName) {
        if (this.sprite === null || this.sprite.getPixiObject.transform === null || this.sprite.getPixiObject.parent === null) {
          return
        }

        switch (animationPair.animatorType) {
          case AnimatorType.TransformAnimator:
            let target: Transform

            switch (animationPair.target) {
              case TargetType.This:
                target = this.sprite.getPixiObject.transform
                break
              case TargetType.Parent:
                target = this.sprite.getPixiObject.parent.transform
                break
            }

            animator = new TransformAnimator(
              this as IAnimatedObject,
              animationPair.animationData,
              target,
              this.baseScaleX,
              this.baseScaleY,
              isLooping,
            )
            animator.SetTimeScale(this.timeScale)
            animator.completeCallback = () => {
              this.onAnimatorPlayingComplete()
            }
            animator.runtimeCallback = () => {
              this.OnRuntimeCallback()
            }
            animator.startedCallback = () => {
              this.OnStartedCallback()
            }
            this.animationTime = animator.animationTime
            this.otherAnimators.push(animator)
            break
          case AnimatorType.All:
            break
          default:
            console.log('Not find suitable animator return')
            break
        }
      }
    })

    this.otherAnimators.forEach(animator => {
      animator.Play()
    })
  }

  OnRuntimeCallback(): void {
    if (this.runtimeCallback) {
      this.runtimeCallback()
      this.runtimeCallback = null
    }
  }

  OnStartedCallback(): void {
    if (this.startedCallback) {
      this.startedCallback()
      this.startedCallback = null
    }
  }

  addAnimationPair(animationJSON: AnimationJSON): void {
    const pair = this.animationPairs.find(pair => pair.animationName == animationJSON.animationName)

    if (pair !== undefined) {
      return
    }
    this.animationPairs.push(
      new AnimationPair(animationJSON.animationName, animationJSON.animatorType, animationJSON, animationJSON.targetType),
    )
  }

  isPlaying(): boolean {
    return this.spineAnimator?.isPlaying ? this.spineAnimator?.isPlaying : false
  }

  onAnimatorPlayingComplete(): void {
    if (this.animationsQueue.length === 0 && this.endSequenceCallback) {
      this.endSequenceCallback()
      this.endSequenceCallback = null

      return
    }

    this.animationsQueue.shift()

    if (this.animationsQueue.length === 0 && this.penultimateCallback) {
      this.penultimateCallback()
      this.penultimateCallback = null
    }
  }

  async playWithDelay(animName: string, delay: number): Promise<void> {
    if (delay > 0) {
      const delayOptions = Delay.CreateDelay({ delay, onCancel: () => console.log('Delay cancelled') })

      this.stopDelay = delayOptions.Cancel

      await delayOptions.delay
    }

    this.addAnimationToPlayQueue(animName)
  }

  async playAnimationQueuePairs(pairs: AnimationQueuePair[]): Promise<void> {
    let i: number = 0
    const pairsLength: number = pairs.length

    for (i; i < pairsLength; i++) {
      const anim = this.animationPairs.find(animPair => animPair.animationName == pairs[i].animName)
      const delay = pairs[i].delay
      const delayOptions = Delay.CreateDelay({ delay, onCancel: () => console.log('Delay cancelled') })

      this.stopDelay = delayOptions.Cancel

      await delayOptions.delay

      if (anim) {
        if (pairs[i].callback !== null) this.penultimateCallback = pairs[i].callback
        this.addAnimationToPlayQueue(anim.animationName)
      }
    }
  }

  setTimeScale(ts: number): void {
    this.timeScale = ts
    this.spineAnimator?.SetTimeScale(ts)
  }

  onRelease(): void {
    throw new Error('Method not implemented.')
  }

  onGet(): void {
    throw new Error('Method not implemented.')
  }
}

export class SpineTracker implements IAnimationStateListener {
  start?(entry: ITrackEntry): void
  interrupt?(entry: ITrackEntry): void
  end?(entry: ITrackEntry): void
  dispose?(entry: ITrackEntry): void
  complete?(entry: ITrackEntry): void
  event?(entry: ITrackEntry, event: IEvent): void
}
