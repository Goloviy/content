import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const shareReplayModalActor = createActor(modalMachine).start()
