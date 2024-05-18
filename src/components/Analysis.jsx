import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import './Analysis.css'; // Import CSS file for styling

const Analysis = () => {
  const [alertHistory, setAlertHistory] = useState([]);
  const [expandedChart, setExpandedChart] = useState(null);

  const fetchAlertHistory = async () => {
    try {
      const response = await axios.get('https://dementian-location.onrender.com/alert-history');
      setAlertHistory(response.data);
    } catch (error) {
      console.error('Error fetching alert history:', error);
    }
  };

  useEffect(() => {
    fetchAlertHistory();
  }, []);

  const prepareChartData = (history) => {
    const labels = history.map(alert => new Date(alert.time_stamp).toLocaleString());
    const dataPoints = history.map((alert, index) => index + 1);

    return {
      labels,
      datasets: [
        {
          label: 'Alert Frequency',
          data: dataPoints,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
        },
      ],
    };
  };

  const AlertSourceDistribution = ({ alertHistory }) => {
    const buttonAlerts = alertHistory.filter(alert => alert.source === 'Button').length;
    const distanceAlerts = alertHistory.filter(alert => alert.source === 'Distance').length;

    const data = {
      labels: ['Button', 'Distance'],
      datasets: [{
        data: [buttonAlerts, distanceAlerts],
        backgroundColor: ['#FF6384', '#36A2EB'],
      }]
    };

    return <Pie data={data} />;
  };

  const TimeBetweenAlerts = ({ alertHistory }) => {
    const intervals = alertHistory.slice(1).map((alert, index) => {
      const previousAlert = alertHistory[index];
      return (new Date(alert.time_stamp) - new Date(previousAlert.time_stamp)) / (1000 * 60); // minutes
    });

    const data = {
      labels: intervals.map((_, index) => `Interval ${index + 1}`),
      datasets: [{
        label: 'Time Between Alerts (minutes)',
        data: intervals,
        backgroundColor: 'rgba(75,192,192,1)',
      }]
    };

    return <Bar data={data} />;
  };

  const DailyPatterns = ({ alertHistory }) => {
    const dailyCounts = alertHistory.reduce((acc, alert) => {
      const day = new Date(alert.time_stamp).getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      datasets: [{
        label: 'Daily Alerts',
        data: [0, 1, 2, 3, 4, 5, 6].map(day => dailyCounts[day] || 0),
        backgroundColor: 'rgba(75,192,192,1)',
      }]
    };

    return <Bar data={data} />;
  };

  const AlertTrendsByTime = ({ alertHistory }) => {
    const hourlyCounts = alertHistory.reduce((acc, alert) => {
      const hour = new Date(alert.time_stamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [{
        label: 'Hourly Alerts',
        data: Array.from({ length: 24 }, (_, i) => hourlyCounts[i] || 0),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      }]
    };

    return <Line data={data} />;
  };

  const handleChartClick = (chartName) => {
    setExpandedChart(expandedChart === chartName ? null : chartName);
  };

  return (
    <div className="analysis-container">
      <h2>Alert Analysis</h2>
      {alertHistory.length > 0 ? (
        <div className="charts-container">
          <div className={`chart ${expandedChart === 'AlertFrequency' ? 'expanded' : ''}`} onClick={() => handleChartClick('AlertFrequency')}>
            <h3>Alert Frequency Over Time</h3>
            <Line data={prepareChartData(alertHistory)} />
          </div>
          <div className={`chart ${expandedChart === 'AlertSourceDistribution' ? 'expanded' : ''}`} onClick={() => handleChartClick('AlertSourceDistribution')}>
            <h3>Alert Source Distribution</h3>
            <AlertSourceDistribution alertHistory={alertHistory} />
          </div>
          <div className={`chart ${expandedChart === 'TimeBetweenAlerts' ? 'expanded' : ''}`} onClick={() => handleChartClick('TimeBetweenAlerts')}>
            <h3>Time Between Alerts</h3>
            <TimeBetweenAlerts alertHistory={alertHistory} />
          </div>
          <div className={`chart ${expandedChart === 'DailyPatterns' ? 'expanded' : ''}`} onClick={() => handleChartClick('DailyPatterns')}>
            <h3>Daily Alert Patterns</h3>
            <DailyPatterns alertHistory={alertHistory} />
          </div>
          <div className={`chart ${expandedChart === 'AlertTrendsByTime' ? 'expanded' : ''}`} onClick={() => handleChartClick('AlertTrendsByTime')}>
            <h3>Hourly Alert Trends</h3>
            <AlertTrendsByTime alertHistory={alertHistory} />
          </div>
        </div>
      ) : (
        <p>No alert data available</p>
      )}
    </div>
  );
}

export default Analysis;
