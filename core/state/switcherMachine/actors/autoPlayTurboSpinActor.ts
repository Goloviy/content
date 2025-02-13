import { createActor } from 'xstate'

import { quickSpinActor } from 'Core/state'

import { switcherMachine } from '../switcherMachine'

export const autoPlayTurboSpinActor = createActor(switcherMachine).start()

autoPlayTurboSpinActor.subscribe(state => {
  const isQuickSpin = quickSpinActor.getSnapshot().context.isOn
  const isTurboSpin = state.context.isOn

  if (isQuickSpin && isTurboSpin) quickSpinActor.send({ type: 'TOGGLE' })
})
