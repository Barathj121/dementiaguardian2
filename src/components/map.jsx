import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker,Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './map.css';

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

  const polyline = [
    [lat, lng],
    [homeLat, homeLng]
  ];

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <MapContainer center={[lat, lng]} zoom={5}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]} />
        <Marker position={[homeLat, homeLng]} />
        <Polyline pathOptions={{ color: 'blue' }} positions={polyline} />
      </MapContainer>
    </div>
  );
};

export default Map;