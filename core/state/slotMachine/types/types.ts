import type { GameInfoDataType, SymbolIdsType } from 'Types'

type InitialSlotMachineContext = {
  isModalOpened: boolean
  resetLater: boolean
  isScatterAnimEnded: boolean
  slotsInitialized: boolean
  index: number
  counter: number
  isSpinning: boolean
  windowSymbols: string[] | null
  nextAction: string | null
  action: string // '' | 'init' | 'spin' | 'result'
  symbolsMark: string
  showLeaveAnimation: boolean
  showComeAnimation: boolean
  animationSymbolsCounter: number
  startAnimationSymbolsCounter: number
  destroy: boolean
  permissionToShow: {
    leaveAnimationEnd: boolean
    request: boolean
    comeAnimationEnd: boolean
  }
  animationBeforeDeletionEnded: boolean
  replaySpinsData: ReplaySpinsData
  win: string
  winAtSpin: string
  winsAtSpin: string[]
  balance: string
  autoSpinsEnabled: boolean
  autoSpinsCount: number
  winsSeries: number
  freeSpinsPurchaseIndex: number | null
  featurePurchaseIndex: number | null
  winningSymbols: SymbolIdsType[]
  freeSpinMode: boolean
  freeSpinTotal: number
  freeSpinsMore: string
  payingSymbols: string
  freeSpins: string
  freeSpinsMaxCount: string
  randomSymbolMultiplier: {
    id: number
    position: number
    multiplier: number
  }[]
  totalSpinWinResult: string
  destroyBombCounter: number
  currentBombMultiplier: number
  coin: number
  betLevel: number
  startTarget: boolean
  isMultipleAnimationEnd: boolean // default true, when go in destroy multiplier state and while not complete false
  isGameTextWinAnimationEnd: boolean // default true, when go in destroy multiplier state and while not complete false
  freeRoundsModalData: string[][]
  freerRoundPlayLater: boolean
  freeRoundsNumber: number | null
  freeRoundsPrize: number | null
  isGetNewSpinData: boolean
  multiplierSum: number
  accumulativeValues: string
  reelSet: string
  trail?: string[]
  trailMultiplierPos?: string[]
  trailMultiplierValues?: string[]
  bets: number[]
  totalBetMin: number
  totalBetMax: number
  gameInfo: GameInfoDataType | null
  rtp: number[] | null
  betLevelScale: number[] | null
  payTable: number[][] | null
  prm: string[] | null
  winLimitTotalBetMultipliers: string[] | null
}

type ReplaySpinsData = { cr: string; sr: string }[]

export type { ReplaySpinsData, InitialSlotMachineContext }
