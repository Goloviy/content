import { assign, createMachine, fromPromise } from 'xstate'

import Aliases from 'Aliases'

import { freeRoundsActor } from 'Core/state'
import {
  setCollectData,
  setDoInitData,
  setSpinData,
  resetProp,
  initialContext,
  getInvokeSrc,
  replayActors,
  gameServiceActors,
  guards,
} from 'Core/state/slotMachine'

import { parseResponseString } from 'Utils'

const isReplayMode: boolean = Boolean(APP_CONFIG.replayMode)
const isReplayOrDebugMode: boolean = isReplayMode || DEBUG_MODE

export const slotMachine = createMachine(
  {
    initial: 'idle',
    context: initialContext,
    states: {
      idle: {
        on: {
          DO_INIT: { target: 'initializing' },
          COLLECT: { target: 'collect' },
          START_SPIN: {
            guard: 'canSpin',
            target: 'startSpin',
          },
          BUY_FREE_SPINS: { target: 'buyFreeSpins' },
          AUTOSPINS_DECREMENT: { actions: 'autoSpinsDecrement' },
          AUTOSPINS_SET_COUNT: { actions: 'autoSpinsSetCount' },
          AUTOSPINS_TOGGLE: { actions: 'autoSpinsToggle' },
          FREE_SPIN_TOGGLE: { actions: 'freeSpinToggle' },
          FREE_SPIN_END_TOGGLE: { actions: 'freeSpinTotalToggle' },
          FREE_SPIN_MORE_TOGGLE: { actions: 'freeSpinMoreToggle' },
          RESET_LATER: { actions: 'resetLaterToggle' },
          JUMP_TO_SHOW_COME_ANIMATION: { target: 'showComeAnimation' },
          SET_BOMB_MULTIPLIER: { actions: 'setBombMultiplierAction' },
          FREE_ROUNDS_LATER: { actions: 'changeFreeRoundsLater' },
          SET_MULTIPLIER_SUM: { actions: 'setMultiplierSum' },
          JACKPOT_MODAL_TOGGLE: { actions: 'jackpotModalToggle' },
          SCATTER_ANIMATION_END_TOGGLE: { actions: 'scatterAnimationEndToggle' },
          MIDDLE_STATE: 'middleState',
        },
      },

      initializing: {
        invoke: {
          src: getInvokeSrc('init'),
          input: ({ context: { index, counter } }) => ({ index, counter }),
          onError: {
            target: 'toIdle',
          },
          onDone: {
            target: 'postDoInit',
            actions: 'successfulInitAction',
          },
        },
      },

      buyFreeSpins: {
        entry: 'buyFreeSpinsAction',
        after: { SPIN: 'spinning' },
      },

      startSpin: {
        entry: 'clickSpinButtonAction',
        after: { SPIN: 'spinning' },
      },

      spinning: {
        on: {
          COUNT_ANIMATION: { actions: 'countingAction' },
          COUNT_START_ANIMATION: { actions: 'countingStartAction' },
          LEAVE_ANIMATION_END: { actions: 'leaveAnimationEndAction' },
          SHOW_COME_ANIMATION: { target: 'showComeAnimation' },
          AUTOSPINS_TOGGLE: { actions: 'autoSpinsToggle' },
          RESET_LATER: { actions: 'resetLaterToggle' },
          JACKPOT_MODAL_TOGGLE: { actions: 'jackpotModalToggle' },
          SCATTER_ANIMATION_END_TOGGLE: { actions: 'scatterAnimationEndToggle' },
          COLLECT: { target: 'collect' },
        },
        entry: 'startSpinAction',
        invoke: {
          src: getInvokeSrc('spin'),
          input: ({ context: { index, counter, featurePurchaseIndex, replaySpinsData, freerRoundPlayLater } }) => ({
            index,
            counter,
            featurePurchaseIndex,
            replaySpinsData,
            freerRoundPlayLater,
          }),
          onError: {
            target: 'toIdle',
          },
          onDone: {
            actions: 'successfulSpinAction',
          },
        },
      },

      showComeAnimation: {
        after: { MIDDLE_STATE: 'middleState' },
        entry: 'showComeAnimationAction',
      },

      middleState: {
        on: {
          COUNT_ANIMATION: { actions: 'countingAction' },
          COME_ANIMATION_END: { actions: 'comeAnimationEndAction' },
          ANIMATION_BEFORE_DELETION_ENDED: { actions: 'animationBeforeDeletionEndedAction' },
          BACK_TO_SPINNING: { target: 'backToSpinning' },
          AUTOSPINS_TOGGLE: { actions: 'autoSpinsToggle' },
          JACKPOT_MODAL_TOGGLE: { actions: 'jackpotModalToggle' },
          RESET_LATER: { actions: 'resetLaterToggle' },
          RESET: { target: 'toIdle' },
          DESTROY_BOMB: { target: 'destroyMultiplierState' },
          COLLECT: { target: 'collect' },
        },
      },

      destroyMultiplierState: {
        on: {
          BOMB_DESTROY_COUNTER: { actions: 'bombDestroyCounterAction' },
          COLLECT: { target: 'collect' },
          SET_BOMB_MULTIPLIER: { actions: 'setBombMultiplierAction' },
          RESET: {
            guard: 'canMakeTransitionFromDestroyMultiplierState',
            target: 'toIdle',
          },
          FREE_SPIN_TOGGLE: { actions: 'freeSpinToggle' },
          IS_MULTIPLE_ANIMATIONS_END: { actions: 'multipleAnimationEndAction' },
          IS_GAME_TEXT_WIN_ANIMATION_END: { actions: 'gameTextWinAnimationEndAction' },
          SET_MULTIPLIER_SUM: { actions: 'setMultiplierSum' },
        },
        entry: 'destroyBombAction',
      },

      backToSpinning: {
        on: {
          COUNT_ANIMATION: { actions: 'countingAction' },
        },
        entry: 'destroyAction',
        after: {
          200: {
            target: 'spinning',
          },
        },
      },

      postDoInit: {
        entry: 'setTarget',
        on: {
          RESET: { target: 'toIdle' },
          CONTINUE: { target: 'middleState' },
          SET_START_TARGET: { actions: 'setTargetValue' },
        },
      },

      collect: {
        entry: 'startCollectAction',
        invoke: {
          src: getInvokeSrc('collect'),
          input: ({ context: { index, counter, replaySpinsData } }) => ({ index, counter, replaySpinsData }),
          onError: {
            target: 'toIdle',
          },
          onDone: {
            target: 'toIdle',
            actions: 'successfulCollectAction',
          },
        },
      },

      toIdle: {
        entry: 'resetContextAction',
        after: { RESET: 'idle' },
      },
    },
  },

  {
    actions: {
      successfulInitAction: assign(
        ({
          event: {
            output: { data },
          },
          context,
        }) => {
          if (!data) return context

          const parsedData = isReplayOrDebugMode ? parseResponseString(data && data.init ? data.init : '') : data

          return {
            replaySpinsData: data && data.log ? data.log : [],
            ...setDoInitData({ data: parsedData, context }),
          }
        },
      ),
      successfulSpinAction: assign(
        ({
          event: {
            output: { data },
          },
          context,
        }) => setSpinData(data, context),
      ),
      successfulCollectAction: assign(
        ({
          event: {
            output: { data },
          },
          context,
        }) => setCollectData(data, context),
      ),

      buyFreeSpinsAction: assign({
        featurePurchaseIndex: ({ event: { value } }) => value,
        isSpinning: true,
        showLeaveAnimation: true,
      }),

      setTarget: assign({
        startTarget: ({ context: { symbolsMark } }) => Boolean(symbolsMark.length),
      }),

      setTargetValue: assign({
        startTarget: ({ event: { value } }) => value,
      }),

      freeSpinToggle: assign({
        freeSpinMode: ({ event: { value } }) => value,
      }),

      freeSpinMoreToggle: assign({
        freeSpinsMore: ({ event: { value } }) => value,
      }),

      freeSpinTotalToggle: assign({
        isSpinning: false,
        freeSpinTotal: ({ event: { value } }) => value,
      }),

      jackpotModalToggle: assign({
        isModalOpened: ({ event: { value } }) => value,
      }),

      scatterAnimationEndToggle: assign({
        isScatterAnimEnded: ({ event: { value } }) => value,
      }),

      resetLaterToggle: assign({
        resetLater: ({ event: { value } }) => value,
      }),

      multipleAnimationEndAction: assign({
        isMultipleAnimationEnd: ({ event: { value } }) => value,
      }),

      gameTextWinAnimationEndAction: assign({
        isGameTextWinAnimationEnd: ({ event: { value } }) => value,
      }),

      clickSpinButtonAction: assign({
        isSpinning: true,
        showLeaveAnimation: true,
        isGetNewSpinData: false,
      }),

      destroyAction: assign({
        permissionToShow: ({ context: { permissionToShow } }) => ({
          ...permissionToShow,
          leaveAnimationEnd: true,
          comeAnimationEnd: false,
        }),
        destroy: true,
        animationSymbolsCounter: 0,
        startAnimationSymbolsCounter: 0,
        animationBeforeDeletionEnded: false,
      }),
      showComeAnimationAction: assign({
        showComeAnimation: true,
        animationSymbolsCounter: 0,
        startAnimationSymbolsCounter: 0,
        permissionToShow: ({ context: { permissionToShow } }) => ({
          ...permissionToShow,
          leaveAnimationEnd: false,
          request: false,
        }),
      }),
      startSpinAction: assign({
        isGetNewSpinData: false,
        index: ({ context }) => context.index + 1,
        counter: ({ context }) =>
          freeRoundsActor.getSnapshot().context.freeRoundsMode && context.action === 'result'
            ? context.counter
            : // TODO Fix Me
              context.counter + 2,
      }),
      startCollectAction: assign({
        index: ({ context }) => context.index + 1,
        counter: ({ context }) => context.counter + 2,
      }),

      countingAction: assign({
        animationSymbolsCounter: ({ context }) => context.animationSymbolsCounter + 1,
      }),
      countingStartAction: assign({
        startAnimationSymbolsCounter: ({ context }) => context.startAnimationSymbolsCounter + 1,
      }),
      leaveAnimationEndAction: assign({
        showLeaveAnimation: false,
        permissionToShow: ({ context: { permissionToShow } }) => ({
          ...permissionToShow,
          leaveAnimationEnd: true,
        }),
      }),
      comeAnimationEndAction: assign({
        showComeAnimation: false,
        permissionToShow: ({ context: { permissionToShow } }) => ({ ...permissionToShow, comeAnimationEnd: true }),
      }),
      animationBeforeDeletionEndedAction: assign({
        animationBeforeDeletionEnded: true,
      }),
      resetContextAction: assign({
        isSpinning: ({ context: { freeSpinMode, payingSymbols, autoSpinsCount, autoSpinsEnabled } }) =>
          !!(freeSpinMode || payingSymbols || (autoSpinsCount > 0 && autoSpinsEnabled)),
        ...resetProp,
      }),
      autoSpinsToggle: assign({
        autoSpinsEnabled: ({ event: { value } }) => value,
      }),
      autoSpinsDecrement: assign({
        autoSpinsCount: state => (state.context.autoSpinsCount -= 1),
      }),
      autoSpinsSetCount: assign({
        autoSpinsCount: ({ event: { value } }) => value,
      }),
      bombDestroyCounterAction: assign({
        destroyBombCounter: ({ context }) => context.destroyBombCounter + 1,
      }),
      destroyBombAction: assign({
        isGameTextWinAnimationEnd: false,
        isMultipleAnimationEnd: false,
      }),
      setBombMultiplierAction: assign({
        currentBombMultiplier: ({ event: { value } }) => value,
      }),
      changeFreeRoundsLater: assign({
        freerRoundPlayLater: true,
        freeRoundsModalData: [],
      }),
      setMultiplierSum: assign({
        multiplierSum: ({ event: { value } }) => value,
      }),
    },

    actors: {
      ...gameServiceActors,
      ...replayActors,
      debugDoInit: fromPromise(async () => {
        const { staticHost, gameId, deviceType } = APP_CONFIG

        return await fetch(`${staticHost}assets/${gameId}/${deviceType}/jsons/debug_data/${Aliases.jsons.DEBUG_DATA}.json`)
          .then(res => res.json())
          .then(data => {
            console.log(`resData`, data)
            console.log(`init`, parseResponseString(data.init))

            return { data, error: null }
          })
      }),
    },

    guards,
  },
)
