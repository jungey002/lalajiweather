import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [country, setCountry] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [flagUrl, setFlagUrl] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    try {
      
      const weatherResponse = await axios.get('https://weatherapi-com.p.rapidapi.com/forecast.json', {
        params: { q: country, days: 1 },
        headers: {
          'x-rapidapi-key': 'be3c45e1cdmsh7186c3077a54305p1347a9jsn6b96e6c7d4a1',
          'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
        }
      });
      setWeather(weatherResponse.data);
      setError(null);

      
      const countryCode = weatherResponse.data.location.country.toLowerCase(); // Ensure this matches the required format
      const flagResponse = await axios.get(`https://restcountries.com/v3.1/name/${countryCode}`);
      
      if (flagResponse.data && flagResponse.data[0] && flagResponse.data[0].flags) {
        setFlagUrl(flagResponse.data[0].flags.png);
      } else {
        setFlagUrl('');
      }
      
    } catch (err) {
      console.error('Error fetching data:', err); 
      setError('Could not fetch weather data. Please try again.');
      setWeather(null);
      setFlagUrl('');
    }
  };

  const weatherIconUrl = weather ? `https:${weather.current.condition.icon}` : '';

  
  const temp_c = Math.round(weather?.current.temp_c || 0);
  const high_temp_c = Math.round(weather?.forecast?.forecastday[0]?.day?.maxtemp_c || 0);
  const low_temp_c = Math.round(weather?.forecast?.forecastday[0]?.day?.mintemp_c || 0);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Weather App</h1>
      <form onSubmit={fetchWeather} className="mb-4">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control input-lg"
            placeholder="Enter country or city"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary btn-lg">Get Weather</button>
        </div>
      </form>
      
      {error && <p className="text-danger">{error}</p>}
      
      {weather && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center">
              {flagUrl && <img src={flagUrl} alt="country flag" className="country-flag" />}
              {weather.location.name}, {weather.location.country}
            </h5>
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <th>Temperature (°C)</th>
                  <td>{temp_c}</td>
                </tr>
                <tr>
                  <th>Condition</th>
                  <td>{weather.current.condition.text}</td>
                </tr>
                <tr>
                  <th>Humidity</th>
                  <td>{weather.current.humidity}%</td>
                </tr>
                <tr>
                  <th>Wind Speed</th>
                  <td>{weather.current.wind_kph} kph</td>
                </tr>
                <tr>
                  <th>Highest Temperature (°C)</th>
                  <td>{high_temp_c}</td>
                </tr>
                <tr>
                  <th>Lowest Temperature (°C)</th>
                  <td>{low_temp_c}</td>
                </tr>
              </tbody>
            </table>
            <img src={weatherIconUrl} alt="weather icon" className="weather-icon" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
