import './App.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from "leaflet";
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [position, setPosition] = useState(null)
  const [address, setAddress] = useState('');

  let DefaultIcon = L.icon({
    iconUrl: "/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  useEffect(() => {
    if (position) {
      getAddressFromCoordinates(position.lat, position.lng);
    }
  }, [position]);

  // Get address from coordinates using OpenStreetMap Nominatim API
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const address = response.data.display_name;
      setAddress(address);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

// events
const HandleClickmap = () =>  {
  const map = useMapEvents({
    click(e){ 
      setPosition(e.latlng)
      map.flyTo(e.latlng)

    },
    
  });

  return position == null 
  ? null
  : <Marker position={position}></Marker>
}


  return (
    <div className="App">
       { position == null ? null : <> <p> Lat : {position.lat}</p><p> Lng : {position.lng}</p>  <p>Address: {address}</p> </>}
    <MapContainer
    center={{ lat: 37.270046498603705, lng: 9.87221360206604 }}
    zoom={13}
    scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <HandleClickmap />
  </MapContainer>,
    </div>
  );
}


export default App;
