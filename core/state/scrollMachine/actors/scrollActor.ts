import { createActor } from 'xstate'

import { scrollMachine } from 'Core/state/scrollMachine/scrollMachine'

export const scrollActor = createActor(scrollMachine).start()
