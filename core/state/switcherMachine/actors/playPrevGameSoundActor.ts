import { createActor } from 'xstate'

import { switcherMachine } from '../switcherMachine'

export const playPrevGameSoundActor = createActor(switcherMachine).start()
