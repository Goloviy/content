import { Text, AnimatedSprite, Sprite, Container, Graphics } from 'Core/abstractions'

import type { Optional } from 'Types'

type OrientationChangeProps<O extends OrientationChangeObjectKeys = 'Sprite'> = {
  obj?: OrientationChangeObjectsTypes[O]
  targetValues?: OrientationChangeObjectsValues<O>
}

type OrientationChangeObjectsTypes = {
  Text: Text
  AnimatedSprite: AnimatedSprite
  Sprite: Sprite
  Container: Container
  Graphics: Graphics
}

type OrientationChangeObjectsValues<O extends OrientationChangeObjectKeys = 'Sprite'> = Optional<OrientationChangeObjectsTypes[O]>

type OrientationChangeObjectKeys = keyof OrientationChangeObjectsTypes

export type { OrientationChangeProps, OrientationChangeObjectsTypes, OrientationChangeObjectKeys, OrientationChangeObjectsValues }
