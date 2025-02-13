import { createActor } from 'xstate'

import { Constants } from 'Constants'

import { settingsActor } from 'Core/state'
import { IDLE } from 'Core/state/settingsMachine/constants/constants'

import { debounce } from 'Utils'

import { switcherMachine } from '../switcherMachine'

export const coinsActor = createActor(switcherMachine).start()

const debounceCoins = debounce(sendCoins, Constants.gameSettings.SETTINGS_DEBOUNCE_DELAY)

function sendCoins(isCoins: boolean) {
  if (settingsActor.getSnapshot().value === IDLE) settingsActor.send({ type: 'UPDATE_DATA', settings: { CoinMode: isCoins } })
}

coinsActor.subscribe(({ context: { isOn } }) => debounceCoins(isOn))
