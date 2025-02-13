import { createActor } from 'xstate'

import { Constants } from 'Constants'

import { playMusicActor, playPrevGameSoundActor, settingsActor } from 'Core/state'
import { IDLE } from 'Core/state/settingsMachine/constants/constants'

import { debounce } from 'Utils'

import { switcherMachine } from '../switcherMachine'

export const playGameSoundActor = createActor(switcherMachine).start()

const debounceGameSound = debounce(sendGameSound, Constants.gameSettings.SETTINGS_DEBOUNCE_DELAY)

function sendGameSound(isGameSound: boolean) {
  const soundState = settingsActor.getSnapshot().context.SoundState
  const prevGameSound = playPrevGameSoundActor.getSnapshot().context.isOn
  const isMusic = playMusicActor.getSnapshot().context.isOn

  const settings = {
    SoundState: {
      ...soundState,
      Effects: isGameSound,
      PreviousEffects: prevGameSound,
      SoundOn: isGameSound || isMusic,
    },
  }

  if (settingsActor.getSnapshot().value === IDLE) settingsActor.send({ type: 'UPDATE_DATA', settings })
}

playGameSoundActor.subscribe(({ context: { isOn } }) => debounceGameSound(isOn))
