import { createActor } from 'xstate'

export type modalContainerRememberType = Container

import { Container } from 'Core/abstractions'

import { rememberComponentMachine } from '../rememberComponentMachine'

export const modalContainerRememberActor = createActor(rememberComponentMachine).start()

modalContainerRememberActor.send({ type: 'SET_COMPONENT', value: null })
