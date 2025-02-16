import { Container, Sprite } from 'pixi.js-legacy';
import { AnimatedObject, AnimationPair } from '../../AnimatedObject/Core/AnimatedObject'


export class ReelSymbol
{
    animatedObject: AnimatedObject
    animations: AnimationPair[] = []
    parentContainer: Container

    constructor(animatedObject: AnimatedObject, parentContainer: Container)
    {
        this.animatedObject = animatedObject
        this.animations = this.animatedObject.animationPairs
        this.parentContainer = parentContainer

    }


    GetSprite() : Sprite | null
    {
        return this.animatedObject? this.animatedObject.sprite : null
    }
    
    GetName(): string
    {
        return this.animatedObject? this.animatedObject.objectName : ''
    }

    Destroy()
    {
        this.GetSprite()?.destroy()
    }
}