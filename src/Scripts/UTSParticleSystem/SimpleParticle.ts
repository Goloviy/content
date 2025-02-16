import { Sprite, Texture } from 'pixi.js-legacy'
import { SimpleParticleSystemConfig, SimpleShapeTypes } from './SimpleParticleSystemConfig'
import { SimpleColor } from './SimpleColor'
import { Random } from '../SweetBonanza/Utilities/Random'
import { ParticleZOrderMode, SimpleZOrderSettings } from './SimpleZOrderSettings'
import { MathCore } from '../AnimatedObject/MathCore/MathCore'

export class SimpleParticle {

  _epm_apf_frame: number = 0
  _epm_apf_frameTime: number = 0
  sprite: Sprite
  lifeTime: number = 0
  size: number = 0
  speed: number = 0
  color: SimpleColor = new SimpleColor()
  gravity: number = 0
  speedX: number = 0
  angle: number = 0
  speedRotation: number = 0
  zIndexSettings: SimpleZOrderSettings
  config: SimpleParticleSystemConfig
  constructor(texture: Texture, simpleParticleSystemConfig: SimpleParticleSystemConfig, zIndexSettings: SimpleZOrderSettings) {
    this.sprite = Sprite.from(texture)
    this.zIndexSettings = zIndexSettings
    this.config = simpleParticleSystemConfig
    this.Spawn(this.config)
  }

  isDead: boolean = false

  Update(delta: number): void
  {
    if(this.isDead)
      return
    this.lifeTime -= delta
    this.sprite.x -= delta * this.speedX
    this.speed -= delta * this.gravity
    this.sprite.y -= delta * this.speed
    this.sprite.angle -= delta * this.speedRotation
    this.UpdateZOrder()
    //this.size -= delta * this.size
  }

  Spawn(config: SimpleParticleSystemConfig): void {
    if(this.isDead)
      return
    this.sprite.zIndex = this.GetStartZOrder(this.zIndexSettings)
    this.lifeTime = Random.Range(config.InitialModule.startLifetime/2, config.InitialModule.startLifetime)
    this.size = config.InitialModule.startSize
    this.sprite.scale.set(this.size, this.size)
    this.speedRotation = Random.Range(config.RotationOverLifeTimeModule.firstConstant.z, config.RotationOverLifeTimeModule.secondConstant.z)
    this.color = config.InitialModule.startColor
    this.gravity = config.InitialModule.gravityModifier
    this.speedX = Random.Range(
      config.VelocityOverLifeTimeModule.firstConstant.x,
      config.VelocityOverLifeTimeModule.secondConstant.x,
    )

    this.speed = Math.max(config.InitialModule.startSpeed - Random.Range( Math.abs(this.speedX)/2, Math.abs(this.speedX)/2 -80))
    this.angle = Random.Range(0,180)
    this.SetupParticle(config)
  }

  private GetStartZOrder(zIndexSettings: SimpleZOrderSettings) {
    let particleZIndex: number = 0
    if (zIndexSettings.ZOrderIncreaseDirection === ParticleZOrderMode.Random) {
      particleZIndex = Random.Range(zIndexSettings.minZOrder, zIndexSettings.maxZOrder)
    }
    else if(zIndexSettings.ZOrderIncreaseDirection === ParticleZOrderMode.LifeTimeNormal)
    {
      particleZIndex = zIndexSettings.minZOrder
    }
    else if(zIndexSettings.ZOrderIncreaseDirection === ParticleZOrderMode.LifetimeInverse)
    {
      particleZIndex = zIndexSettings.maxZOrder
    }
    return particleZIndex
  }

  UpdateZOrder()
  {
    switch (this.zIndexSettings.ZOrderIncreaseDirection)
    {
      case ParticleZOrderMode.LifetimeInverse:
        this.sprite.zIndex = Math.floor(MathCore.Lerp(this.zIndexSettings.maxZOrder,this.zIndexSettings.minZOrder,this.lifeTime/ this.config.InitialModule.startLifetime ))
        break;
      case ParticleZOrderMode.Random:
        //this.sprite.zIndex = Math.floor( Random.Range(this.zIndexSettings.minZOrder, this.zIndexSettings.maxZOrder))
        break;
      case ParticleZOrderMode.LifeTimeNormal:
        this.sprite.zIndex = Math.floor( MathCore.Lerp(this.zIndexSettings.minZOrder,this.zIndexSettings.maxZOrder,this.lifeTime/ this.config.InitialModule.startLifetime ))
        break;

    }
  }

  MarkAsDead()
  {
    this.isDead = true
  }
  SetupParticle(config: SimpleParticleSystemConfig): void
  {
    switch (config.ShapeModule.type)
    {
      case SimpleShapeTypes.cone:
        this.sprite.x = Random.Range(
          window.innerWidth / 2 - config.ShapeModule.radius * 1000,
          window.innerWidth / 2 + config.ShapeModule.radius * 1000,
        )
        this.sprite.y = window.innerHeight -200
        this.sprite.angle = this.angle
        break;
      case SimpleShapeTypes.box:
        this.sprite.x = Random.Range(config.ShapeModule.position.x - config.ShapeModule.scale.x* config.ShapeModule.startBoxSize/2,
          config.ShapeModule.position.x + config.ShapeModule.scale.x* config.ShapeModule.startBoxSize /2)
        this.sprite.y = Random.Range(config.ShapeModule.position.y - config.ShapeModule.scale.y* config.ShapeModule.startBoxSize/2,
          config.ShapeModule.position.y + config.ShapeModule.scale.y* config.ShapeModule.startBoxSize/2)
        this.sprite.angle = this.angle
        break;

    }



  }
}