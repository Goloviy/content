import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const freeRoundsStartModalActor = createActor(modalMachine).start()
