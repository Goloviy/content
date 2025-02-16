import { Container } from "pixi.js-legacy"
import { FallAnimationData, ReelsAnimationData } from "../CommonAnimationData/ReelsAnimationData"
import { AnimationPair } from "../../AnimatedObject/Core/AnimatedObject"
import { Reel } from "./Reel"

export class ReelContainer
{
    reelsAnimationData: ReelsAnimationData
    reelsContainer: Container
    reels: Reel[] = []
    constructor(reelsContainer: Container)
    {
        this.reelsContainer = reelsContainer
        this.reelsAnimationData = new ReelsAnimationData()

    }

    AddReel(reel: Reel)
    {
        this.reels.push(reel)
    }

    AddCommonAnimation(animJSON: AnimationPair)
    {
        if(!this.reelsAnimationData.TryAddFallAnimation(new FallAnimationData(animJSON)))
        {
            console.log('Fail add common animation')
        }
    }

}