import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const freeSpinSidebarModalActor = createActor(modalMachine).start()
