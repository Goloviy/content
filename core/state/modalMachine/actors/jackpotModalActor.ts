import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const jackpotModalActor = createActor(modalMachine).start()
