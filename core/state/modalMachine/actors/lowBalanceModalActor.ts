import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const lowBalanceModalActor = createActor(modalMachine).start()
