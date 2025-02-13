import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const freeRoundsEndModalActor = createActor(modalMachine).start()
