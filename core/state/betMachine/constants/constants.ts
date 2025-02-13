type MultiplicationMapItem = {
  bet: number
  coin: number
}
type MultiplicationMap = { [key: string]: MultiplicationMapItem[] }

let multiplicationMap: MultiplicationMap = {}

function getTotalBetArray(betArray: number[], coinValueArray: number[], betMultiplier: number, isCoins = false) {
  const totalBetArray: number[] = []

  multiplicationMap = {}

  coinValueArray.forEach(coinValue => {
    betArray.forEach(bet => {
      const resultValue = isCoins ? bet * betMultiplier : bet * coinValue * betMultiplier
      const numberOfDigits = isCoins ? 0 : 2

      const result = parseFloat(resultValue.toFixed(numberOfDigits))

      if (!totalBetArray.includes(result)) totalBetArray.push(result)

      multiplicationMap[result] = multiplicationMap[result] || []
      multiplicationMap[result].push({ bet: bet, coin: coinValue })
    })
  })

  totalBetArray.sort((a, b) => a - b)

  return totalBetArray
}

export type { MultiplicationMapItem }
export { multiplicationMap, getTotalBetArray }
