import { createActor } from 'xstate'

import { Constants } from 'Constants'

import { playGameSoundActor, playPrevMusicActor, settingsActor } from 'Core/state'
import { IDLE } from 'Core/state/settingsMachine/constants/constants'

import { debounce } from 'Utils'

import { switcherMachine } from '../switcherMachine'

export const playMusicActor = createActor(switcherMachine).start()

const debounceMusic = debounce(sendMusic, Constants.gameSettings.SETTINGS_DEBOUNCE_DELAY)

function sendMusic(isMusic: boolean) {
  const soundState = settingsActor.getSnapshot().context.SoundState
  const prevMusic = playPrevMusicActor.getSnapshot().context.isOn
  const isGameSound = playGameSoundActor.getSnapshot().context.isOn

  const settings = {
    SoundState: {
      ...soundState,
      Music: isMusic,
      PreviousMusic: prevMusic,
      SoundOn: isMusic || isGameSound,
    },
  }

  if (settingsActor.getSnapshot().value === IDLE) settingsActor.send({ type: 'UPDATE_DATA', settings })
}

playMusicActor.subscribe(({ context: { isOn } }) => debounceMusic(isOn))
