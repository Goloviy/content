import { InteractionEvent as PixiInteractionEvent } from 'pixi.js-legacy'

import type { IInteractionEventOptions } from 'Core/abstractions/types'

export class InteractionEvent {
  private _interactionEvent
  private _stopped: boolean
  private _target: PIXI.DisplayObject
  private _currentTarget: PIXI.DisplayObject
  private _type: string
  private _data: PIXI.InteractionData

  get stopped(): boolean {
    return this._stopped
  }

  set stopped(value: boolean) {
    this._stopped = value
  }

  get target(): PIXI.DisplayObject {
    return this._target
  }

  set target(value: PIXI.DisplayObject) {
    this._target = value
  }

  get currentTarget() {
    return this._currentTarget
  }

  set currentTarget(value: PIXI.DisplayObject) {
    this._currentTarget = value
  }

  get type() {
    return this._type
  }

  set type(value: string) {
    this._type = value
  }

  get data(): PIXI.InteractionData {
    return this._data
  }

  set data(value: PIXI.InteractionData) {
    this._data = value
  }

  constructor({ stopped, target, currentTarget, type, data }: IInteractionEventOptions) {
    this._interactionEvent = new PixiInteractionEvent()

    this._stopped = stopped
    this._target = target
    this._currentTarget = currentTarget
    this._type = type
    this._data = data
  }

  public stopPropagation(): void {
    this._interactionEvent.stopPropagation()
  }

  public reset(): void {
    this._interactionEvent.reset()
  }
}
