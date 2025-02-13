import { createActor } from 'xstate'

import { switcherMachine } from '../switcherMachine'

export const replayModeActor = createActor(switcherMachine).start()
