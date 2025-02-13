import { assign, createMachine } from 'xstate'

export const freeRoundsMachine = createMachine(
  {
    id: 'freeRoundsMachine',
    initial: 'freeRoundsMachineState',
    context: {
      showModal: false,
      freeRoundsMode: false,
      barAnimation: 'hidden',
    },
    states: {
      freeRoundsMachineState: {
        on: {
          TOGGLE_MODAL: { actions: 'toggleModal' },
          TOGGLE_FREE_ROUNDS_MODE: { actions: 'toggleFreeRoundsMode' },
          CHANGE_BAR_ANIMATION: { actions: 'changeBarAnimation' },
        },
      },
    },
  },
  {
    actions: {
      toggleModal: assign({
        showModal: ({ event: { value } }) => value,
      }),
      toggleFreeRoundsMode: assign({
        freeRoundsMode: ({ event: { value } }) => value,
      }),
      changeBarAnimation: assign({
        barAnimation: ({ context: { barAnimation } }) => (barAnimation === 'hidden' ? 'visible' : 'hidden'),
      }),
    },
  },
)
