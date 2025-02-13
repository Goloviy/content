import { Actor, SnapshotFrom } from 'xstate'

import { betMachine } from 'Core/state/betMachine/betMachine'
import { changeOrientationMachine } from 'Core/state/changeOrientationMachine/changeOrientationMachine'
import { freeRoundsMachine } from 'Core/state/freeRoundsMachine/freeRoundsMachine'
import { historyMachine } from 'Core/state/historyMachine/historyMachine'
import { introScreenReelsMachine } from 'Core/state/introScreenReelsMachine/introScreenReelsMachine'
import { jackpotMachine } from 'Core/state/jackpotMachine/jackpotMachine'
import { loaderMachine } from 'Core/state/loaderMachine/loaderMachine'
import { modalMachine } from 'Core/state/modalMachine/modalMachine'
import { rememberComponentMachine } from 'Core/state/rememberComponentMachine/rememberComponentMachine'
import { rememberValueMachine } from 'Core/state/rememberValueMachine/rememberValueMachine'
import { settingsMachine } from 'Core/state/settingsMachine/settingsMachine'
import { slotMachine } from 'Core/state/slotMachine/slotMachine'
import { soundMachine } from 'Core/state/soundMachine/soundMachine'
import { switcherMachine } from 'Core/state/switcherMachine/switcherMachine'
import { tournamentsMachine } from 'Core/state/tournamentsMachine/tournamentsMachine'

type MachineTypes =
  | 'slot'
  | 'loader'
  | 'sound'
  | 'bet'
  | 'modal'
  | 'switcher'
  | 'settings'
  | 'rememberValue'
  | 'rememberComponent'
  | 'tournaments'
  | 'jackpot'
  | 'freeRounds'
  | 'introSlot'
  | 'changeOrientation'
  | 'history'

type MachineActorsTypes = {
  slot: SlotActor
  loader: LoaderActor
  sound: SoundActor
  bet: BetActor
  modal: ModalActor
  switcher: SwitcherActor
  settings: SettingsActor
  rememberValue: RememberValueActor
  rememberComponent: RememberComponentActor
  tournaments: TournamentsActor
  jackpot: JackpotActor
  freeRounds: FreeRoundsActor
  introSlot: IntroScreenSlotActor
  changeOrientation: ChangeOrientationActor
  history: HistoryActor
}

type MachineContextTypes = {
  slot: SlotContext
  loader: LoaderContext
  sound: SoundContext
  bet: BetContext
  modal: ModalContext
  switcher: SwitcherContext
  settings: SettingsContext
  rememberValue: RememberValueContext
  rememberComponent: RememberComponentContext
  tournaments: TournamentsContext
  jackpot: JackpotContext
  freeRounds: FreeRoundsContext
  introSlot: IntroScreenSlotContext
  changeOrientation: ChangeOrientationContext
  history: HistoryContext
}

type SlotActor = Actor<typeof slotMachine>
type SlotContext = SnapshotFrom<SlotActor>['context']

type IntroScreenSlotActor = Actor<typeof introScreenReelsMachine>
type IntroScreenSlotContext = SnapshotFrom<IntroScreenSlotActor>['context']

type LoaderActor = Actor<typeof loaderMachine>
type LoaderContext = SnapshotFrom<LoaderActor>['context']

type SwitcherActor = Actor<typeof switcherMachine>
type SwitcherContext = SnapshotFrom<SwitcherActor>['context']

type SoundActor = Actor<typeof soundMachine>
type SoundContext = SnapshotFrom<SoundActor>['context']

type ModalActor = Actor<typeof modalMachine>
type ModalContext = SnapshotFrom<ModalActor>['context']

type BetActor = Actor<typeof betMachine>
type BetContext = SnapshotFrom<BetActor>['context']

type SettingsActor = Actor<typeof settingsMachine>
type SettingsContext = SnapshotFrom<SettingsActor>['context']

type RememberValueActor = Actor<typeof rememberValueMachine>
type RememberValueContext = SnapshotFrom<RememberValueActor>['context']

type RememberComponentActor = Actor<typeof rememberComponentMachine>
type RememberComponentContext = SnapshotFrom<RememberComponentActor>['context']

type TournamentsActor = Actor<typeof tournamentsMachine>
type TournamentsContext = SnapshotFrom<TournamentsActor>['context']

type JackpotActor = Actor<typeof jackpotMachine>
type JackpotContext = SnapshotFrom<JackpotActor>['context']

type FreeRoundsActor = Actor<typeof freeRoundsMachine>
type FreeRoundsContext = SnapshotFrom<FreeRoundsActor>['context']

type ChangeOrientationActor = Actor<typeof changeOrientationMachine>
type ChangeOrientationContext = SnapshotFrom<ChangeOrientationActor>['context']

type HistoryActor = Actor<typeof historyMachine>
type HistoryContext = SnapshotFrom<HistoryActor>['context']

export type {
  MachineTypes,
  MachineActorsTypes,
  MachineContextTypes,
  SlotActor,
  SlotContext,
  IntroScreenSlotActor,
  IntroScreenSlotContext,
  LoaderActor,
  LoaderContext,
  SwitcherActor,
  SwitcherContext,
  SoundActor,
  SoundContext,
  ModalActor,
  ModalContext,
  BetActor,
  BetContext,
  SettingsActor,
  SettingsContext,
  TournamentsActor,
  TournamentsContext,
  JackpotActor,
  JackpotContext,
  FreeRoundsActor,
  FreeRoundsContext,
  ChangeOrientationContext,
  HistoryContext,
}
