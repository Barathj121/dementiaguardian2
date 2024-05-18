import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './alert.css'; // Import the CSS file for styling
import Analytics from './Analysis'; // Import the Analytics component
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AlertMonitor = () => {
  const [latestSerialNumber, setLatestSerialNumber] = useState(null);
  const [viewHistory, setViewHistory] = useState(false);
  const [viewAnalytics, setViewAnalytics] = useState(false);
  const [alertHistory, setAlertHistory] = useState([]);

  const fetchLatestSerialNumber = async () => {
    try {
      const response = await axios.get('https://dementian-location.onrender.com/alert-history');
      const latestAlert = response.data[response.data.length - 1];
      setLatestSerialNumber(latestAlert.serial_number);
    } catch (error) {
      console.error('Error fetching latest serial number:', error);
    }
  };

  const fetchAlertHistory = async () => {
    try {
      const response = await axios.get('https://dementian-location.onrender.com/alert-history');
      setAlertHistory(response.data);
    } catch (error) {
      console.error('Error fetching alert history:', error);
    }
  };

  useEffect(() => {
    fetchLatestSerialNumber();
    fetchAlertHistory();
  }, []);

  const handleViewHistoryClick = () => {
    setViewHistory(true);
    setViewAnalytics(false);
  };

  const handleViewAnalyticsClick = () => {
    setViewAnalytics(true);
    setViewHistory(false);
  };

  const handleBackClick = () => {
    setViewHistory(false);
    setViewAnalytics(false);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Dementia Guardian</h1>
        <NavBar onViewHistoryClick={handleViewHistoryClick} onViewAnalyticsClick={handleViewAnalyticsClick} onBackClick={handleBackClick} />
      </header>
      {viewHistory ? (
        <ViewHistory alertHistory={alertHistory} />
      ) : viewAnalytics ? (
        <Analytics alertHistory={alertHistory} /> // Render Analytics component
      ) : (
        latestSerialNumber ? (
          <div className="latest-alert">
            <h2>Latest Serial Number: {latestSerialNumber}</h2>
            <hr />
            <AlertChecker latestSerialNumber={latestSerialNumber} onViewHistoryClick={handleViewHistoryClick} />
          </div>
        ) : (
          <div className="no-alert">
            <h2>No Alerts at the Moment</h2>
            <button onClick={handleViewHistoryClick}>View Alert History</button>
          </div>
        )
      )}
    </div>
  );
};

const NavBar = ({ onViewHistoryClick, onViewAnalyticsClick, onBackClick }) => {
  return (
    <nav>
      <ul className="nav-list">
        <li>
          <a href="#" className="nav-link" onClick={onBackClick}>Home</a>
        </li>
        <li>
          <a href="#" className="nav-link" onClick={onViewHistoryClick}>View Alert History</a>
        </li>
        <li>
          <a href={Analytics} className="nav-link" onClick={onViewAnalyticsClick}>View Analytics</a>
        </li>
      </ul>
    </nav>
  );
};

const ViewHistory = ({ alertHistory }) => {
  const [filterCriteria, setFilterCriteria] = useState('none'); // Set default filter to 'none'
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    setFilteredHistory(alertHistory);
  }, [alertHistory]);

  const handleFilterChange = (event) => {
    const criteria = event.target.value;
    setFilterCriteria(criteria);
    if (criteria === 'none') {
      // If 'none' is selected, display the entire table
      setFilteredHistory(alertHistory);
    } else {
      filterHistory(criteria);
    }
  };

  const filterHistory = (criteria) => {
    let filteredData = [];
    switch (criteria) {
      case 'distance':
        filteredData = alertHistory.filter(alert => alert.source === 'Distance');
        break;
      case 'button':
        filteredData = alertHistory.filter(alert => alert.source === 'Button');
        break;
      case 'timestamp':
        filteredData = alertHistory.sort((a, b) => new Date(b.time_stamp)          .getTime() - new Date(a.time_stamp).getTime());
        break;
      default:
        filteredData = alertHistory;
        break;
    }
    setFilteredHistory(filteredData);
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Alert History</h2>
        <div>
          <label htmlFor="filter">Filter by:</label>
          <select id="filter" value={filterCriteria} onChange={handleFilterChange}>
            <option value="none">None</option>
            <option value="timestamp">Timestamp</option>
            <option value="distance">Source (Distance)</option>
            <option value="button">Source (Button)</option>
          </select>
        </div>
      </div>
      <table className="history-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Location</th>
            <th>Mode</th>
            <th>Time Stamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistory.map(alert => (
            <tr key={alert.serial_number}>
              <td>{alert.serial_number}</td>
              <td>{alert.location_lat}, {alert.location_long}</td>
              <td>{alert.source}</td>
              <td>{formatTimestamp(alert.time_stamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AlertChecker = ({ latestSerialNumber, onViewHistoryClick }) => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const checkAlert = async () => {
      try {
        const response = await axios.get('https://dementian-location.onrender.com/alert-history');
        const latestAlert = response.data[response.data.length - 1];
        if (latestAlert.serial_number !== latestSerialNumber) {
          setAlert(latestAlert);
          setTimeout(() => {
            setAlert(null); // Hide alert after 1 minute
          }, 60000);
        }
      } catch (error) {
        console.error('Error checking alert:', error);
      }
    };

    const interval = setInterval(checkAlert, 5000); // Check for alert every 5 seconds
    return () => clearInterval(interval);
  }, [latestSerialNumber]);

  return (
    <div>
      {alert ? (
        <div className="alert-box">
          <h4>Dementia Guardian</h4>
          <p>The patient has pressed the alert button</p>
          <hr />
          <div className="map-container">
            <MapContainer center={[alert.location_lat, alert.location_long]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[alert.location_lat, alert.location_long]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <p className="alert-mode">Mode: {alert.source}</p>
          {formatTimestamp(alert.time_stamp)}
          <button className="close-alert-button" onClick={() => setAlert(null)}>Close Alert</button>
        </div>
      ) : (
        <div className="no-alert">
          <h2>No Alerts at the Moment</h2>
          <button onClick={onViewHistoryClick}>View Alert History</button>
        </div>
      )}
    </div>
  );
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export default AlertMonitor;

