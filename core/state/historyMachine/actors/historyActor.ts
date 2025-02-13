import { createActor } from 'xstate'

import { historyMachine } from 'Core/state/historyMachine/historyMachine'

export const historyActor = createActor(historyMachine).start()
