import { Texture as PixiTexture } from 'pixi.js-legacy'

import type { ITextureOptions } from 'Core/abstractions/types'

export class Texture {
  private readonly _pixiTexture
  private _baseTexture

  get width(): number {
    return this._pixiTexture.width
  }

  get height(): number {
    return this._pixiTexture.height
  }

  get getPixiObject() {
    return this._pixiTexture
  }

  get baseTexture() {
    return this._pixiTexture.baseTexture
  }

  set baseTexture(value: PIXI.BaseTexture) {
    this._baseTexture = value
    this._pixiTexture.baseTexture = this._baseTexture
  }

  destroy(): void {
    return this._baseTexture.destroy()
  }

  constructor({ texture, frame, orig, trim, rotate, anchor }: ITextureOptions) {
    this._pixiTexture = new PixiTexture(texture, frame?.getPixiObject, orig?.getPixiObject, trim?.getPixiObject, rotate, anchor)

    const defaultTexture = Texture.EMPTY

    this._baseTexture = defaultTexture.baseTexture
  }

  static from(
    source: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | PIXI.BaseTexture,
    options?: unknown,
    strict?: boolean,
  ): Texture {
    const pixiTexture = PixiTexture.from(source, options, strict)

    return new Texture({ texture: pixiTexture.baseTexture })
  }

  static EMPTY = PixiTexture.EMPTY
}
