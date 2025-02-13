import type { MachineTypes, MachineActorsTypes, MachineContextTypes } from 'Core/state/types'

type SubscribeParameters<MachineType extends MachineTypes = 'loader'> = {
  actor: MachineActorsTypes[MachineType]
  effect: (context: MachineContextTypes[MachineType]) => void
  fields?: ContextFields<MachineType>[]
}

type CreatePrevValuesEntityParams<MachineType extends MachineTypes = 'loader'> = {
  fields?: ContextFields<MachineType>[]
  context: MachineContextTypes[MachineType]
}

type ContextFields<MachineType extends MachineTypes = 'loader'> = keyof MachineContextTypes[MachineType]

type IContextSubscriber = {
  subscribe<MachineType extends MachineTypes = 'loader'>({ actor, effect, fields }: SubscribeParameters<MachineType>): void
}

type ContextSubscription = {
  unsubscribe(): void
}

export type {
  IContextSubscriber,
  MachineTypes,
  SubscribeParameters,
  MachineContextTypes,
  ContextFields,
  MachineActorsTypes,
  CreatePrevValuesEntityParams,
  ContextSubscription,
}
