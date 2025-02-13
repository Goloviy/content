import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const errorModalActor = createActor(modalMachine).start()
