import { createActor } from 'xstate'

import { switcherMachine } from '../switcherMachine'

export const playPrevMusicActor = createActor(switcherMachine).start()
