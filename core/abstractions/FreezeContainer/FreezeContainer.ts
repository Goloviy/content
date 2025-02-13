import { Container } from 'Core/abstractions'
import type { IContainerOptions } from 'Core/abstractions/types'

type RequiredDimensions = Pick<IContainerOptions, 'width' | 'height'>
type OptionalContainerOptions = Omit<IContainerOptions, 'width' | 'height'>

interface IContainerOptionsWithDimensions extends OptionalContainerOptions, Required<RequiredDimensions> {}

class FreezeContainer extends Container {
  private readonly freezeWidth: number
  private readonly freezeHeight: number

  constructor(props: IContainerOptionsWithDimensions) {
    super(props)

    this.freezeWidth = props.width
    this.freezeHeight = props.height
  }

  get width(): number {
    return this.freezeWidth
  }

  get height(): number {
    return this.freezeHeight
  }
}

export { FreezeContainer }
