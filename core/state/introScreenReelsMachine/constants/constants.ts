type InitialIntroScreenReelsContextType = {
  index: number
  counter: number
  windowSymbols: string[] | null
  symbolsMark: string
  showLeaveAnimation: boolean
  showComeAnimation: boolean
  animationSymbolsCounter: number
  destroy: boolean
  permissionToShow: {
    leaveAnimationEnd: boolean
    request: boolean
    comeAnimationEnd: boolean
  }
  animationBeforeDeletionEnded: boolean
  spinsData: []
  randomSymbolMultiplier: {
    id: number
    position: number
    multiplier: number
  }[]
  totalSpinWinResult: string
  destroyBombCounter: number
  destroyBomb: boolean
  currentBombMultiplier: number
  payingSymbols: string
}

const initialIntroScreenReelsContext: InitialIntroScreenReelsContextType = {
  index: 1,
  counter: 1,
  windowSymbols: null,
  symbolsMark: '',
  showLeaveAnimation: false,
  showComeAnimation: false,
  animationSymbolsCounter: 0,
  destroy: false,
  permissionToShow: {
    leaveAnimationEnd: false,
    request: false,
    comeAnimationEnd: false,
  },
  payingSymbols: '',
  animationBeforeDeletionEnded: false,
  spinsData: [],
  randomSymbolMultiplier: [],
  totalSpinWinResult: '',
  destroyBomb: false,
  destroyBombCounter: 0,
  currentBombMultiplier: 0,
}

const resetProp = {
  animationSymbolsCounter: () => 0,
  showLeaveAnimation: () => false,
  showComeAnimation: () => false,
  destroy: () => false,
  destroyBombCounter: () => 0,
  destroyBomb: () => false,
  permissionToShow: {
    leaveAnimationEnd: false,
    request: false,
    comeAnimationEnd: false,
  },
  index: 1,
}

function setDoInitData({ windowSymbols }: { windowSymbols: string }) {
  return {
    action: 'init',
    windowSymbols: windowSymbols ? windowSymbols.split(',') : null,
  }
}

export { initialIntroScreenReelsContext, resetProp, setDoInitData }
