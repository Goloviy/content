import { Application, BaseTexture, Sprite } from 'pixi.js-legacy'
import { UIManager } from './UIManager'
import { ResourceLoader } from './ResourceLoader'
import { SpriteFramesAnimator } from '../../../animations/Animators/SpriteFramesAnimator'
import  test from '../../../ml/multiplier.json'
import  test_pr from '../../../ml_pr/multiplier_pr.json'
import { AnimationJSON, AtlasDataType, AtlasParser } from '../../../animations/Animators/AnimatedObjectTypes'


export class GameManager {
  private static _instance: GameManager
  isInitialized: boolean = false
  app: Application
  uiManager!: UIManager
  resourceLoader!: ResourceLoader

  private constructor() {
    this.app = new Application({
      width: 1920,
      height: 1080,
      backgroundColor: 0x9910BB,
    })
    document.body.appendChild(this.app.view)

    //@ts-ignore
    globalThis.__PIXI_APP__ = this.app
    this.StartGame = this.StartGame.bind(this)
  }

  public static GetInstance(): GameManager {
    if (GameManager._instance === null || GameManager._instance === undefined) {
      GameManager._instance = new GameManager()

      return GameManager._instance
    }
    return GameManager._instance
  }

  public async StartGame() {


    this.resourceLoader = new ResourceLoader(this.app)

    this.app.loader.add("atlas_ml",'src/ml/multiplier.png')
    this.app.loader.add("atlas_ml_pr", 'src/ml_pr/multiplier_pr.png')
    this.app.loader.load(()=>
    {
      this.uiManager = new UIManager(this.app)
      this.uiManager.InitStartScreen()
      this.isInitialized = true
      const atlas_ter = BaseTexture.from("atlas_ml");
      const atlas_ter_pr = BaseTexture.from("atlas_ml_pr");
      const textures = AtlasParser.ParseAtlasData(atlas_ter,test.animationAtlases as AtlasDataType)
      const textures_pr = AtlasParser.ParseAtlasData(atlas_ter_pr,test_pr.animationAtlases as AtlasDataType)
      const spite_anim = new Sprite(textures[0])
      const spite_anim_pr = new Sprite(textures_pr[0])
      spite_anim_pr.x = 80;
      this.app.stage.addChild(spite_anim)
      this.app.stage.addChild(spite_anim_pr)
      const testAnim = new SpriteFramesAnimator(test as AnimationJSON, textures,spite_anim, true);
      const testAnim_pr = new SpriteFramesAnimator(test_pr as AnimationJSON, textures_pr,spite_anim_pr, true);
      testAnim.Play()
      testAnim_pr.Play()
      console.log(testAnim)
    })


  }


}
