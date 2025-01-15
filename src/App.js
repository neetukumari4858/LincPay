import { useEffect, useState, useCallback } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dropdownStatus, setDropdownStatus] = useState('Select Status');
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const maxPages = 2;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
        const newCharacters = response.data.results;
        setAllData((prevData) => [...prevData, ...newCharacters]);
        setFilteredData((prevData) => [...prevData, ...newCharacters]);
               
        // Extract unique statuses and update dropdown options
        const newStatuses = Array.from(new Set(newCharacters.map((char) => char.status)));
        setDropdownOptions((prevOptions) => Array.from(new Set([...prevOptions, ...newStatuses])));
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    };
    if (page <= maxPages) {
      fetchData();
    }
  }, [page]);

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 200
    ) {
      if (!loading && page < maxPages) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading, page]);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    const debouncedScroll = debounce(handleScroll, 300);
    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [handleScroll]);

  useEffect(() => {
    const getFilteredData =
      dropdownStatus === 'Select Status'
        ? allData
        : allData.filter((char) => char.status === dropdownStatus);
    setFilteredData([...getFilteredData]);
  }, [dropdownStatus, allData]);

  const handleDropdownChange = (e) => {
    setDropdownStatus(e.target.value);
  };

  return (
    <div className="App">
      <div className='container'>
        <h1>Character Explorer</h1>
        <div>
          <label htmlFor="statusFilter">Filter by Status: </label>
          <select
            id="statusFilter"
            value={dropdownStatus}
            onChange={handleDropdownChange}
          >
            <option value="Select Status" disabled>
              Select Status
            </option>
            {dropdownOptions.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="character-list">
        {filteredData.length > 0 && (
          filteredData.map((character, index) => (
            <div key={index}>
              <img src={character.image} alt={character.name} />
              <h3>{character.name}</h3>
              <p>Status: {character.status}</p>
            </div>
          ))
        )}
      </div>
      {loading && <p>Loading more characters...</p>}
    </div>
  );
}

export default App;

