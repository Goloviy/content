import { assign, createMachine } from 'xstate'

export const historyMachine = createMachine(
  {
    id: 'historyMachine',
    initial: 'idle',
    context: {
      activeHistoryListIds: [0],
      lastActiveId: null,
      fullRoundData: {},
      historyList: [],
    },
    states: {
      idle: {
        on: {
          SET_ID_INTO_LIST: {
            actions: 'setIdsHistoryIdsList',
          },
          SET_EMPTY_STATE: {
            actions: 'setEmptyState',
          },
          SET_FULL_ROUND_DATA: {
            actions: 'setFullRoundsData',
          },
          REMOVE_ROUND_ID: {
            actions: 'removeRoundDataById',
          },
          GET_HISTORY_LIST: {
            actions: 'getHistoryList',
          },
        },
      },
    },
  },
  {
    actions: {
      getHistoryList: assign(({ event }) => ({
        historyList: event.data,
      })),
      setIdsHistoryIdsList: assign(({ context, event }): {} => {
        const startList = [...context.activeHistoryListIds] as number[]
        let result: number[]

        if (startList.includes(event.id)) {
          result = startList.filter(id => id !== event.id)
        } else {
          result = [...startList, event.id]
        }

        return {
          activeHistoryListIds: result,
          lastActiveId: event.id,
        }
      }),
      setEmptyState: assign(() => ({
        activeHistoryListIds: [],
        fullRoundData: {},
        lastActiveId: null,
      })),
      setLastActiveId: assign(({ event }) => ({
        lastActiveId: event.id,
      })),
      setFullRoundsData: assign(({ event, context }) => ({
        fullRoundData: {
          ...context.fullRoundData,
          [event.id]: event.data,
        },
      })),
      removeRoundDataById: assign(({ event, context }) => {
        const newFullRoundData: Record<number, {}> = { ...context.fullRoundData }

        delete newFullRoundData[event.id as number]

        return {
          fullRoundData: newFullRoundData,
        }
      }),
    },
  },
)
