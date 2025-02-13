import { createActor } from 'xstate'

import { switcherMachine } from '../switcherMachine'

export const doubleBetActor = createActor(switcherMachine).start()
