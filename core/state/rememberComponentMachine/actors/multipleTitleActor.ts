import { createActor } from 'xstate'

export type multipleTitleType = Container

import { Container } from 'Core/abstractions'

import { rememberComponentMachine } from '../rememberComponentMachine'

export const multipleTitleActor = createActor(rememberComponentMachine).start()

multipleTitleActor.send({ type: 'SET_COMPONENT', value: null })
