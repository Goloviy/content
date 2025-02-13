import { createActor } from 'xstate'

import { freeRoundsMachine } from '../freeRoundsMachine'

export const freeRoundsActor = createActor(freeRoundsMachine).start()
