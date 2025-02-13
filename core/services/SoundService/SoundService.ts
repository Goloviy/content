import { CompleteCallback, PlayOptions, sound } from '@pixi/sound'
import { injectable } from 'inversify'

import { Container, Graphics, Sprite, Text } from 'Core/abstractions'
import { playGameSoundActor, replayModeActor, soundActor } from 'Core/state'

type ISubscription = {
  element: Container | Sprite | Text | Graphics
  sounds: string[]
  types: string[]
}

@injectable()
class SoundService {
  public init(): void {
    sound.init()
    this.playSoundBackground()
  }

  public play(sounds: string | string[], options?: string | PlayOptions | CompleteCallback | undefined): void {
    if (Array.isArray(sounds)) sounds.forEach(soundName => sound.play(soundName, options))
    if (typeof sounds === 'string') sound.play(sounds, options)
  }

  public playGameSound(soundName: string, delay = 0, options?: string | PlayOptions | CompleteCallback | undefined): void {
    const isGameSound = playGameSoundActor.getSnapshot().context.isOn

    if (isGameSound) delay ? setTimeout(() => sound.play(soundName, options), delay) : sound.play(soundName, options)
  }

  public pause(sounds: string | string[]): void {
    if (Array.isArray(sounds)) sounds.forEach(soundName => sound.pause(soundName))
    if (typeof sounds === 'string') sound.pause(sounds)
  }

  public resume(sounds: string | string[]): void {
    if (Array.isArray(sounds)) sounds.forEach(soundName => sound.resume(soundName))
    if (typeof sounds === 'string') sound.resume(sounds)
  }

  public stop(sounds: string | string[]): void {
    if (Array.isArray(sounds)) sounds.forEach(soundName => sound.stop(soundName))
    if (typeof sounds === 'string') sound.stop(sounds)
  }

  public subscribe(elements: ISubscription[]): void {
    let currentIsGameSounds = playGameSoundActor.getSnapshot().context.isOn

    this.toggleSounds(currentIsGameSounds, elements)

    playGameSoundActor.subscribe(state => {
      if (state.context.isOn !== currentIsGameSounds) {
        currentIsGameSounds = state.context.isOn

        this.toggleSounds(currentIsGameSounds, elements)
      }
    })
  }

  public unsubscribe(elements: ISubscription[]): void {
    elements.forEach(({ element, types, sounds }: ISubscription) => {
      types.forEach((type, index) => element.off(type, () => sound.play(sounds[index])))
      types.forEach((type, index) => element.off(type, () => sound.stop(sounds[index])))
    })
  }

  public changeVolume(soundName: string, volume: number): void {
    sound.find(soundName).volume = volume
  }

  public changeVolumeAll(volume: number): void {
    sound.volumeAll = volume
  }

  private toggleSounds(currentIsGameSounds: boolean, elements: ISubscription[]): void {
    currentIsGameSounds
      ? elements.forEach(({ element, types, sounds }: ISubscription) => {
          types.forEach((type, index) => element.on(type, () => sound.play(sounds[index])))
        })
      : elements.forEach(({ element, types, sounds }: ISubscription) => {
          types.forEach((type, index) => element.on(type, () => sound.stop(sounds[index])))
        })
  }

  public fadeOutSounds(sounds: string[], duration = 1000): void {
    sounds.forEach(sound => this.fadeOut(sound, duration))
  }

  public fadeInSounds(sounds: string[], duration = 1000): void {
    sounds.forEach(sound => this.fadeIn(sound, duration))
  }

  // Функция для плавного затухания звука
  public fadeOut(soundName: string, duration = 1000): void {
    const soundInstance = sound.find(soundName)
    const volume = soundActor.getSnapshot().context.volume * 0.01
    const step = 0.05
    const interval = duration / (volume / step)

    const fade = setInterval(() => {
      if (soundInstance.volume > step) {
        soundInstance.volume -= step
      } else {
        soundInstance.volume = 0
        clearInterval(fade)
      }
    }, interval)
  }

  // Функция для плавного включения звука
  public fadeIn(soundName: string, duration = 1000): void {
    const soundInstance = sound.find(soundName)
    const volume = soundActor.getSnapshot().context.volume * 0.01
    const step = 0.05
    const interval = duration / (volume / step)

    const fade = setInterval(() => {
      if (soundInstance.volume < volume - step) {
        soundInstance.volume += step
      } else {
        soundInstance.volume = volume
        clearInterval(fade)
      }
    }, interval)
  }

  private playSoundBackground(): void {
    sound.disableAutoPause = true

    document.visibilityState === 'hidden' ? this.pauseAll() : this.resumeAll()

    window.addEventListener('visibilitychange', () => {
      const replayMode = replayModeActor.getSnapshot().context.isOn

      this.pauseAll()

      if (document.visibilityState === 'visible' && !replayMode) {
        this.resumeAll()
      }
    })
  }

  public pauseAll(): void {
    sound.pauseAll()
  }

  public resumeAll(): void {
    sound.resumeAll()
  }
}

export { SoundService }
