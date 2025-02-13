import type { EasingT } from 'Core/services/AnimationService/types'

/**
 * Easing provides a collection of easing functions for use with animation.
 */

const Easing: EasingT = {
  None: (t: number): number => t,
  In: (t: number): number => t * t,
  Out: (t: number): number => t * (2 - t),
  InOut: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
}

export default Easing
