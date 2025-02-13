import { BaseTexture, Container, Sprite, Texture } from 'Core/abstractions'
import { TransformJson, Vector2 } from 'Core/animations/ObjectTypes/MultiObjectTypes'

export class RectTransform extends Container {
  child: RectTransform[] = []
  root: Container = new Container({})
  anchorMin: Vector2 = { X: 0, Y: 0 }
  anchorMax: Vector2 = { X: 0, Y: 0 }
  sprite: Sprite | undefined
  hasSpriteContainer: boolean = false
  constructor(parent: Container | null, data: TransformJson) {
    super({
      x: data.posX,
      y: data.posY,
      name: data.objectName,
    })
    if (parent != null) {
      this.root = parent
    }

    this.setScale({ x: data.scaleX, y: data.scaleY })
    this.pivot.x = data.pivotX
    this.pivot.y = data.pivotY
    this.getPixiObject.angle = data.rot
    this.root.addChild(this)
    if (data.anchorMin) this.anchorMin = data.anchorMin
    if (data.anchorMax) this.anchorMax = data.anchorMax
    if (data.childs != null && data.childs.length > 0) {
      data.childs.forEach(child => {
        this.child.push(new RectTransform(this, child))
      })
    }
  }

  setSpriteFromAlias(alias: string) {
    if (this.sprite === null || this.sprite === undefined) {
      this.sprite = new Sprite({ path: alias })
    } else {
      this.sprite.getPixiObject.texture = Texture.from(BaseTexture.from(alias)).getPixiObject
    }
    if (!this.hasSpriteContainer && this.sprite) {
      this.addChild(this.sprite)
      this.hasSpriteContainer = true
    }
  }

  destroy() {
    if (this.hasSpriteContainer) {
      this.sprite?.getPixiObject.destroy()
    }
    super.destroy()
  }
}
