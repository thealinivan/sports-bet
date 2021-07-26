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
                betHouse: m1.betHouse,
                odd: m1.left
            },
            draw: {
                betHouse: m1.betHouse,
                odd: m1.draw
            },
            right: {
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
    maxOddsMatches.forEach(m1 => {

        let match = {
            id: m1.id,
            betHouse: m1.betHouse,
            leftTeam: m1.leftTeam,
            rightTeam: m1.rightTeam,
            left: {
                betHouse: m1.betHouse,
                odd: m1.left,
                bet: 0.0,
                return: 0.0
            },
            draw: {
                betHouse: m1.betHouse,
                odd: m1.draw,
                bet: 0.0,
                return: 0.0
            },
            right: {
                betHouse: m1.betHouse,
                odd: m1.right,
                bet: 0.0,
                return: 0.0
            },
        };

        let wOdds = [m1.left, m1.draw, m1.right];
        // wOdds.sort((function (a, b) { return a.odd - b.odd; }));

        let bet0 = 10.00
        let bet1 = round(bet0 * wOdds[0].odd / wOdds[1].odd)
        let favBet = round(bet0 * wOdds[0].odd - (bet0 + bet1))
        let bet0r = round(bet0 * wOdds[0].odd)
        let bet1r = round(bet1 * wOdds[1].odd)
        let favBetr = round(favBet * wOdds[2].odd)
        let totalBet = round(bet0 + bet1 + favBet)
        let minR = round(bet0 * wOdds[0].odd)
        let maxR = round(favBet * wOdds[2].odd)
        let profit = round(maxR - totalBet)

        if (profit > 0) {
            wOdds[0].bet = 100.0;
            wOdds[0].return = bet0r;
            wOdds[1].bet = bet1;
            wOdds[1].return = bet1r;
            wOdds[2].bet = favBet;
            wOdds[2].return = favBetr;

            match.left = wOdds[0];
            match.draw = wOdds[1];
            match.right = wOdds[2];

            winningMatches.push(match)
        }

    })
    return winningMatches;

}

//reder data to DOM
const renderToDOM = maxOdds => {
    document.getElementById("bets-no").innerHTML = `Current Games: ${maxOdds.length}`;
    maxOdds.forEach(match => {

        const game = `
     <div id=${match.id} class="card padd-1 marg-1">
                    <h4 class="padd-1 center-text">${match.leftTeam} vs ${match.rightTeam}</h4>
                    <div>
                        <div class="card padd-1 d-inline-block">
                            <p class="light-back"><b>1</b></p>
                            <p>${match.left.odd}</p>
                            <p>${match.left.betHouse}</p>
                            <p>Amount: <b>${match.left.bet}</b></p>
                            <p>Return: <b>${match.left.return}</b></p>
                            <p>Status: <b>./</b></p>
                        </div>
                        <div class="card padd-1 d-inline-block">
                            <p class="light-back"><b>X</b></p>
                            <p>${match.draw.odd}</p>
                            <p>${match.draw.betHouse}</p>
                             <p>Amount: <b>${match.draw.bet}</b></p>
                            <p>Return: <b>${match.draw.return}</b></p>
                            <p>Status: <b>./</b></p>
                        </div>
                        <div class="card padd-1 d-inline-block">
                            <p class="light-back"><b>2</b></p>
                            <p>${match.right.odd}</p>
                            <p>${match.right.betHouse}</p>
                            <p>Amount: <b>${match.right.bet}</b></p>
                            <p>Return: <b>${match.right.return}</b></p>
                            <p>Status: <b>./</b></p>
                        </div>
                    </div>
                </div>
    `;
        const list = document.getElementById(`games-list`);
        $(list).append(game);
    })
}



//LOGIC

//INIT

//target urls
url0 = [
    {
        id: "match1",
        betHouse: "paddypower",
        leftTeam: "Spain",
        rightTeam: "Italy",
        left: 1.5,
        draw: 1.9,
        right: 4.7
    },
    {
        id: "match2",
        betHouse: "paddypower",
        leftTeam: "England",
        rightTeam: "Germany",
        left: 3.8,
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
        left: 2.5,
        draw: 3.1,
        right: 3.1
    },
    {
        id: "match2",
        betHouse: "ladbrokes",
        leftTeam: "England",
        rightTeam: "Germany",
        left: 2.5,
        draw: 2.65,
        right: 2.3
    }
]

url2 = [
    {
        id: "match2",
        betHouse: "bet365",
        leftTeam: "England",
        rightTeam: "Germany",
        left: 2.5,
        draw: 2.3,
        right: 2.7
    },
    {
        id: "match1",
        betHouse: "bet365",
        leftTeam: "Spain",
        rightTeam: "Italy",
        left: 2.35,
        draw: 5.2,
        right: 2.7
    }
]

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









