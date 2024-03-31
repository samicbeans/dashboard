/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';

const CLIENTID = import.meta.env.VITE_APP_CLIENT_ID;
const APIKEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [list, setList] = useState([]);
  const [filters, setFilters] = useState({
    venuestate: '',
    pricelimit: '9999',
    type: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    if (searchClicked) {
      const fetchEventsData = async () => {
        let API_URL = `https://api.seatgeek.com/2/events?client_id=${CLIENTID}&client_secret=
        ${APIKEY}&venue.state=${filters.venuestate}&highest_price.lte=${filters.pricelimit}
        &per_page=50`;
        if(filters.type == 'concert' || filters.type == 'theater' || filters.type == 'sports'){API_URL = `https://api.seatgeek.com/2/events?client_id=${CLIENTID}&client_secret=
        ${APIKEY}&venue.state=${filters.venuestate}&highest_price.lte=${filters.pricelimit}
        &taxonomies.name=${filters.type}&per_page=50`;}
          const response = await fetch(API_URL);
          const json = await response.json();
          setList(json.events);
      };

      fetchEventsData().catch(console.error);
      setSearchClicked(false);
    }
  }, [filters, searchClicked]);

  // Filter events based on search term
  const filteredList = list.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleSearchClick = () => {
    setSearchClicked(true);
  };

    // Calculate summary statistics
    const eventTypeCounts = {};
    let totalTicketPrice = 0;
    let eventswithprices = 0;
  
    filteredList.forEach(event => {
      // Count event types
      if (event.taxonomies.length > 0) {
        const eventType = event.taxonomies[0].name;
        eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + 1;
      }
  
      // Calculate total ticket price
      if (event.stats.highest_price != null) {
        totalTicketPrice += event.stats.highest_price;
        eventswithprices++;
      }
    });
  
    // Find most common event type
    let mostCommonEventType = 'N/A';
    let maxCount = 0;
    for (const [eventType, count] of Object.entries(eventTypeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonEventType = eventType;
      }
    }
  
    // Calculate average highest ticket price
    const averageTicketPrice = filteredList.length > 0 ? totalTicketPrice / eventswithprices : 0;
  

  return (
    <div className='whole-page'>
      <h1>My Events Dashboard</h1>
      <h2>Search for Events</h2>
      <div className="filter-search">
        <input
          type="text"
          placeholder="Search entries by name"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <label>
          Venue State:
          <input
            type="text"
            placeholder="Enter state abbreviation"
            value={filters.venuestate}
            onChange={e => handleFilterChange('venuestate', e.target.value)}
          />
        </label>
        <label>
          Price Limit:
          <input
            type="number"
            value={filters.pricelimit}
            onChange={e => handleFilterChange('pricelimit', e.target.value)}
          />
        </label>
        <label>
          Event Type (optional):
          <input
            type="text"
            placeholder="any/sports/concert/theater"
            value={filters.type}
            onChange={e => handleFilterChange('type', e.target.value)}
          />
        </label>
        <button onClick={handleSearchClick}>Search</button>
      </div>
      <table className="summary-stats"> 
        <thead>
          <tr>
            <th>Total Events: {filteredList.length}</th>
            <th>Most Common Event Type: {mostCommonEventType}</th>
            <th>Average Highest Ticket Price: ${averageTicketPrice.toFixed(2)}</th>
          </tr>
        </thead>
      </table>
      <table>
        <thead>
          <tr className='categories'>
            <th>Title</th>
            <th>Highest Ticket Price</th>
            <th>URL</th>
            <th>Event Type</th>
            <th>Date and Time (Local)</th>
            <th>Venue Address</th>
          </tr>
        </thead>
        <tbody className='main-board'>
          {filteredList.map(event => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.stats.highest_price != null ? "$" + event.stats.highest_price : 'N/A'}</td>
              <td><a href={event.url} target="_blank" rel="noopener noreferrer">{event.url}</a></td>
              <td>{event.taxonomies.length > 0 ? event.taxonomies[0].name : 'N/A'}</td>
              <td>{event.datetime_local}</td>
              <td>{event.venue.address ? event.venue.address : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;