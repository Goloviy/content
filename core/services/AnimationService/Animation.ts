import { injectable } from 'inversify'

import { Ticker } from 'Core/abstractions'
import Easing from 'Core/services/AnimationService/Easing'

import type { Optional } from 'Types'

import type { AnimationProps, AnimationValues, AnimObjectKeys, AnimObjectsTypes, EasingFunc, IAnimation } from './types'

@injectable()
class Animation<AnimObject extends AnimObjectKeys = 'Sprite'> implements IAnimation {
  // private loggerService: LoggerService = IoCContainer.get(IoCContainerTypes.LoggerService)

  private readonly _animObject: AnimObjectsTypes[AnimObject] | undefined = undefined

  private _startValues: AnimationValues<AnimObject> | undefined = undefined
  private readonly _targetValues: AnimationValues<AnimObject> | undefined = undefined
  private _currentValues: AnimationValues<AnimObject> = {}

  private _ticker = Ticker.shared

  private _duration: number = 0
  private _isPlaying: boolean = false

  private _startTime: number = 0
  private _delayTime: number = 0
  private readonly _infinity: boolean = false
  private _repeat: number = 0
  private readonly _easingFunction: EasingFunc = Easing.None

  private _now = (): number => performance.now()
  private _lastUpdate: number = 0
  private _elapsedTime: number = 0
  private _maxElapsedMS: number = 1e3 / this._ticker.minFPS

  private readonly _onUpdateCallback: ((progress: number) => void) | undefined = undefined
  private readonly _onCompleteCallback: (() => void) | undefined = undefined
  private readonly _onStopCallback: (() => void) | undefined = undefined

  private _propertiesAreSetUp: boolean = false

  private readonly _debug: boolean = false
  private _frameCounter: number = 0
  private _sumFPS: number = 0
  private _sumMS: number = 0

  /** Permissible frame error */
  private _infelicity: number = 1

  /**
   * Constructor for creating animation
   * @constructor
   */
  constructor({
    animObject,
    targetValues,
    duration = 0,
    onUpdate,
    onComplete,
    onStop,
    delay = 0,
    debug = false,
    infinity = false,
    playNow = false,
    repeat = 0,
    easing = 'None',
  }: AnimationProps<AnimObject>) {
    this._animObject = animObject
    this._targetValues = targetValues
    this._setDuration(duration)
    this._setDelayTime(delay)
    this._infinity = infinity
    this._repeat = repeat

    this._onCompleteCallback = onComplete
    this._onUpdateCallback = onUpdate
    this._onStopCallback = onStop
    this._easingFunction = Easing[easing]

    this._debug = debug

    if (playNow) this.play()
  }

  private _setDuration(duration: number): void {
    this._duration = duration < 0 ? 0 : duration
  }

  private _setDelayTime(delay: number): void {
    this._delayTime = delay < 0 ? 0 : delay
  }

  /**
   * Start animation
   * @returns {this}
   */
  public play(): this {
    if (this._isPlaying) return this

    this._isPlaying = true

    this._startTime = this._now()
    this._startTime += this._delayTime

    if (this._lastUpdate === 0) this._lastUpdate = this._now()

    this._reset()

    if (!this._propertiesAreSetUp) {
      if (this._objectsInArrAreNotEmpty([this._targetValues, this._animObject]) && this._targetValues && this._animObject) {
        this._setupProperties(this._targetValues, this._animObject)

        this._propertiesAreSetUp = true
      }
    }

    this._startTicker()

    return this
  }

  private _reset(): void {
    this._elapsedTime = 0
    // this._lastUpdate = 0
  }

  private _startTicker(): void {
    this._ticker.add(this._update, this)
  }

  /**
   * Stops the current animation
   * @returns {this}
   */
  public stop(): this {
    this._isPlaying = false

    this._removeTicker()

    if (this._onStopCallback) this._onStopCallback()

    return this
  }

  private _setupProperties(
    targetValues: AnimationValues<AnimObject>,
    currentValues: AnimationValues<AnimObject>,
  ): AnimationValues<AnimObject> {
    const targetKeys = Object.keys(targetValues) as unknown as (keyof AnimationValues<AnimObject>)[]

    return (this._startValues = targetKeys.reduce((o: AnimationValues<AnimObject>, targetKey) => {
      if (targetKey in currentValues) {
        const targetVal = targetValues[targetKey]
        const cVal = currentValues[targetKey]

        if (this._existenceCheck(targetVal, cVal) && targetVal && cVal) {
          const nested = this._setupProperties(targetVal, cVal)

          if (Object.keys(nested).length) {
            o[targetKey] = nested as AnimObjectsTypes[AnimObject][keyof AnimObjectsTypes[AnimObject]]
          }
        } else {
          o[targetKey] = cVal
        }
      } else {
        delete targetValues[targetKey]
      }

      return o
    }, {} as AnimationValues<AnimObject>))
  }

