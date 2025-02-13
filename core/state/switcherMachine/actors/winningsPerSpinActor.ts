import { createActor } from 'xstate'

import { switcherMachine } from '../switcherMachine'

export const winningsPerSpinActor = createActor(switcherMachine).start()
