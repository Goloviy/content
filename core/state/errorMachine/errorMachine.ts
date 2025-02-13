import { assign, createMachine } from 'xstate'

export const errorMachine = createMachine(
  {
    id: 'errorMachine',
    initial: 'errorState',
    context: {
      errorMessage: '',
    },
    states: {
      errorState: {
        on: {
          SET_MESSAGE: {
            actions: 'setErrorMessage',
          },
        },
      },
    },
  },
  {
    actions: {
      setErrorMessage: assign(({ event }) => ({
        errorMessage: event?.message as string,
      })),

      logError: ({ event }): void => {
        console.error(event)
      },
    },
    actors: {},
  },
)
