import { Container } from 'Core/abstractions'

import { SimpleParticle } from './SimpleParticle'
import { SimpleParticleSystem } from './SimpleParticleSystem'

export interface IParticleSystemObject<T extends SimpleParticle> {
  Play(duration: number): void

  Destroy(): void

  OnAnimationEnded: CallableFunction | null

  GetChildrenParticleSystems(): SimpleParticleSystem<T>[]

  GetRootParticleSystem(): SimpleParticleSystem<T>

  GetParticlesContainer(): Container

  Stop(immediately: boolean): void
}
