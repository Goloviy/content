import { inject, injectable } from 'inversify'

import { Constants } from 'Constants'

import { Container } from 'Core/abstractions'
import { IoCContainerTypes } from 'Core/IoCContainerTypes'
import { LoggerService } from 'Core/services'
import { introDisableActor, introScreenActor } from 'Core/state'

import { Component, ComponentInitParams, Nullable, PixiAppType } from 'Types'

import { DropsAndWinsModal, HolidayModal, IntroScreen, Loader } from 'CommonComponents/desktop'
import { SoundsSubscriber } from 'CommonComponents/desktop/SoundsSubscriber/SoundsSubscriber'

@injectable()
class ComponentsService {
  private pixiAppComponent: Nullable<PixiAppType> = null
  private gameContainer: Nullable<Container> = null

  constructor(
    @inject(IoCContainerTypes.ComponentsCollection)
    private componentsCollection: Component[],
    @inject(IoCContainerTypes.LoggerService) private loggerService: LoggerService,
    @inject(IoCContainerTypes.IntroScreen) private introScreen: IntroScreen,
    @inject(IoCContainerTypes.Loader) private loader: Loader,
    @inject(IoCContainerTypes.SoundsSubscriber) private soundsSubscriber: SoundsSubscriber,
  ) {}

  public renderComponents({ gameContainer, pixiApp }: ComponentInitParams): void {
    this.pixiAppComponent = pixiApp
    this.gameContainer = gameContainer

    this.subscribeIntro()
    this.showComponents()
  }

  private initAllComponents({ pixiApp, gameContainer }: ComponentInitParams): void {
    ComponentsService.renderAndFilterComponents({ components: this.componentsCollection, pixiApp, parent: gameContainer })

    this.loggerService.log('Components rendered')
  }

  private showComponents(): void {
    const isIntro: boolean = introScreenActor.getSnapshot().context.isOn

    isIntro && !APP_CONFIG.replayMode
      ? this.introScreen.init({ pixiApp: this.pixiAppComponent!, gameContainer: this.gameContainer! })
      : this.initAllComponents({
          pixiApp: this.pixiAppComponent!,
          gameContainer: this.gameContainer!,
        })

    this.loader.hideLoader()
    this.soundsSubscriber.init()
  }

  private subscribeIntro(): void {
    introDisableActor.subscribe(state => {
      const isDisabled: boolean = state.context.isOn

      if (isDisabled && this.pixiAppComponent && this.gameContainer) {
        introDisableActor.stop()

        this.introScreen.remove(this.gameContainer)

        this.initAllComponents({ pixiApp: this.pixiAppComponent, gameContainer: this.gameContainer })
      }
    })
  }

  static renderAndFilterComponents({
    pixiApp,
    components,
    parent,
  }: {
    components: Component[]
    parent: Container
    pixiApp: PixiAppType
  }): void {
    const appShowMode = APP_CONFIG.replayMode ? Constants.showComponentType.REPLAY_ONLY : Constants.showComponentType.GAME_ONLY

    components
      .filter(({ component, showMode }) => {
        if ((component instanceof HolidayModal || component instanceof DropsAndWinsModal) && APP_CONFIG.isDev) return false

        return showMode === Constants.showComponentType.ALL || showMode === appShowMode
      })
      .forEach(({ component }) => {
        component.init({ gameContainer: parent, pixiApp })
      })
  }
}

export { ComponentsService }
