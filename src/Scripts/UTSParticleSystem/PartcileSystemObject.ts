import { BaseTexture, Container, Texture } from 'pixi.js-legacy'
import { IParticleSystemObject } from './IParticleSystemObject'
import { SimpleParticleSerializedComponent } from './SimpleSerializedComponent'
import { SimpleParticleSystem } from './SimpleParticleSystem'
import { SimpleAnimatedSpriteParticle } from './SimpleAnimatedSpriteParticle'
import { SimpleZOrderSettings } from './SimpleZOrderSettings'
import { AtlasDataType } from '../AnimatedObject/ObjectTypes/AnimatedObjectTypes'

export class ParticleSystemObject implements IParticleSystemObject<SimpleAnimatedSpriteParticle> {
  children: SimpleParticleSystem<SimpleAnimatedSpriteParticle>[] = []
  particlesContainer: Container
  isPlaying: boolean = false
  zOrderSettings : SimpleZOrderSettings = new SimpleZOrderSettings(0)
  constructor(
    particlesContainer: Container,
    particleJsons: SimpleParticleSerializedComponent| SimpleParticleSerializedComponent[],
    particleTexture: Texture,
    spriteSheetTexture: BaseTexture,
    atlasData: AtlasDataType,
    ZOrderSettings?: SimpleZOrderSettings,
    maxParticlesNumber?: number
  )
  {
    if(ZOrderSettings) this.zOrderSettings = ZOrderSettings

    this.particlesContainer = particlesContainer
    this.particlesContainer.zIndex = this.zOrderSettings.startZOrder
    this.particlesContainer.sortableChildren = true
    this.OnAnimationEnded = null

    if (!Array.isArray(particleJsons))
    {
      this.children.push(new SimpleParticleSystem<SimpleAnimatedSpriteParticle>(
        SimpleParticleSerializedComponent.Deserialize(particleJsons as SimpleParticleSerializedComponent),
        particlesContainer,
        particleTexture,
        AtlasDataType.ParseAtlasData(spriteSheetTexture, atlasData),
        this.zOrderSettings
      ))
    }
    else
    {
      (particleJsons as SimpleParticleSerializedComponent[]).forEach((particleJSON) =>
      {
        this.children.push(new SimpleParticleSystem<SimpleAnimatedSpriteParticle>(
          SimpleParticleSerializedComponent.Deserialize(particleJSON),
          particlesContainer,
          particleTexture,
          AtlasDataType.ParseAtlasData(spriteSheetTexture, atlasData),
          this.zOrderSettings
        ))
      })
    }


    if(maxParticlesNumber)
    {
      this.children.forEach((child) =>
      {
        child.config.InitialModule.maxParticles = maxParticlesNumber
      })
    }
  }

  GetParticlesContainer(): Container {
    return this.particlesContainer
  }

  Play(duration: number, withChildren: boolean = true): void
  {
    if(this.children.length > 0)
    if (withChildren) {
      this.children.forEach(child => {
        child.Play(duration)
      })
    }
    else
      this.children[0].Play(duration)
  }
  Destroy(this: ParticleSystemObject): void {
    if (this.children.length > 0) {
      this.children.forEach(child => {
        child.Stop(true)
        child.DestroyParticleSystem()
      })
    }
  }
  OnAnimationEnded: CallableFunction | null
  GetChildrenParticleSystems(): SimpleParticleSystem<SimpleAnimatedSpriteParticle>[] {
    return this.children
  }

  GetRootParticleSystem(): SimpleParticleSystem<SimpleAnimatedSpriteParticle> {
    return this.children[0]
  }

  Stop(immediately: boolean, withChildren: boolean = true): void {
    if(this.children.length > 0)
      if (withChildren) {
        this.children.forEach(child => {
          child.Stop(immediately)
        })
      }
      else
        this.children[0].Stop(immediately)
  }
}
