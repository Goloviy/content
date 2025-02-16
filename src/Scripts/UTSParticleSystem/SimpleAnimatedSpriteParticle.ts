import { SimpleParticle } from './SimpleParticle'
import { Texture } from 'pixi.js-legacy'
import { Random } from '../SweetBonanza/Utilities/Random'
import { SimpleParticleSystemConfig } from './SimpleParticleSystemConfig'
import { SimpleZOrderSettings } from './SimpleZOrderSettings'

export class SimpleAnimatedSpriteParticle extends SimpleParticle {
  FPS: number = 20
  frameTextures: Texture[]
  time: number = 0
  constructor(textures: Texture[], config: SimpleParticleSystemConfig, zIndexSettings: SimpleZOrderSettings) {
    super(textures[0], config, zIndexSettings)
    this.frameTextures = textures
    this._epm_apf_frame = Random.Range(0, this.frameTextures.length - 1)
    this._epm_apf_frameTime = Random.Range(0.01, 1 / this.FPS)

    this.sprite.texture = this.frameTextures[this._epm_apf_frame]
  }

  override Update(deltaTime: number) {
    if (this.isDead) return
    super.Update(deltaTime)
    this._epm_apf_frameTime += deltaTime
    let newFrame = this._epm_apf_frame
    while (this._epm_apf_frameTime > 1 / this.FPS) {
      this._epm_apf_frameTime -= 1 / this.FPS
      newFrame++
    }
    newFrame %= this.frameTextures.length
    if (newFrame != this._epm_apf_frame) {
      this._epm_apf_frame = newFrame
      this.sprite.texture = this.frameTextures[this._epm_apf_frame]

      // if (index != -1)
      // {
      //   this.sprite.parent = this.parent.pixiZOrderedContainer;
      //   pppc[index] = this.sprite
      // } else
      //   this.parent.pixiZOrderedContainer.addChild(this.sprite)
    }
  }

  override SetupParticle(config: SimpleParticleSystemConfig)
  {
    super.SetupParticle(config)
    this.sprite.anchor.x = .5;
    this.sprite.anchor.y = .5;
  }
}