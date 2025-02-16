import { Application} from "pixi.js-legacy";
import { GameScreen } from "./GameScreen";

export class ScreenResizer
{
    app: Application
    deviceType: DEVICE_TYPE = DEVICE_TYPE.DESKTOP
    rememberedWidth: number = 0
    rememberedHeight: number = 0
    manualWidth = 999
    manualHeight = 666
    intendedRatio = this.manualWidth / this.manualHeight;
    currentRatio = GameScreen.width / GameScreen.height;
    canvasSizeDirty: boolean = false
    

    constructor(app: Application)
    {
        this.app = app
        this.rememberedWidth = globalThis.window.innerWidth
        this.rememberedHeight = globalThis.window.innerHeight
        this.checkWindowSize();
        this.resizeUHTScreen();
      
    }
  resizeUHTScreen() {
    // let PixelRatio = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
    // if (UHT_DEVICE_TYPE.DESKTOP == true)
    //     if (PixelRatio > 1.5)
    //         PixelRatio = 1.5;
    // if (PixelRatio > 2)
    //     PixelRatio = 2;
    // UHTScreen.width = Math.floor(rememberedWindowWidth * PixelRatio);
    // UHTScreen.height = Math.floor(rememberedWindowHeight * PixelRatio);
    // if (createjs.BrowserDetect.isIOS) {
    //     document.body.style.width = rememberedWindowWidth + "px";
    //     if (UHT_UA_INFO.browser.name == "Chrome") {
    //         renderCanvas.style.width = rememberedWindowWidth + "px";
    //         renderCanvas.style.height = rememberedWindowHeight + "px"
    //     }
    // }
    // canvasSizeDirty = false
  }
  checkWindowSize() {
    if (this.rememberedWidth != window.innerWidth) {
      this.rememberedWidth = window.innerWidth;
      this.canvasSizeDirty = true
  }
  if (this.rememberedHeight != window.innerHeight) {
    this.rememberedHeight = window.innerHeight;
      this.canvasSizeDirty = true
  }
  }
    // onResize = (event: Event) =>
    // {
    //   console.log('resize')
    //   // this.window = event.target as Window
    //   // let pixelRatio = window.devicePixelRatio;
    //   // if (this.deviceType === DEVICE_TYPE.DESKTOP && pixelRatio > 1.5)
    //   //   pixelRatio = 1.5;
    //
    //   // if (pixelRatio > 2)
    //   //     pixelRatio = 2;
    //
    //   // this.rememberedWidth = Math.floor(this.window.screen.availWidth * pixelRatio);
    //   // this.rememberedHeight = Math.floor(this.window.screen.availHeight * pixelRatio);
    //
    //   // this.app.renderer.resize(Math.floor(this.window.screen.availWidth), Math.floor(this.window.screen.availWidth/ pixelRatio))
    //
    // }
    
}


export enum DEVICE_TYPE 
{
    MOBILE,
    DESKTOP
}

