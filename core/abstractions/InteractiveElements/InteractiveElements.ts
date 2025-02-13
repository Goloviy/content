import { Container } from 'pixi.js-legacy'

import { BaseElements } from 'Core/abstractions'
import type { InteractiveElementsType } from 'Core/abstractions/types'

export class InteractiveElements extends BaseElements {
  protected _interactiveElement: InteractiveElementsType

  constructor() {
    super()

    this._interactiveElement = new Container()
  }

  public on(type: string, action: Function): void {
    this._interactiveElement.on(type, action)
  }

  public off(type: string, action: Function): void {
    this._interactiveElement.off(type, action)
  }

  // Pointer Events

  public onPointerDown(action: Function): void {
    this._interactiveElement.on('pointerdown', action)
  }

  public onPointerCancel(action: Function): void {
    this._interactiveElement.on('pointercancel', action)
  }

  public onPointerUp(action: Function): void {
    this._interactiveElement.on('pointerup', action)
  }

  public onPointerTap(action: Function): void {
    this._interactiveElement.on('pointertap', action)
  }

  public onPointerUpOutside(action: Function): void {
    this._interactiveElement.on('pointerupoutside', action)
  }

  public onPointerMove(action: Function): void {
    this._interactiveElement.on('pointermove', action)
  }

  public onPointerMoveEnd(action: Function): void {
    this._interactiveElement.off('pointermove', action)
  }

  public onPointerOver(action: Function): void {
    this._interactiveElement.on('pointerover', action)
  }

  public onPointerOut(action: Function): void {
    this._interactiveElement.on('pointerout', action)
  }

  // Touch Events

  public onTouchStart(action: Function): void {
    this._interactiveElement.on('touchstart', action)
  }

  public onTouchCancel(action: Function): void {
    this._interactiveElement.on('touchcancel', action)
  }

  public onTouchEnd(action: Function): void {
    this._interactiveElement.on('touchend', action)
  }

  public onTouchEndOutside(action: Function): void {
    this._interactiveElement.on('touchendoutside', action)
  }

  public onTouchMove(action: Function): void {
    this._interactiveElement.on('touchmove', action)
  }

  public onTap(action: Function): void {
    this._interactiveElement.on('tap', action)
  }

  // Mouse Events

  public rightDown(action: Function): void {
    this._interactiveElement.on('rightdown', action)
  }

  public onMouseDown(action: Function): void {
    this._interactiveElement.on(APP_CONFIG.isMobi ? 'pointerdown' : 'mousedown', action)
  }

  public onRightUp(action: Function): void {
    this._interactiveElement.on('rightup', action)
  }

  public onMouseUp(action: Function): void {
    this._interactiveElement.on(APP_CONFIG.isMobi ? 'pointerup' : 'mouseup', action)
  }

  public onRightClick(action: Function): void {
    this._interactiveElement.on('rightclick', action)
  }

  public onClick(action: Function): void {
    this._interactiveElement.on(APP_CONFIG.isMobi ? 'tap' : 'click', action)
  }

  public onRightUpOutside(action: Function): void {
    this._interactiveElement.on('rightupoutside', action)
  }

  public onMouseUpOutside(action: Function): void {
    this._interactiveElement.on('mouseupoutside', action)
  }

  public onMouseMove(action: Function): void {
    this._interactiveElement.on('mousemove', action)
  }

  public onMouseOver(action: Function): void {
    this._interactiveElement.on(APP_CONFIG.isMobi ? 'touchstart' : 'mouseover', action)
  }

  public onMouseOut(action: Function): void {
    if (APP_CONFIG.isMobi) {
      this._interactiveElement.on('touchendoutside', action)
      this._interactiveElement.on('touchend', action)
    } else {
      this._interactiveElement.on('mouseout', action)
    }
  }
}
