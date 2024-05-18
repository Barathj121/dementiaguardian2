import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Make sure to import Routes

import AlertMonitor from './components/alert';
import Analysis from './components/Analysis';
import MedicineReminder from './components/MedicineReminder';
import Current from './components/Currentlocation'

function App() {
  return (
    <Router>
      <Routes> {/* Wrap your Route components inside a Routes component */}
        <Route path="/" element={<AlertMonitor />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/medicine" element={<MedicineReminder/>}/>
        <Route path='/current' element={<Current/>}/>
      </Routes>
    </Router>
  );
}

export default App;
