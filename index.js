const initBet = 10.00;
let totalBetAcumulator = 0.0;
let minReturnAcumulator = 0.0;
let maxReturnAcumulator = 0.0;


//FUNCTIONS

//round
const round = no => { return Math.round(no * 100) / 100 }

//scrape
const scrape = (betHouse, url) => {
    data = url;
    return data
}

//calculate max odds
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
            },
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

//filter winning odds
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

            //static
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

//reder data to DOM
const renderToDOM = winOdds => {


    winOdds.forEach(match => {
        let currentOdds = [match.left, match.draw, match.right];
        currentOdds.sort((function (a, b) { return a.return - b.return; }));
        totalBetAcumulator += match.left.bet + match.draw.bet + match.right.bet;
        minReturnAcumulator += currentOdds[0].return;
        maxReturnAcumulator += currentOdds[2].return;
        const game = `
            <div id=${match.id} class="card padd-1 marg-1">
                <h4 class="padd-1 center-text">${match.leftTeam} vs ${match.rightTeam}</h4>
                <p>Total bet: <b>${match.left.bet + match.draw.bet + match.right.bet}</b></p>
                <p>Min return: <b>${currentOdds[0].return}</b></p>
                <p>Max return: <b>${currentOdds[2].return}</b></p>
                
                <div>
                    <div id=${match.left.id} class="${match.left.status} bd padd-1 d-inline-block">
                        <p class="light-back"><b>${match.left.type}</b></p>
                        <p>${match.left.odd}</p>
                        <p>${match.left.betHouse}</p>
                        <p>Bet: <b>${match.left.bet}</b></p>
                        <p>Return: <b>${match.left.return}</b></p>
                    </div>
                    <div id=${match.draw.id} class="${match.draw.status} bd padd-1 d-inline-block">
                        <p class="light-back"><b>${match.draw.type}</b></p>
                        <p>${match.draw.odd}</p>
                        <p>${match.draw.betHouse}</p>
                        <p>Bet: <b>${match.draw.bet}</b></p>
                        <p class=>Return: <b>${match.draw.return}</b></p>
                    </div>
                    <div id=${match.right.id} class="${match.right.status} bd padd-1 d-inline-block">
                        <p class="light-back"><b>${match.right.type}</b></p>
                        <p>${match.right.odd}</p>
                        <p>${match.right.betHouse}</p>
                        <p>Bet: <b>${match.right.bet}</b></p>
                        <p>Return: <b>${match.right.return}</b></p>
                    </div>
                </div>
            </div>
        `;
        const list = document.getElementById(`games-list`);
        $(list).append(game);
    })
    document.getElementById("total-games").innerHTML = `Current Games: <b>${maxOdds.length}</b>`;
    document.getElementById("bet-games").innerHTML = `Betted Games: <b>${winningOdds.length}</b>`;
    document.getElementById("total-bet").innerHTML = `Total Bet: <b>${round(totalBetAcumulator)}</b>`;
    document.getElementById("min-return").innerHTML = `Min Return: <b>${round(minReturnAcumulator)}</b>`;
    document.getElementById("max-return").innerHTML = `Max Return: <b>${round(maxReturnAcumulator)}</b>`;
    document.getElementById("max-profit").innerHTML = `Max Profit: <b>${round(maxReturnAcumulator - totalBetAcumulator)}</b>`;
}


//DATA

//target urls
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

//LOGIC

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
console.log(winningOdds);


renderToDOM(winningOdds);









