import { createActor } from 'xstate'

import { switcherMachine } from '../switcherMachine'

export const autoPlaySkipScreenActor = createActor(switcherMachine).start()
