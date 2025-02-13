import { createActor } from 'xstate'

import { tournamentsMachine } from 'Core/state/tournamentsMachine/tournamentsMachine'

export const tournamentsActor = createActor(tournamentsMachine).start()
