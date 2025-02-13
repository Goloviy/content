import { createActor } from 'xstate'

import { Constants } from 'Constants'

import { settingsActor } from 'Core/state'
import { IDLE } from 'Core/state/settingsMachine/constants/constants'

import { debounce } from 'Utils'

import { switcherMachine } from '../switcherMachine'

export const introScreenActor = createActor(switcherMachine).start()

const debounceIntro = debounce(sendIntro, Constants.gameSettings.SETTINGS_DEBOUNCE_DELAY)

function sendIntro(isIntro: boolean) {
  if (settingsActor.getSnapshot().value === IDLE)
    settingsActor.send({ type: 'UPDATE_DATA', settings: { PreviewScreen: isIntro } })
}

introScreenActor.subscribe(({ context: { isOn } }) => debounceIntro(isOn))
