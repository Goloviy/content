import { createActor } from 'xstate'

import { Constants } from 'Constants'

import { settingsActor } from 'Core/state'
import { IDLE } from 'Core/state/settingsMachine/constants/constants'

import { debounce } from 'Utils'

import { switcherMachine } from '../switcherMachine'

export const spinButtonLockActor = createActor(switcherMachine).start()

const debounceSpinButtonLock = debounce(sendSpinButtonLock, Constants.gameSettings.SETTINGS_DEBOUNCE_DELAY)

function sendSpinButtonLock(isLocked: boolean) {
  if (settingsActor.getSnapshot().value === IDLE) settingsActor.send({ type: 'UPDATE_DATA', settings: { SBPLock: isLocked } })
}

spinButtonLockActor.subscribe(({ context: { isOn } }) => debounceSpinButtonLock(isOn))
