import { InitialSlotMachineContext } from 'Core/state/slotMachine'

import type { DoCollectResData, DoInitResData, DoSpinResData, GameInfoDataType, ICheckCandyRush, SymbolIdsType } from 'Types'

function setDoInitData({
  data,
  context,
}: {
  data: DoInitResData
  context: InitialSlotMachineContext
}): Partial<InitialSlotMachineContext> {
  if (!data) return context

  const symbolsMarkData = data['symbolMark'] ? data['symbolMark'].match(/\d+:\d+/g) : null
  const symbolsMark = symbolsMarkData ? symbolsMarkData.join(',') : ''

  return {
    nextAction: data['nextAction'],
    action: 'init',
    windowSymbols: data['symbolsWindow'] ? data['symbolsWindow'].split(',') : null,
    slotsInitialized: true,
    balance: data['balance'] ? data['balance'] : '',
    freeSpinMode: !!(data['freeSpins'] || data['freeSpinsTotalCount']),
    freeSpinTotal: data['freeSpinsTotalCount'] ? +data['freeSpinsTotalCount'] : 0,
    freeSpinsMore: data['freeSpinsMore'] ? data['freeSpinsMore'] : '0',
    freeSpins: data['freeSpins'] || '',
    freeSpinsMaxCount: data['freeSpinsMaxCount'] || '',
    coin: data['coin'] ? +data['coin'] : 1,
    betLevel: data['betLevelValue'] ? +data['betLevelValue'] : 1,
    win: data['roundWin'] || '',
    randomSymbolMultiplier: data['randomSymbolMultiplier']
      ? data['randomSymbolMultiplier'].split(';').map(part => {
          const [id, position, multiplier] = part.split('~').map(Number)

          return { id, position, multiplier }
        })
      : [],
    winAtSpin: data['spinWin'] || '',
    symbolsMark,
    freeRoundsModalData: getFreeRoundsModalData(data['events']),
    freeRoundsNumber: data['freeRoundNumber'] ? +data['freeRoundNumber'] : null,
    freeRoundsPrize: data['freeRoundAmount'] ? +data['freeRoundAmount'] : null,
    winsAtSpin: getWinAtSpinData(data),
    accumulativeValues: data['accumulativeValues'],
    multiplierSum: Math.round(Number(data['accumulativeValues'])),
    reelSet: data['reelSet'],
    trail: data.trail ? data.trail.split('~')[1].split(',') : [],
    trailMultiplierPos: data.symbolLineMultiplierPositions ? data.symbolLineMultiplierPositions.split(',') : [],
    trailMultiplierValues: data.symbolLineMultiplierValues ? data.symbolLineMultiplierValues.split(',') : [],
    bets: data['bets'] ? formatDataIntoArrayNumbers(data['bets']) : [],
    totalBetMin: +data['totalBetMin'],
    totalBetMax: +data['totalBetMax'],
    gameInfo: data.gameInfo ? getGameInfoRtpsData(data.gameInfo) : null,
    rtp: data.rtp ? formatDataIntoArrayNumbers(data.rtp) : null,
    betLevelScale: data.betLevelScale ? formatDataIntoArrayNumbers(data.betLevelScale) : null,
    payTable: data.payTable ? parsePayTable(data.payTable) : null,
    prm: data.prm ? parsePrmData(data.prm) : null,
    winLimitTotalBetMultipliers: data.winLimitTotalBetMultipliers
      ? parseWinLimitMultipliers(data.winLimitTotalBetMultipliers)
      : null,
  }
}

function setSpinData(data: DoSpinResData, context: InitialSlotMachineContext): Partial<InitialSlotMachineContext> {
  if (!data) return context

  return {
    permissionToShow: { ...context.permissionToShow, request: true },
    windowSymbols: data['symbolsWindow'] ? data['symbolsWindow'].split(',') : null,
    nextAction: data['nextAction'] || '',
    action: 'spin',
    symbolsMark: data['symbolMark'] ? data.symbolMark.match(/\d+:\d+/g)?.join(',') : '',
    payingSymbols: setPayingSymbols(data),
    winningSymbols: setWinningSymbols(data),
    win: data['roundWin'] || '',
    winAtSpin: data['spinWin'] || '',
    winsAtSpin: getWinAtSpinData(data),
    balance: data['balance'] ? data['balance'] : '',
    winsSeries: setWinsSeries(data),
    freeSpinsPurchaseIndex: null,
    featurePurchaseIndex: null,
    freeSpins: data['freeSpins'] || '',
    freeSpinTotal: data['freeSpinsTotalCount'] ? +data['freeSpinsTotalCount'] : 0,
    freeSpinsMore: data['freeSpinsMore'] ? data['freeSpinsMore'] : '0',
    freeSpinsMaxCount: data['freeSpinsMaxCount'] || '',
    randomSymbolMultiplier: setRandomSymbolMultiplier(data['randomSymbolMultiplier']),
    totalSpinWinResult: data['totalSpinWinResult'] || '',
    freeRoundsModalData: data['events'] ? getFreeRoundsModalData(data['events']) : [],
    freeRoundsNumber: data['freeRoundNumber'] ? +data['freeRoundNumber'] : null,
    freeRoundsPrize: data['freeRoundAmount'] ? +data['freeRoundAmount'] : null,
    isGetNewSpinData: true,
    accumulativeValues: data['accumulativeValues'],
    reelSet: data['reelSet'],
    trail: data.trail ? data.trail.split('~')[1].split(',') : [],
    trailMultiplierPos: data.symbolLineMultiplierPositions ? data.symbolLineMultiplierPositions.split(',') : [],
    trailMultiplierValues: data.symbolLineMultiplierValues ? data.symbolLineMultiplierValues.split(',') : [],
  }
}

