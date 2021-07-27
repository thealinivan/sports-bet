'use strict'

let winningOdds;
let maxOdds;
let acumulator;
axios.get('http://localhost:5500/data')
    .then(res => {
        winningOdds = res.data.winningOdds;
        maxOdds = res.data.maxOdds;
        acumulator = res.data.acumulator;
        renderToDOM(winningOdds, maxOdds, acumulator);
    })

//round
const round = no => { return Math.round(no * 100) / 100 }


//reder data to DOM
const renderToDOM = (winOdds, maxOdds, acumulator) => {
    winOdds.forEach(match => {
        let currentOdds = [match.left, match.draw, match.right];
        currentOdds.sort((function (a, b) { return a.return - b.return; }));

        const game = `
            <div id=${match.id} class="match-item bd padd-1 center-text d-inline-block">
                <h4 class="padd-1 center-text deep-gray">${match.leftTeam} vs ${match.rightTeam}</h4>
                <div>
                <p class="bd gray d-inline-block">Total bet: <b>${match.left.bet + match.draw.bet + match.right.bet}</b></p>
                <p class="bd gray d-inline-block">Min return: <b>${currentOdds[0].return}</b></p>
                <p class="bd gray d-inline-block">Max return: <b>${currentOdds[2].return}</b></p>
                </div>
                <br>
                <div>
                    <div id=${match.left.id} class="${match.left.status} bd padd-1 d-inline-block">
                        <p class="light-back deep-gray"><b>${match.left.type}</b></p>
                        <br>
                        <h5><b>${match.left.odd}</b></h5>
                        <p class="deep-gray">${match.left.betHouse}</p>
                        <br>
                        <p class="gray">Bet: <b>${match.left.bet}</b></p>
                        <p class="gray">Return: <b>${match.left.return}</b></p>
                    </div>
                    <div id=${match.draw.id} class="${match.draw.status} bd padd-1 d-inline-block">
                        <p class="light-back deep-gray"><b>${match.draw.type}</b></p>
                        <br>
                        <h5><b>${match.draw.odd}</b></h5>
                        <p class="deep-gray">${match.draw.betHouse}</p>
                        <br>
                        <p class="gray">Bet: <b>${match.draw.bet}</b></p>
                        <p class="gray">Return: <b>${match.draw.return}</b></p>
                    </div>
                    <div id=${match.right.id} class="${match.right.status} bd padd-1 d-inline-block">
                        <p class="light-back deep-gray"><b>${match.right.type}</b></p>
                        <br>
                        <h5><b>${match.right.odd}</b></h5>
                        <p class="deep-gray">${match.right.betHouse}</p>
                        <br>
                        <p class="gray">Bet: <b>${match.right.bet}</b></p>
                        <p class="gray">Return: <b>${match.right.return}</b></p>
                    </div>
                </div>
            </div>
        `;
        const list = document.getElementById(`games-list`);
        $(list).append(game);
    });
    document.getElementById("total-games").innerHTML = `<b>${maxOdds.length}</b>`;
    document.getElementById("bet-games").innerHTML = `<b>${winningOdds.length}</b>`;
    document.getElementById("total-bet").innerHTML = `<b>${round(acumulator.totalBet)}</b>`;
    document.getElementById("min-return").innerHTML = `<b>${round(acumulator.minReturn)}</b>`;
    document.getElementById("max-return").innerHTML = `<b>${round(acumulator.maxReturn)}</b>`;
    document.getElementById("max-profit").innerHTML = `<b>${round(acumulator.maxReturn - acumulator.totalBet)}</b>`;
}


//search
const search = () => {
    const output = document.getElementById("games-list");
    output.innerHTML = "";
    let filtered = maxOdds.filter(match => (match.leftTeam.toLowerCase() + match.rightTeam.toLowerCase())
        .includes($('#field-search').val().toLowerCase()));
    $('#field-search').val() == "" ? renderToDOM(winningOdds) : renderToDOM(filtered);
}


//event listeners
document.getElementById('field-search').addEventListener('keyup', (event) => {
    event.preventDefault();
    console.log("keyup");
    search();
})









