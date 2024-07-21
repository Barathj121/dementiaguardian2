// // LocationMap.js

// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import './map.css';

// const LocationMap = () => {
//   const [locationData, setLocationData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('https://dementian-location.onrender.com/get-location');
//         const data = await response.json();
//         setLocationData(data);
//       } catch (error) {
//         console.error('Error fetching location data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="map-container alert-box">
//       <h2>Current Patient Location</h2>
//       <div className="map-container-inner">
//         <MapContainer center={[0, 0]} zoom={16} style={{ height: '100%', width: '100%' }}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           {locationData && (
//             <LocationMarker position={[locationData.lat, locationData.lon]} />
//           )}
//         </MapContainer>
//       </div>
//     </div>
//   );
// };

// const LocationMarker = ({ position }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (position) {
//       map.setView(position, map.getZoom());
//     }
//   }, [position, map]);

//   return position === null ? null : (
//     <Marker position={position}>
//       <Popup>
//         Latitude: {position[0]}, Longitude: {position[1]}
//       </Popup>
//     </Marker>
//   );
// };

// export default LocationMap;

// LocationMap.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from '../assets/marker.png';
import './map.css';

// Custom icon for markers
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LocationMap = () => {
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dementian-location.onrender.com/get-location');
        const data = await response.json();
        setLocationData(data);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="map-container alert-box">
      <h2>Current Patient Location</h2>
      <div className="map-container-inner">
        <MapContainer center={[0, 0]} zoom={16} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locationData && (
            <LocationMarker position={[locationData.lat, locationData.lon]} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

const LocationMarker = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>
        Latitude: {position[0]}, Longitude: {position[1]}
      </Popup>
    </Marker>
  );
};

export default LocationMap;
