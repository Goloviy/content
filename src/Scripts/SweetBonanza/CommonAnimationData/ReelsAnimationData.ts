import { AnimationPair } from '../../AnimatedObject/Core/AnimatedObject'

export class ReelsAnimationData {
  fallingAnimations: FallAnimationData[] = []

  constructor() {}

  TryAddFallAnimation(fallAnim: FallAnimationData): boolean {
    if (!fallAnim) {
      return false
    }
    if (this.CheckForDuplicates(fallAnim.fallAnimation)) {
      return false
    } else {
      this.fallingAnimations.push(fallAnim)
      return true
    }
  }

  private CheckForDuplicates(fallAnim: AnimationPair): boolean {
    if (this.fallingAnimations && this.fallingAnimations.length && this.fallingAnimations.length > 0) {
      for (let i = 0; i < this.fallingAnimations.length; i++) {
        if (this.fallingAnimations[i].fallAnimation.animationName === fallAnim.animationName) {
          return true
        }
      }
    } else {
      return false
    }
    return false
  }
}
export class FallAnimationData
{
    animName: AnimationNames = AnimationNames.undefined
    fallAnimation: AnimationPair
    constructor(animData: AnimationPair)
    {
        this.fallAnimation = animData
        this.animName = animData.animationName  as AnimationNames
    }

    
}

export enum AnimationNames
{
  undefined = 'undefined',
  Intro_Tumble_01 = 'Intro_Tumble_01',
  Intro_Tumble_02 = 'Intro_Tumble_02',
  Intro_Tumble_03 = 'Intro_Tumble_03',
  Intro_Tumble_04 = 'Intro_Tumble_04',
  Intro_Tumble_05 = 'Intro_Tumble_05',
  Intro_Tumble_12 = 'Intro_Tumble_12',
  Intro_Tumble_13 = 'Intro_Tumble_13',
  Intro_Tumble_14 = 'Intro_Tumble_14',
  Intro_Tumble_15 = 'Intro_Tumble_15',
  Intro_Tumble_23 = 'Intro_Tumble_23',
  Intro_Tumble_24 = 'Intro_Tumble_24',
  Intro_Tumble_25 = 'Intro_Tumble_25',
  Intro_Tumble_34 = 'Intro_Tumble_34',
  Intro_Tumble_35 = 'Intro_Tumble_35',
  Intro_Tumble_45 = 'Intro_Tumble_45',
}