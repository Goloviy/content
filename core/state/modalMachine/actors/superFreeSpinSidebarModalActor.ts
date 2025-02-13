import { createActor } from 'xstate'

import { modalMachine } from '../modalMachine'

export const superFreeSpinSidebarModalActor = createActor(modalMachine).start()
