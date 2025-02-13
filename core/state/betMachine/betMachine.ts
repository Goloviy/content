import { createMachine, assign } from 'xstate'

type BetMachineContext = {
  index: number
  value: number
  array: number[]
  isUpdatedValue: boolean
}

const context: BetMachineContext = {
  index: -1,
  array: [],
  value: 0,
  isUpdatedValue: false,
}

export const betMachine = createMachine(
  {
    id: 'betMachine',
    initial: 'betState',
    context,
    states: {
      betState: {
        on: {
          INCREMENT: {
            actions: 'increment',
            guard: 'canIncrement',
          },
          DECREMENT: {
            actions: 'decrement',
            guard: 'canDecrement',
          },
          SET_ARRAY: {
            actions: 'setArray',
          },
          SET_VALUE: {
            actions: 'setValue',
          },
          SET_INDEX: {
            actions: 'setIndex',
          },
          SET_IS_UPDATED_VALUE: {
            actions: 'setIsUpdatedValue',
          },
        },
      },
    },
  },
  {
    actions: {
      increment: assign({
        index: state => (state.context.index += 1),
      }),
      decrement: assign({
        index: state => (state.context.index -= 1),
      }),
      setArray: assign({
        array: ({ event: { array } }) => array,
      }),
      setValue: assign({
        value: ({ event: { value } }) => value,
      }),
      setIndex: assign({
        index: ({ event: { index } }) => index,
      }),
      setIsUpdatedValue: assign({
        isUpdatedValue: ({ event: { isUpdatedValue } }) => isUpdatedValue,
      }),
    },
    guards: {
      canIncrement: state => {
        const maxIndex = state.context.array.length - 1

        return state.context.index < maxIndex
      },
      canDecrement: state => {
        return state.context.index > 0
      },
    },
  },
)
