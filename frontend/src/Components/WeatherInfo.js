import React from 'react';
import '../Components/WeatherChart.css'

const WeatherInfo = ({ data, locationName, userGroup }) => {
  if (!data || !data.timelines || !data.timelines.daily || !data.timelines.daily[0]) {
    // Handle the case when data is not available or structure is unexpected
    return <div>Loading...</div>;
  }

  const { temperatureMax, temperatureMin, humidityAvg, precipitationProbabilityAvg, windSpeedAvg, visibilityAvg, weatherCodeMax, sunriseTime, sunsetTime } = data.timelines.daily[0].values;

  let additionalInfo = null;

  // Customize additional information based on user group
  if (userGroup === 'farmers') {
    additionalInfo = (
      <>
        <p>Precipitation: {precipitationProbabilityAvg} mm</p>
        <p>Wind Speed: {windSpeedAvg} m/s</p>
        <p>Sunlight Duration: {calculateSunlightDuration(sunriseTime, sunsetTime)}</p>
      </>
    );
  } else if (userGroup === 'travelers') {
    additionalInfo = (
      <>
        <p>Wind Speed: {windSpeedAvg} m/s</p>
        <p>Visibility: {visibilityAvg} km</p>
        <p>Overall Weather: {getWeatherDescription(weatherCodeMax)}</p>
      </>
    );
  } else if (userGroup === 'eventPlanners') {
    additionalInfo = (
      <>
        <p>Max Temperature: {temperatureMax} °C</p>
        <p>Min Temperature: {temperatureMin} °C</p>
        <p>Precipitation: {precipitationProbabilityAvg} mm</p>
        <p>Weather : {getWeatherDescription(weatherCodeMax)}</p>
      </>
    );
  }

  return (
    <div>
      <h2>Weather Information</h2>
      <p>Location: {locationName}</p>
      <p>Max Temperature: {temperatureMax} °C</p>
      <p>Min Temperature: {temperatureMin} °C</p>
      <p>Humidity: {humidityAvg}</p>
      <p>Weather:{getWeatherDescription(weatherCodeMax)}</p>
      {additionalInfo && (
        <>
          <h3>Additional Information</h3>
          {additionalInfo}
        </>
      )}
    </div>
  );
};

// Function to map weather codes to descriptions (you can customize this based on your data)
const getWeatherDescription = (weatherCode) => {
  // Example mappings, modify as needed
  const weatherCodeMappings = {
    1000: 'Clear',
    2000: 'Partly Cloudy',
    3000: 'Cloudy',
    // Add more mappings as needed
  };

  return weatherCodeMappings[weatherCode] || 'Unknown';
};

// Function to convert UTC time to local time
const convertToLocaleTime = (utcTime) => {
  const localTime = new Date(utcTime);
  return localTime.toLocaleTimeString();
};

// Function to calculate sunlight duration
const calculateSunlightDuration = (sunriseTime, sunsetTime) => {
  const sunrise = new Date(sunriseTime);
  const sunset = new Date(sunsetTime);

  const duration = sunset - sunrise;
  const hours = Math.floor(duration / 3600000);
  const minutes = Math.floor((duration % 3600000) / 60000);

  return `${hours} hours ${minutes} minutes`;
};

export default WeatherInfo;