  private _existenceCheck(
    val1: Optional<AnimObjectsTypes[AnimObject]>[keyof AnimObjectsTypes[AnimObject]],
    val2: Optional<AnimObjectsTypes[AnimObject]>[keyof AnimObjectsTypes[AnimObject]],
  ): boolean {
    return typeof val1 === 'object' && val1 !== void 0 && typeof val2 === 'object' && val2 !== void 0
  }

  private _update(): boolean {
    if (!this._isPlaying) return false

    const currentTime: number = this._now()

    if (currentTime < this._startTime) return false

    let elapsedMS: number = (currentTime - this._lastUpdate) * GLOBAL_TIME_SCALE

    if (elapsedMS > this._maxElapsedMS) {
      elapsedMS = this._maxElapsedMS
    }

    this._elapsedTime += elapsedMS

    const progress: number = this._calculateProgress({
      elapsedTime: this._elapsedTime,
    })

    if (
      this._objectsInArrAreNotEmpty([this._animObject, this._startValues, this._targetValues]) &&
      this._animObject &&
      this._startValues &&
      this._targetValues
    ) {
      this._updateProperties(this._animObject, this._startValues, this._targetValues, progress)
    }

    if (this._onUpdateCallback) this._onUpdateCallback(progress)

    this._showLogs()

    if (this._duration === 0 || this._elapsedTime >= this._duration) {
      this._stopAnimation()

      return false
    }

    this._lastUpdate = currentTime

    return true
  }

  private _isObjectNotEmpty(obj: AnimObjectsTypes[AnimObject] | AnimationValues<AnimObject> | undefined): boolean {
    return !!(obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length > 0)
  }

  private _objectsInArrAreNotEmpty(arr: (AnimObjectsTypes[AnimObject] | AnimationValues<AnimObject> | undefined)[]): boolean {
    return arr.every(obj => {
      return this._isObjectNotEmpty(obj)
    })
  }

  private _stopAnimation(): void {
    this._removeTicker()

    this._isPlaying = false

    if (this._onCompleteCallback) this._onCompleteCallback()

    this._onCompleteDebug()

    this._startOver()
  }

  private _removeTicker(): void {
    this._ticker.remove(this._update, this)
  }

  private _onCompleteDebug(): void {
    if (this._debug) {
      const totalFrames: number = this._frameCounter
      const averageFPS: number = this._sumFPS / totalFrames
      const targetFrames: number = Number((this._duration / (1e3 / averageFPS)).toFixed())
      const isOkay: boolean = [targetFrames - 1, targetFrames, targetFrames + 1].includes(totalFrames)

      console.log(
        `Frames: ${totalFrames}, TargetFrames ${targetFrames}, FPS: ${averageFPS.toFixed(2)}, Infelicity: ${this._infelicity}`,
      )
      console.log(isOkay ? 'OK' : 'error')
      // this.loggerService.log(isOkay ? 'OK' : 'error', isOkay ? 'win' : 'error')
    }
  }

  private _startOver(): void {
    if (this._infinity || this._repeat > 0) this.play()
    --this._repeat
  }

  private _updateProperties(
    obj: AnimationValues<AnimObject>,
    startValues: AnimationValues<AnimObject>,
    targetValues: AnimationValues<AnimObject>,
    progress: number,
  ): void {
    for (const property in targetValues) {
      const prop = property as keyof AnimationValues<AnimObject>

      const start = startValues[prop]
      const end = targetValues[prop]

      if (this._existenceCheck(start, end) && obj[property] && end) {
        this._updateProperties(obj[property], start as AnimationValues<AnimObject>, end, progress)
      } else {
        if (property === 'texture') {
          obj[property] = end as AnimObjectsTypes[AnimObject][Extract<keyof AnimObjectsTypes[AnimObject], string>]
        }

        if (typeof start === 'number' && typeof end === 'number' && !Number.isNaN(start) && !Number.isNaN(start)) {
          const distance: number = end - start
          const value: number = start + distance * progress

          obj[property] = value as AnimObjectsTypes[AnimObject][Extract<keyof AnimObjectsTypes[AnimObject], string>]

          this._currentValues[prop] = value as AnimObjectsTypes[AnimObject][keyof AnimObjectsTypes[AnimObject]]
        }
      }
    }
  }

  private _showLogs(): void {
    if (this._debug) {
      this._frameCounter++
      this._sumFPS += 1e3 / this._ticker.deltaMS
      this._sumMS += this._ticker.deltaMS

      // Current values per frame
      console.log('CVPF', JSON.stringify(this._currentValues))
    }
  }

  private _calculateProgress({ elapsedTime }: { elapsedTime: number }): number {
    if (this._duration === 0) return 1
    if (elapsedTime > this._duration) return 1

    const progress: number = Math.min(elapsedTime / this._duration, 1)

    if (progress === 0 && elapsedTime === this._duration) return 1

    return this._easingFunction(progress)
  }
}

function createAnimation<AnimObject extends AnimObjectKeys = 'Sprite'>(p: AnimationProps<AnimObject>): void {
  new Animation<AnimObject>(p)
}

export { Animation, createAnimation }
