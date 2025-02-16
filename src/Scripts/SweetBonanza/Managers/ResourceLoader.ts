import { Application, Loader } from 'pixi.js-legacy'
import { ASSET_PATHS } from '../Settings/Constants'

export class ResourceLoader {
  isInitialized: boolean = false
  app: Application
  loader: Loader
  initAwaiter: Promise<boolean>

  constructor(app: Application) {
    this.app = app
    this.loader = Loader.shared
    this.isInitialized = false

    this.initAwaiter = new Promise<boolean>(() => {
      Object.entries(ASSET_PATHS.fallToScreenAnimations).forEach(entry => {
        this.loader.add(entry[0] + '_json', entry[1].json)
      })

      this.loader.add(ASSET_PATHS.background.backImage.alias, ASSET_PATHS.background.backImage.png)
      this.loader.load(async () => {
        console.log(this.loader.resources)

        await this.OnCompleteLoadingResources()
        this.isInitialized = true
      })
    }).catch(error => {
      console.log(error)
      return false
    })

    const interval = setInterval(() => {
      if (this.isInitialized) {
        this.initAwaiter = Promise.resolve(true)
        clearInterval(interval)
      }
    }, 50)
  }

  async Init() {
    this.LoadStartResources()
    return await this.initAwaiter
  }

  LoadStartResources() {}

  async OnCompleteLoadingResources() {
    this.isInitialized = true
    await performTaskWithDelay()
    const loaderRes = this.loader.resources['start0_json']

    console.log(loaderRes)
  }
}

async function performTaskWithDelay(): Promise<void> {
  await delay(100)
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
