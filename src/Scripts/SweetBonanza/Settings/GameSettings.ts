export class GameSettings
{
    static IsDebug: boolean = true
    static loadResourcesTimeout: number = 10000000

    static minAppWidth = 162
    
    static numberOfReels = 6
    static numberOfSymbolsInReel = 5
    static gridPaddingX: number = 190
    static gridPaddingY: number = 152
    static startReelPosX: number = -665
    static startReelPosY: number = -304
    static startReelsContainerPosX: number = 135
    static startReelsContainerPosY: number = -200


    static reelsDelays =
    {
        delayBeforeStartFallToScreen : 0.33
    }
}