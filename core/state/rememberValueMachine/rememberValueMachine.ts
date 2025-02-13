import { createMachine, assign } from 'xstate'

type ContextType = {
  value: string | number
}

const context: ContextType = {
  value: '',
}

export const rememberValueMachine = createMachine(
  {
    id: 'rememberValueMachine',
    initial: 'idle',
    context,
    states: {
      idle: {
        on: {
          SET_VALUE: {
            actions: 'setValue',
          },
        },
      },
    },
  },
  {
    actions: {
      setValue: assign({
        value: ({ event: { value } }) => value,
      }),
    },
  },
)
