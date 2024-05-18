// MedicineReminder.js
import { useState } from 'react';
import axios from 'axios';
import './medicineReminder.css'; // Create a CSS file for styling the form

const MedicineReminder = () => {
  const [medicineName, setMedicineName] = useState('');
  const [timeInterval, setTimeInterval] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timeIntervalInMicroseconds = timeInterval * 60 * 1000000;

    try {
      await axios.post('https://dementian-location.onrender.com/medicine-reminder', {
        medicine_name: medicineName,
        time: timeIntervalInMicroseconds,
      });
      alert('Medicine reminder set successfully');
      setMedicineName('');
      setTimeInterval('');
    } catch (error) {
      console.error('Error setting medicine reminder:', error);
    }
  };

  return (
    <div className="medicine-reminder-container">
      <h2>Set Medicine Reminder</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="medicineName">Medicine Name:</label>
          <input
            type="text"
            id="medicineName"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="timeInterval">Time Interval (minutes):</label>
          <input
            type="number"
            id="timeInterval"
            value={timeInterval}
            onChange={(e) => setTimeInterval(e.target.value)}
            required
          />
        </div>
        <button type="submit">Set Reminder</button>
      </form>
    </div>
  );
};

export default MedicineReminder;
