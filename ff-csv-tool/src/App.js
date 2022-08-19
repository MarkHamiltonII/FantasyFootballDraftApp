import { useState } from 'react';
import './App.css';

const MY_EMPTY_TEAM = {
  "QB": [],
  "RB": [],
  "WR": [],
  "TE": [],
  "DST": [],
  "K": []
}

function App() {

  const [csvFile, setCsvFile] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [chosenPlayers, setChosenPlayers] = useState([]);
  const [myTeam, setMyTeam] = useState(MY_EMPTY_TEAM);
  const [pickCounter, setPickCounter] = useState(0);
  const [roundCounter, setRoundCounter] = useState(0);
  const [lastIndex, setLastIndex] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = csvFile;
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      const data = csvToArray(text);
      setRankings(data);
    };

    reader.readAsText(input);

  };

  const handleChosen = (index) => {
    let currentRankings = [...rankings];
    let currentChosenPlayers = [...chosenPlayers];
    let currentIndex = [...lastIndex];
    let currentChosen = currentRankings.splice(index, 1);
    currentChosenPlayers.push(currentChosen);
    currentIndex.push(index);
    setPickCounter(pickCounter + 1);
    setRankings(currentRankings);
    setChosenPlayers(currentChosenPlayers);
    setLastIndex(currentIndex);
  }

  const handleAddToMyTeam = (index, Eligible_Position) => {
    let myCurrentTeam = myTeam;
    myCurrentTeam[Eligible_Position].push(rankings[index]);
    setMyTeam(myCurrentTeam);
    setRoundCounter(roundCounter + 1);
    handleChosen(index);
  }

  const handleReset = () => {
    setCsvFile(csvFile);
    setRankings([]);
    setChosenPlayers([]);
    setMyTeam({});
    setMyTeam(MY_EMPTY_TEAM);
    setPickCounter(0);
    setRoundCounter(0);
  }

  const handleUndo = () => {
    let indexList = lastIndex;
    let recentIndex = indexList.pop();
    let chosenList = [...chosenPlayers]
    let lastChosen = chosenList.pop();
    let recentRatings = [...rankings];
    recentRatings.splice(recentIndex, 0, lastChosen[0]);
    setRankings(recentRatings);
    setChosenPlayers(chosenList);
    setLastIndex(indexList);
    setPickCounter(pickCounter - 1);
  }

  return (
    <div className="App">


      <h2>Welcome to FF Helper</h2>
      <p>Please upload your preffered rankings as a csv</p>
      <form id="myForm" onSubmit={handleSubmit}>
        <input type="file" id="csvFile" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
        <input type="submit" value="Submit" />
      </form>
      <div className='button-container'>
      <button onClick={() => handleReset()}>Reset</button>
      <button onClick={() => handleUndo()}>Undo</button>
      </div>

      <div className='counter-container counter'>
        <h3>Pick Counter</h3>
        <h2>{pickCounter}</h2>
        <p><button onClick={() => setPickCounter(pickCounter + 1)}>+</button><button onClick={() => setPickCounter(pickCounter - 1)}>-</button></p>
      </div>

      <div className='counter-container round-container'>
        <h3>Round Counter</h3>
        <h2>{roundCounter}</h2>
        <p><button onClick={() => setRoundCounter(roundCounter + 1)}>+</button><button onClick={() => setRoundCounter(roundCounter - 1)}>-</button></p>
      </div>


      <div className='workspace'>

        <div className='section-container'>
          <h2>Rankings</h2>
          {rankings[0] && <table className='table-container rankings'>
            <thead className='table-header'>
              <tr>
                {Object.keys(rankings[0]).map((key, index) =>
                  <td key={index}>{key}</td>)}
              </tr>
            </thead>
            <tbody>
              {rankings.map((ranking, index) => (
                <tr className={((ranking.ADP < pickCounter) ? 'should-have-gone' : ((ranking.ADP <= pickCounter+10) ? 'going-soon' : '')) + ((ranking.Rank < parseFloat(ranking.ADP)-10) ? ' good-deal' : "") + ((ranking.Rank > parseFloat(ranking.ADP)+10) ? ' bad-deal' : "")} key={index}>
                  {Object.keys(ranking).map((key, idx) => 
                  <td key={idx}>{ranking[key]}</td>)}
                  <td><button onClick={() => handleChosen(index)}>Taken</button></td>
                  <td><button onClick={() => handleAddToMyTeam(index, ranking.Position)}>Mine!</button></td>
                </tr>
              ))}
            </tbody>
          </table>}
        </div>



        <div className='section-container'>
          <h2>My Team</h2>
          <table className='table-container myteam'>
            <thead className='table-header'>
              <tr>
                <td>Position</td>
                <td>Player</td>
              </tr>
            </thead>
            <tbody>
              {myTeam.QB.map((p) => (
                <tr key={p.Position_Rank}>
                  <td>{p.Position_Rank}</td>
                  <td>{p.Player}</td>
                </tr>
              ))}
              {myTeam.RB.map((p) => (
                <tr key={p.Position_Rank}>
                  <td>{p.Position_Rank}</td>
                  <td>{p.Player}</td>
                </tr>
              ))}
              {myTeam.WR.map((p) => (
                <tr key={p.Position_Rank}>
                  <td>{p.Position_Rank}</td>
                  <td>{p.Player}</td>
                </tr>
              ))}
              {myTeam.TE.map((p) => (
                <tr key={p.Position_Rank}>
                  <td>{p.Position_Rank}</td>
                  <td>{p.Player}</td>
                </tr>
              ))}
              {myTeam.K.map((p) => (
                <tr key={p.Position_Rank}>
                  <td>{p.Position_Rank}</td>
                  <td>{p.Player}</td>
                </tr>
              ))}
              {myTeam.DST.map((p) => (
                <tr key={p.Position_Rank}>
                  <td>{p.Position_Rank}</td>
                  <td>{p.Player}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
