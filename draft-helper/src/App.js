import { useState } from 'react';
import './App.css';
import { FaUserPlus, FaTrashAlt } from 'react-icons/fa'
// import adp from './data/adp.json'
import field_rank from './data/field_ranks.json'
import tristan_rank from './data/tristan_ranks.json'


function App() {

  const [ranking, setRanking] = useState(field_rank)
  const [pick, setPick] = useState(1)
  const [myRanking, setMyRanking] = useState([])
  const [filteredData, setFilteredData] = useState(ranking)
  const [filterName, setFilterName] = useState('')
  const [sortPosition, setSortPosition] = useState('All')

  function getGoodDeal(rank, adp) {
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
    switch (e.target.value) {
      case 'Field':
        setRanking(field_rank)
        setFilteredData(field_rank)
        break
      case 'Tristan':
        setRanking(tristan_rank)
        setFilteredData(tristan_rank)
        break
      default:
        return
    }
  }

  function handleRemovePlayer(player) {
    let idx = ranking.findIndex((p) => player === p)
    let new_ranking = [...ranking]
    new_ranking.splice(idx, 1)
    setPick(pick + 1)
    setRanking(new_ranking)
    setFilteredData(new_ranking)
    setFilterName('')
    setSortPosition('All')
  }

  function handleAddPlayer(player) {
    let idx = ranking.findIndex((p) => p === player)
    let new_ranking = [...ranking]
    let new_myRanking = [...myRanking]
    let new_player = new_ranking.splice(idx, 1)
    new_myRanking.push(new_player[0])
    setPick(pick + 1)
    setRanking(new_ranking)
    setMyRanking(new_myRanking)
    setFilteredData(new_ranking)
    setFilterName('')
    setSortPosition('All')
  }

  function handleSearch(e) {
    e.preventDefault()
    setFilterName(e.target.value)
    filterByPlayer(e.target.value)
  }

  function handlePositionSelect(e) {
    e.preventDefault()
    setSortPosition(e.target.value)
    filterByPosition(e.target.value)
  }

  function filterByPlayer(name) {
    if (name.length === 0) {
      setFilteredData(ranking)
      return
    }
    const newFilter = ranking.filter(rank => rank.Name.toLowerCase().includes(name.toLowerCase()))
    setFilteredData(newFilter)
  }

  function filterByPosition(pos) {
    setFilterName('')
    if (pos === 'All') {
      setFilteredData(ranking)
      return
    }
    const newFilter = ranking.filter(rank => rank.Position === pos)
    setFilteredData(newFilter)
  }


  return (
    <div className="App">
      <div className='jumbotron jumbotron-green mb-0'>
        <h1 className='display-4'>Fantasy Football Draft Helper</h1>
      </div>
      <div className='status-box w-100 d-flex mb-4 py-4 justify-content-center'>
        <div className='pick-box container d-flex flex-column bg-light w-auto pb-2'>
          <h3 className='font-weight-bold'>Pick #</h3>
          <div className='pick-container d-flex align-items-center'>
            <div className='d-flex flex-column justify-content-evenly'>
              <button className='btn btn-sm btn-secondary mb-2' onClick={() => setPick(pick + 1)}>+</button>
              <button className='btn btn-sm btn-secondary' onClick={() => setPick(pick - 1)}>-</button>
            </div>
            <div className='d-flex align-items-center h-50 pt-2 px-3 ml-2 w-auto'>
              <p className='text-center h3 '>{pick}</p>
            </div>
          </div>
        </div>
        <div className='search container d-flex flex-column pt-3 w-auto'>
          <div className='player-search-box'>
            <label className='font-weight-bold mr-2'>Seach Player Name:</label>
            <input type='text' name='search' onChange={(e) => handleSearch(e)} value={filterName}></input>
          </div>
          <div className='position-filter-box'>
            <label className='font-weight-bold mt-3 mr-2'>Position:</label>
            <select className='' name="selectedPos" onChange={(e) => handlePositionSelect(e)} value={sortPosition}>
              <option value="All">All</option>
              <option value="QB">QB</option>
              <option value="WR">WR</option>
              <option value="RB">RB</option>
              <option value="TE">TE</option>
              <option value="DST">DST</option>
              <option value="K">K</option>
            </select>
          </div>
        </div>
        {pick < 2 && <div className='rank-selection container d-flex flex-column justify-content-center align-items-center w-auto'>
          <label className='font-weight-bold'>
            Who's ranking would you like to use?
          </label>
          <select className='w-50' name="selectedRank" defaultValue="Field" onChange={(e) => handleRankingSelect(e)}>
            <option value="Field">Field Yates (ESPN)</option>
            <option value="Tristan">Tristan H. Cockroft (ESPN)</option>
          </select>
        </div>}
      </div>
      <div className='d-flex w-100'>
        <div className='table-container container'>
          <table className="table table-sm table-hover table-fixed vh-60">
            <thead className="thead-dark table-header">
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Name</th>
                <th scope="col">Team</th>
                <th scope="col">Position</th>
                <th scope="col">Position Rank</th>
                <th scope="col">ADP</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(player => (
                <tr key={player.Rank} className={`${getGoodDeal(player.Rank, player.ADP)} ${(player.ADP - pick) < 10 ? 'going-soon' : ''}`}>
                  <th scope="row">{player.Rank}</th>
                  <td>{player.Name}</td>
                  <td>{player.Team}</td>
                  <td>{player.Position}</td>
                  <td>{player['Position Rank']}</td>
                  <td>{player.ADP}</td>
                  <td><button className='btn btn-sm btn-danger p-2 d-flex align-items-center justify-content-center' onClick={() => { handleRemovePlayer(player) }}>
                    <FaTrashAlt></FaTrashAlt>
                  </button></td>
                  <td><button className='btn btn-sm btn-success p-2 d-flex align-items-center justify-content-center' onClick={() => { handleAddPlayer(player) }}>
                    <FaUserPlus className='mr-1'></FaUserPlus>
                  </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myRanking.length > 0 && <div className='container w-auto'>
          <h2 className='font-weight-bold'>My Team</h2>
          <table className="table table-sm table-hover ">
            <thead className="thead-dark table-header">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Team</th>
                <th scope="col">Position</th>
              </tr>
            </thead>
            <tbody>
              {myRanking.map(player => (
                <tr key={player.Rank}>
                  <td>{player.Name}</td>
                  <td>{player.Team}</td>
                  <td>{player.Position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>
    </div>
  );
}

export default App;
