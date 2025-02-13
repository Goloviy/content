import { createActor } from 'xstate'

import { Constants } from 'Constants'

import { totalBetActor, coinValueActor, multiplierActor, coinsActor } from 'Core/state'
import { betMachine } from 'Core/state/betMachine/betMachine'

export const betActor = createActor(betMachine, { id: Constants.actorIds.BET_ACTOR }).start()

betActor.send({ type: 'SET_ARRAY', array: APP_CONFIG.betArray })

let { index: prevIndex, value: prevValue, array: prevArray } = betActor.getSnapshot().context

betActor.subscribe(({ context }) => {
  const { index, value, array } = context

  if (prevIndex !== index) {
    prevIndex = index

    betActor.send({ type: 'SET_VALUE', value: array[index] })
  }

  if (prevValue !== value) {
    prevValue = value

    const isBetUpdatedValue = betActor.getSnapshot().context.isUpdatedValue
    const coinValue = coinValueActor.getSnapshot().context.value
    const totalBetArray = totalBetActor.getSnapshot().context.array
    const multiplier = multiplierActor.getSnapshot().context.value
    const isCoins = coinsActor.getSnapshot().context.isOn

    const nextTotalBetValue = +multiplier * coinValue * value
    const nextTotalBetIndex = isCoins ? index : totalBetArray.indexOf(nextTotalBetValue)

    !isBetUpdatedValue
      ? totalBetArray.length && totalBetActor.send({ type: 'SET_INDEX', index: nextTotalBetIndex })
      : betActor.send({ type: 'SET_IS_UPDATED_VALUE', isUpdatedValue: false })
  }

  if (prevArray.length !== array.length) {
    prevArray = [...array]
  }
})
