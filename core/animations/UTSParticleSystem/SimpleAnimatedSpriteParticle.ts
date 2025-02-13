import { Texture } from 'Core/abstractions'
import { Random } from 'Core/animations/Utilities/Random'

import { SimpleParticle } from './SimpleParticle'
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

  public Update(deltaTime: number) {
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
    }
  }

  protected SetupParticle(config: SimpleParticleSystemConfig) {
    super.SetupParticle(config)
    this.sprite.getPixiObject.anchor.x = 0.5
    this.sprite.getPixiObject.anchor.y = 0.5
  }
}
