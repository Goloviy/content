import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const autoPlayModalActor = createActor(modalMachine).start()
