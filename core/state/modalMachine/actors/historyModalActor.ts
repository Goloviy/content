import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const historyModalActor = createActor(modalMachine).start()
