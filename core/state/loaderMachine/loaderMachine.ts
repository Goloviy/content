import { assign, createMachine } from 'xstate'

export const loaderMachine = createMachine(
  {
    id: 'loaderMachine',
    initial: 'loading',
    context: {
      isLoading: false,
      loadingPercent: 0,
    },
    states: {
      loading: {
        on: {
          START: {
            actions: ['start'],
          },
          STOP: {
            actions: ['stop'],
          },
          SET_LOADING_PERCENT: {
            actions: ['setLoadingPercent'],
          },
        },
      },
    },
  },
  {
    actions: {
      start: assign({
        isLoading: () => true,
      }),
      stop: assign({
        isLoading: () => false,
      }),
      setLoadingPercent: assign({
        loadingPercent: ({ event: { percent } }) => percent,
      }),
    },
  },
)
