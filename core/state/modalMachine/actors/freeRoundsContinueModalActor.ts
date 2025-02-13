import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const freeRoundsContinueModalActor = createActor(modalMachine).start()
