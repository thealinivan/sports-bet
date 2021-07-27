const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

const initBet = 10.00;
let acumulator = {
    totalBet: 0.0,
    minReturn: 0.0,
    maxReturn: 0.0
}

//FUNCTIONS

//round
const round = no => { return Math.round(no * 100) / 100 }

//Scrape
const scrape = (betHouse, url) => {
    //to be replaced with scraping algorithm
    data = url;
    return data
}

//Max odds
const calculateMaxOdds = hData => {
    let maxOdds = [];
    hData.shift().forEach(m1 => {
        let match = {
            id: m1.id,
            betHouse: m1.betHouse,
            leftTeam: m1.leftTeam,
            rightTeam: m1.rightTeam,
            left: {
                id: 1,
                type: "1",
                betHouse: m1.betHouse,
                odd: m1.left
            },
            draw: {
                id: 2,
                type: "X",
                betHouse: m1.betHouse,
                odd: m1.draw
            },
            right: {
                id: 3,
                type: "2",
                betHouse: m1.betHouse,
                odd: m1.right
            }
        };

        hData.forEach(house2 => {
            house2.forEach(m2 => {
                if (m1.id === m2.id) {
                    if (match.left.odd < m2.left) {
                        match.left.odd = m2.left;
                        match.left.betHouse = m2.betHouse;
                    }
                    if (match.draw.odd < m2.draw) {
                        match.draw.odd = m2.draw;
                        match.draw.betHouse = m2.betHouse;
                    }
                    if (match.right.odd < m2.right) {
                        match.right.odd = m2.right;
                        match.right.betHouse = m2.betHouse;
                    }
                }
            })
        })
        maxOdds.push(match)
    });
    return maxOdds;
}

//Winning odds
const calculateWinningOdds = (maxOddsMatches) => {
    let winningMatches = [];
    maxOddsMatches.forEach(match => {
        let wOdds = [match.left, match.draw, match.right];
        wOdds.sort((function (a, b) { return a.odd - b.odd; })).reverse();
        let bet0 = initBet
        let bet1 = bet0 * wOdds[0].odd / wOdds[1].odd
        let favBet = bet0 * wOdds[0].odd - (bet0 + bet1)
        let bet0r = bet0 * wOdds[0].odd
        let bet1r = bet1 * wOdds[1].odd
        let favBetr = favBet * wOdds[2].odd
        let totalBet = bet0 + bet1 + favBet
        let minR = bet0 * wOdds[0].odd
        let maxR = favBet * wOdds[2].odd
        let profit = maxR - totalBet
        if (profit > 0) {
            wOdds[0].bet = round(initBet);
            wOdds[0].return = round(bet0r);
            wOdds[1].bet = round(bet1);
            wOdds[1].return = round(bet1r);
            wOdds[2].bet = round(favBet);
            wOdds[2].return = round(favBetr);
            //to be integrated as part of the scrapping component
            wOdds[2].status = "won";

            wOdds.sort((function (a, b) { return a.id - b.id; }));
            match.left = wOdds[0];
            match.draw = wOdds[1];
            match.right = wOdds[2];
            winningMatches.push(match)
        }
    })
    return winningMatches;
}

//Bet
const bettWinningOdds = winningOdds => {
    winningOdds.forEach(match => {
        let wOdds = [match.left, match.draw, match.right];
        wOdds.sort((function (a, b) { return a.odd - b.odd; })).reverse();
        acumulator.totalBet += match.left.bet + match.draw.bet + match.right.bet;
        acumulator.minReturn += wOdds[0].return;
        acumulator.maxReturn += wOdds[2].return;
        //initiate betting
        wOdds.forEach(bet => {
            //betting algorithm
            console.log(`House ${bet.betHouse} | Type: ${bet.type} | Odds: ${bet.odd} | Bet: ${bet.bet}`);
        })
    });

}


//Data
url0 = [
    {
        id: "match1",
        betHouse: "paddypower",
        leftTeam: "Spain",
        rightTeam: "Italy",
        left: 3.5,
        draw: 1.9,
        right: 2.6
    },
    {
        id: "match2",
        betHouse: "paddypower",
        leftTeam: "England",
        rightTeam: "Germany",
        left: 3.8,
        draw: 2.0,
        right: 1.2
    },
    {
        id: "match3",
        betHouse: "paddypower",
        leftTeam: "Denmark",
        rightTeam: "Romania",
        left: 2.7,
        draw: 2.0,
        right: 1.2
    }
]

url1 = [
    {
        id: "match1",
        betHouse: "ladbrokes",
        leftTeam: "Spain",
        rightTeam: "Italy",
        left: 2.3,
        draw: 2.7,
        right: 2.3
    },
    {
        id: "match2",
        betHouse: "ladbrokes",
        leftTeam: "England",
        rightTeam: "Germany",
        left: 2.5,
        draw: 2.65,
        right: 2.3
    },
    {
        id: "match3",
        betHouse: "ladbrokes",
        leftTeam: "Denmark",
        rightTeam: "Romania",
        left: 2.6,
        draw: 3.3,
        right: 3.4
    }
]

url2 = [
    {
        id: "match2",
        betHouse: "bet365",
        leftTeam: "England",
        rightTeam: "Germany",
        left: 2.7,
        draw: 2.3,
        right: 2.7
    },
    {
        id: "match1",
        betHouse: "bet365",
        leftTeam: "Spain",
        rightTeam: "Italy",
        left: 2.3,
        draw: 2.2,
        right: 3.1
    },
    {
        id: "match3",
        betHouse: "bet365",
        leftTeam: "Denmark",
        rightTeam: "Romania",
        left: 2.5,
        draw: 2.9,
        right: 3.95
    }
]


//APP

//house names
bh0 = "paddypower"
bh1 = "ladbrokes";
bh2 = "bet365";

//get data
const betHouse0 = scrape(bh0, url0);
const betHouse1 = scrape(bh1, url1);
const betHouse2 = scrape(bh2, url2);
const housesData = [betHouse0, betHouse1, betHouse2];

//get max odss data
const maxOdds = calculateMaxOdds(housesData);
const winningOdds = calculateWinningOdds(maxOdds);
bettWinningOdds(winningOdds);

//get endpoint for domestic data
app.get('/data', function (req, res) {
    res.status(200).send({
        maxOdds: maxOdds,
        winningOdds: winningOdds,
        acumulator: acumulator
    });
});
app.listen(PORT, () => console.log(`App runinng at: ${PORT}`));









