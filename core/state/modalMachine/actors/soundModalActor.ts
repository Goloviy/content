import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const soundModalActor = createActor(modalMachine).start()
