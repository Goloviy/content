import { assign, createMachine } from 'xstate'

export const switcherMachine = createMachine(
  {
    id: 'switcherMachine',
    initial: 'off',
    context: {
      isOn: false,
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
        isOn: state => !state.context.isOn,
      }),
      setValue: assign({
        isOn: ({ event: { value } }) => value,
      }),
    },
  },
)
