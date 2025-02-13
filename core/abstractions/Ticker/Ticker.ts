import { Ticker as PixiTicker } from 'pixi.js-legacy'

export class Ticker {
  private readonly _pixiTicker
  get getPixiObject() {
    return this._pixiTicker
  }

  constructor() {
    this._pixiTicker = new PixiTicker()
  }

  add(callback: (delta: number) => void): void {
    this._pixiTicker.add(callback)
  }

  start(): void {
    this._pixiTicker.start()
  }

  stop(): void {
    this._pixiTicker.stop()
  }

  static shared: PixiTicker = PixiTicker.shared
}
