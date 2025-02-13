import { createMachine, assign } from 'xstate'

import { modalContainerRememberType } from 'Core/state/rememberComponentMachine/actors/modalContainerRememberActor'
import { multipleTitleType } from 'Core/state/rememberComponentMachine/actors/multipleTitleActor'

type ContextType = {
  component: multipleTitleType | modalContainerRememberType | null
}

const context: ContextType = {
  component: null,
}

export const rememberComponentMachine = createMachine(
  {
    id: 'rememberComponentMachine',
    initial: 'idle',
    context,
    states: {
      idle: {
        on: {
          SET_COMPONENT: {
            actions: 'setComponent',
          },
        },
      },
    },
  },
  {
    actions: {
      setComponent: assign({
        component: ({ event: { value } }) => value,
      }),
    },
  },
)
