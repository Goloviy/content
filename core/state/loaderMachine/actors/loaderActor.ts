import { createActor } from 'xstate'

import { loaderMachine } from '../loaderMachine'

export const loaderActor = createActor(loaderMachine).start()
