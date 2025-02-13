import { assign, createMachine } from 'xstate'

export const changeOrientationMachine = createMachine(
  {
    id: 'changeOrientationMachine',
    initial: 'off',
    context: {
      isLandscape: false,
    },
    states: {
      off: {
        on: {
          TOGGLE: {
            target: 'on',
            actions: 'toggle',
          },
          SET_VALUE: {
            target: 'on',
            actions: 'setValue',
          },
        },
      },
      on: {
        on: {
          TOGGLE: {
            target: 'off',
            actions: 'toggle',
          },
          SET_VALUE: {
            target: 'off',
            actions: 'setValue',
          },
        },
      },
    },
  },
  {
    actions: {
      toggle: assign({
        isLandscape: state => !state.context.isLandscape,
      }),
      setValue: assign({
        isLandscape: ({ event: { isLandscape } }) => isLandscape,
      }),
    },
  },
)
