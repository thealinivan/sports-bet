'use strict'

let winningOdds;
let maxOdds;
let acumulator;
axios.get('http://localhost:5000/data')
    .then(res => {
        winningOdds = res.data.winningOdds;
        maxOdds = res.data.maxOdds;
        acumulator = res.data.acumulator;
        renderToDOM(winningOdds, maxOdds, acumulator);
    })
    .catch(err => {
        console.log(err);
        alert(`Something went wrong`);

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
                <p class="bd gray d-inline-block">Total bet: <b>${match.left.bet ? match.left.bet + match.draw.bet + match.right.bet : 0}</b></p>
                <p class="bd gray d-inline-block">Min return: <b>${currentOdds[0].return ? currentOdds[0].return : 0}</b></p>
                <p class="bd gray d-inline-block">Max return: <b>${currentOdds[2].return ? currentOdds[2].return : 0}</b></p>
                </div>
                <br>
                <div>
                    <div id=${match.left.id} class="bd d-inline-block">
                        <p class="light-back deep-gray padd-1"><b>${match.left.type}</b></p>
                        <br>
                        <h5><b>${match.left.odd}</b></h5>
                        <p class="deep-gray">${match.left.betHouse}</p>
                        <br>
                        <p class="gray">Bet: <b>${match.left.bet ? match.left.bet : 0}</b></p>
                        <p class="gray">Return: <b>${match.left.return ? match.left.return : 0}</b></p>
                        <p class="${match.left.status} gray">${match.left.status}</p>
                    </div>
                    <div id=${match.draw.id} class="bd d-inline-block">
                        <p class="light-back deep-gray padd-1"><b>${match.draw.type}</b></p>
                        <br>
                        <h5><b>${match.draw.odd}</b></h5>
                        <p class="deep-gray">${match.draw.betHouse}</p>
                        <br>
                        <p class="gray">Bet: <b>${match.draw.bet ? match.draw.bet : 0}</b></p>
                        <p class="gray">Return: <b>${match.draw.return ? match.draw.return : 0}</b></p>
                        <p class="${match.draw.status} gray">${match.draw.status}</p>
                    </div>
                    <div id=${match.right.id} class="bd d-inline-block">
                        <p class="light-back deep-gray padd-1"><b>${match.right.type}</b></p>
                        <br>
                        <h5><b>${match.right.odd}</b></h5>
                        <p class="deep-gray">${match.right.betHouse}</p>
                        <br>
                        <p class="gray">Bet: <b>${match.right.bet ? match.right.bet : 0}</b></p>
                        <p class="gray">Return: <b>${match.right.return ? match.right.return : 0}</b></p>
                        <p class="${match.right.status} gray">${match.right.status}</p>
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

//render

//event listeners
document.getElementById('field-search').addEventListener('keyup', (event) => {
    event.preventDefault();
    search();
})
document.getElementById("tg").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("bg").style.backgroundColor = "white"
    document.getElementById("tg").style.backgroundColor = "rgba(166, 226, 169, 0.63)"
    document.getElementById("games-list").innerHTML = "";
    renderToDOM(maxOdds);

})
document.getElementById("bg").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("tg").style.backgroundColor = "white"
    document.getElementById("bg").style.backgroundColor = "rgba(166, 226, 169, 0.63)"
    document.getElementById("games-list").innerHTML = "";
    renderToDOM(winningOdds);
})









