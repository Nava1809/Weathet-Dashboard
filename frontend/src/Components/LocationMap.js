import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import '../Components/LocationMap.css'


const LocationMap = ({ onSelectLocation, updateLocationName, onWeatherData, forTravelers = false }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  const onMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    onSelectLocation({ lat, lng });

    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=b97bf010d2f94c90b7f738e12bf444cc`);
      const firstResult = response.data.results[0];
      if (firstResult) {
        const locationName = firstResult.formatted;
        console.log(locationName);
        updateLocationName(locationName); // Update location name in App component

        // Fetch weather data using the new location
        const weatherResponse = await axios.get(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lng}&apikey=DORWV4VN6O1S9r86lcSRgMEwv9nz9eUP`);
        onWeatherData(weatherResponse.data);

        if (forTravelers) {
          // Fetch additional traveler-specific data
          const travelerData = await axios.get(`https://api.tomorrow.io/v4/travel/advisory?location=${lat},${lng}&apikey=DORWV4VN6O1S9r86lcSRgMEwv9nz9eUP`);
          // Extract and display traveler-specific data in the UI
          console.log('Traveler Data:', travelerData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD-jbxCI8bt7nchJc5JstBnoXme3LF4YEE">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={10}
        center={selectedLocation || { lat: 0, lng: 0 }}
        onClick={onMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationMap;
