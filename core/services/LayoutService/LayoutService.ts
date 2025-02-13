import { injectable } from 'inversify'

import { Constants } from 'Constants'

import { Container } from 'Core/abstractions'
import { defaultLayoutServiceConfig } from 'Core/services/LayoutService/defaultLayoutServiceConfig'
import { type ILayoutServiceConfig, Orientations } from 'Core/services/LayoutService/types'
import { changeOrientationActor } from 'Core/state'

import type { ComponentInitParams, MobileOrientations, Nullable, PixiAppType } from 'Types'

@injectable()
class LayoutService {
  private pixiApp: Nullable<PixiAppType> = null
  private gameContainer: Nullable<Container> = null
  private currentOrientation: Orientations = Orientations.Default
  private layoutConfig: Required<ILayoutServiceConfig> = defaultLayoutServiceConfig
  private orientationChangeEvent: Event = new Event(Constants.events.CHANGE_ORIENTATION)
  private prevOrientation: Orientations = Orientations.MobilePortrait

  constructor() {
    this.subscribeToWindowEvents()
    this.subscribeToWindowEvents = this.subscribeToWindowEvents.bind(this)
    this.hasOrientation = this.hasOrientation.bind(this)
    this.selectOrientation()
  }

  public init({ pixiApp, gameContainer }: ComponentInitParams): void {
    this.layoutConfig = { ...defaultLayoutServiceConfig, ...APP_CONFIG.layoutConfig }
    this.pixiApp = pixiApp
    this.gameContainer = gameContainer

    if (APP_CONFIG.isMobi) {
      this.currentOrientation = this.getClientWidth() > this.getClientHeight() ? 2 : 1
    }

    this.adjustPositions()
  }

  private subscribeToWindowEvents(): void {
    window.addEventListener('resize', this.handleResizeOrChange.bind(this))
    window.addEventListener('change', this.handleResizeOrChange.bind(this))
  }

  protected handleResizeOrChange(): void {
    this.selectOrientation()
    this.adjustPositions()
  }

  protected adjustPositions(this: LayoutService): void {
    if (this.pixiApp && this.gameContainer) {
      let scale: number
      let appContainerWidth: number = APP_CONFIG.gameContainerWidth
      let appContainerHeight: number = APP_CONFIG.gameContainerHeight

      if (this.currentOrientation === Orientations.MobilePortrait) {
        scale = Math.min(
          this.getClientWidth() / (appContainerWidth - this.layoutConfig.flexibleWidthPortrait),
          this.getClientHeight() / appContainerHeight - this.layoutConfig.flexibleHeightPortrait,
        )
      } else if (this.currentOrientation === Orientations.MobileLandscape) {
        appContainerWidth = APP_CONFIG.gameContainerWidthLandscape
        appContainerHeight = APP_CONFIG.gameContainerHeightLandscape

        scale = Math.min(
          this.getClientWidth() / (appContainerWidth - this.layoutConfig.flexibleWidthLandscape),
          this.getClientHeight() / appContainerHeight - this.layoutConfig.flexibleHeightLandscape,
        )
      } else {
        scale = Math.min(
          this.getClientWidth() / (appContainerWidth - this.layoutConfig.flexibleWidthLandscape),
          this.getClientHeight() / appContainerHeight - this.layoutConfig.flexibleHeightLandscape,
        )
      }

      this.pixiApp.stage.scale.set(scale)
      this.pixiApp.renderer.resolution = window.devicePixelRatio
      this.pixiApp.renderer.plugins.interaction.resolution = this.pixiApp.renderer.resolution

      this.gameContainer.x = Math.round((this.getClientWidth() - appContainerWidth * scale) / 2 / scale)
      this.gameContainer.y = Math.round((this.getClientHeight() - appContainerHeight * scale) / 2 / scale)
      this.pixiApp.renderer.resize(this.getClientWidth(), this.getClientHeight())
    }
  }

  private getClientWidth(): number {
    return APP_CONFIG.browser === 'Safari' ? window.innerWidth : window.document.documentElement.clientWidth
  }

  private getClientHeight(): number {
    return APP_CONFIG.browser === 'Safari' ? window.innerHeight : window.document.documentElement.clientHeight
  }

