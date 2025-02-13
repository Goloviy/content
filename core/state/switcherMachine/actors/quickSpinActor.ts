import { createActor } from 'xstate'

import { Constants } from 'Constants'

import { autoPlayTurboSpinActor, fastPlayActor, settingsActor } from 'Core/state'
import { IDLE } from 'Core/state/settingsMachine/constants/constants'

import { debounce } from 'Utils'

import { switcherMachine } from '../switcherMachine'

export const quickSpinActor = createActor(switcherMachine).start()

const debounceQuickSpin = debounce(sendQuickSpin, Constants.gameSettings.SETTINGS_DEBOUNCE_DELAY)

function sendQuickSpin(isQuickSpin: boolean) {
  const isTurboSpin = autoPlayTurboSpinActor.getSnapshot().context.isOn

  if (isTurboSpin && isQuickSpin) autoPlayTurboSpinActor.send({ type: 'TOGGLE' })

  fastPlayActor.send({ type: 'SET_VALUE', value: isQuickSpin })

  if (settingsActor.getSnapshot().value === IDLE)
    settingsActor.send({ type: 'UPDATE_DATA', settings: { QuickSpin: isQuickSpin } })
}

quickSpinActor.subscribe(({ context: { isOn } }) => debounceQuickSpin(isOn))
