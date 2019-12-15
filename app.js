
let winsCount = 0
let lossCount = 0
let betAcumulator = 0
let winAcumulator = 0
let profitLossAcumulator = 0

const round = no => {return Math.round(no*100)/100}

// const rawOddsData = [
//   //first platform
//   [
//       //matches
//       [ 'team1-team2', [1.8, 2.9, 2.4] ],
//       [ 'team1-team2', [1.3, 3.2, 1.8] ],
//       [ 'team1-team2', [1.2, 2.5, 3.0] ]
//   ],
//   //following platform <second option>
//   [
//       //matches
//       [ 'team1-team2', [ ["first",1.8] , ["draw",1.8], ["second",1.8] ] ],
//       [ 'team1-team2', [ ["first",1.8] , ["draw",1.8], ["second",1.8] ] ],
//       [ 'team1-team2', [ ["first",1.8] , ["draw",1.8], ["second",1.8] ] ]
//   ]
// ]

//Filter odds
const filteredOdds = [
  [2.5,3.0,2.5],
  [2.9,1.8,2.2],
  [3.0,2.2,2.5],
  [3.5,2.9,3.0],
  [2.7,2.4,1.7],
  [3.5,4.2,2.7]
]

//test beeting odds
const isWinning = odds => {
    console.log("== "+odds+" ================")

    odds.sort().reverse() //solve array mutation

    //core
    let isWinning = false
    let bet0 = 10.00
    let bet1 = round(bet0*odds[0]/odds[1])
    let favBet = round(odds[0]*bet0 - (bet0+bet1))

    let bet0r = round(bet0*odds[0])
    let bet1r = round(bet1*odds[1])
    let favBetr = round(favBet*odds[2])
    let totalBet = round(bet0+bet1+favBet)
    let minR = round(bet0*odds[0])
    let maxR = round(favBet*odds[2])
    let profit = round(maxR-totalBet)

    if (favBet*odds[2] > bet0+bet1+favBet) {
      isWinning = [bet0, bet1, favBet]
      winsCount++
      betAcumulator += totalBet
      winAcumulator += maxR
      profitLossAcumulator = winAcumulator - betAcumulator
    } else{
      lossCount++
    }

    //log
    console.log("------------------Result-----")
    console.log("input: " + odds)
    console.log("bet 0: " + bet0 + ", return: " + bet0r)
    console.log("bet 1: " + bet1 + ", return: " + bet1r)
    console.log("favBet: " + favBet + ", return: " + favBetr)
    console.log("total bet: " + totalBet)
    console.log("min return: " + minR)
    console.log("max return: " + maxR)
    console.log("expected profit: " + profit)

    //return
    return isWinning
}

//Run app
filteredOdds.forEach(match => {
  console.log("place bet ? " + isWinning(match))
  console.log("")
})

//log
console.log("")
console.log("=============STATISTICS==============")
console.log("succesfull: " + winsCount)
console.log("failed: " + lossCount)
console.log("bet acumulator: " + betAcumulator)
console.log("win acumulator: " + winAcumulator)
console.log("profit/loss acumulator: " + round(profitLossAcumulator))
console.log("profit percentage acumulator: " + round(profitLossAcumulator*(betAcumulator/100)) + "%")
console.log("")
