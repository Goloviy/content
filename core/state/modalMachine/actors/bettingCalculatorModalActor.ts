import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const bettingCalculatorModalActor = createActor(modalMachine).start()
