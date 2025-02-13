import { createActor } from 'xstate'

import { soundMachine } from '../soundMachine'

export const soundActor = createActor(soundMachine).start()
