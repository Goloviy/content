import { Container } from 'pixi.js-legacy'
import { SimpleParticleSystem } from './SimpleParticleSystem'
import { SimpleParticle } from './SimpleParticle'

export interface IParticleSystemObject<T extends SimpleParticle> {
  Play(duration: number): void
  Destroy(): void
  OnAnimationEnded: CallableFunction | null
  GetChildrenParticleSystems(): SimpleParticleSystem<T>[]
  GetRootParticleSystem(): SimpleParticleSystem<T>
  GetParticlesContainer():  Container
  Stop(immediately: boolean): void
}