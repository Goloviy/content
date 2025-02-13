import { createActor } from 'xstate'

import { Constants } from 'Constants'

import { settingsActor } from 'Core/state'
import { IDLE } from 'Core/state/settingsMachine/constants/constants'

import { debounce } from 'Utils'

import { switcherMachine } from '../switcherMachine'

export const batterySaveActor = createActor(switcherMachine).start()

const debounceBatterySaver = debounce(sendBatterySaver, Constants.gameSettings.SETTINGS_DEBOUNCE_DELAY)

function sendBatterySaver(isBatterySaver: boolean) {
  if (settingsActor.getSnapshot().value === IDLE) settingsActor.send({ type: 'UPDATE_DATA', settings: { BSM: isBatterySaver } })
}

batterySaveActor.subscribe(({ context: { isOn } }) => debounceBatterySaver(isOn))
