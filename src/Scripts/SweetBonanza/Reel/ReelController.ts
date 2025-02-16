import { Application, Container } from 'pixi.js-legacy'
import { SymbolsData } from './SymbolsData'
import { ReelContainer } from './ReelContainer'
import { Reel } from './Reel'
import { ReelSymbol } from './ReelSymbol'
import {  AnimationPair } from '../../AnimatedObject/Core/AnimatedObject'

import { GameManager } from '../Managers/GameManager'
import { GameSettings } from '../Settings/GameSettings'
import { ReelStates } from './ReelStates'

export class ReelController {
  app: Application
  gameManager: GameManager
  parentContainer: Container | null = null
  reelState: ReelStates = ReelStates.Idle
  onCompleteInit: (() => void) | null = null

  reelContainer: ReelContainer | null = null

  symbols: Map<string, SymbolsData> = new Map<string, SymbolsData>()
  symbolDissapear: Map<string, SymbolsData> = new Map<string, SymbolsData>()
  bombSymbol: Map<string, SymbolsData> = new Map<string, SymbolsData>()
  fallFromScreenAnimations: Map<number, AnimationPair> = new Map<number, AnimationPair>()
  fallToScreenAnimations: Map<number, AnimationPair> = new Map<number, AnimationPair>()
  symbolsMatrix: ReelSymbol[][] = []

  constructor(application: Application, gameManager: GameManager) {
    this.app = application
    this.gameManager = gameManager
    this.symbols = new Map<string, SymbolsData>()
    this.InitializeEmptySymbolsMatrix()
    this.BindContext()
  }

  InitializeEmptySymbolsMatrix() {
    this.symbolsMatrix = new Array(GameSettings.numberOfReels)
    for (let i = 0; i < this.symbolsMatrix.length; i++) {
      this.symbolsMatrix = new Array(GameSettings.numberOfSymbolsInReel)
    }
  }

  BindContext() {
    this.SetupReelsData = this.SetupReelsData.bind(this)
    this.CreateReelContainer = this.CreateReelContainer.bind(this)
  }

  SetupReelsData() {
    // let loader = this.gameManager.resourceLoader?.loader
    // if (loader) {
    //   Object.entries(ASSET_PATHS.symbols).forEach(entry => {
    //     this.symbols.set(entry[0], new SymbolsData(loader.resources[entry[0] + '_json'].data, BaseTexture.from(entry[1].png)))
    //   })
    //   let entryIndex: number = 0
    //   Object.entries(ASSET_PATHS.fallFromScreenAnimations).forEach(entry => {
    //     let jsonData = loader.resources[entry[0] + '_json'].data
    //     this.fallFromScreenAnimations.set(
    //       entryIndex,
    //       new AnimationPair(jsonData.animationName, jsonData.AnimatorType as AnimatorType, jsonData.animationData),
    //     )
    //     entryIndex++
    //   })
    //   entryIndex = 0
    //   Object.entries(ASSET_PATHS.fallToScreenAnimations).forEach(entry => {
    //     let jsonData = loader.resources[entry[0] + '_json'].data
    //     this.fallToScreenAnimations.set(
    //       entryIndex,
    //       new AnimationPair(jsonData.animationName, jsonData.AnimatorType as AnimatorType, jsonData.animationData),
    //     )
    //     entryIndex++
    //   })
    //   this.BindContext()
    //   if (this.onCompleteInit !== null) {
    //     this.onCompleteInit = this.onCompleteInit.bind(this)
    //     this.onCompleteInit()
    //   }
    // }
  }

  GetRandomSymbol(): SymbolsData {
    let randomIndex = Math.floor(Math.random() * 9) + 1
    return Array.from(this.symbols.values())[randomIndex]
  }

  CreateReelContainer(container: Container) {
    this.parentContainer = container
    this.reelContainer = new ReelContainer(this.parentContainer)
    for (let index = 0; index < GameSettings.numberOfReels; index++) {
      this.CreateReel = this.CreateReel.bind(this)
      this.reelContainer.AddReel(this.CreateReel(index, this.parentContainer))
    }
    this.FillSymbolsMatrix()
  }