function setCollectData(data: DoCollectResData, context: InitialSlotMachineContext) {
  if (!data) return context

  return {
    action: 'result',
    nextAction: data['nextAction'] || '',
    balance: data['balance'] ? data['balance'] : '',
    index: Boolean(APP_CONFIG.replayMode) ? 1 : context.index,

    freeRoundsModalData: data['events'] ? getFreeRoundsModalData(data['events']) : [],
    freeRoundsPrize: data['freeRoundAmount'] ? +data['freeRoundAmount'] : null,
    accumulativeValues: data['accumulativeValues'],
  }
}

function setWinningSymbols(data: DoSpinResData): SymbolIdsType[] {
  if (data['symbolMark']) {
    return (data['symbolMark'].match(/\d+(?=:)/g) || []) as SymbolIdsType[]
  } else if (data['symbolMark']) {
    return data['symbolMark'].split('~')[2].split(',').fill('1') as SymbolIdsType[]
  }

  return []
}

function setWinsSeries(data: DoSpinResData): number {
  if (data['reSpinTotal']) {
    return +data['reSpinTotal']
  } else if (data['reSpinPlayed']) {
    return +data['reSpinPlayed']
  } else if (data['reSpinType']) {
    return +data['reSpinType']
  }

  return 0
}

function setRandomSymbolMultiplier(randomSymbolMultiplier?: string) {
  if (randomSymbolMultiplier) {
    const parts: string[] = randomSymbolMultiplier.split(';')

    return parts.map(part => {
      const [id, position, multiplier] = part.split('~').map(Number)

      return { id, position, multiplier }
    })
  }

  return []
}

function getFreeRoundsModalData(data: string): string[][] {
  return data
    ? Array.from(data.matchAll(/([^~;]+)~([^;]*)/g), (match: RegExpMatchArray): string[] => [
        match[1],
        ...match[2].match(/[^,]*/g)!.filter(value => value.trim() !== ''),
      ])
    : []
}

function getWinAtSpinData(data: DoSpinResData | DoInitResData): string[] {
  return [
    data['winLines0'],
    data['winLines1'],
    data['winLines2'],
    data['winLines3'],
    data['winLines4'],
    data['winLines5'],
    data['winLines6'],
    data['winLines7'],
    data['winLines8'],
    data['winLines9'],
  ].filter(i => i)
}

function getPsymCandyRush(data: DoSpinResData): ICheckCandyRush {
  // TODO
  const isCandyRush =
    (APP_CONFIG.gameId === 'candy_rush' ||
      APP_CONFIG.gameId === 'candy_rush_x' ||
      APP_CONFIG.gameId === 'mariobet_rush' ||
      APP_CONFIG.gameId === 'bayspin_rush') &&
    (!!data['reSpinTotal'] || !data['winLines0']) &&
    data['freeSpins'] === '1'

  const payingSymbolsCandyRush = data['symbolsWindow']
    .split(',')
    .flatMap((value, index) => (value === '1' ? index : []))
    .join(',')

  return { isCandyRush, payingSymbolsCandyRush }
}

function setPayingSymbols(data: DoSpinResData): string | undefined {
  const { isCandyRush, payingSymbolsCandyRush } = getPsymCandyRush(data)

  if (isCandyRush) return payingSymbolsCandyRush

  return data['payingSymbols'] ? data['payingSymbols'].match(/\d+(?=,|$)/g)?.join(',') : ''
}

function getInvokeSrc(type: 'init' | 'spin' | 'collect' | undefined): string {
  const isReplayMode: boolean = Boolean(APP_CONFIG.replayMode)
  const isDebugMode: boolean = DEBUG_MODE
  const isReplayOrDebugMode: boolean = Boolean(APP_CONFIG.replayMode) || DEBUG_MODE

  switch (type) {
    case 'init':
      if (isDebugMode) return 'debugDoInit'
      if (isReplayMode) return 'replayDoInit'

      return 'doInit'
    case 'spin':
      return isReplayOrDebugMode ? 'replayDoSpin' : 'doSpin'
    case 'collect':
      return isReplayOrDebugMode ? 'replayDoCollect' : 'doCollect'

    default:
      return ''
  }
}

function formatDataIntoArrayNumbers(data: string): number[] {
  return data.split(',').map(val => +val)
}

function getGameInfoRtpsData(data: string): GameInfoDataType {
  return JSON.parse(data.replace(/([a-zA-Z0-9_]+):/g, '"$1":')).rtps
}

function parsePayTable(data: string): number[][] {
  const payTable: number[][] = []
  const symbolValues = data.split(';')

  for (let i = 0; i < symbolValues.length; ++i) {
    const symbolPayTable: number[] = []
    const symbolValue = symbolValues[i].split(',')

    for (let j = symbolValue.length - 1; j >= 0; --j) {
      symbolPayTable.push(checkValue(symbolValue[j]))
    }
    payTable[i] = symbolPayTable
  }

  return payTable
}

function checkValue(value: string) {
  const number = parseInt(value, 10)

  return isFinite(number) && !isNaN(number) ? number : 0
}

function parsePrmData(data: string): string[] {
  return data.split(';')[0].split('~')[1].split(',')
}

function parseWinLimitMultipliers(data: string): RegExpMatchArray | null {
  return data.match(/\d+/g)
}

export {
  setDoInitData,
  setSpinData,
  setCollectData,
  getFreeRoundsModalData,
  setWinningSymbols,
  setWinsSeries,
  setRandomSymbolMultiplier,
  getInvokeSrc,
}
