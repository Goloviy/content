import { Container } from 'Core/abstractions'
import { RectTransform } from 'Core/animations/Core/RectTransform'
import type { MultiTransformJSON } from 'Core/animations/ObjectTypes/MultiObjectTypes'

export class MultiTransformObject {
  rootContainer: Container
  _child: RectTransform[] = []

  constructor(root: Container, data: MultiTransformJSON) {
    this.rootContainer = root
    data.structure.forEach(json => this._child.push(new RectTransform(root, json)))
  }

  addChildToContainers() {
    const result: RectTransform[] = []
    const queue = [this._child[0]]
    const shallowCopy = Object.assign({}, this._child[0])

    while (queue.length > 0) {
      const current = queue.shift()

      if (current === null) continue
      if (current != undefined) {
        current.root.addChild(current)
        result.push(current)
        for (const child of current.child) {
          queue.push(child)
        }
      }
    }
    this._child[0] = shallowCopy

    return result
  }

  get child() {
    const result: RectTransform[] = []
    const queue = [this._child[0]]
    const shallowCopy = Object.assign({}, this._child[0])

    while (queue.length > 0) {
      const current = queue.shift()

      if (current === null) continue
      if (current != undefined) {
        result.push(current)
        for (const child of current.child) {
          queue.push(child)
        }
      }
    }
    this._child[0] = shallowCopy

    return result
  }

  addSpriteForChild(alias: string): void {
    const result: RectTransform[] = []
    const queue = this._child
    const shallowCopy = Object.assign({}, this._child)
    let layer: number = 0

    while (queue.length > 0) {
      const current = queue.shift()

      if (current === null) continue
      if (current != undefined) {
        if (layer !== 0) current.setSpriteFromAlias(alias)
        result.push(current)
        for (const child of current.child) {
          queue.push(child)
        }
      }
      layer++
    }
    this._child = shallowCopy
  }
}
