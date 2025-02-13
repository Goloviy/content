import { createActor } from 'xstate'

import { Constants } from 'Constants'

import { coinsActor, multiplierActor, totalBetActor, betActor, getTotalBetArray } from 'Core/state'
import { betMachine } from 'Core/state/betMachine/betMachine'

export const coinValueActor = createActor(betMachine, { id: Constants.actorIds.COIN_VALUE_ACTOR }).start()

let { index: prevIndex, value: prevValue, array: prevArray } = coinValueActor.getSnapshot().context

coinValueActor.subscribe(({ context }) => {
  const { index, value, array } = context

  if (prevIndex !== index) {
    prevIndex = index

    array.length && coinValueActor.send({ type: 'SET_VALUE', value: array[index] })
  }

  if (prevValue !== value) {
    prevValue = value

    const multiplier = multiplierActor.getSnapshot().context.value
    const betValue = betActor.getSnapshot().context.value
    const totalBetArray = totalBetActor.getSnapshot().context.array
    const isCoinUpdatedValue = coinValueActor.getSnapshot().context.isUpdatedValue
    const isCoins = coinsActor.getSnapshot().context.isOn

    const nextTotalBetValue = +multiplier * betValue * value
    const nextTotalBetIndex = totalBetArray.indexOf(nextTotalBetValue)

    !isCoinUpdatedValue && !isCoins
      ? totalBetArray.length && totalBetActor.send({ type: 'SET_INDEX', index: nextTotalBetIndex })
      : coinValueActor.send({ type: 'SET_IS_UPDATED_VALUE', isUpdatedValue: false })
  }

  if (prevArray.length !== array.length) {
    prevArray = [...array]

    const betArray = betActor.getSnapshot().context.array
    const multiplier = multiplierActor.getSnapshot().context.value as number
    const isCoins = coinsActor.getSnapshot().context.isOn

    const totalBetArray = getTotalBetArray(betArray, array, multiplier, isCoins)

    coinValueActor.send({ type: 'SET_VALUE', value: array[index] })
    totalBetActor.send({ type: 'SET_ARRAY', array: totalBetArray })
  }
})
