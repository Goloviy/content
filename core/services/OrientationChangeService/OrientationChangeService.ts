import { injectable } from 'inversify'

import { Constants } from 'Constants'

import type { MobileOrientations, Optional } from 'Types'

import type {
  OrientationChangeObjectsTypes,
  OrientationChangeObjectsValues,
  OrientationChangeObjectKeys,
  OrientationChangeProps,
} from './types'

@injectable()
class OrientationChangeService<O extends OrientationChangeObjectKeys = 'Sprite'> {
  private readonly _obj: OrientationChangeObjectsTypes[O] | undefined = undefined

  private _startValues: OrientationChangeObjectsValues<O> | undefined = undefined
  private readonly _targetValues: OrientationChangeObjectsValues<O> | undefined = undefined
  private _currentValues: OrientationChangeObjectsValues<O> = {}

  private _isPlaying: boolean = false

  private _propertiesAreSetUp: boolean = false

  /**
   * Constructor immediately calls the object's move method
   * @constructor
   */
  constructor({ obj, targetValues }: OrientationChangeProps<O>) {
    this._obj = obj
    this._targetValues = targetValues

    this.start()
  }

  static getDataByOrientation<D>(portraitData: D, landscapeData: D): D {
    const orientation: MobileOrientations = APP_CONFIG.mobileOrientation

    return orientation === Constants.mobileOrientation.PORTRAIT ? portraitData : landscapeData
  }

  /**
   * Start of orientation change
   * @returns {this}
   */
  private start(): this {
    if (this._isPlaying) return this

    this._isPlaying = true

    if (!this._propertiesAreSetUp) {
      if (this._objectsInArrAreNotEmpty([this._targetValues, this._obj]) && this._targetValues && this._obj) {
        this._setupProperties(this._targetValues, this._obj)

        this._propertiesAreSetUp = true
      }
    }

    this._update()

    return this
  }

  private _setupProperties(
    targetValues: OrientationChangeObjectsValues<O>,
    currentValues: OrientationChangeObjectsValues<O>,
  ): OrientationChangeObjectsValues<O> {
    const targetKeys = Object.keys(targetValues) as unknown as (keyof OrientationChangeObjectsValues<O>)[]

    return (this._startValues = targetKeys.reduce((obj: OrientationChangeObjectsValues<O>, targetKey) => {
      if (targetKey in currentValues) {
        const targetVal = targetValues[targetKey]
        const cVal = currentValues[targetKey]

        if (this._existenceCheck(targetVal, cVal) && targetVal && cVal) {
          const nested = this._setupProperties(targetVal, cVal)

          if (Object.keys(nested).length) {
            obj[targetKey] = nested as OrientationChangeObjectsTypes[O][keyof OrientationChangeObjectsTypes[O]]
          }
        } else {
          obj[targetKey] = cVal
        }
      } else {
        delete targetValues[targetKey]
      }

      return obj
    }, {} as OrientationChangeObjectsValues<O>))
  }

  private _existenceCheck(
    val1: Optional<OrientationChangeObjectsTypes[O]>[keyof OrientationChangeObjectsTypes[O]],
    val2: Optional<OrientationChangeObjectsTypes[O]>[keyof OrientationChangeObjectsTypes[O]],
  ): boolean {
    return typeof val1 === 'object' && val1 !== void 0 && typeof val2 === 'object' && val2 !== void 0
  }

  private _update(): boolean {
    if (!this._isPlaying) return false

    if (
      this._objectsInArrAreNotEmpty([this._obj, this._startValues, this._targetValues]) &&
      this._obj &&
      this._startValues &&
      this._targetValues
    ) {
      this._updateProperties(this._obj, this._startValues, this._targetValues)
    }

    this._endOfMovement()

    return true
  }

  private _isObjectNotEmpty(obj: OrientationChangeObjectsTypes[O] | OrientationChangeObjectsValues<O> | undefined): boolean {
    return !!(obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length > 0)
  }

  private _objectsInArrAreNotEmpty(
    arr: (OrientationChangeObjectsTypes[O] | OrientationChangeObjectsValues<O> | undefined)[],
  ): boolean {
    return arr.every(obj => {
      return this._isObjectNotEmpty(obj)
    })
  }

  private _endOfMovement(): void {
    this._isPlaying = false
  }

  private _updateProperties(
    obj: OrientationChangeObjectsValues<O>,
    startValues: OrientationChangeObjectsValues<O>,
    targetValues: OrientationChangeObjectsValues<O>,
  ): void {
    for (const property in targetValues) {
      const prop = property as keyof OrientationChangeObjectsValues<O>

      const start = startValues[prop]
      const end = targetValues[prop]

      if (this._existenceCheck(start, end) && obj[property] && end) {
        this._updateProperties(obj[property], start as OrientationChangeObjectsValues<O>, end)
      } else {
        if (property === 'texture' || property === 'text') {
          obj[property] = end as OrientationChangeObjectsTypes[O][Extract<keyof OrientationChangeObjectsTypes[O], string>]
        } else if (typeof start === 'number' && typeof end === 'number' && !Number.isNaN(start) && !Number.isNaN(start)) {
          const distance: number = end - start
          const value: number = start + distance

          obj[property] = value as OrientationChangeObjectsTypes[O][Extract<keyof OrientationChangeObjectsTypes[O], string>]

          this._currentValues[prop] = value as OrientationChangeObjectsTypes[O][keyof OrientationChangeObjectsTypes[O]]
        }
      }
    }
  }

  static subscribe(listener: () => void, context?: unknown): void {
    if (APP_CONFIG.deviceType === Constants.devicesTypes.MOBI) {
      document.addEventListener(Constants.events.CHANGE_ORIENTATION, listener.bind(context))
    }
  }

  static unsubscribe(listener: () => void, context?: unknown): void {
    if (APP_CONFIG.deviceType === Constants.devicesTypes.MOBI) {
      document.removeEventListener(Constants.events.CHANGE_ORIENTATION, listener.bind(context))
    }
  }
}

function changeOrientationObject<O extends OrientationChangeObjectKeys = 'Sprite'>(
  obj?: OrientationChangeObjectsTypes[O],
  targetValues?: OrientationChangeObjectsValues<O>,
): void {
  new OrientationChangeService<O>({ obj, targetValues })
}

function changeOrientationArray<O extends OrientationChangeObjectKeys = OrientationChangeObjectKeys>(
  array: { obj: OrientationChangeObjectsTypes[O]; targetValues: OrientationChangeObjectsValues<O> }[],
): void {
  array.forEach(({ obj, targetValues }) => {
    changeOrientationObject<O>(obj, targetValues)
  })
}

export { OrientationChangeService, changeOrientationObject, changeOrientationArray }
