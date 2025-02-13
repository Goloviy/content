import { createActor } from 'xstate'

import { switcherMachine } from '../switcherMachine'

export const fastPlayActor = createActor(switcherMachine).start()
