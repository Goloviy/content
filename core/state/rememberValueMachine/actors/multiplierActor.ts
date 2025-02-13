import { createActor } from 'xstate'

import { Constants } from 'Constants'

import { rememberValueMachine } from '../rememberValueMachine'

export const multiplierActor = createActor(rememberValueMachine).start()

multiplierActor.send({ type: 'SET_VALUE', value: Constants.gameSettings.BET_MULTIPLIER })
