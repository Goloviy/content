import { Sprite, Container, Ticker, BaseTexture } from 'Core/abstractions'
import type { IAnimator } from 'Core/animations/Core/IAnimator'

import { AnimationJSON, CustomEvent, CustomEventType } from '../ObjectTypes/AnimatedObjectTypes'

import { AnimatedObject, AnimationQueuePair } from './AnimatedObject'
import { Delay } from './Delay'

import type { IAnimatedObject } from './IAnimatedObject'
import type { MultiAnimation, MultiAnimatedObjectJSON, MultiStructureJSON, MultiSubAnim } from '../ObjectTypes/MultiObjectTypes'

export class MultiAnimatedObject implements IAnimatedObject {
  endSequenceCallback: (() => void) | null = null
  mainObject: AnimatedObject | null = null
  structure: MultiStructureJSON[] = []
  animatedObjects: AnimatedObject[] = []
  animatedObjectDict: { [key in string]: AnimatedObject } = {}
  animationPairs: { [key in string]: MultiAnimation } = {}
  animatedObjectPairs: AnimatedObjectPair[] = []
  animationsQueue: string[] = []
  objectName: string = ''
  sprite: Sprite | null = null
  container: Container
  ticker = Ticker.shared
  currentAnimation: MultiAnimation | null = null
  subAnims: MultiSubAnim[] = []
  currentTime: number = 0
  progress: number = 0
  customEvents: CustomEvent[] = []
  timeScale: number = 1

  penultimateCallback: (() => void) | null = null
  runtimeCallback: (() => void) | null = null
  startedCallback: (() => void) | null = null
  stopDelay?: (() => void) | undefined

  constructor(inputJSON?: MultiAnimatedObjectJSON, animatedObjects?: AnimatedObject[])

  constructor(inputJSON: MultiAnimatedObjectJSON, animatedObjects: AnimatedObject[])

  constructor(inputJSON: MultiAnimatedObjectJSON, animatedObjects: AnimatedObject[]) {
    this.container = new Container({})
    this.ticker = Ticker.shared
    if (inputJSON && animatedObjects) {
      this.setupData(inputJSON, animatedObjects)
    }
  }

  setupData(inputJSON: MultiAnimatedObjectJSON, animatedObjects: AnimatedObject[]) {
    this.animatedObjects = animatedObjects
    inputJSON.structure.forEach(child => {
      this.ParseAnimatedObject(child, null)
    })
    this.ParseAnimations(inputJSON.animations)
    animatedObjects.forEach(animatedObject => {
      animatedObject.setTimeScale(this.timeScale)
    })

    this.structure = inputJSON.structure
    this.mainObject = this.animatedObjectDict[inputJSON.structure[0].objectName]
    this.sprite = this.mainObject.sprite
  }

  onRelease(): void {
    this.timeScale = 1
    this.container.alpha = 0
  }

  public onGet() {}

  getCurrentAnimator(): IAnimator | null {
    return null
  }

  getCurrentAnimation(): string {
    return Array.from(this.animationsQueue).join(',')
  }

  setCurrentAnimProgress(progress: number): void {
    this.mainObject?.currentAnimators.forEach(animator => {
      animator.currentTime = animator.animationTime * progress
    })
    this.animatedObjects.forEach(animatedObject => {
      animatedObject.currentAnimators.forEach(animator => {
        animator.currentTime = animator.animationTime * progress
      })
    })
  }

  addAnimationToPlayQueue(animationName: string): void {
    this.Play(animationName)
  }

  addAnimationPair(animationJSON: AnimationJSON, baseTexture?: BaseTexture): void {
    this.mainObject?.addAnimationPair(animationJSON, baseTexture)
  }

  isPlaying(): boolean {
    for (const key in this.animatedObjectDict) {
      if (this.animatedObjectDict[key].isPlaying()) {
        return true
      }
    }

    return false
  }

  onAnimatorPlayingComplete(): void {
    this.SetDefaultPositions()
    if (this.animationsQueue.length === 0 && this.endSequenceCallback) {
      this.endSequenceCallback()
      this.endSequenceCallback = null

      return
    }

    this.animationsQueue.shift()

    if (this.animationsQueue.length === 0 && this.penultimateCallback) {
      this.penultimateCallback()
      this.penultimateCallback = null
    }
  }

  OnRuntimeCallback(): void {
    if (this.runtimeCallback) {
      this.runtimeCallback()
      this.runtimeCallback = null
    }
  }

  OnStartedCallback(): void {
    if (this.startedCallback) {
      this.startedCallback()
      this.startedCallback = null
    }
  }

  async playWithDelay(animName: string, delay: number): Promise<void> {
    const delayOptions = Delay.CreateDelay({ delay, onCancel: () => console.log('Delay cancelled') })

    this.stopDelay = delayOptions.Cancel

    await delayOptions.delay

    this.addAnimationToPlayQueue(animName)
  }

  async playAnimationQueuePairs(pairs: AnimationQueuePair[]): Promise<void> {
    if (this.mainObject) {
      this.mainObject.playAnimationQueuePairs(pairs)
      this.mainObject.penultimateCallback = () => {
        this.onAnimatorPlayingComplete()
      }
      this.mainObject.runtimeCallback = () => {
        this.OnRuntimeCallback()
      }
      this.mainObject.startedCallback = () => {
        this.OnStartedCallback()
      }
    }
  }

