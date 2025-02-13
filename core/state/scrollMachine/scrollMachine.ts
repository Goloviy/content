import { createMachine, assign } from 'xstate'

type ContextType = {
  scrollPosition: number
}

const context: ContextType = {
  scrollPosition: 0,
}

export const scrollMachine = createMachine(
  {
    id: 'scrollMachine',
    initial: 'idle',
    context,
    states: {
      idle: {
        on: {
          SET_SCROLL_POSITION: {
            actions: 'setScrollPosition',
          },
        },
      },
    },
  },
  {
    actions: {
      setScrollPosition: assign({
        scrollPosition: ({ event: { scrollPosition } }) => scrollPosition,
      }),
    },
  },
)
