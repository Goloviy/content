import { Container } from "pixi.js-legacy"
import { ReelSymbol } from "./ReelSymbol"


export class Reel
{
    symbols : ReelSymbol[] = []
    reelContainer : Container
    visibleSymbolsinReel: number = 5
    paddingY: number = 0
    startPosY : number = 0
    constructor(container: Container, paddingY?: number , startPosY?: number, symbolsInReel?: number)
    {
        this.reelContainer = container
        this.visibleSymbolsinReel = symbolsInReel ? symbolsInReel: this.visibleSymbolsinReel
        this.paddingY = paddingY ? paddingY: this.paddingY
        this.startPosY = startPosY ? startPosY: this.startPosY
        this.AddSymbol = this.AddSymbol.bind(this)
    }

    AddSymbol(newSymbol: ReelSymbol)
    {
        if(this.symbols)
        {
            this.symbols.push(newSymbol)
        }
      
        let sprite = newSymbol.GetSprite()
        
        if(sprite)
        {
            let symbolContainer: Container = new Container()
            symbolContainer.name = newSymbol.GetName()
            symbolContainer.y =this.startPosY + (this.symbols.length -1) * this.paddingY
            this.reelContainer.addChild(symbolContainer)

            symbolContainer.addChild(sprite)
        }
    }
    RemoveSymbolAtIndex(index: number)
    {
        if(index>=0 && index < this.symbols.length)
        {
            this.symbols[index].Destroy()
        }
    }
}