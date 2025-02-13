import { Container, Texture, Ticker } from 'Core/abstractions'

import { SimpleAnimatedSpriteParticle } from './SimpleAnimatedSpriteParticle'
import { SimpleParticle } from './SimpleParticle'
import { SimpleParticleSystemConfig } from './SimpleParticleSystemConfig'
import { SimpleZOrderSettings } from './SimpleZOrderSettings'

export class SimpleParticleSystem<T extends SimpleParticle> {
  config: SimpleParticleSystemConfig
  particleContainer: Container
  rootContainer: Container
  particles: T[] = []
  particleStartTexture: Texture | null
  spriteSheetTextures: Texture[]
  state: SimpleParticleSystemState = SimpleParticleSystemState.isStopped
  ticker = Ticker.shared
  duration: number = 0
  floorEmit: number = 0
  zOrderSettings: SimpleZOrderSettings
  loopFunction = () => this.Update()

  constructor(
    config: SimpleParticleSystemConfig,
    rootContainer: Container,
    particleTexture: Texture | null,
    textures: Texture[],
    zOrderSettings: SimpleZOrderSettings,
  ) {
    this.config = config
    this.particleContainer = new Container({})
    this.rootContainer = rootContainer
    rootContainer.addChild(this.particleContainer)
    this.particleStartTexture = particleTexture

    this.spriteSheetTextures = textures
    this.zOrderSettings = zOrderSettings
    this.floorEmit = 0
  }

  Play(duration: number) {
    this.duration = duration
    if (this.state !== SimpleParticleSystemState.isPlaying) {
      this.state = SimpleParticleSystemState.isPlaying
      this.ticker.add(this.loopFunction)
    }
  }

  Update() {
    this.duration -= this.ticker.deltaMS * this.config.InitialModule.simulationSpeed
    let numbersToSpawn: number = 0

    if (this.duration < 0) {
      this.Stop(false)
    }

    this.floorEmit +=
      (this.config.EmissionModule.emissionRate / 100) * this.ticker.deltaMS * this.config.InitialModule.simulationSpeed
    if (this.floorEmit >= 1) {
      numbersToSpawn = this.floorEmit - (this.floorEmit % 1)
      this.floorEmit = this.floorEmit % 1
    }
    this.particles.forEach(particle => {
      particle.Update((this.ticker.deltaMS * this.config.InitialModule.simulationSpeed) / 1000)
      if (particle.lifeTime < 0) {
        if (this.state === SimpleParticleSystemState.isPlaying) {
          if (numbersToSpawn > 0) {
            this.ShuffleParticle(particle)
            numbersToSpawn--
          }
        } else {
          this.DestroyParticle(particle)
        }
      }
    })

    if (
      numbersToSpawn > 0 &&
      this.particles.length < this.config.InitialModule.maxParticles &&
      this.state === SimpleParticleSystemState.isPlaying
    ) {
      this.Emit(numbersToSpawn)
    }
  }

  Emit(numberOfParticlesToSpawn: number) {
    let i = numberOfParticlesToSpawn

    while (i > 0) {
      this.particles.push(
        this.SpawnNewParticle<SimpleAnimatedSpriteParticle>(
          new SimpleAnimatedSpriteParticle(this.spriteSheetTextures, this.config, this.zOrderSettings),
        ) as unknown as T,
      )
      i--
    }
  }

  StopEmit() {
    this.state = SimpleParticleSystemState.isPaused
  }

  Stop(immediately: boolean = false) {
    if (immediately) {
      this.state = SimpleParticleSystemState.isStopped
      this.ticker.remove(this.loopFunction)
      let i = this.particles.length - 1

      while (i >= 0) {
        this.DestroyParticle(this.particles[0])
        i--
      }
    } else {
      this.StopEmit()
    }
  }

  SpawnNewParticle<T extends SimpleParticle>(particleExample: SimpleAnimatedSpriteParticle): T {
    const newParticle = particleExample as unknown as T

    this.particleContainer.addChild(newParticle.sprite)

    return newParticle
  }

  ShuffleParticle(particle: SimpleParticle): void {
    if (particle) {
      particle.Spawn(this.config)
    }
  }

  DestroyParticle(particle: T) {
    this.particles.splice(this.particles.indexOf(particle as T, 0), 1)

    this.particleContainer.removeChild(particle.sprite)
    particle.sprite.getPixiObject.destroy()
    particle.MarkAsDead()

    if (this.particles.length === 0) {
      this.state = SimpleParticleSystemState.isStopped
      this.ticker.remove(this.loopFunction)
    }
  }

  public DestroyParticleSystem() {
    this.Stop(true)
    this.rootContainer.removeChild(this.particleContainer)
  }
}

export enum SimpleParticleSystemState {
  isStopped = 0,
  isPaused = 1,
  isPlaying = 2,
}
