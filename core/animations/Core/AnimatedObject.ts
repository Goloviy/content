import { BaseTexture, Container, Sprite, Texture } from 'Core/abstractions'
import { Transform } from 'Core/abstractions/Transform/Transform'
import { AnimationJSON, AnimatorType, AtlasParser, TargetType } from 'Core/animations/ObjectTypes/AnimatedObjectTypes'

import type { Nullable } from 'Types'

import { SpriteFramesAnimator } from '../Animators/SpriteFramesAnimator'
import { TransformAnimator } from '../Animators/TransformAnimator'

import { Delay } from './Delay'

import type { IAnimatedObject } from './IAnimatedObject'
import type { IAnimator } from './IAnimator'

export class AnimatedObject implements IAnimatedObject {
  endSequenceCallback: Nullable<() => void> = null
  objectName: string = ''
  animationsQueue: string[] = []
  currentAnimators: IAnimator[] = []
  animationPairs: AnimationPair[] = []
  cachedTexturePairs: TexturesPair[] = []
  sprite: Nullable<Sprite> = null
  container: Container
  animationTime: number = 0
  baseScaleX: number = 1
  baseScaleY: number = 1
  timeScale: number = 1
  penultimateCallback: Nullable<() => void> = null
  runtimeCallback: Nullable<() => void> = null
  startedCallback: Nullable<() => void> = null
  stopDelay?: () => void
  currentAnimationName: string | undefined

  public constructor(animationJSON?: AnimationJSON, baseTexture?: BaseTexture, baseScaleX?: number, baseScaleY?: number)

  public constructor(animationJSON: AnimationJSON, baseTexture: BaseTexture, baseScaleX: number, baseScaleY: number)
  public constructor(animationJSON: AnimationJSON, baseTexture: BaseTexture, baseScaleX?: number, baseScaleY?: number)

  public constructor(animationJSON?: AnimationJSON, baseTexture?: BaseTexture, baseScaleX?: number, baseScaleY?: number) {
    this.container = new Container({})
    if (animationJSON && baseTexture) {
      if (animationJSON.scaleX && animationJSON.scaleY) {
        this.setupData(animationJSON, baseTexture, animationJSON.scaleX, animationJSON.scaleY)
      } else this.setupData(animationJSON, baseTexture, baseScaleX, baseScaleY)
    }
  }

  public setupData(
    animationJSON: AnimationJSON,
    baseTexture: BaseTexture,
    baseScaleX: number = 1,
    baseScaleY: number = 1,
    useCache: boolean = true,
  ): void {
    this.baseScaleX = animationJSON.scaleX ? animationJSON.scaleX : baseScaleX
    this.baseScaleY = animationJSON.scaleY ? animationJSON.scaleY : baseScaleY
    this.cachedTexturePairs.push(
      new TexturesPair(
        animationJSON.animationName,
        AtlasParser.ParseAtlasData(baseTexture, animationJSON.animationAtlases, useCache),
      ),
    )
    this.ParseAnimationsJSON(animationJSON)
    this.objectName = baseTexture.textureCacheIds[0]
    this.CreateSpriteInContainer()
  }

  public onRelease(): void {
    this.timeScale = 1
    this.cachedTexturePairs = []
    this.objectName = ''
    this.penultimateCallback = null
    this.runtimeCallback = null
    this.startedCallback = null
    if (this.currentAnimators && this.currentAnimators.length > 0) {
      this.currentAnimators.forEach(animator => animator.Stop())
    }
    this.currentAnimators = []
    this.animationPairs = []
    this.animationsQueue = []
    this.stopDelay = undefined
    this.animationTime = 0
    this.currentAnimationName = undefined
    this.sprite?.getPixiObject.destroy()
    this.sprite = null
    this.container.alpha = 1
    this.container.setScale({ x: 1, y: 1 })
    this.container.setPosition({ x: 0, y: 0 })
  }

  public onGet() {}

  getCurrentAnimator(): IAnimator | null {
    if (this.currentAnimators != null && this.currentAnimators.length > 0) {
      return this.currentAnimators[0]
    } else return null
  }

  getCurrentAnimation(): string {
    return Array.from(this.animationsQueue).join(',')
  }

  setCurrentAnimProgress(progress: number): void {
    this.currentAnimators.forEach(animator => {
      animator.currentTime = animator.animationTime * progress
    })
  }

  addAnimationToPlayQueue(animationName: string, isLooping?: boolean | number): void {
    this.animationsQueue.push(animationName)
    if (isLooping) this.Play(animationName, isLooping)
    else this.Play(animationName)
  }

  AddAnimationsToPlayQueue(animationNames: string[]): void {
    animationNames.forEach(anim => {
      this.animationsQueue.push(anim)
    })

    this.Play(animationNames[0])
  }

