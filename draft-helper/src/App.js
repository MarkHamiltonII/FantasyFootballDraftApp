import { useState } from 'react';
import './App.css';
import adp from './data/adp.json'
import field_rank from './data/field_ranks.json'
import tristan_rank from './data/tristan_ranks.json'


function App() {

  const [ranking, setRanking] = useState(field_rank)
  const [pick, setPick] = useState(1)

  function getGoodDeal(name, adp) {
    let rank = ranking.filter(rank => name.includes(rank.Name))
    if (rank.length === 0) {
      return ""
    }
    rank = rank[0].Rank

    console.log(name, rank, adp)
    if ((rank - adp) < -10) {
      return "table-success"
    }
    if ((rank - adp) > 10) {
      return "table-danger"
    }
    return ""
  }

  function handleRankingSelect(e) {
    e.preventDefault()
    const selection = e.target.value

    switch (selection) {
      case 'Field': 
        setRanking(field_rank)
        break
      case 'Tristan': 
        setRanking(tristan_rank)
        break
    }

  }

  return (
    <div className="App">
      <div className='jumbotron'>
        <h1 className='display-4'>Fantasy Football Draft Helper</h1>
      </div>
      <div className='status-box container d-flex mb-4'>
        <div className='pick-box d-flex flex-column align-items-center w-100 justify-content-center'>
          <h3 className='fs-1 font-weight-bold'>Pick #</h3>
          <div className='pick-container d-flex align-items-center'>
            <div className='d-flex flex-column justify-content-evenly'>
              <button className='btn btn-sm btn-secondary mb-2' onClick={() => setPick(pick + 1)}>+</button>
              <button className='btn btn-sm btn-secondary' onClick={() => setPick(pick - 1)}>-</button>
            </div>
            <div className='d-flex align-items-center border border-dark rounded h-50 pt-2 px-3 ml-2'>
              <p className='text-center'>{pick}</p>
            </div>
          </div>
        </div>
        {pick < 2 && <div className='rank-selection container d-flex flex-column justify-content-center align-items-center'>
          <label>
            Who's ranking would you like to use?
          </label>
          <select className='w-50' name="selectedRank" defaultValue="Field" onChange={(e) => handleRankingSelect(e)}>
            <option value="Field">Field Yates (ESPN)</option>
            <option value="Tristan">Tristan H. Cockroft (ESPN)</option>
          </select>
        </div>}
      </div>
      <div className='container table-container'>
        <table className="table table-hover table-fixed vh-60">
          <thead className="thead-dark table-header">
            <tr>
              <th scope="col">Overall Rank</th>
              <th scope="col">Name</th>
              <th scope="col">Team</th>
              <th scope="col">Position</th>
              <th scope="col">Position Rank</th>
              <th scope="col">ADP</th>
            </tr>
          </thead>
          <tbody>
            {adp.map(player => (
              <tr key={player.Rank} className={`${getGoodDeal(player.Name, player.ADP)} ${(player.ADP - pick) < 10 ? 'going-soon' : ''}`}>
                <th scope="row">{player.Rank}</th>
                <td>{player.Name}</td>
                <td>{player.Team}</td>
                <td>{player.Position}</td>
                <td>{player['Position Rank']}</td>
                <td>{player.ADP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
