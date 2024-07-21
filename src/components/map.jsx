import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './map.css';
import markerIcon from '../assets/marker.png';

// Custom icon for markers
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = () => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [homeLat, setHomeLat] = useState(0);
  const [homeLng, setHomeLng] = useState(0);

  const fetchData = () => {
    fetch('https://iot-0agm.onrender.com/latest')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setLat(data.data[0]);
          setLng(data.data[1]);
          setHomeLat(data.data[2]);
          setHomeLng(data.data[3]);
          console.log(data.data);
        }
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  const polyline = [
    [lat, lng],
    [homeLat, homeLng]
  ];

  return (
    <div>
      <button onClick={fetchData}>Refresh Data</button>
      <MapContainer center={[lat || 0, lng || 0]} zoom={5} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {lat !== 0 && lng !== 0 && (
          <Marker position={[lat, lng]} icon={customIcon} />
        )}
        {homeLat !== 0 && homeLng !== 0 && (
          <Marker position={[homeLat, homeLng]} icon={customIcon} />
        )}
        {lat !== 0 && lng !== 0 && homeLat !== 0 && homeLng !== 0 && (
          <Polyline pathOptions={{ color: 'blue' }} positions={polyline} />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
