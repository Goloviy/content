import { createActor } from 'xstate'

import { errorMachine } from 'Core/state/errorMachine/errorMachine'

export const errorActor = createActor(errorMachine).start()
