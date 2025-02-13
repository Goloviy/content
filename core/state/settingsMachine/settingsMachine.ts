import { assign, createMachine, fromPromise } from 'xstate'

import { api } from 'Api/api'

import type { SettingsResData } from 'Types'

import { getBetInfo } from 'Utils'

import { IDLE, initialContext, INITIALIZING, SAVE_SETTINGS, SettingsContextType } from './constants/constants'

export const settingsMachine = createMachine(
  {
    id: 'settingsMachine',
    initial: INITIALIZING,
    context: initialContext,
    states: {
      [IDLE]: {
        on: {
          UPDATE_DATA: {
            actions: 'updateData',
            target: SAVE_SETTINGS,
          },
        },
      },
      [INITIALIZING]: {
        invoke: {
          src: 'load',
          onError: {
            target: IDLE,
          },
          onDone: {
            target: IDLE,
            actions: 'successfulInitAction',
          },
        },
      },
      [SAVE_SETTINGS]: {
        invoke: {
          src: 'save',
          onError: {
            target: IDLE,
          },
          onDone: {
            target: IDLE,
          },
          input: ({ context }) => context,
        },
      },
    },
  },
  {
    actions: {
      successfulInitAction: assign(({ event }) => event.output),
      updateData: assign(({ event: { settings } }) => {
        const betInfo = getBetInfo()

        return { ...settings, BetValue: betInfo }
      }),
    },
    actors: {
      load: fromPromise(async () => {
        return await api
          .loadSettings({
            method: 'load',
            id: APP_CONFIG.gameId,
            authToken: APP_CONFIG.authToken,
          })
          .then(data => convertBetValueToArray(data.data as SettingsResData))
      }),
      save: fromPromise(async ({ input: settings }: { input: SettingsContextType }) => {
        return await api
          .saveSettings({
            id: APP_CONFIG.gameId,
            settings: JSON.stringify(convertBetValueToString(settings)),
            authToken: APP_CONFIG.authToken,
          })
          .then(data => data)
      }),
    },
  },
)

function convertBetValueToString(settings: SettingsContextType) {
  const convertedBetValue = settings.BetValue.join('_')
  const convertedSettings: SettingsResData = {
    ...settings,
    BetValue: convertedBetValue,
  }

  return convertedSettings
}

function convertBetValueToArray(data: SettingsResData) {
  const convertedBetValue = data.BetValue.split('_').map(Number)
  const convertedSettings: SettingsContextType = {
    ...data,
    BetValue: convertedBetValue,
  }

  return convertedSettings
}
