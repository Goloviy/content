import { createActor } from 'xstate'

import { jackpotMachine } from 'Core/state/jackpotMachine/jackpotMachine'

export const jackpotActor = createActor(jackpotMachine).start()
