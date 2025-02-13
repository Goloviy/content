import { assign, createMachine } from 'xstate'

export const soundMachine = createMachine(
  {
    id: 'soundMachine',
    initial: 'soundState',
    context: {
      volume: 50,
    },
    states: {
      soundState: {
        on: {
          SET_VOLUME: {
            actions: 'setVolume',
          },
        },
      },
    },
  },
  {
    actions: {
      setVolume: assign({
        volume: ({ event: { value } }) => value,
      }),
    },
  },
)