  setTimeScale(ts: number): void {
    this.timeScale = ts
    for (const key in this.animatedObjectDict) {
      this.animatedObjectDict[key].setTimeScale(this.timeScale)
    }
  }

  private Play(animName: string): void {
    if (animName in this.animationPairs) {
      this.currentAnimation = this.animationPairs[animName]
      this.subAnims = this.currentAnimation.subAnims
      this.customEvents = this.currentAnimation.customEvents
      this.ticker.add(this.loopFunction)
      this.OnStartedCallback()
    } else {
      if (this.mainObject) {
        this.mainObject.addAnimationToPlayQueue(animName)
        this.mainObject.penultimateCallback = () => {
          this.onAnimatorPlayingComplete()
        }
        this.mainObject.runtimeCallback = () => {
          this.OnRuntimeCallback()
        }
        this.mainObject.startedCallback = () => {
          this.OnStartedCallback()
        }
      }
    }
  }

  private Stop(): void {
    this.ticker.remove(this.loopFunction)
    this.currentAnimation = null
    this.subAnims = []
    this.customEvents = []
    this.currentTime = 0

    this.onAnimatorPlayingComplete()
  }

  private loopFunction = () => this.Update()

  private Update(): void {
    if (this.currentAnimation === null) {
      this.Stop()

      return
    }
    this.currentTime += Ticker.shared.deltaMS / 1000

    this.subAnims.forEach(subAnim => {
      if (this.currentTime >= subAnim.startTime) {
        const targetAnimatedObject = this.FindObjectInStructure(this.structure, subAnim.path)

        if (targetAnimatedObject.sprite) targetAnimatedObject.sprite.alpha = 1
        targetAnimatedObject.addAnimationToPlayQueue(subAnim.animationName)
      }
    })
    this.subAnims = this.subAnims.filter(anim => anim.startTime > this.currentTime)

    this.HandleEvents()

    if (this.currentTime >= this.currentAnimation.animationTime) {
      this.Stop()
    }
  }

  private ParseAnimatedObject(structureJSON: MultiStructureJSON, parent: AnimatedObject | null): void {
    const filteredObjects = this.animatedObjects.filter(animObject => animObject.objectName === structureJSON.objectName)

    if (filteredObjects.length > 0) {
      this.animatedObjectDict[structureJSON.objectName] = filteredObjects[0]
      this.SetObjectPosition(structureJSON, filteredObjects[0])
      this.animatedObjectPairs.push(new AnimatedObjectPair(structureJSON, filteredObjects[0]))
      if (filteredObjects[0].sprite) {
        // eslint-disable-next-line max-len
        filteredObjects[0].sprite.texture =
          filteredObjects[0].cachedTexturePairs[0].cachedTextures[structureJSON.startSpriteIndex]
        parent === null
          ? this.container.addChild(filteredObjects[0].sprite.getPixiObject)
          : parent.sprite?.addChild(filteredObjects[0].sprite)
      }

      this.animatedObjects = this.animatedObjects.filter(obj => obj !== filteredObjects[0])

      structureJSON.childs.forEach(child => {
        this.ParseAnimatedObject(child, filteredObjects[0])
      })
    }
  }

  private HandleEvents(): void {
    this.customEvents.forEach(customEvent => {
      if (customEvent.time <= this.currentTime * 1000) {
        switch (customEvent.eventType) {
          case CustomEventType.CallFunction:
            this.OnRuntimeCallback()
            break
          case CustomEventType.PlayAnimation:
            this.addAnimationToPlayQueue(customEvent.functionName)
            break
        }
      }
    })
    this.customEvents = this.customEvents.filter(customEvent => customEvent.time > this.currentTime * 1000)
  }

  private ParseAnimations(animations: MultiAnimation[]): void {
    animations.forEach(anim => {
      this.animationPairs[anim.animationName] = anim
    })
  }

  private SetObjectPosition(structureJSON: MultiStructureJSON, animatedObject: AnimatedObject) {
    if (animatedObject.sprite) {
      animatedObject.sprite.getPixiObject.position.set(structureJSON.posX, structureJSON.posY)
      animatedObject.sprite.getPixiObject.pivot.set(structureJSON.pivotX, structureJSON.pivotY)
      animatedObject.baseScaleX = structureJSON.scaleX
      animatedObject.baseScaleY = structureJSON.scaleY
      animatedObject.sprite.getPixiObject.scale.set(structureJSON.scaleX, structureJSON.scaleY)
      animatedObject.sprite.getPixiObject.angle = structureJSON.rot
      animatedObject.sprite.getPixiObject.alpha = structureJSON.startAlpha
    }
  }

  private SetDefaultPositions(): void {
    this.animatedObjectPairs.forEach(pair => {
      if (pair.structure.defaultAfterAnim) {
        this.SetObjectPosition(pair.structure, pair.animatedObject)
      }
    })
  }

  private FindObjectInStructure(localStructure: MultiStructureJSON[], path: number[]): AnimatedObject {
    let targetStructure = localStructure[path[0]]

    path.forEach(index => {
      targetStructure = localStructure[index]
      localStructure = localStructure[index].childs
    })

    return this.animatedObjectPairs.filter(pair => pair.structure === targetStructure)[0].animatedObject
  }
}

export class AnimatedObjectPair {
  animatedObject: AnimatedObject
  structure: MultiStructureJSON

  constructor(structureJSON: MultiStructureJSON, animatedObject: AnimatedObject) {
    this.animatedObject = animatedObject
    this.structure = structureJSON
  }
}