  async playAnimationQueuePairs(pairs: AnimationQueuePair[]): Promise<void> {
    let i: number = 0

    for (i; i < pairs.length; i++) {
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

  async playWithDelay(animName: string, delay: number): Promise<void> {
    if (delay > 0) {
      const delayOptions = Delay.CreateDelay({ delay, onCancel: () => console.log('Delay cancelled') })

      this.stopDelay = delayOptions.Cancel

      await delayOptions.delay
    }

    this.addAnimationToPlayQueue(animName)
  }

  isPlaying(): boolean {
    return this.animationsQueue.length !== 0
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

  setTimeScale(ts: number): void {
    this.timeScale = ts
    if (this.currentAnimators.length === 0) {
      return
    }

    this.currentAnimators.forEach(animator => {
      animator.SetTimeScale(this.timeScale)
    })
  }

  addAnimationPair(animationJSON: AnimationJSON, baseTexture?: BaseTexture): void {
    const pair = this.animationPairs.find(pair => pair.animationName == animationJSON.animationName)

    if (pair !== undefined) {
      return
    }
    if (baseTexture) {
      this.cachedTexturePairs.push(
        new TexturesPair(animationJSON.animationName, AtlasParser.ParseAtlasData(baseTexture, animationJSON.animationAtlases)),
      )
    }

    this.animationPairs.push(
      new AnimationPair(animationJSON.animationName, animationJSON.animatorType, animationJSON, animationJSON.targetType),
    )
  }

  private Play(animName: string, isLooping: boolean | number = false): void {
    if (this.animationsQueue.length === 0) return
    this.Stop()
    this.currentAnimationName = animName
    this.SelectAnimatorAndPlay(animName, isLooping)
    this.OnStartedCallback()
  }

  private Stop() {
    this.currentAnimators = []
  }

  private ParseAnimationsJSON(inputJSON: AnimationJSON): AnimationPair[] {
    this.animationPairs.push(new AnimationPair(inputJSON.animationName, inputJSON.animatorType, inputJSON, inputJSON.targetType))

    return this.animationPairs
  }

  private SelectAnimatorAndPlay(animationName: string, isLooping: boolean | number = false): void {
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
              this,
              animationPair.animationData,
              target,
              this.baseScaleX,
              this.baseScaleY,
              isLooping,
            )
            animator.SetTimeScale(this.timeScale)
            animator.startedCallback = () => {
              this.OnStartedCallback()
            }
            animator.completeCallback = () => {
              this.onAnimatorPlayingComplete()
            }
            animator.runtimeCallback = () => {
              this.OnRuntimeCallback()
            }
            this.animationTime = animator.animationTime
            this.currentAnimators.push(animator)
            break
          case AnimatorType.SpriteFramesAnimator:
            let textures: Texture[] = this.cachedTexturePairs[0].cachedTextures

            for (const texturePair of this.cachedTexturePairs) {
              if (texturePair.animName == animationName) {
                textures = texturePair.cachedTextures
                break
              }
            }

            animator = new SpriteFramesAnimator(this, animationPair.animationData, textures, this.sprite, isLooping)
            animator.SetTimeScale(this.timeScale)
            animator.startedCallback = () => {
              this.OnStartedCallback()
            }
            animator.completeCallback = () => {
              this.onAnimatorPlayingComplete()
            }
            animator.runtimeCallback = () => {
              this.OnRuntimeCallback()
            }
            this.animationTime = animator.animationTime
            this.currentAnimators.push(animator)
            break
          case AnimatorType.All:
            break
          default:
            console.log('Not find suitable animator return')
            break
        }
      }
    })

    this.currentAnimators.forEach(animator => {
      animator.Play()
    })
  }

  private CreateSpriteInContainer(): void {
    if (this.sprite != null) {
      this.sprite.texture = this.cachedTexturePairs[0].cachedTextures[0]
      this.sprite.getPixiObject.scale.set(this.baseScaleX, this.baseScaleY)
    } else {
      this.sprite = new Sprite({})
      this.sprite.texture = this.cachedTexturePairs[0].cachedTextures[0]
      this.sprite.getPixiObject.scale.set(this.baseScaleX, this.baseScaleY)
      this.sprite.getPixiObject.anchor.set(0.5, 0.5)
      this.container.addChild(this.sprite)
    }
  }
}

export class AnimationPair {
  animatorType: AnimatorType
  animationName: string
  animationData: AnimationJSON
  target: TargetType

  constructor(animName: string, animatorType: AnimatorType, animData: AnimationJSON, target: TargetType) {
    this.animationName = animName
    this.animatorType = animatorType
    this.animationData = animData
    this.target = target
  }
}

export class AnimationQueuePair {
  animName: string
  delay: number
  callback: (() => void) | null

  constructor(animName: string, delay: number, callback: (() => void) | null = null) {
    this.animName = animName
    this.delay = delay
    this.callback = callback
  }
}

export class TexturesPair {
  animName: string
  cachedTextures: Texture[]
  constructor(animName: string, cachedTextures: Texture[]) {
    this.animName = animName
    this.cachedTextures = cachedTextures
  }
}
