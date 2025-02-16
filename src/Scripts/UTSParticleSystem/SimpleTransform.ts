import { Container } from 'pixi.js-legacy'

export class SimpleTransform extends Container
{
  constructor( name: string = 'SimpleTransform')
  {
    super()
    this.name = name
  }
}