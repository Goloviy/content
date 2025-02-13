import { createActor } from 'xstate'

import { rememberValueMachine } from '../rememberValueMachine'

export const prevBetActor = createActor(rememberValueMachine).start()
