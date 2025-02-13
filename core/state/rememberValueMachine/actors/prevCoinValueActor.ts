import { createActor } from 'xstate'

import { rememberValueMachine } from '../rememberValueMachine'

export const prevCoinValueActor = createActor(rememberValueMachine).start()
