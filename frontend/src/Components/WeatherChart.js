import React, { useEffect, useState } from 'react';
import "chart.js/auto";
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import '../Components/WeatherChart.css'


const WeatherChart = ({ location, userGroup }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`https://api.tomorrow.io/v4/weather/forecast?location=${location.lat},${location.lng}&apikey=DORWV4VN6O1S9r86lcSRgMEwv9nz9eUP`, {
          responseType: 'json',
        });
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const dailyTimelines = weatherData?.timelines?.daily || [];
  const labels = dailyTimelines.map((day) => {
    const date = day?.time ? new Date(day.time) : null;
    return date ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';
  });

  const temperatureMaxData = dailyTimelines.map((day) => day?.values?.temperatureMax || 0);
  const temperatureMinData = dailyTimelines.map((day) => day?.values?.temperatureMin || 0);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Max Temperature',
        data: temperatureMaxData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
      {
        label: 'Min Temperature',
        data: temperatureMinData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        labels: labels,
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 30,
          padding: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const index = context.dataIndex;
            return `${label}: ${value}°C - ${labels[index]}`;
          },
        },
      },
    },
  };

  return (
    <div>
      {weatherData ? <Line key={JSON.stringify(weatherData)} data={chartData} options={options} /> : ''}
    </div>
  );
};

export default WeatherChart;
