export class SimpleZOrderSettings {
  readonly startZOrder: number = 0
  readonly ZOrderIncreaseDirection: ParticleZOrderMode = ParticleZOrderMode.Random
  readonly minZOrder: number = -100
  readonly maxZOrder: number = 100

  constructor(startZOrder: number, ZOrderIncreaseDirection?: ParticleZOrderMode, minZOrder?: number, maxZOrder?: number) {
    this.startZOrder = startZOrder
    if (ZOrderIncreaseDirection) this.ZOrderIncreaseDirection = ZOrderIncreaseDirection
    if (minZOrder) this.minZOrder = minZOrder
    if (maxZOrder) this.maxZOrder = maxZOrder
  }
}

export enum ParticleZOrderMode {
  LifetimeInverse = -1,
  Random = 0,
  LifeTimeNormal = 1,
}
