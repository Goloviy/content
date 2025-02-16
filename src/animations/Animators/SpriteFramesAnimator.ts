import { MathCore } from '../MathCore/MathCore'
import { AnimationJSON, CustomEvent, CustomEventType } from './AnimatedObjectTypes'
import { AnimationCurve } from './AnimationCurve'
import { Sprite, Texture, Ticker } from 'pixi.js-legacy'
import { IAnimator } from '../Abstraction/IAnimator'
import { AnimatorType } from '../Abstraction/AnimatorType'

export class SpriteFramesAnimator implements IAnimator
{
  animatorType: AnimatorType = AnimatorType.FramesAnimator
  startDelay: number
  animationTime: number
  animationCurve: AnimationCurve
  timeScale: number = 1
  currentFrameTexture: Texture
  currentTime: number = 0
  isPlaying: boolean
  reseted: boolean
  cachedTextures: Texture[]
  progress: number = 0
  isLooping: boolean | number = false
  targetFPS: number = 60
  currentSpriteFrame: number = 0
  sprite: Sprite
  ticker = Ticker.shared
  customEvents: CustomEvent[]
  completeCallback: (() => void) | undefined
  runtimeCallback: (() => void) | null = null
  startedCallback: (() => void) | null = null

  constructor(
    atlasJSON: AnimationJSON,
    cachedTextures: Texture[],
    sprite: Sprite,
    isLopping: boolean | number = false,
  ) {
    this.startDelay = 0
    this.isPlaying = false
    this.reseted = false
    this.isLooping = isLopping
    this.sprite = sprite
    this.cachedTextures = cachedTextures
    this.customEvents = atlasJSON.customEvents

    this.currentFrameTexture = this.cachedTextures[0]

    this.animationCurve = new AnimationCurve()

    this.animationCurve.deserialize(atlasJSON.curvesData[0].animationCurve)
    this.animationTime = atlasJSON.animationTime
  }

  Play(): void {
    this.isPlaying = true
    if (this.startedCallback !== null) {
      this.startedCallback()
      this.startedCallback = null
    }
    this.ticker.add(this.loopFunction)
  }

  public GoToFrame(index: number) {
    index = MathCore.Clamp(index, 0, this.cachedTextures.length)
    this.currentFrameTexture = this.cachedTextures[index]

    return this.currentFrameTexture
  }

  loopFunction = () => this.Update()

  Update(): void
  {
    if (typeof this.isLooping === 'boolean' && this.isLooping)
    {
      this.currentTime = (this.currentTime + (Ticker.shared.deltaMS * this.timeScale) / 1000) % this.animationTime
    }
    else
    {
      this.currentTime += (Ticker.shared.deltaMS * this.timeScale) / 1000
    }

    this.progress = this.currentTime / this.animationTime

    this.HandleEvents()

    if (this.animationCurve.keys.length >= 2) {
      var curCurveTime = this.progress

      this.progress = this.animationCurve.Evaluate(curCurveTime)
      this.progress = MathCore.Clamp(this.progress, 0, 1)
    }

    this.currentSpriteFrame = Math.floor(this.progress * this.cachedTextures.length)
    if (this.currentSpriteFrame > this.cachedTextures.length - 1) this.currentSpriteFrame = this.cachedTextures.length - 1
    else if (this.currentSpriteFrame < 0) {
      this.currentSpriteFrame = 0
    }
    this.currentFrameTexture = this.cachedTextures[this.currentSpriteFrame]
    this.sprite.texture = this.currentFrameTexture

    if (
      (typeof this.isLooping === 'boolean' && !this.isLooping && this.currentTime >= this.animationTime) ||
      (typeof this.isLooping === 'number' && this.isLooping === 1 && this.currentTime >= this.animationTime)
    ) {
      this.Stop()
    } else if (typeof this.isLooping === 'number' && this.currentTime >= this.animationTime) {
      this.currentTime = 0
      this.isLooping--
    }
  }

  Stop(): void {
    this.isPlaying = false
    this.ticker.remove(this.loopFunction)

    if (this.completeCallback !== undefined) {
      this.completeCallback()
      this.completeCallback = undefined
    }
  }

  SetTimeScale(ts: number): void {
    this.timeScale = ts
  }

  Reset(): void {
    this.currentTime = 0
    this.currentSpriteFrame = 0
    this.currentFrameTexture = this.cachedTextures[0]
    this.reseted = true
  }

  private HandleRuntimeCallback() {
    if (this.runtimeCallback !== null) {
      this.runtimeCallback()
      this.runtimeCallback = null
    }
  }

  private HandleEvents(): void {
    this.customEvents.forEach(customEvent => {
      if (customEvent.time <= this.currentTime * 1000) {
        switch (customEvent.eventType) {
          case CustomEventType.CallFunction:
            this.HandleRuntimeCallback()
            break
          case CustomEventType.PlayAnimation:
            //this.animatedObject.addAnimationToPlayQueue(customEvent.functionName)
            break
        }
      }
    })
    this.customEvents = this.customEvents.filter(customEvent => customEvent.time > this.currentTime * 1000)
  }
}
