import { Application/*, Container, Graphics, Sprite, Texture*/ } from 'pixi.js-legacy'
//import { ASSET_PATHS } from '../Settings/Constants'
import { DEVICE_TYPE, ScreenResizer } from '../Utilities/ScreenResizer'
import { GameScreen } from '../Utilities/GameScreen'

export class UIManager {
  isInit: boolean = false
  app: Application
  screenResizer: ScreenResizer | null = null
  deviceType: DEVICE_TYPE = DEVICE_TYPE.DESKTOP

  constructor(application: Application) {
    this.app = application
    this.SetupContainers()
    GameScreen.width = application.renderer.width
    GameScreen.height = application.renderer.height
  }

  Init() {
    this.screenResizer = new ScreenResizer(this.app)
    window.addEventListener('resize', this.OnResize)
    this.Resize(window)
    this.isInit = true
  }

  Resize(newWindow: Window) {
    this.app.renderer.resolution = newWindow.devicePixelRatio
    this.app.renderer.resize(newWindow.innerWidth, newWindow.innerHeight)
  }

  OnResize = (event: Event) => {
    console.log('resize')
    let newWindow = event.target as Window
    this.Resize(newWindow)
  }

  SetupContainers() {
    // const sprite = Sprite.from('src/Assets/UI/backgrounds1.png')
    // const graphics = new Graphics()
    // graphics.beginFill()
    // graphics.drawEllipse(50, 50, 100, 100)
    // this.app.stage.addChild(sprite)
  }

  InitStartScreen() {
    // let backgroundAlias = ASSET_PATHS.background.backImage.alias
    // let backgroundSprite = Sprite.from(Texture.from(backgroundAlias))
    // backgroundSprite.zIndex = 1
    // backgroundSprite.anchor.set(0.5, 0.5)
  }
}
