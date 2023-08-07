const MY_EMPTY_TEAM = {
    "QB": [],
    "RB": [],
    "WR": [],
    "TE": [],
    "DST": [],
    "K": []
}

let csvFile = null
let rankings = []
let chosenPlayers = []
let myTeam = MY_EMPTY_TEAM
let pickCounter = 0
let roundCounter = 0
let lastIndex = []

function csvToArray(str, delimiter = ", ") {

    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n") - 1).split(delimiter);

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\r\n");

    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });

    // return the array
    return arr;
}

document.getElementById('csvFile').addEventListener("change", (e) => csvFile = e.target.files[0])

function handleSubmit(e) {
    e.preventDefault();
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);
        rankings = data;
        renderRankings();
        renderCounters();
    };

    reader.readAsText(csvFile);

};

const handleChosen = (index) => {
    let currentChosen = rankings.splice(index, 1);
    chosenPlayers.push(currentChosen);
    lastIndex.push(index);
    pickCounter += 1;
    renderCounters();
    renderRankings();
}

const handleAddToMyTeam = (index, Eligible_Position) => {
    myTeam[Eligible_Position].push(rankings[index]);
    roundCounter += 1;
    renderMyTeam();
    handleChosen(index);
    renderCounters();
}

const handleReset = () => {
    location.reload();
}

const handleUndo = () => {
    let recentIndex = lastIndex.pop();
    let lastChosen = chosenPlayers.pop();
    rankings.splice(recentIndex, 0, lastChosen[0]);
    pickCounter -= 1;
    renderRankings();
    renderCounters();
}

const plusPick = () => {
    pickCounter += 1;
    renderCounters();
}

const minusPick = () => {
    pickCounter -= 1;
    renderCounters();
}
const plusRound = () => {
    roundCounter += 1;
    renderCounters();
}

const minusRound = () => {
    roundCounter -= 1;
    renderCounters();
}

const renderRankings = () => {
    const h = document.querySelector('.table-header');
    let content = "<tr>";
    Object.keys(rankings[0]).map((key, index) => {
        content += `<td>${key}</td>`
    })
    content += "</tr>"
    h.innerHTML = content;

    let b = document.querySelector('.table-body');
    let bodyContent = '';
    for (i = 0; i < rankings.length; i++) {
        if (rankings[0].ADP) {
            let rowClass = '';
            if (rankings[i]['ADP'] < pickCounter) {
                rowClass = 'should-have-gone';
            } else if (rankings[i]['ADP'] < pickCounter + 10) {
                rowClass = 'going-soon'
            } else if (rankings[i].Rank > rankings[i]['ADP']) {
                rowClass = 'good-deal'
            }
            bodyContent += `<tr class="${rowClass}">`;
            Object.keys(rankings[i]).map((key, index) => {
                bodyContent += `<td>${rankings[i][key]}</td>`
            })
            bodyContent += `
        <td><button onclick="handleChosen(${i})">Taken</button></td>
        <td><button onclick="handleAddToMyTeam(${i}, '${rankings[i].Position}')">Mine!</button></td></tr>`;
            b.innerHTML = bodyContent;
        }
    }
}

const renderMyTeam = () => {
    const tb = document.querySelector('.team-body');
    let content = '';

    myTeam['QB'].map((p) => {
        content += `<tr><td>${p.Position_Rank}</td><td>${p.Player}</td></tr>`
    })
    myTeam['RB'].map((p) => {
        content += `<tr><td>${p.Position_Rank}</td><td>${p.Player}</td></tr>`
    })
    myTeam['WR'].map((p) => {
        content += `<tr><td>${p.Position_Rank}</td><td>${p.Player}</td></tr>`
    })
    myTeam['TE'].map((p) => {
        content += `<tr><td>${p.Position_Rank}</td><td>${p.Player}</td></tr>`
    })
    myTeam['K'].map((p) => {
        content += `<tr><td>${p.Position_Rank}</td><td>${p.Player}</td></tr>`
    })
    myTeam['DST'].map((p) => {
        content += `<tr><td>${p.Position_Rank}</td><td>${p.Player}</td></tr>`
    })

    tb.innerHTML = content;
}

const renderCounters = () => {
    const pc = document.querySelector('.pick-counter');
    const rc = document.querySelector('.round-counter');
    pc.innerHTML = ` ${pickCounter} `;
    rc.innerHTML = ` ${roundCounter} `;
}