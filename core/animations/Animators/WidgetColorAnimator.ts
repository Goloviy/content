import { Sprite, Ticker } from 'Core/abstractions'
import { MathCore } from 'Core/animations/MathCore/MathCore'

import { AnimationCurve } from '../Core/AnimationCurve'
import { Color } from '../Core/Color'
import { IAnimator } from '../Core/IAnimator'
import { Keyframe } from '../Core/KeyFrame'
import { AnimatorType } from '../ObjectTypes/AnimatedObjectTypes'
import { WidgetColorJSON } from '../ObjectTypes/WidgetColorAnimatorTypes'

export class WidgetColorAnimator implements IAnimator {
  animatorType: AnimatorType = AnimatorType.WidgetColorAnimator
  targetWidgets: ColorPair[] = []
  colorA: Color
  colorB: Color
  animationTime: number
  useAnimationCurve: boolean
  animationCurve: AnimationCurve
  firstCurveKey: Keyframe | null = null
  lastCurveKey: Keyframe | null = null
  timeScale: number = 1
  totalCurveTime: number
  currentTime: number = 0
  isPlaying: boolean = false
  reset: boolean = false
  ticker = Ticker.shared
  direction: number = 1
  playMode: WidgetPlayMode = WidgetPlayMode.Default

  completeCallback: (() => void) | undefined = undefined
  runtimeCallback: (() => void) | null = null
  startedCallback: (() => void) | null = null

  constructor(widgetJSON: WidgetColorJSON, sprites: Sprite[]) {
    this.colorA = widgetJSON.colorA
    this.colorB = widgetJSON.colorB
    this.animationTime = widgetJSON.animationTime
    this.useAnimationCurve = widgetJSON.useAnimationCurve
    this.animationCurve = new AnimationCurve()
    this.animationCurve.deserialize(widgetJSON.animationCurve)
    this.totalCurveTime = this.animationCurve.keys[this.animationCurve.keys.length - 1].time
    this.ticker = Ticker.shared
    sprites.forEach(sprite => {
      const rgbaColor: Color = Color.hexToRgba(sprite.tint.toString())
      const colorPair: ColorPair = new ColorPair(sprite, rgbaColor)

      this.targetWidgets.push(colorPair)
    })

    this.Initialize()
  }

  Play() {
    this.isPlaying = true
    this.ticker.add(this.loopFunction)

    if (this.startedCallback) {
      this.startedCallback()
      this.startedCallback = null
    }
  }

  Stop() {
    if (!this.isPlaying) return

    if (this.useAnimationCurve)
      if (this.direction == 1)
        for (var widgetIndex = 0; widgetIndex < this.targetWidgets.length; widgetIndex++) {
          Color.qLerp(
            this.targetWidgets[widgetIndex].color,
            this.colorA,
            this.colorB,
            this.animationCurve.keys[this.animationCurve.keys.length - 1].value,
          )
          if (this.targetWidgets[widgetIndex].color.a === 1) {
            this.targetWidgets[widgetIndex].color.a = 0.99
          }
          this.targetWidgets[widgetIndex].sprite.alpha = this.targetWidgets[widgetIndex].color.a
          this.targetWidgets[widgetIndex].sprite.tint = this.targetWidgets[widgetIndex].color.argbAsHex()
        }
      else
        for (var widgetIndex2 = 0; widgetIndex2 < this.targetWidgets.length; widgetIndex2++) {
          Color.qLerp(this.targetWidgets[widgetIndex2].color, this.colorA, this.colorB, this.animationCurve.keys[0].value)
          if (this.targetWidgets[widgetIndex2].color.a === 1) {
            this.targetWidgets[widgetIndex2].color.a = 0.99
          }
          this.targetWidgets[widgetIndex2].sprite.alpha = this.targetWidgets[widgetIndex2].color.a
          this.targetWidgets[widgetIndex2].sprite.tint = this.targetWidgets[widgetIndex2].color.argbAsHex()
        }

    this.ticker.remove(this.loopFunction)
    this.isPlaying = false
    this.currentTime = 0

    if (this.completeCallback) {
      this.completeCallback()
      this.completeCallback = undefined
    }
    if (this.runtimeCallback) {
      this.runtimeCallback()
      this.runtimeCallback = null
    }
  }

  Reset() {
    this.reset = true
    this.Stop()
  }

  SetTimeScale(ts: number) {
    this.timeScale = ts
  }

  SyncCurrentTimeWithAnimator(animator: IAnimator): void {
    this.currentTime = animator.currentTime
  }

  loopFunction = () => this.Update()

  private Update() {
    if (!this.useAnimationCurve)
      if (this.direction > 0) this.currentTime = this.animationTime
      else this.currentTime = 0

    var progress = this.currentTime / this.animationTime

    if (this.animationCurve.keys.length >= 2) {
      var curCurveTime = progress * this.totalCurveTime

      progress = this.animationCurve.Evaluate(curCurveTime)
      progress = MathCore.Clamp(progress, 0, 1)
    }
    if (progress >= 0 && progress <= 1)
      for (var i = 0; i < this.targetWidgets.length; i++) {
        Color.qLerp(this.targetWidgets[i].color, this.colorA, this.colorB, progress)
        this.targetWidgets[i].sprite.tint = this.targetWidgets[i].color.argbAsHex()
        this.targetWidgets[i].sprite.alpha = this.targetWidgets[i].color.a
      }
    if (this.direction > 0) {
      if (this.currentTime < this.animationTime) this.currentTime += (Ticker.shared.deltaMS * this.timeScale) / 1000
      if (this.currentTime >= this.animationTime)
        switch (this.playMode) {
          case WidgetPlayMode.Loop:
            this.currentTime -= (Ticker.shared.deltaMS * this.timeScale) / 1000
            break
          case WidgetPlayMode.PingPong:
            this.direction = -1
            break
          default:
            this.Stop()
            break
        }
    }
    if (this.direction < 0) {
      if (this.currentTime > 0) this.currentTime -= this.ticker.deltaMS
      if (this.currentTime <= 0)
        switch (this.playMode) {
          case WidgetPlayMode.Loop:
            this.currentTime += this.animationTime
            break
          case WidgetPlayMode.PingPong:
            this.direction = 1
            break
          default:
            this.Stop()
            break
        }
    }
  }

  private Initialize() {
    this.direction = 1
    this.firstCurveKey = this.animationCurve.keys[0]
    this.lastCurveKey = this.animationCurve.keys[this.animationCurve.keys.length - 1]
    this.totalCurveTime = this.lastCurveKey.time - this.firstCurveKey.time
  }
}

export class ColorPair {
  sprite: Sprite
  color: Color

  constructor(sprite: Sprite, color: Color) {
    this.color = color
    this.sprite = sprite
  }
}

export enum WidgetPlayMode {
  Default = 'Default',
  Loop = 'Loop',
  PingPong = 'PingPong',
}
