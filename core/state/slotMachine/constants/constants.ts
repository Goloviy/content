import { fromPromise } from 'xstate'

import {
  betActor,
  coinsActor,
  coinValueActor,
  doubleBetActor,
  freeRoundsActor,
  lowBalanceModalActor,
  totalBetActor,
} from 'Core/state'
import type { InitialSlotMachineContext, ReplaySpinsData } from 'Core/state/slotMachine'

import { api } from 'Api/api'

import { DoCollectData, DoInitData, DoSpinData, ReplayDoInitParams } from 'Types'

const initialContext: InitialSlotMachineContext = {
  slotsInitialized: false,
  isModalOpened: false,
  isScatterAnimEnded: false,
  resetLater: false,
  index: 1,
  counter: 1,
  isSpinning: false,
  windowSymbols: null,
  nextAction: null,
  action: '',
  symbolsMark: '',
  showLeaveAnimation: false,
  showComeAnimation: false,
  animationSymbolsCounter: 0,
  startAnimationSymbolsCounter: 0,
  destroy: false,
  permissionToShow: {
    leaveAnimationEnd: false,
    request: false,
    comeAnimationEnd: false,
  },
  animationBeforeDeletionEnded: false,
  replaySpinsData: [],
  win: '',
  winAtSpin: '',
  winsAtSpin: [],
  balance: '',
  autoSpinsEnabled: false,
  autoSpinsCount: 100,
  winsSeries: 0,
  freeSpinsPurchaseIndex: null,
  featurePurchaseIndex: null,
  winningSymbols: [],
  freeSpinMode: false,
  freeSpinTotal: 0,
  freeSpinsMore: '0',
  payingSymbols: '',
  freeSpins: '',
  freeSpinsMaxCount: '',
  randomSymbolMultiplier: [],
  totalSpinWinResult: '',
  destroyBombCounter: 0,
  currentBombMultiplier: 0,
  coin: 1,
  betLevel: 1,
  startTarget: false,
  isMultipleAnimationEnd: true,
  isGameTextWinAnimationEnd: true,
  freeRoundsModalData: [],
  freerRoundPlayLater: false,
  freeRoundsNumber: null,
  freeRoundsPrize: null,
  isGetNewSpinData: false,
  multiplierSum: 0,
  accumulativeValues: '0',
  reelSet: '1',
  bets: [],
  totalBetMin: 0,
  totalBetMax: 0,
  gameInfo: null,
  rtp: null,
  betLevelScale: null,
  payTable: null,
  prm: null,
  winLimitTotalBetMultipliers: null,
}

const resetProp = {
  animationSymbolsCounter: () => 0,
  startAnimationSymbolsCounter: () => 0,
  showLeaveAnimation: () => false,
  showComeAnimation: () => false,
  destroy: () => false,
  destroyBombCounter: () => 0,
  resetLater: () => false,
  permissionToShow: {
    leaveAnimationEnd: false,
    request: false,
    comeAnimationEnd: false,
  },
  randomSymbolMultiplier: () => [],
  freerRoundPlayLater: false,
  isGetNewSpinData: false,
}

const replayDoInitParams: ReplayDoInitParams = {
  token: APP_CONFIG.authToken,
  roundID: APP_CONFIG.replayRoundId ? `${APP_CONFIG.replayRoundId}` : '',
  envID: APP_CONFIG.environmentId ?? '',
}

function getDoInitParams({ index, counter }: { index: number; counter: number }): DoInitData {
  return {
    action: 'init',
    symbol: APP_CONFIG.gameId,
    serverVersion: '209193',
    index: index,
    counter: counter,
    repeat: 0,
    authToken: APP_CONFIG.authToken,
  }
}

