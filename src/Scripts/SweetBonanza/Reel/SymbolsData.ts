import { BaseTexture } from "pixi.js-legacy"
import { AnimationObjectType } from '../../AnimatedObject/ObjectTypes/AnimatedObjectTypes'


export class SymbolsData
{
    json: AnimationObjectType
    basetexture: BaseTexture

    constructor(symbolJSON : AnimationObjectType, baseTexture: BaseTexture )
    {
        this.json = symbolJSON
        this.basetexture = baseTexture
    }
}