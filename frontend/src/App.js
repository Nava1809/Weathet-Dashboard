// App.js
import React, { useState } from 'react';
import './App.css';
import WeatherForm from "./Components/WeatherForm";
import WeatherInfo from "./Components/WeatherInfo";
import WeatherChart from "./Components/WeatherChart";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [userGroup, setUserGroup] = useState('');

  const handleWeatherData = (data) => {
    setWeatherData(data);
  }

  const updateLocationName = (name) => {
    setLocationName(name);
  }

  const handleUserGroupChange = (group) => {
    setUserGroup(group);
  }

  return (
    <div className="App">
      <header>
        <h1>Weather Dashboard</h1>
      </header>
      <main>
        <WeatherForm onWeatherData={handleWeatherData} updateLocationName={updateLocationName} onUserGroupChange={handleUserGroupChange} />
        {weatherData && (
          <>
            <WeatherInfo data={weatherData} locationName={locationName} userGroup={userGroup} />
            <WeatherChart location={weatherData?.location} userGroup={userGroup} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
