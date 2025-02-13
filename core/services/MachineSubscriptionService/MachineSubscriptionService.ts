import { injectable } from 'inversify'

import type {
  ContextSubscription,
  CreatePrevValuesEntityParams,
  IContextSubscriber,
  MachineContextTypes,
  MachineTypes,
  SubscribeParameters,
} from './types'

@injectable()
class MachineSubscriptionService implements IContextSubscriber {
  public subscribe<MachineType extends MachineTypes = 'loader'>({
    actor,
    effect,
    fields,
  }: SubscribeParameters<MachineType>): ContextSubscription {
    const context = actor.getSnapshot().context as MachineContextTypes[MachineType]
    let prevValue = this.createPrevValuesEntity({ fields, context })

    // @ts-ignore
    return actor.subscribe(({ context }) => {
      const currentValue = this.createPrevValuesEntity({ fields, context })

      for (const key in prevValue) {
        if (prevValue[key] !== currentValue[key]) {
          prevValue = currentValue

          effect(context)
          break
        }
      }
    })
  }

  /**
   * Here is an example of the implementation of unsubscribe
   */
  /*
  unsubscribe() {
    Example:

    const subscription: ContextSubscription = this.contextSubscriber.subscribe()
    subscription.unsubscribe()
  }
  */

  private createPrevValuesEntity<MachineType extends MachineTypes = 'loader'>({
    fields,
    context,
  }: CreatePrevValuesEntityParams<MachineType>): MachineContextTypes[MachineType] {
    if (!fields) return context

    return fields.reduce(
      (acc, key) => (acc = { ...acc, [key]: (context as MachineContextTypes[MachineType])[key] }),
      {} as MachineContextTypes[MachineType],
    )
  }
}

export { MachineSubscriptionService }
