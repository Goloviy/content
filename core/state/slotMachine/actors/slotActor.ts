import { createActor } from 'xstate'

import { updateCoinArray } from 'Utils'

import { slotMachine } from '../slotMachine'

// function initInspector(): { inspect: Observer<InspectionEvent> } | undefined {
//   if (APP_CONFIG.isDev) {
//     const { inspect } = createBrowserInspector()
//
//     return {
//       inspect,
//     }
//   }
//
//   return undefined
// }

// const options = initInspector()

export const slotActor = createActor(slotMachine).start()

let currentBets = slotActor.getSnapshot().context.bets

slotActor.subscribe(state => {
  if (currentBets.length !== state.context.bets.length) {
    currentBets = state.context.bets
    updateCoinArray()
  }
})

// export const slotActor = createActor(slotMachine, options).start()
