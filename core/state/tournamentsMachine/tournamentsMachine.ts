import { assign, createMachine, fromPromise } from 'xstate'

import { api } from 'Api/api'

import type { EventsListType } from 'Types'

export enum TournamentsEnum {
  LEADERBOARD = 'LEADERBOARD',
  PRIZES = 'PRIZES',
  RULES = 'RULES',
  TOURNAMENTS = 'TOURNAMENTS',
  DAILY = 'DAILY',
}

const REQUEST_PARAMS = {
  symbol: APP_CONFIG.isDev ? 'vs20fruitsw' : APP_CONFIG.gameId,
  authToken: APP_CONFIG.authToken,
}

type TournamentsPromoType = { input: { activeTournamentId: string } }

export const tournamentsMachine = createMachine(
  {
    id: 'tournamentsMachine',
    initial: 'idle',
    context: {
      activeMode: 'PRIZES',
      activeEvent: 'TOURNAMENTS',
      activeTournamentId: 0,
      activeTournaments: {},
      tournaments: {},
      dailyPrizes: {},
      dailyTournamentsData: {},
      leaderboards: {},
      winners: {},
      isActive: true,
      scores: {},
      isClickableDailyTournamentButton: true,
      isRequestsCompleted: false,
    },
    states: {
      idle: {
        on: {
          LEADERBOARD: {
            actions: 'setLeaderboardMode',
          },
          PRIZES: {
            actions: 'setPrizesMode',
          },
          RULES: {
            actions: 'setRulesMode',
          },
          TOURNAMENTS: {
            actions: 'setTournamentsMode',
          },
          DAILY: {
            actions: 'setDailyMode',
          },
          SET_TOURNAMENT_ID: {
            actions: 'setTournamentsId',
          },
          TOGGLE_TOURNAMENT_BUTTON_STATUS: {
            actions: 'toggleButtonStatus',
          },
          SET_EVENT_TIME_STATUS: {
            actions: 'setActiveEventTimeStatus',
          },
          FETCH_PROMO: 'loadingPromo',
          GET_TOURNAMENTS_DATA: 'loadingAllData',
        },
      },
      loadingAllData: {
        invoke: {
          src: 'getAllTournamentsData',
          onDone: {
            target: 'idle',
            actions: 'setAllTournamentsData',
          },
          onError: {
            target: 'idle',
            actions: 'logError',
          },
        },
      },
      loadingPromo: {
        invoke: {
          src: 'getTournamentsPromo',
          input: ({ context: { activeTournamentId } }) => ({
            activeTournamentId,
          }),
          onDone: {
            target: 'idle',
            actions: 'setTournamentsPromoData',
          },
          onError: {
            target: 'idle',
            actions: 'logError',
          },
        },
      },
    },
  },
  {
    actions: {
      setLeaderboardMode: assign({
        activeMode: TournamentsEnum.LEADERBOARD,
      }),
      setPrizesMode: assign({
        activeMode: TournamentsEnum.PRIZES,
      }),
      setRulesMode: assign({
        activeMode: TournamentsEnum.RULES,
      }),
      setTournamentsMode: assign({
        activeEvent: TournamentsEnum.TOURNAMENTS,
      }),
      setDailyMode: assign({
        activeEvent: TournamentsEnum.DAILY,
      }),
      setActiveEventTimeStatus: assign(({ event }) => ({
        isActive: event?.isActive as boolean,
      })),
      setTournamentsId: assign(({ event }) => ({
        activeTournamentId: event?.id as number,
      })),
      setTournaments: assign(({ event: { output } }) => ({
        tournaments: output.data,
      })),
      setDailyPrizes: assign(({ event: { output } }) => ({
        dailyPrizes: output.data,
      })),
      toggleButtonStatus: assign({
        isClickableDailyTournamentButton: state => !state.context.isClickableDailyTournamentButton,
      }),
      setAllTournamentsData: assign({
        isRequestsCompleted: true,
        activeTournaments: ({ event: { output } }) => output[0].data,
        tournaments: ({ event: { output } }) => output[1].data,
        dailyPrizes: ({ event: { output } }) => output[2].data,
        dailyTournamentsData: ({ event: { output } }) => output[3].data,
        leaderboards: ({ event: { output } }) => output[4].data,
        winners: ({ event: { output } }) => output[5].data,
        activeTournamentId: ({
          event: {
            output: [item],
          },
        }): number => {
          if (!item?.data?.races || !item?.data?.tournaments) return 0

          const eventsList: EventsListType = [...item?.data?.races!, ...item?.data?.tournaments]
            .filter(el => el.status === 'O')
            .filter(({ name }) => name.toLowerCase().includes('daily'))
            .sort((a, b) => b.endDate - a.endDate)

          return eventsList[1].id
        },
      }),
      setTournamentsPromoData: assign({
        scores: ({ event: { output } }) => (output?.data?.scores && output?.data?.scores.length ? output?.data?.scores[0] : {}),
      }),
      logError: assign({
        isRequestsCompleted: true,
      }),
    },
    actors: {
      getAllTournamentsData: fromPromise(async () => {
        try {
          return await Promise.all([
            api.getActiveTournamentsData(REQUEST_PARAMS),
            api.getTournamentsDetailsData(REQUEST_PARAMS),
            api.getPrizeDropsDetailsData(REQUEST_PARAMS),
            api.getPrizeData(REQUEST_PARAMS),
            api.getLeaderboardData(REQUEST_PARAMS),
            api.getWinnersData(REQUEST_PARAMS),
          ])
        } catch (error: unknown) {
          console.error('Error in getAllTournamentsData service:', error)
          throw error
        }
      }),
      getTournamentsPromo: fromPromise(async ({ input: { activeTournamentId } }: TournamentsPromoType) => {
        return await api.getTournamentsPromo({ ...REQUEST_PARAMS, tournamentIDs: activeTournamentId }).then(data => data)
      }),
    },
  },
)
