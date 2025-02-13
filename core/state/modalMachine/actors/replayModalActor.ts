import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const replayModalActor = createActor(modalMachine).start()
