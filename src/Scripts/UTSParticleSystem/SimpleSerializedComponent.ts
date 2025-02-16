import { SimpleParticleSystemConfig } from './SimpleParticleSystemConfig'

export abstract class SimpleSerializedComponent {
  componentType: string = ''
  serializableData: any
  static Deserialize(arg?: any):any| void
  {
    return arg
  }
}

export class SimpleParticleSerializedComponent extends SimpleSerializedComponent
{
  static componentType: string = 'ParticleSystem'
  serializableData: SimpleParticleSystemConfig = new SimpleParticleSystemConfig()
  static override Deserialize(serializedParticle: SimpleParticleSerializedComponent): SimpleParticleSystemConfig
  {
    return serializedParticle.serializableData

  }
}

export class SimpleSerializedRectTransform extends SimpleSerializedComponent
{
  static componentType: string = 'RectTransform'

}