  CreateReel(index: number, container: Container): Reel {
    let reelContainer = new Container()
    reelContainer.name = 'reel' + index
    reelContainer.x = GameSettings.startReelPosX + index * GameSettings.gridPaddingX
    container.addChild(reelContainer)
    let reel = new Reel(reelContainer, GameSettings.gridPaddingY, GameSettings.startReelPosY)

    // for (let i = 0; i < GameSettings.numberOfSymbolsInReel; i++) {
    //   this.GetRandomSymbol = this.GetRandomSymbol.bind(this)
    //   symbolData = this.GetRandomSymbol()
    //
    //   reel.AddSymbol(new ReelSymbol(new AnimatedObject(symbolData.json, symbolData.basetexture), reelContainer))
    // }
    return reel
  }

  FillSymbolsMatrix() {
    let emptyReelSymbols = new Array<ReelSymbol>()
    for (let i = 0; i < this.symbolsMatrix.length; i++) {
      this.symbolsMatrix[i] = emptyReelSymbols
    }
    console.log(this.symbolsMatrix)

    if (this.reelContainer && this.reelContainer.reels)
      for (let j = 0; j < this.reelContainer.reels[0].symbols.length; ) {
        for (let i = 0; i < this.reelContainer.reels.length; i++) {
          console.log(j, i)
          this.symbolsMatrix[j][i] = this.reelContainer.reels[i].symbols[j]
        }
        j++
      }
    for (let i = 0; i < this.symbolsMatrix.length; i++) {
      console.log(this.symbolsMatrix[i])
    }
  }

  SpawnNewElements() {}

  DoSpin() {
    if (this.reelState !== ReelStates.Idle) {
      console.log("spin in progress can't stat new spin")
      return
    }

    this.ChangeState(ReelStates.Spinning)
  }

  ChangeState(newState: ReelStates) {
    switch (newState) {
      case ReelStates.Idle:
        break
      case ReelStates.BeforeStartSpin:
        break
      case ReelStates.Spinning:
        this.StartSpinAnimation()
        break
      case ReelStates.StartCollectingWinSymbols:
        break
      case ReelStates.EndCollectingWinSymbols:
        break
      case ReelStates.SpawnNewSymbols:
        break
      case ReelStates.BeforeEndSpin:
        break
      case ReelStates.EndSpin:
        break
    }
    this.reelState = newState
  }

  async StartSpinAnimation() {
    this.PlayFallAnimation(FallType.FromScreen)
    await this.PlayFallAnimation(FallType.ToScreen, GameSettings.reelsDelays.delayBeforeStartFallToScreen)
    this.ChangeState(ReelStates.Idle)
  }

  SelectAnimationFromIndex(symbolIndex: number, fallType: FallType): AnimationPair | undefined {
    switch (fallType) {
      case FallType.FromScreen:
        return this.fallFromScreenAnimations.get(symbolIndex)
      case FallType.ToScreen:
        return this.fallToScreenAnimations.get(symbolIndex)
    }
  }

  async PlayFallAnimation(fallType: FallType, delayBeforeStart?: number) {
    let completePromise: Promise<boolean> = new Promise(resolve => {
      if (delayBeforeStart) {
        setTimeout(() => {}, delayBeforeStart)
      }
      if (this.reelContainer) {
        let animPair: AnimationPair | undefined
        for (let i = 0; i < this.reelContainer.reels.length; i++) {
          for (let j = 0; j < this.reelContainer.reels[i].symbols.length; j++) {
            animPair = this.SelectAnimationFromIndex(j, fallType)
            if (animPair) {
              if (fallType === FallType.ToScreen) {
                //this.reelContainer.reels[i].symbols[j].animatedObject.PlayJSON(animPair)
                this.reelContainer.reels[i].symbols[j].animatedObject.PlayWithDelay(
                  'bounce',
                  animPair.animationData.animationTime * 0.9,
                )
              } else {
                if (
                  i === this.reelContainer.reels[i].symbols.length - 1 &&
                  j === this.reelContainer.reels[i].symbols.length - 1 &&
                  fallType === FallType.FromScreen
                ) {
                  this.reelContainer.reels[i].symbols[j].animatedObject.callback = () => {
                    resolve(true)
                    console.log('last element falled from sreen')
                  }
                }
              }
            }
          }
        }
      }
    })
    await completePromise
  }
}

export enum SpawnModes {
  OneLine = 0,
  Stair = 1,
}

export enum FallType {
  FromScreen = 0,
  ToScreen = 1,
}
