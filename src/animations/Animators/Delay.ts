type DelayOptions = {
  delay: number
  onCancel?: () => void
}

export class Delay {
  static CreateDelay(options: DelayOptions): { delay: Promise<void>; Cancel: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let resolveDelay: (() => void) | null = null

    const delay = new Promise<void>(resolve => {
      resolveDelay = () => {
        resolve()
      }

      timeoutId = setTimeout(() => {
        resolveDelay?.()
        resolveDelay = null
      }, options.delay)
    })

    const Cancel = (): void => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
        resolveDelay?.()
        resolveDelay = null
        options.onCancel?.()
      }
    }

    return { delay, Cancel }
  }
}
