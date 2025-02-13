import { assign, createMachine } from 'xstate'

export const jackpotMachine = createMachine(
  {
    id: 'jackpotMachine',
    initial: 'idle',
    context: {
      currentLevel: 0,
      bigWinSteps: [15, 30, 45, 60],
      finalSound: null,
      delay: 0,
      secondsToCountOneTotalBet: 1,
      forcedSmallWinCountDuration: -1,
      secondsToCountOneTotalBetOldValue: 1,
      normalSettings: null,
      freeSpinsSettings: null,
      useBonusGameSettings: false,
      bonusGameSettings: null,
      currentSettings: null,
      normalAlternateMusic: null,
      freeSpinsAlternateMusic: null,
      bonusGameAlternateMusic: null,
      finalAlternateSound: null,
      finalAlternateSoundFS: null,
      currentAlternateMusic: null,
      individualBigWinClips: null,
      finalIndividualBigWinClips: null,
      individualBigWinSoundsDuration: [12, 20, 30, 40, 50],
      finalIndividualBigWinSound: null,
      targetBigWinLevel: 0,
      timesTotalBet: 0,
      timesTotalBetFloat: 0,
      target: 0,
      counting: false,
      counter: 0,
      level: 0,
      idxInLevel: 0,
      inLevelRepeatCounter: 0,
      sndManager: null,
      timer: 0,
      totalWin: 0,
      isJackpot: false,
      isShowedJackpot: false,
      isWatchAgainPressed: false,
      isAnimationStopped: false,
    },
    states: {
      idle: {
        on: {
          SET_IS_JACKPOT: {
            actions: 'setIsJackpot',
          },
          SET_TOTAL_WIN: {
            actions: 'setTotalWin',
          },
          SET_CURRENT_LEVEL: {
            actions: 'setCurrentLevel',
          },
          SET_TIMES_TOTAL_BET_FLOAT: {
            actions: 'setTimesTotalBetFloat',
          },
          SET_SECONDS_OLD: {
            actions: 'setSecondsTotalBetOld',
          },
          SET_HAS_ALREADY_MODE: {
            actions: 'setHasAlreadyModalOrNot',
          },
          WATCH_AGAIN_PRESSED_STATUS: {
            actions: 'setWatchAgainPressedStatus',
          },
          STOP_ANIMATION: {
            actions: 'stopAnimation',
          },
        },
      },
    },
  },
  {
    actions: {
      setIsJackpot: assign(({ event }) => ({
        isJackpot: event?.isJackpot as boolean,
      })),
      setTotalWin: assign(({ event }) => ({
        totalWin: event?.totalWin as number,
      })),
      setCurrentLevel: assign(({ event }) => ({
        currentLevel: event?.currentLevel as number,
      })),
      setTimesTotalBetFloat: assign(({ event }) => ({
        timesTotalBetFloat: event?.timesTotalBetFloat as number,
      })),
      setSecondsTotalBetOld: assign(({ event }) => ({
        secondsToCountOneTotalBetOldValue: event?.secods as number,
      })),
      setHasAlreadyModalOrNot: assign(({ event }) => ({
        isShowedJackpot: event.value as boolean,
      })),
      setWatchAgainPressedStatus: assign(({ event }) => ({
        isWatchAgainPressed: event.value as boolean,
      })),
      stopAnimation: assign(({ event }) => ({
        isAnimationStopped: event.value as boolean,
      })),
    },
  },
)
