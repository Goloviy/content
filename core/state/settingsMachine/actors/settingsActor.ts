import { createActor } from 'xstate'

import {
  batterySaveActor,
  betActor,
  coinsActor,
  coinValueActor,
  introScreenActor,
  playGameSoundActor,
  playMusicActor,
  playPrevGameSoundActor,
  playPrevMusicActor,
  prevBetActor,
  prevCoinValueActor,
  quickSpinActor,
  soundActor,
  spinButtonLockActor,
} from 'Core/state'
import { SwitcherActor } from 'Core/state/types'

import { initialContext, SettingsContextType } from '../constants/constants'
import { settingsMachine } from '../settingsMachine'

const isReplayMode = APP_CONFIG.replayMode
const settingsActor = createActor(settingsMachine)

!isReplayMode ? settingsActor.start() : settingsActor.stop()

settingsActor.subscribe(state => {
  const settings = state.context

  if (settings === null || (typeof settings === 'object' && Object.keys(settings).length === 0)) {
    settingsActor.send({ type: 'UPDATE_DATA', settings: initialContext })
  } else {
    updateBetData(settings)
    updateAllSwitchers(settings)
    updateSoundState(settings)
    updateVolume(settings)
  }
})

function updateBetData(settings: SettingsContextType): void {
  const { BetValue } = settings
  const settingsBetIndex = BetValue[0]
  const settingsCoinIndex = BetValue[1]
  const currentBetIndex = betActor.getSnapshot().context.index
  const currentCoinIndex = coinValueActor.getSnapshot().context.index

  if (settingsBetIndex !== currentBetIndex) {
    betActor.send({ type: 'SET_INDEX', index: settingsBetIndex })
    prevBetActor.send({ type: 'SET_VALUE', value: settingsBetIndex })
  }
  if (settingsCoinIndex !== currentCoinIndex) {
    coinValueActor.send({ type: 'SET_INDEX', index: settingsCoinIndex })
    prevCoinValueActor.send({ type: 'SET_VALUE', value: settingsCoinIndex })
  }
}

function updateSwitcherData(personalSettingsValue: boolean, actor: SwitcherActor): void {
  const currentValue = actor.getSnapshot().context.isOn

  if (currentValue !== personalSettingsValue) actor.send({ type: 'SET_VALUE', value: personalSettingsValue })
}

function updateSoundState(settings: SettingsContextType): void {
  const { SoundState } = settings
  const currentMusicValue = playMusicActor.getSnapshot().context.isOn
  const currentGameSoundValue = playGameSoundActor.getSnapshot().context.isOn
  const prevMusicValue = playPrevMusicActor.getSnapshot().context.isOn
  const prevGameSoundValue = playPrevGameSoundActor.getSnapshot().context.isOn

  const { Music, Effects, PreviousMusic, PreviousEffects } = SoundState

  if (currentMusicValue !== Music) playMusicActor.send({ type: 'SET_VALUE', value: Music })
  if (currentGameSoundValue !== Effects) playGameSoundActor.send({ type: 'SET_VALUE', value: Effects })
  if (prevMusicValue !== PreviousMusic) playPrevMusicActor.send({ type: 'SET_VALUE', value: PreviousMusic })
  if (prevGameSoundValue !== PreviousEffects) playPrevGameSoundActor.send({ type: 'SET_VALUE', value: PreviousEffects })
}

function updateAllSwitchers(settings: SettingsContextType): void {
  const { BSM, CoinMode, PreviewScreen, QuickSpin, SBPLock } = settings

  updateSwitcherData(SBPLock, spinButtonLockActor)
  updateSwitcherData(BSM, batterySaveActor)
  updateSwitcherData(CoinMode, coinsActor)
  updateSwitcherData(PreviewScreen, introScreenActor)
  updateSwitcherData(QuickSpin, quickSpinActor)
}

function updateVolume(settings: SettingsContextType): void {
  const { Volume } = settings.SoundState
  const currentVolume = soundActor.getSnapshot().context.volume

  if (currentVolume !== Volume) soundActor.send({ type: 'SET_VOLUME', value: Volume })
}

export { settingsActor }
