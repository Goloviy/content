import { Point, Ticker } from 'Core/abstractions'
import { Transform } from 'Core/abstractions/Transform/Transform'
import {
  AnimationJSON,
  AnimatorType,
  CurveType,
  CustomEvent,
  CustomEventType,
} from 'Core/animations/ObjectTypes/AnimatedObjectTypes'

import { AnimationCurve } from '../Core/AnimationCurve'
import { AnimationCurveTransform, AnimationProperty } from '../Core/AnimationCurveTransform'
import { Event } from '../Core/Event'

import type { IAnimatedObject } from '../Core/IAnimatedObject'
import type { IAnimator } from '../Core/IAnimator'

export class TransformAnimator implements IAnimator {
  animatedObject: IAnimatedObject
  animatorType: AnimatorType = AnimatorType.TransformAnimator
  customEvents: CustomEvent[]
  curves: AnimationCurveTransform[] = []
  animationTime: number = 0
  target: Transform
  animationCurve: AnimationCurve = AnimationCurve.linear(0, 0, 1, 1)
  reseted: boolean = false
  currentTime: number = 0
  isPlaying: boolean
  isLooping: boolean | number = false
  ticker = Ticker.shared
  progress: number = 0
  baseScaleX: number
  baseScaleY: number
  from: Point
  timeScale: number = 1
  OnComplete: Event<Function | null>
  completeCallback: (() => void) | undefined
  runtimeCallback: (() => void) | null = null
  startedCallback: (() => void) | null = null

  constructor(
    animatedObject: IAnimatedObject,
    inputJson: AnimationJSON,
    transform: Transform,
    baseScaleX?: number,
    baseScaleY?: number,
    isLopping: boolean | number = false,
  ) {
    this.animatedObject = animatedObject
    this.baseScaleX = baseScaleX ? baseScaleX : 0.71
    this.baseScaleY = baseScaleY ? baseScaleY : 0.71
    this.from = new Point({ x: 0, y: 0 })
    this.target = transform
    this.customEvents = inputJson.customEvents
    this.animationTime = inputJson.animationTime
    this.animationCurve = AnimationCurve.linear(0, 0, 1, 1)
    this.ParseAnimationCurves(inputJson.curvesData)
    this.isPlaying = false
    this.isLooping = isLopping
    this.ticker = Ticker.shared
    this.OnComplete = new Event<Function | null>()
  }

  ParseAnimationCurves(curvesJSON: CurveType[]): void {
    curvesJSON.forEach(animationCurveTransform => {
      this.curves.push(
        new AnimationCurveTransform(
          animationCurveTransform.path,
          animationCurveTransform.type,
          animationCurveTransform.propertyName,
          animationCurveTransform.animationCurve,
        ),
      )
    })
  }

  Play(): void {
    this.currentTime = 0
    this.isPlaying = true
    this.from = new Point({
      x: this.target.position.x,
      y: this.target.position.y,
    })

    if (this.startedCallback !== null) {
      this.startedCallback()
      this.startedCallback = null
    }
    if (this.progress === 1) {
      this.Update()
    }
    this.ticker.add(this.loopFunction)
  }

  SetTimeScale(ts: number): void {
    this.timeScale = ts
  }

  loopFunction = () => this.Update()

  Update(): void {
    if (GLOBAL_TIME_SCALE) {
      if (typeof this.isLooping === 'boolean' && this.isLooping) {
        this.currentTime =
          (this.currentTime + (Ticker.shared.deltaMS * this.timeScale * GLOBAL_TIME_SCALE) / 1000) % this.animationTime
      } else {
        this.currentTime += (Ticker.shared.deltaMS * this.timeScale * GLOBAL_TIME_SCALE) / 1000
      }
    }

    this.progress = this.currentTime / this.animationTime
    const curCurveTime = this.progress * this.animationTime

    this.HandleEvents()

    this.curves.forEach(animationCurveTransform => {
      this.UpdateValue(animationCurveTransform, curCurveTime)
    })

    if (
      (typeof this.isLooping === 'boolean' && !this.isLooping && this.currentTime >= this.animationTime) ||
      (typeof this.isLooping === 'number' && this.isLooping === 1 && this.currentTime >= this.animationTime)
    ) {
      this.Stop()
    } else if (typeof this.isLooping === 'number' && this.currentTime >= this.animationTime) {
      console.log(this.isLooping, this.currentTime, this.animationTime)
      this.currentTime = 0
      this.isLooping--
    }
  }

  UpdateValue(animationCurveTransform: AnimationCurveTransform, curCurveTime: number): number | 'Unknown' {
    switch (animationCurveTransform.animationProperty) {
      case AnimationProperty.LocalScaleX:
        return (this.target.scale.x = this.baseScaleX * animationCurveTransform.Evaluate(curCurveTime))
      case AnimationProperty.LocalScaleY:
        return (this.target.scale.y = this.baseScaleY * animationCurveTransform.Evaluate(curCurveTime))
      case AnimationProperty.LocalScaleZ:
      case AnimationProperty.LocalPositionX:
        return (this.target.position.x = this.from.x + animationCurveTransform.Evaluate(curCurveTime))
      case AnimationProperty.LocalPositionY:
        return (this.target.position.y = this.from.y + animationCurveTransform.Evaluate(curCurveTime))
      case AnimationProperty.LocalPositionZ:
      case AnimationProperty.LocalRotationX:
        return (this.target.rotation = animationCurveTransform.Evaluate(curCurveTime))
      case AnimationProperty.LocalRotationY:
        return (this.target.skew.x = animationCurveTransform.Evaluate(curCurveTime))
      case AnimationProperty.LocalRotationZ:
        return (this.target.skew.y = animationCurveTransform.Evaluate(curCurveTime))
      case AnimationProperty.PositionX:
      case AnimationProperty.PositionY:
      case AnimationProperty.PositionZ:
      case AnimationProperty.UNDEFINED:
      default:
        return 'Unknown'
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

  Reset(): void {
    this.currentTime = 0
    this.reseted = true
  }

  private HandleRuntimeCallback(): void {
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
            this.animatedObject.addAnimationToPlayQueue(customEvent.functionName)
            break
        }
      }
    })
    this.customEvents = this.customEvents.filter(customEvent => customEvent.time > this.currentTime * 1000)
  }
}
