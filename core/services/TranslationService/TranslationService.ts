import { inject, injectable } from 'inversify'
import { IResourceDictionary, Loader } from 'pixi.js-legacy'

import Aliases from 'Aliases'

import { IoCContainerTypes } from 'Core/IoCContainerTypes'
import { LoggerService } from 'Core/services'

import { api } from 'Api/api'

import type { Nullable, Translations } from 'Types'

@injectable()
class TranslationService {
  translations: Translations = {}

  constructor(@inject(IoCContainerTypes.LoggerService) private loggerService: LoggerService) {
    window.gettext = this.gettext.bind(this)
    this.setTranslations = this.setTranslations.bind(this)
  }

  public setTranslations(resources: IResourceDictionary): void {
    const data = JSON.parse(resources[Aliases.jsons.TRANSLATIONS].data)

    if (data) {
      this.translations = data
    }
  }

  public gettext(key: string, fallback?: string): string {
    return this.translations[key] || fallback || key
  }

  public async downloadTranslation(loader: Loader): Promise<void> {
    await api
      .getTranslations({ gameId: APP_CONFIG.gameId, lang: APP_CONFIG.lang, authToken: APP_CONFIG.authToken })
      .then(res => {
        loader.add(Aliases.jsons.TRANSLATIONS, this.getUrlAtData(res.data))

        this.loggerService.log('Translations loaded')
      })
      .catch(() => {
        loader.add(Aliases.jsons.TRANSLATIONS, this.getUrlAtData())

        this.loggerService.log('Translations not loaded')
      })
  }

  private getUrlAtData(data: Nullable<Translations> = {}): string {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })

    return URL.createObjectURL(blob)
  }
}

export { TranslationService }
