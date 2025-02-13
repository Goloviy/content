import { Application as PixiApplication } from 'pixi.js-legacy'

import { IApplicationOptions } from 'Core/abstractions/types'

export class Application extends PixiApplication {
  constructor(options: IApplicationOptions) {
    const { width, height, resolution, autoDensity, view, forceCanvas, backgroundColor = 0x000000, ...rest } = options

    super({
      width,
      height,
      resolution,
      autoDensity,
      view,
      forceCanvas,
      backgroundColor,
      ...rest,
    })
  }

  get getPixiObject() {
    return this
  }
}
