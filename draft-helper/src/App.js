import { useEffect, useState } from 'react';
import './App.css';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa'
// import adp from './data/adp.json'
import field_rank from './data/field_ranks.json'
import tristan_rank from './data/tristan_ranks.json'
import fantasy_pros_rank from './data/fantasy-pros.json'


function App() {

  const [ranking, setRanking] = useState(field_rank)
  const [pick, setPick] = useState(1)
  const [myRanking, setMyRanking] = useState([])
  const [filteredData, setFilteredData] = useState(field_rank)
  const [filterName, setFilterName] = useState('')
  const [sortPosition, setSortPosition] = useState('All')
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [loadComplete, setLoadComplete] = useState(false)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line
  }, [])

  async function loadData() {
    try {
      if (loadComplete) {
        throw new Error('Load is completed')
      }
      console.log('Loading...')
      const storedRanking = await JSON.parse(sessionStorage.getItem("ranking"))
      const storedPick = await JSON.parse(sessionStorage.getItem("pick"))
      const storedMyRanking = await JSON.parse(sessionStorage.getItem("myRanking"))
      const storedSelectedPlayers = await JSON.parse(sessionStorage.getItem("selectedPlayers"))
      if (storedRanking) {
        console.log(storedRanking[0])
        setRanking(storedRanking)
        setFilteredData(storedRanking)
      }
      if (storedPick) {
        setPick(storedPick)
      }
      if (storedMyRanking) {
        setMyRanking(storedMyRanking)
      }
      if (storedSelectedPlayers) {
        setSelectedPlayers(storedSelectedPlayers)
      }
      if (!storedRanking) {
        setRanking(field_rank)
        setFilteredData(field_rank)
        console.log('No stored ranking')
      }
      setLoadComplete(true)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (loadComplete) {
      saveData()
    }
    setFilterName('')
    setSortPosition('All')
    // eslint-disable-next-line
  }, [ranking, myRanking, pick, selectedPlayers])

  function saveData() {
    sessionStorage.setItem("ranking", JSON.stringify(ranking))
    sessionStorage.setItem("myRanking", JSON.stringify(myRanking))
    sessionStorage.setItem("pick", pick)
    sessionStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers))
  }

  function getGoodDeal(rank, adp) {
    if ((rank - adp) < -10) {
      return "table-success"
    }
    if ((rank - adp) > 10) {
      return "table-danger"
    }
    return ""
  }

  function getGoingSoon(adp) {
    if (adp - pick < 0) {
      return 'should-have-gone'
    }
    if (adp - pick < 10) {
      return 'going-soon'
    }
    if (adp - pick > 20) {
      return 'we-chillin'
    }
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
      case 'Fantasy Pros':
        setRanking(fantasy_pros_rank)
        setFilteredData(fantasy_pros_rank)
        break
      default:
        return
    }
  }

  async function handleRemovePlayer(player) {
    let idx = ranking.findIndex((p) => player === p)
    let new_ranking = [...ranking]
    let new_selected = [...selectedPlayers]
    let new_player = new_ranking.splice(idx, 1)
    new_selected.push(new_player[0])
    setPick(pick + 1)
    setRanking(new_ranking)
    setFilteredData(new_ranking)
    setSelectedPlayers(new_selected)
    setFilterName('')
    setSortPosition('All')
  }

  async function handleAddPlayer(player) {
    let idx = ranking.findIndex((p) => p === player)
    let new_ranking = [...ranking]
    let new_myRanking = [...myRanking]
    let new_selected = [...selectedPlayers]
    let new_player = new_ranking.splice(idx, 1)
    new_myRanking.push(new_player[0])
    new_selected.push(new_player[0])
    setPick(pick + 1)
    setRanking(new_ranking)
    setMyRanking(new_myRanking)
    setFilteredData(new_ranking)
    setSelectedPlayers(new_selected)
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

  async function handleUndo() {
    if (selectedPlayers.length < 1) {
      return
    }
    let new_selected = [...selectedPlayers]
    let new_ranking = [...ranking]
    let new_myRanking = [...myRanking]
    let player = new_selected.pop()
    new_ranking.push(player)
    new_ranking.sort((player1, player2) => player1.Rank - player2.Rank)
    let own_player = false
    for (let p = 0; p < new_myRanking.length; p++) {
      if (new_myRanking[p].Name === player.Name) {
        own_player = true
      }
    }
    if (own_player) {
      new_myRanking.pop()
    }
    setMyRanking(new_myRanking)
    setRanking(new_ranking)
    setFilteredData(new_ranking)
    setSelectedPlayers(new_selected)
    setFilterName('')
    setSortPosition('All')
    setPick(pick - 1)
  }

  return (
    <div className="App">
      <div className='jumbotron jumbotron-green mb-0'>
        <h1 className='display-5'>Fantasy Football Draft Helper</h1>
      </div>
      <div className='status-box w-100 d-flex py-4 justify-content-center'>
        <div className='pick-box container d-flex flex-column bg-light w-auto pb-2'>
          <h4 className='font-weight-bold'>Pick #</h4>
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
        {pick < 2 ? <div className='rank-selection container d-flex flex-column justify-content-center align-items-center w-auto'>
          <label className='font-weight-bold'>
            Who's ranking would you like to use?
          </label>
          <select className='w-50' name="selectedRank" defaultValue="Field" onChange={(e) => handleRankingSelect(e)}>
            <option value="Field">Field Yates (ESPN)</option>
            <option value="Tristan">Tristan H. Cockroft (ESPN)</option>
            <option value="Fantasy Pros">Fantasy Pros</option>
          </select>
        </div> :
          <div className='undo-button container d-flex flex-column justify-content-center align-items-center w-auto'>
            <button className='btn btn-dark' onClick={() => handleUndo()}>Undo</button>
          </div>}
      </div>
      <div className='d-flex w-100 content-box pt-4 mb-0'>
        {filteredData && <div className='table-container container'>
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
              </tr>
            </thead>
            <tbody>
              {filteredData.map(player => (
                <tr key={player.Rank} className={`${getGoodDeal(player.Rank, player.ADP)} ${getGoingSoon(player.ADP)}`}>
                  <th scope="row">{player.Rank}</th>
                  <td>{player.Name}</td>
                  <td>{player.Team}</td>
                  <td>{player.Position}</td>
                  <td>{player['Position Rank']}</td>
                  <td>{player.ADP}</td>
                  <td className='d-flex'>
                    <button className='btn btn-sm btn-danger p-2 d-flex align-items-center justify-content-center mr-1' onClick={() => { handleRemovePlayer(player) }}>
                      <FaUserMinus></FaUserMinus>
                    </button>
                    <button className='btn btn-sm btn-success p-2 d-flex align-items-center justify-content-center' onClick={() => { handleAddPlayer(player) }}>
                      <FaUserPlus></FaUserPlus>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
        {myRanking.length > 0 && <div className='container w-auto'>
          <h2 className='font-weight-bold'>My Team</h2>
          <table className="table-container table table-sm table-hover ">
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
