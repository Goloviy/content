import { createActor } from 'xstate'

import { switcherMachine } from '../switcherMachine'

export const introDisableActor = createActor(switcherMachine).start()
