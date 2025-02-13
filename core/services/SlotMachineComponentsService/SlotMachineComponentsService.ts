import { inject, injectable } from 'inversify'

import { Container } from 'Core/abstractions'
import { IoCContainerTypes } from 'Core/IoCContainerTypes'
import { ComponentsService, LoggerService } from 'Core/services'

import { Component, PixiAppType } from 'Types'

@injectable()
class SlotMachineComponentsService {
  constructor(
    @inject(IoCContainerTypes.SlotMachineCollection)
    private slotMachineCollection: Component[],
    @inject(IoCContainerTypes.LoggerService) private loggerService: LoggerService,
  ) {}

  public renderSlotMachineComponents(parent: Container, pixiApp: PixiAppType): void {
    ComponentsService.renderAndFilterComponents({ components: this.slotMachineCollection, parent, pixiApp })

    this.loggerService.log('Slot machine rendered')
  }
}

export { SlotMachineComponentsService }
