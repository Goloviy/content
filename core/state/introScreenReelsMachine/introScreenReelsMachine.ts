import { assign, createMachine, fromPromise } from 'xstate'

import { parseResponseString } from 'Utils'

import { setRandomSymbolMultiplier } from '../slotMachine'

import { initialIntroScreenReelsContext, resetProp, setDoInitData } from './constants/constants'

export const introScreenReelsMachine = createMachine(
  {
    initial: 'idle',
    context: initialIntroScreenReelsContext,
    states: {
      idle: {
        on: {
          DO_INIT_INTRO: { actions: 'successfulInitAction' },
          START_SPIN_INTRO: { target: 'startSpin' },
          SET_BOMB_MULTIPLIER_INTRO: { actions: 'setBombMultiplierAction' },
        },
      },

      startSpin: {
        entry: 'clickSpinButtonAction',
        after: { SPIN: 'spinning' },
      },

      spinning: {
        on: {
          COUNT_ANIMATION_INTRO: { actions: 'countingAction' },
          LEAVE_ANIMATION_END_INTRO: { actions: 'leaveAnimationEndAction' },
          SHOW_COME_ANIMATION_INTRO: { target: 'showComeAnimation' },
        },
        entry: 'startSpinAction',
        invoke: {
          src: 'doSpin',
          input: ({ context: { index, counter, spinsData } }) => ({
            index,
            counter,
            spinsData,
          }),
          onError: { target: 'toIdle' },
          onDone: { actions: 'successfulSpinAction' },
        },
      },

      showComeAnimation: {
        after: { MIDDLE_STATE: 'middleState' },
        entry: 'showComeAnimationAction',
      },

      middleState: {
        on: {
          COUNT_ANIMATION_INTRO: { actions: 'countingAction' },
          COME_ANIMATION_END_INTRO: { actions: 'comeAnimationEndAction' },
          ANIMATION_BEFORE_DELETION_ENDED_INTRO: { actions: 'animationBeforeDeletionEndedAction' },
          BACK_TO_SPINNING_INTRO: { target: 'backToSpinning' },
          RESET_INTRO: { target: 'toIdle' },
          DESTROY_BOMB_INTRO: { target: 'destroyBomb' },
        },
      },

      destroyBomb: {
        on: {
          BOMB_DESTROY_COUNTER_INTRO: { actions: 'bombDestroyCounterAction' },
          SET_BOMB_MULTIPLIER_INTRO: { actions: 'setBombMultiplierAction' },
          RESET_INTRO: { target: 'toIdle' },
        },
        entry: 'destroyBombAction',
      },

      backToSpinning: {
        on: { COUNT_ANIMATION_INTRO: { actions: 'countingAction' } },
        entry: 'destroyAction',
        after: {
          200: {
            target: 'spinning',
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
      successfulInitAction: assign(({ event, context }) => {
        const data = event.data

        if (!data) return context

        const parsedData = parseResponseString(data && data.init ? data.init : '')

        return {
          spinsData: data && data.log ? data.log : [],
          randomSymbolMultiplier: setRandomSymbolMultiplier(parsedData['rmul']),
          ...setDoInitData({ windowSymbols: parsedData['s'] }),
        }
      }),

      successfulSpinAction: assign({
        permissionToShow: ({ context: { permissionToShow } }) => ({ ...permissionToShow, request: true }),
        windowSymbols: ({ event }) => (event.output.data['s'] ? event.output.data['s'].split(',') : null),
        symbolsMark: ({ event }) => (event.output.data['s_mark'] ? event.output.data['s_mark'].match(/\d+:\d+/g).join(',') : ''),
        randomSymbolMultiplier: ({ event }) => setRandomSymbolMultiplier(event.output.data['rmul']),
        totalSpinWinResult: ({ event }) => event.output.data['tmb_res'] || '',
      }),

      clickSpinButtonAction: assign({
        showLeaveAnimation: true,
      }),

      destroyAction: assign({
        permissionToShow: ({ context: { permissionToShow } }) => ({
          ...permissionToShow,
          leaveAnimationEnd: true,
          comeAnimationEnd: false,
        }),
        destroy: true,
        animationSymbolsCounter: 0,
        animationBeforeDeletionEnded: false,
      }),

      showComeAnimationAction: assign({
        showComeAnimation: true,
        animationSymbolsCounter: 0,
        permissionToShow: ({ context: { permissionToShow } }) => ({
          ...permissionToShow,
          leaveAnimationEnd: false,
          request: false,
        }),
      }),
      startSpinAction: assign({
        index: ({ context }) => context.index + 1,
        counter: ({ context }) => context.counter + 2,
      }),

      countingAction: assign({
        animationSymbolsCounter: ({ context }) => context.animationSymbolsCounter + 1,
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
      resetContextAction: assign(resetProp),
      bombDestroyCounterAction: assign({
        destroyBombCounter: ({ context }) => context.destroyBombCounter + 1,
      }),
      destroyBombAction: assign({
        destroyBomb: true,
      }),
      setBombMultiplierAction: assign({
        currentBombMultiplier: ({ event: { value } }) => value,
      }),
    },

    actors: {
      doSpin: fromPromise(
        async ({ input: { spinsData, index } }: { input: { spinsData: { cr: string; sr: string }[]; index: number } }) => {
          const spinData = parseResponseString(spinsData[index - 2]['sr'])

          return { data: spinData }
        },
      ),
    },
  },
)
