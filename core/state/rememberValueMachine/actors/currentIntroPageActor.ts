import { createActor } from 'xstate'

import { rememberValueMachine } from '../rememberValueMachine'

export const currentIntroPageActor = createActor(rememberValueMachine).start()

currentIntroPageActor.send({ type: 'SET_VALUE', value: 1 })
