type SoundStateType = {
  SoundOn: boolean
  Music: boolean
  Effects: boolean
  PreviousMusic: boolean
  PreviousEffects: boolean
  Volume: number
}

export type SettingsContextType = {
  SoundState: SoundStateType
  QuickSpin: boolean
  PreviewScreen: boolean
  StopMsg: number
  TurboSpinMsg: number
  BetValue: number[]
  BSM: boolean
  ShowCMM: boolean
  ShowQSM: boolean
  CoinMode: boolean
  InitialScreen: string
  SBPLock: boolean
  SBLL: string
  SBLP: string
  CustomGameStoredData: string
}

const IDLE = 'IDLE'
const INITIALIZING = 'INITIALIZING'
const SAVE_SETTINGS = 'SAVE_SETTINGS'

const initialContext: SettingsContextType = {
  SoundState: {
    SoundOn: true,
    Music: true,
    Effects: true,
    PreviousMusic: true,
    PreviousEffects: true,
    Volume: 50,
  },
  QuickSpin: false,
  PreviewScreen: true,
  StopMsg: 0,
  TurboSpinMsg: 0,
  BetValue: [0, 0],
  BSM: false,
  ShowCMM: true,
  ShowQSM: true,
  CoinMode: false,
  InitialScreen: '1,3,6,6,3_10,4,9,10,8_6,3,8,5,4_10,8,7,7,8_5,4,4,8,1_7,8,5,9,10',
  SBPLock: false,
  SBLL: '',
  SBLP: '',
  CustomGameStoredData: '',
}

export { initialContext, IDLE, INITIALIZING, SAVE_SETTINGS }
