import { createActor } from 'xstate'

import { historyMachine } from 'Core/state/historyMachine/historyMachine'

export const replayHistoryActor = createActor(historyMachine).start()
