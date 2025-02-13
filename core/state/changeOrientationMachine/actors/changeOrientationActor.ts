import { createActor } from 'xstate'

import { changeOrientationMachine } from '../changeOrientationMachine'

const changeOrientationActor = createActor(changeOrientationMachine)

changeOrientationActor.start()

export { changeOrientationActor }
