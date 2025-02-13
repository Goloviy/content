import { Container, DisplayObject, Graphics, IPointData, Sprite, Text } from 'pixi.js-legacy'

import type { IPointDataOptions, IRemoveChildren } from 'Core/abstractions/types'

import { clearMemory } from 'Utils'

export class BaseElements {
  protected _baseElement: BaseElementsType

  constructor() {
    this._baseElement = new Container()
  }

  public addChild(...children: DisplayObject[] | BaseElements[]): void {
    children.forEach(child => {
      if ('getPixiObject' in child) {
        return this._baseElement.addChild(child.getPixiObject as DisplayObject)
      } else {
        return this._baseElement.addChild(child as DisplayObject)
      }
    })
  }

  public addChildAt(child: DisplayObject | BaseElements, index: number): DisplayObject {
    if ('getPixiObject' in child) {
      return this._baseElement.addChildAt(child.getPixiObject as DisplayObject, index)
    } else {
      return this._baseElement.addChildAt(child as DisplayObject, index)
    }
  }

  public removeChild(...children: DisplayObject[] | BaseElements[]): void {
    // children?.length && clearMemory(children)

    children.forEach(child => {
      if ('getPixiObject' in child) {
        return this._baseElement.removeChild(child.getPixiObject as DisplayObject)
      } else {
        return this._baseElement.removeChild(child as DisplayObject)
      }
    })
  }

  removeChildren({ beginIndex, endIndex }: IRemoveChildren, isClearMemory: boolean = false): void {
    if (isClearMemory) {
      this._baseElement?.children?.length && clearMemory(this._baseElement.children)
    }
    this._baseElement.removeChildren(beginIndex, endIndex)
  }

  public checkIsWithinContainer({ x = 0, y = 0 }: IPointData): boolean {
    const bounds: PIXI.Rectangle = this._baseElement.getBounds()

    return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height
  }

  public sortChildren(): void {
    this._baseElement.sortChildren()
  }

  get scale(): {
    x: number
    y: number
    set: (value: number) => void
  } {
    const that = this

    return {
      get x(): number {
        return that._baseElement.scale.x
      },
      set x(value: number) {
        if (that._baseElement) {
          that._baseElement.scale.x = value
        } else {
        }
      },
      get y(): number {
        return that._baseElement.scale.y
      },
      set y(value: number) {
        if (that._baseElement) {
          that._baseElement.scale.y = value
        }
      },

      set(value: number): void {
        that._baseElement.scale.set(value)
      },
    }
  }

  public setScale({ x = 1, y = 1 }: IPointDataOptions): void {
    this._baseElement.scale.set(x, y)
  }

  public get pivot(): {
    x: number
    y: number
    set: (value: number) => void
  } {
    const that = this

    return {
      get x(): number {
        return that._baseElement.pivot.x
      },
      set x(value: number) {
        if (that._baseElement) {
          that._baseElement.pivot.x = value
        }
      },
      get y(): number {
        return that._baseElement.pivot.y
      },
      set y(value: number) {
        if (that._baseElement) {
          that._baseElement.pivot.y = value
        }
      },

      set(value: number): void {
        that._baseElement.pivot.set(value)
      },
    }
  }

  public setPivot({ x = 0, y = 0 }: IPointDataOptions): void {
    this._baseElement.pivot.set(x, y)
  }

  public get position(): {
    x: number
    y: number
  } {
    const that = this

    return {
      get x(): number {
        return that._baseElement.position.x
      },
      set x(value: number) {
        if (that._baseElement) {
          that._baseElement.position.x = value
        }
      },
      get y(): number {
        return that._baseElement.position.y
      },
      set y(value: number) {
        if (that._baseElement) {
          that._baseElement.position.y = value
        }
      },
    }
  }

  public setPosition({ x = 0, y = 0 }: IPointDataOptions): void {
    this._baseElement.position.set(x, y)
  }
}

type BaseElementsType = Container | Sprite | Graphics | Text
