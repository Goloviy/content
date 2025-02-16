import { Container, Graphics, RoundedRectangle, TextStyle } from 'pixi.js-legacy'
import { ButtonSettings } from './ButtonSettings'
import {Text} from 'pixi.js-legacy'

export class UIButton extends Graphics
{
  private static defaultButtonSettings: ButtonSettings = new ButtonSettings(0,0)
  settings:ButtonSettings
  constructor(rootContainer: Container, onPointerDown: CallableFunction,name?:string,buttonSettings?: ButtonSettings, textString?:string)
  {
    super()
    this.name = name? name:'UIButton'
    this.interactive = true
    this.settings = buttonSettings? buttonSettings: UIButton.defaultButtonSettings
    this.transform.updateLocalTransform()
    this.beginFill(this.settings.color,1)
    this.drawShape(new RoundedRectangle(this.settings.x,this.settings.y,this.settings.width,this.settings.height, this.settings.radius))

    this.endFill()
    onPointerDown.name
    rootContainer.addChild(this)
    if(textString)
    this.AddText(textString)
  }

  AddText(stringText: string)
  {

    const style = new TextStyle(
    {
      align: 'center',
      fill: "#d82c2c",
      wordWrapWidth: this.settings.width,
    });
    let text = new Text(stringText, style);

    //text.anchor.set(0.5,0.5)
    text.x = this.settings.x
    text.y = this.settings.y
    text.width = this.settings.width
    text.height = this.settings.height
    //text.position.set(-,-this.position.y)
    text.name = this.name + 'Text'
    this.addChild(text)
  }
}
