import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(20);
  const [dropdownStatus, setStatus] = useState('Select Status');
  const [dropdownData, setDropdown] = useState([]);

  useEffect(() => {
    const apiUrl = `https://rickandmortyapi.com/api/character?page=${page}`;
    const getData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const newData = response.data.results;
        setData((prevData) => [...prevData, ...newData]);
        const uniqueStatuses = Array.from(
          new Set([...dropdownData, ...newData.map((item) => item.status)])
        );
        setDropdown(uniqueStatuses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, [page,dropdownStatus, setStatus]);

  const handleScroll = () => {
    if (
      document.body.scrollHeight - 300 <
      window.scrollY + window.innerHeight
    ) {
      setLoading(true);
    }
  };

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  window.addEventListener('scroll', debounce(handleScroll, 500));

  useEffect(() => {
    if (loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading]);

  const handleChange = (e) => {
    setStatus(e.target.value);
  };

  const filteredData =
    dropdownStatus === 'Select Status'
      ? data
      : data.filter((character) => character.status === dropdownStatus);

  return (
    <div className="App">
      <div className="container">
        <h1>Character Explorer</h1>
        <div>
          <h3>Filter By Status</h3>
          <select value={dropdownStatus} onChange={handleChange}>
            <option value="Select Status" disabled>
              Select Status
            </option>
            {dropdownData.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      {filteredData.map((character) => (
        <div key={character.id}>
          <img src={character.image} alt="character" />
          <p>Name: {character.name}</p>
          <p>Status: {character.status}</p>
        </div>
      ))}
      <h2>{loading && 'Loading more characters...'}</h2>
    </div>
  );
}

export default App;


