// WeatherForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationMap from './LocationMap';
import WeatherChart from './WeatherChart';
import '../Components/WeatherForm.css'


const WeatherForm = ({ onWeatherData, updateLocationName, onUserGroupChange }) => {
  const [location, setLocation] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userGroup, setUserGroup] = useState('');

  const getWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.tomorrow.io/v4/weather/forecast?location=${encodeURIComponent(location)}&apikey=DORWV4VN6O1S9r86lcSRgMEwv9nz9eUP`, {
        responseType: 'json',
      });
      onWeatherData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
          await fetchLocationName(latitude, longitude);
          setSelectedLocation({ lat: latitude, lng: longitude });
          getWeatherData();
        },
        (error) => {
          console.error('Error getting current location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
    }
  };

  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=b97bf010d2f94c90b7f738e12bf444cc`);
      const firstResult = response.data.results[0];
      if (firstResult) {
        setLocationName(firstResult.formatted);
        updateLocationName(firstResult.formatted);
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  useEffect(() => {
    if (location) {
      fetchLocationName(location.split(',')[0], location.split(',')[1]);
    }
  }, [location]);

  return (
    <div className="weather-form">

      <input type="text" placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <select value={userGroup} onChange={(e) => { setUserGroup(e.target.value); onUserGroupChange(e.target.value); }}>
        <option value="">Select User Group</option>
        <option value="eventPlanners">Event Planners</option>
        <option value="farmers">Farmers</option>
        <option value="travelers">Travelers</option>
      </select>
      <button onClick={getWeatherData}>Get Weather</button>
      <button onClick={getCurrentLocation}>Get Current Location</button>
      {locationName && <p>Location: {locationName}</p>}
      <LocationMap onSelectLocation={(location) => setSelectedLocation(location)} updateLocationName={updateLocationName} onWeatherData={onWeatherData} forTravelers={userGroup === 'travelers'} />
      {selectedLocation && <WeatherChart location={selectedLocation} forFarmers={userGroup === 'farmers'} />}
    </div>
  );
};

export default WeatherForm;
