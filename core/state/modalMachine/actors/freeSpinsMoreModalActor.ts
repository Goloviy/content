import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const freeSpinsMoreModalActor = createActor(modalMachine).start()
