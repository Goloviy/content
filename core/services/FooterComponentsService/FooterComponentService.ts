import { inject, injectable } from 'inversify'

import { Container } from 'Core/abstractions'
import { IoCContainerTypes } from 'Core/IoCContainerTypes'
import { ComponentsService, LoggerService } from 'Core/services'

import { Component, PixiAppType } from 'Types'

@injectable()
class FooterComponentsService {
  constructor(
    @inject(IoCContainerTypes.FooterCollection)
    private footerCollection: Component[],
    @inject(IoCContainerTypes.LoggerService) private loggerService: LoggerService,
  ) {}

  public renderFooterComponents(parent: Container, pixiApp: PixiAppType): void {
    ComponentsService.renderAndFilterComponents({ components: this.footerCollection, parent, pixiApp })

    this.loggerService.log('Footer rendered')
  }
}

export { FooterComponentsService }
