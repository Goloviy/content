import { SimpleParticleModule } from './SimpleParticleModule'
import { SimpleColor } from './SimpleColor'
import { Vector3 } from '../AnimatedObject/MathCore/Vector3'


class SimpleShapeModule extends SimpleParticleModule
{
  type: SimpleShapeTypes = SimpleShapeTypes.cone
  radius: number = 0
  angle: number = 0
  startBoxSize: number = 100
  scale: Vector3 = Vector3.one
  position: Vector3 = Vector3.zero
  rotation: Vector3 = Vector3.zero

}

class SimpleInitialModule extends SimpleParticleModule
{
  startLifetime: number = 0
  startSpeed: number = 0
  startSize: number = 1
  startColor: SimpleColor = new SimpleColor()
  gravityModifier: number = 9.81
  simulationSpeed: number = 0
  maxParticles: number = 0
}

class SimpleEmissionModule extends SimpleParticleModule
{
  emissionRate: number = 0
}

class SimpleRotationModule  extends SimpleParticleModule
{
  type: SimpleValueTypes = SimpleValueTypes.RandomBetweenTwoConstants
  separateAxes: boolean = true
  firstConstant: Vector3 = new Vector3()
  secondConstant: Vector3 = new Vector3()
}

class SimpleVelocityModule  extends SimpleParticleModule
{
  type: SimpleValueTypes = SimpleValueTypes.RandomBetweenTwoConstants
  firstConstant: Vector3 = new Vector3()
  secondConstant: Vector3 = new Vector3()
}

export class SimpleParticleSystemConfig
{
  ShapeModule: SimpleShapeModule = new SimpleShapeModule()
  InitialModule: SimpleInitialModule = new SimpleInitialModule()
  EmissionModule: SimpleEmissionModule = new SimpleEmissionModule()
  RotationOverLifeTimeModule: SimpleRotationModule = new SimpleRotationModule()
  VelocityOverLifeTimeModule: SimpleVelocityModule  = new SimpleVelocityModule()
  //ForceModule: ForceModule
}

export enum SimpleShapeTypes
{
  cone = 'Cone',
  box = 'Box',

}

export enum SimpleValueTypes
{
  RandomBetweenTwoConstants = 'RandomBetweenTwoConstants',


}