function getDoSpinParams({
  index,
  counter,
  featurePurchaseIndex,
  freerRoundPlayLater,
}: {
  index: number
  counter: number
  featurePurchaseIndex: number | null
  freerRoundPlayLater: boolean
}): DoSpinData {
  return {
    action: 'spin',
    symbol: APP_CONFIG.gameId,
    index: index,
    counter: counter,
    repeat: 0,
    authToken: APP_CONFIG.authToken,
    coin: +betActor.getSnapshot().context.value * +coinValueActor.getSnapshot().context.value,
    line: 20,
    betLevel: doubleBetActor.getSnapshot().context.isOn ? 1 : 0,
    ...(typeof featurePurchaseIndex === 'number' ? { featurePurchaseIndex } : {}),
    ...(freerRoundPlayLater ? { FreePlayLater: 1 } : {}),
  }
}

function getDoCollectParams({ index, counter }: { index: number; counter: number }): DoCollectData {
  return {
    action: 'result',
    symbol: APP_CONFIG.gameId,
    index: index,
    counter: counter,
    repeat: 0,
    authToken: APP_CONFIG.authToken,
  }
}

const gameServiceActors = {
  doInit: fromPromise(({ input: { index, counter } }: { input: { index: number; counter: number } }) =>
    api.doInit(getDoInitParams({ index, counter })).then(data => data),
  ),
  doSpin: fromPromise(
    ({
      input: { index, counter, featurePurchaseIndex, freerRoundPlayLater },
    }: {
      input: { index: number; counter: number; featurePurchaseIndex: number; freerRoundPlayLater: boolean }
    }) => api.doSpin(getDoSpinParams({ index, counter, featurePurchaseIndex, freerRoundPlayLater })).then(data => data),
  ),
  doCollect: fromPromise(({ input: { index, counter } }: { input: { index: number; counter: number } }) =>
    api.doCollect(getDoCollectParams({ index, counter })).then(data => data),
  ),
}

const replayActors = {
  replayDoInit: fromPromise(() => api.replayDoInit(replayDoInitParams).then(data => data)),
  replayDoSpin: fromPromise(
    async ({ input: { replaySpinsData, index } }: { input: { replaySpinsData: ReplaySpinsData; index: number } }) => {
      const spinData = JSON.parse(replaySpinsData[index - 2].sr)

      if (DEBUG_MODE) console.log('spin', spinData)

      return { data: spinData }
    },
  ),
  replayDoCollect: fromPromise(async ({ input: { replaySpinsData } }: { input: { replaySpinsData: ReplaySpinsData } }) => {
    const replayDoCollectResData = replaySpinsData.at(-1) ? replaySpinsData.at(-1) : ''
    const data = replayDoCollectResData ? replayDoCollectResData['sr'] : {}

    return { data }
  }),
}

const isReplayMode: boolean = Boolean(APP_CONFIG.replayMode)
const isReplayOrDebugMode: boolean = isReplayMode || DEBUG_MODE

const guards = {
  canSpin: ({ context }: { context: InitialSlotMachineContext }) => {
    const isCoins = coinsActor.getSnapshot().context.isOn
    const coinsValue = Number(coinValueActor.getSnapshot().context.value)
    const bet = Number(totalBetActor.getSnapshot().context.value)

    const betMoney = isCoins ? bet * coinsValue : bet
    const balanceMoney = Number(context.balance)

    const isNotAvailable = betMoney > balanceMoney && !context.freeSpinMode && !isReplayOrDebugMode

    if (freeRoundsActor.getSnapshot().context.freeRoundsMode) return true

    lowBalanceModalActor.send({ type: 'SET_MODAL_OPEN', value: isNotAvailable })

    if (isNotAvailable) {
      context.autoSpinsCount = 0
      context.isSpinning = false
      context.autoSpinsEnabled = false
    }

    return !isNotAvailable
  },
  canMakeTransitionFromDestroyMultiplierState: ({
    context: { destroyBombCounter, randomSymbolMultiplier, isGameTextWinAnimationEnd, resetLater },
  }: {
    context: InitialSlotMachineContext
  }) => {
    if (destroyBombCounter === randomSymbolMultiplier.length && isGameTextWinAnimationEnd && !resetLater) {
      return true
    }

    return false
  },
}

export { initialContext, resetProp, replayDoInitParams, replayActors, gameServiceActors, guards }