  protected selectOrientation(): void {
    const pixelRatio: number = this.getClientWidth() / this.getClientHeight()

    let newOrientation: Orientations = this.currentOrientation

    if (APP_CONFIG.deviceType === Constants.devicesTypes.DESKTOP) {
      if (this.hasOrientation(Orientations.DesktopWide) || this.hasOrientation(Orientations.Desktop)) {
        pixelRatio > this.layoutConfig.desktopLandscapeRatio
          ? (newOrientation = Orientations.DesktopWide)
          : (newOrientation = Orientations.Desktop)
      }
    } else {
      if (
        this.hasOrientation(Orientations.MobilePortrait) ||
        this.hasOrientation(Orientations.MobileLandscape) ||
        this.hasOrientation(Orientations.TabletPortrait) ||
        this.hasOrientation(Orientations.TabletLandscape)
      ) {
        let updateOrientation: boolean = false

        if (this.hasOrientation(Orientations.MobilePortrait)) {
          if (pixelRatio < this.layoutConfig.maxMobilePortraitRatio) {
            updateOrientation = true
            newOrientation = Orientations.MobilePortrait
          } else {
          }
        }
        if (this.hasOrientation(Orientations.TabletPortrait)) {
          if (updateOrientation) {
          } else {
            if (pixelRatio < this.layoutConfig.maxTabletPortraitRatio) {
              newOrientation = Orientations.TabletPortrait
              updateOrientation = true
            }
          }
        }
        if (this.hasOrientation(Orientations.TabletLandscape)) {
          if (updateOrientation) {
          } else {
            if (pixelRatio > this.layoutConfig.maxTabletPortraitRatio || pixelRatio > this.layoutConfig.maxMobilePortraitRatio) {
              updateOrientation = true
              newOrientation = Orientations.TabletLandscape
            }
          }
        }
        if (this.hasOrientation(Orientations.MobileLandscape)) {
          if (updateOrientation) {
            if (pixelRatio > this.layoutConfig.maxTabletLandscapeRatio) {
              newOrientation = Orientations.MobileLandscape
            }
          } else {
            if (pixelRatio > this.layoutConfig.maxMobilePortraitRatio) {
              newOrientation = Orientations.MobileLandscape
            }
          }
        }
      }
    }

    if (this.currentOrientation != newOrientation) {
      if (newOrientation === Orientations.MobileLandscape && APP_CONFIG.gameContainerWidth < APP_CONFIG.gameContainerHeight) {
        // console.log('Switched to << LANDSCAPE >>')
        const tempGameContainerHeight = APP_CONFIG.gameContainerHeight

        APP_CONFIG.gameContainerHeight = APP_CONFIG.gameContainerWidth
        APP_CONFIG.gameContainerWidth = tempGameContainerHeight
      } else if (
        newOrientation === Orientations.MobilePortrait &&
        APP_CONFIG.gameContainerWidth > APP_CONFIG.gameContainerHeight
      ) {
        // console.log('Switched to << PORTRAIT >>')
        const temp = APP_CONFIG.gameContainerHeight

        APP_CONFIG.gameContainerHeight = APP_CONFIG.gameContainerWidth
        APP_CONFIG.gameContainerWidth = temp
      }

      if (newOrientation !== this.prevOrientation) {
        this.orientationChanged(newOrientation)

        this.currentOrientation = newOrientation
        this.prevOrientation = newOrientation
      }
    }
  }

  private hasOrientation(targetOrientation: Orientations): boolean {
    return (this.layoutConfig.supportOrientations & targetOrientation) === targetOrientation
  }

  private orientationChanged(newOrientation: Orientations): void {
    const isLandscape: boolean = newOrientation === Orientations.MobileLandscape
    const mobileOrientation: MobileOrientations =
      Orientations[newOrientation] === Orientations[2]
        ? Constants.mobileOrientation.LANDSCAPE
        : Constants.mobileOrientation.PORTRAIT

    APP_CONFIG.isMobileLandscape = newOrientation === Orientations.MobileLandscape
    APP_CONFIG.mobileOrientation = mobileOrientation
    changeOrientationActor.send({ type: 'SET_VALUE', isLandscape })
    document.dispatchEvent(this.orientationChangeEvent)
  }
}

export { LayoutService }
