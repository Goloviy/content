import { TextStyle as PixiTextStyle } from 'pixi.js-legacy'

import type { ITextStyleOptions } from 'Core/abstractions/types'

export class TextStyle {
  readonly _pixiTextStyle

  get getPixiObject() {
    return this._pixiTextStyle
  }

  public align
  public breakWords
  public dropShadow
  public dropShadowAlpha
  public dropShadowAngle
  public dropShadowBlur
  public dropShadowColor
  public dropShadowDistance
  public fill
  public fillGradientType
  public fillGradientStops
  public fontFamily
  public fontSize
  public fontStyle
  public fontVariant
  public fontWeight
  public leading
  public letterSpacing
  public lineHeight
  public lineJoin
  public miterLimit
  public padding
  public stroke
  public strokeThickness
  public trim
  public textBaseline
  public whiteSpace
  public wordWrap
  public wordWrapWidth

  constructor({
    align = 'left',
    breakWords = false,
    dropShadow = false,
    dropShadowAlpha = 0,
    dropShadowAngle = 0,
    dropShadowBlur = 0,
    dropShadowColor = 0,
    dropShadowDistance = 0,
    fill = '',
    fillGradientType = 0,
    fillGradientStops = [0],
    fontFamily = '',
    fontSize = '',
    fontStyle = 'normal',
    fontVariant = 'normal',
    fontWeight = 'normal',
    leading = 0,
    letterSpacing = 0,
    lineHeight = 0,
    lineJoin = '',
    miterLimit = 0,
    padding = 0,
    stroke = '',
    strokeThickness = 0,
    trim = false,
    textBaseline = '',
    whiteSpace = '',
    wordWrap = false,
    wordWrapWidth = 0,
  }: ITextStyleOptions) {
    this._pixiTextStyle = new PixiTextStyle()

    this.align = align
    this.breakWords = breakWords
    this.dropShadow = dropShadow
    this.dropShadowAlpha = dropShadowAlpha
    this.dropShadowAngle = dropShadowAngle
    this.dropShadowBlur = dropShadowBlur
    this.dropShadowColor = dropShadowColor
    this.dropShadowDistance = dropShadowDistance
    this.fill = fill
    this.fillGradientType = fillGradientType
    this.fillGradientStops = fillGradientStops
    this.fontFamily = fontFamily
    this.fontSize = fontSize
    this.fontStyle = fontStyle
    this.fontVariant = fontVariant
    this.fontWeight = fontWeight
    this.leading = leading
    this.letterSpacing = letterSpacing
    this.lineHeight = lineHeight
    this.lineJoin = lineJoin
    this.miterLimit = miterLimit
    this.padding = padding
    this.stroke = stroke
    this.strokeThickness = strokeThickness
    this.trim = trim
    this.textBaseline = textBaseline
    this.whiteSpace = whiteSpace
    this.wordWrap = wordWrap
    this.wordWrapWidth = wordWrapWidth

    this.setup()
  }

  private setup(): void {
    this._pixiTextStyle.align = this.align
    this._pixiTextStyle.breakWords = this.breakWords
    this._pixiTextStyle.dropShadow = this.dropShadow
    this._pixiTextStyle.dropShadowAlpha = this.dropShadowAlpha
    this._pixiTextStyle.dropShadowAngle = this.dropShadowAngle
    this._pixiTextStyle.dropShadowBlur = this.dropShadowBlur
    this._pixiTextStyle.dropShadowColor = this.dropShadowColor
    this._pixiTextStyle.dropShadowDistance = this.dropShadowDistance
    this._pixiTextStyle.fill = this.fill
    this._pixiTextStyle.fillGradientType = this.fillGradientType
    this._pixiTextStyle.fillGradientStops = this.fillGradientStops
    this._pixiTextStyle.fontFamily = this.fontFamily
    this._pixiTextStyle.fontSize = this.fontSize
    this._pixiTextStyle.fontStyle = this.fontStyle
    this._pixiTextStyle.fontVariant = this.fontVariant
    this._pixiTextStyle.fontWeight = this.fontWeight
    this._pixiTextStyle.leading = this.leading
    this._pixiTextStyle.letterSpacing = this.letterSpacing
    this._pixiTextStyle.lineHeight = this.lineHeight
    this._pixiTextStyle.lineJoin = this.lineJoin
    this._pixiTextStyle.miterLimit = this.miterLimit
    this._pixiTextStyle.padding = this.padding
    this._pixiTextStyle.stroke = this.stroke
    this._pixiTextStyle.strokeThickness = this.strokeThickness
    this._pixiTextStyle.trim = this.trim
    this._pixiTextStyle.textBaseline = this.textBaseline
    this._pixiTextStyle.whiteSpace = this.whiteSpace
    this._pixiTextStyle.wordWrap = this.wordWrap
    this._pixiTextStyle.wordWrapWidth = this.wordWrapWidth
  }
}
