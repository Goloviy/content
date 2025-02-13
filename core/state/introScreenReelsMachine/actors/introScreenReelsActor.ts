import { createActor } from 'xstate'

import { introScreenReelsMachine } from '../introScreenReelsMachine'

export const introScreenReelsActor = createActor(introScreenReelsMachine).start()
