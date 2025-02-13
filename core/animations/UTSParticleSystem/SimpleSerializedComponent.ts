import { SimpleParticleSystemConfig } from './SimpleParticleSystemConfig'

export abstract class SimpleSerializedComponent {
  componentType: string = ''
  // eslint-disable-next-line
  serializableData: any
  // eslint-disable-next-line
  static Deserialize(arg?: any): any | void {
    return arg
  }
}

export class SimpleParticleSerializedComponent extends SimpleSerializedComponent {
  static componentType: string = 'ParticleSystem'
  serializableData: SimpleParticleSystemConfig = new SimpleParticleSystemConfig()

  static override Deserialize(serializedParticle: SimpleParticleSerializedComponent): SimpleParticleSystemConfig {
    return serializedParticle.serializableData
  }
}

export class SimpleSerializedRectTransform extends SimpleSerializedComponent {
  static componentType: string = 'RectTransform'
}
