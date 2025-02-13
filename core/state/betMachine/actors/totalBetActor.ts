import { createActor } from 'xstate'

import { Constants } from 'Constants'

import {
  betActor,
  coinsActor,
  coinValueActor,
  getTotalBetArray,
  MultiplicationMapItem,
  multiplierActor,
  multiplicationMap,
} from 'Core/state'
import { betMachine } from 'Core/state/betMachine/betMachine'

const totalBetActor = createActor(betMachine, { id: Constants.actorIds.TOTAL_BET_ACTOR }).start()

multiplierActor.subscribe(() => updatedTotalBetArray())
coinsActor.subscribe(() => updatedTotalBetArray())

let { index: prevIndex, value: prevValue, array: prevArray } = totalBetActor.getSnapshot().context

totalBetActor.subscribe(({ context }) => {
  const { index, value, array } = context

  if (prevIndex !== index) {
    prevIndex = index

    totalBetActor.send({ type: 'SET_VALUE', value: array[index] })
  }

  if (prevValue !== value) {
    prevValue = value

    const betValue = betActor.getSnapshot().context.value
    const coinValue = coinValueActor.getSnapshot().context.value

    const betArray = betActor.getSnapshot().context.array
    const coinValueArray = coinValueActor.getSnapshot().context.array

    const isTotalBetUpdatedValue = totalBetActor.getSnapshot().context.isUpdatedValue

    if (!multiplicationMap[value]) return

    const { bet: savedBetValue, coin: savedCoinValue } = getSavedValues(multiplicationMap[value], coinValue)

    if (isTotalBetUpdatedValue) {
      totalBetActor.send({ type: 'SET_IS_UPDATED_VALUE', isUpdatedValue: false })
    } else if (betValue !== savedBetValue && coinValue === savedCoinValue) {
      betActor.send({ type: 'SET_INDEX', index: betArray.indexOf(savedBetValue) })
    } else if (coinValue !== savedCoinValue && betValue === savedBetValue) {
      coinValueActor.send({ type: 'SET_INDEX', index: coinValueArray.indexOf(savedCoinValue) })
    } else if (coinValue !== savedCoinValue && betValue !== savedBetValue) {
      betActor.send({ type: 'SET_IS_UPDATED_VALUE', isUpdatedValue: true })
      betActor.send({ type: 'SET_INDEX', index: betArray.indexOf(savedBetValue) })

      coinValueActor.send({ type: 'SET_IS_UPDATED_VALUE', isUpdatedValue: true })
      coinValueActor.send({ type: 'SET_INDEX', index: coinValueArray.indexOf(savedCoinValue) })
    } else {
      return
    }
  }

  if (prevArray.length !== array.length) {
    prevArray = [...array]

    updatedTotalBetArray()
  }
})

function updatedTotalBetArray() {
  const betIndex = betActor.getSnapshot().context.index
  const betValue = betActor.getSnapshot().context.value
  const betArray = betActor.getSnapshot().context.array

  const coinValue = coinValueActor.getSnapshot().context.value
  const coinValueArray = coinValueActor.getSnapshot().context.array

  const multiplier = multiplierActor.getSnapshot().context.value as number
  const isCoins = coinsActor.getSnapshot().context.isOn

  const totalBetArray = getTotalBetArray(betArray, coinValueArray, multiplier, isCoins)

  const newTotalBetValue = isCoins ? betValue * multiplier : betValue * coinValue * multiplier
  const newTotalBetIndex = isCoins ? betIndex : totalBetArray.indexOf(newTotalBetValue)

  if (!!coinValueArray.length) {
    totalBetActor.send({ type: 'SET_ARRAY', array: totalBetArray })
    totalBetActor.send({ type: 'SET_IS_UPDATED_VALUE', isUpdatedValue: true })
    totalBetActor.send({ type: 'SET_INDEX', index: newTotalBetIndex })
    totalBetActor.send({ type: 'SET_VALUE', value: newTotalBetValue })
    totalBetActor.send({ type: 'SET_IS_UPDATED_VALUE', isUpdatedValue: false })
  }
}

function getSavedValues(array: MultiplicationMapItem[], coinValue: number): MultiplicationMapItem {
  const savedValuesObject = array.find(item => item.coin === coinValue)

  return savedValuesObject ? savedValuesObject : array[0]
}

export { totalBetActor }
