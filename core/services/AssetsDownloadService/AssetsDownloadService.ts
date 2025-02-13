import { inject, injectable } from 'inversify'
import { Loader } from 'pixi.js-legacy'

import { IoCContainerTypes } from 'Core/IoCContainerTypes'
import { LoggerService, TranslationService } from 'Core/services'
import { loaderActor } from 'Core/state'

import type { Asset, AssetByType, PixiAppType } from 'Types'

@injectable()
class AssetsDownloadService {
  private pixiApp: PixiAppType | null = null

  constructor(
    @inject(IoCContainerTypes.LoggerService)
    private loggerService: LoggerService,
    @inject(IoCContainerTypes.TranslationService) private translationService: TranslationService,
  ) {}

  public async start({ pixiApp }: { pixiApp: PixiAppType }): Promise<void> {
    this.pixiApp = pixiApp
    const loader: Loader = pixiApp.loader

    await this.translationService.downloadTranslation(loader)

    this.downloadAssets(loader)
    this.downloadFonts()

    this.onProgressDownload(loader)
    this.onCompleteDownload(loader)
  }

  private downloadAssets(loader: Loader): void {
    const manifest: Asset[] = this.extractManifest(APP_CONFIG.assets)
    const v: string = import.meta.env.VITE_ASSET_V || ''
    const p: string = APP_CONFIG.isDev ? '' : `?v=${v}`

    manifest.forEach((asset: Asset) => {
      loader.add(asset.alias, `${asset.src}${p}`)
    })
  }

  private downloadFonts(): void {
    const manifestFonts: Asset[] = this.extractManifest({ fonts: APP_CONFIG.assets.fonts })

    manifestFonts.forEach((asset: Asset) => {
      const fontFace: FontFace = new FontFace(asset.alias, `url(${asset.src})`)

      fontFace.load().then(loaderFont => {
        document.fonts.add(loaderFont)
      })
    })
  }

  private onProgressDownload(loader: Loader): void {
    loader.onProgress.add(loader => {
      this.setDownloadPercent(loader.progress)
    })
  }

  private setDownloadPercent(progress: number): void {
    const percent: number = Math.round(progress)

    loaderActor.send({ type: 'SET_LOADING_PERCENT', percent })
  }

  private onCompleteDownload(loader: Loader): void {
    loader.load((_, resources) => {
      console.log('ASSETS', resources)

      this.setTranslations()

      this.loggerService.log('Assets loaded')

      loaderActor.send({ type: 'STOP' })
    })
  }

  private setTranslations(): void {
    const resources = this.pixiApp!.loader.resources

    this.translationService.setTranslations(resources)
  }

  private extractManifest(assets: { [key: string]: AssetByType }): Asset[] {
    const groupValues: AssetByType[] = Object.values(assets)

    return groupValues.reduce((manifest: [] | Asset[], entity: AssetByType) => {
      const assetEntity: Asset[] = Object.values(entity).reduce((acc: Asset[], item: Asset[]) => [...acc, ...item], [])

      return [...manifest, ...assetEntity]
    }, [])
  }
}

export { AssetsDownloadService }
