import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const tournamentsModalActor = createActor(modalMachine).start()
