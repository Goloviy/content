import { AnimationCurveType } from 'Core/animations/ObjectTypes/AnimatedObjectTypes'

import { AnimationCurve } from './AnimationCurve'

export class AnimationCurveTransform {
  path: string = ''
  type: string = ''
  animationProperty: AnimationProperty
  curve: AnimationCurve
  startValue: number = 0
  endValue: number = 0

  constructor(path: string, type: string, animationProperty: string, curveJSON: AnimationCurveType) {
    this.path = path
    this.type = type
    this.animationProperty = this.ParseAnimationProperty(animationProperty)
    this.curve = new AnimationCurve()
    this.curve.deserialize(curveJSON)
    this.SaveCurvePositions()
  }

  SaveCurvePositions(): void {
    this.startValue = this.curve.keys[0].value
    this.endValue = this.curve.keys[this.curve.keys.length - 1].value
  }

  ParseAnimationProperty(animationProperty: string) {
    switch (animationProperty) {
      case 'm_LocalScale.x':
        return (this.animationProperty = AnimationProperty.LocalScaleX)
      case 'm_LocalScale.y':
        return (this.animationProperty = AnimationProperty.LocalScaleY)
      case 'm_LocalScale.z':
        return (this.animationProperty = AnimationProperty.LocalScaleZ)
      case 'm_LocalPosition.x':
        return (this.animationProperty = AnimationProperty.LocalPositionX)
      case 'm_LocalPosition.y':
        return (this.animationProperty = AnimationProperty.LocalPositionY)
      case 'm_LocalPosition.z':
        return (this.animationProperty = AnimationProperty.LocalPositionZ)
      case 'm_Position.x':
        return (this.animationProperty = AnimationProperty.PositionX)
      case 'm_Position.y':
        return (this.animationProperty = AnimationProperty.PositionY)
      case 'm_Position.z':
        return (this.animationProperty = AnimationProperty.PositionZ)
      case 'm_LocalRotation.x':
        return (this.animationProperty = AnimationProperty.LocalRotationX)
      case 'm_LocalRotation.y':
        return (this.animationProperty = AnimationProperty.LocalRotationY)
      case 'm_LocalRotation.z':
        return (this.animationProperty = AnimationProperty.LocalRotationZ)
      default:
        return AnimationProperty.UNDEFINED
    }
  }

  Evaluate(curCurveTime: number): number {
    return this.curve.Evaluate(curCurveTime)
  }
}

export enum AnimationProperty {
  LocalScaleX = 0,
  LocalScaleY = 1,
  LocalScaleZ = 2,
  LocalPositionX = 3,
  LocalPositionY = 4,
  LocalPositionZ = 5,
  LocalRotationX = 6,
  LocalRotationY = 7,
  LocalRotationZ = 8,
  PositionX = 9,
  PositionY = 10,
  PositionZ = 11,
  UNDEFINED = 12,
}
