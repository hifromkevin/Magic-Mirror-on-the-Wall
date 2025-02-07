import React from 'react';

import Forecasts from './Forecasts.jsx';

const Weather = ({
  currentWeather,
  location,
  forecasts,
  weatherIcons,
  weatherTranslator,
  weatherBool,
  weatherError,
}) => {
  if (weatherError) {
    return <div className="weather"> No Weather Found</div>;
  }

  if (weatherBool) {
    return (
      <div className="weather">
        <div className="weather__today">
          <div className="weather__today__main">
            <img
              src={weatherIcons[weatherTranslator(currentWeather.weatherCode)]}
              alt={currentWeather.description}
              className="weather__today__icon"
            />
            <div className="weather__today__sub">
              <p className="weather__today__temperature">
                {currentWeather.temperature}
              </p>
              <p className="weather__today__location">in {location}</p>
            </div>
          </div>
          <p className="weather__today__type">{currentWeather.description}</p>
          {/* <p className="weather__description">{currentWeather.description}</p> */}
        </div>
        <Forecasts
          forecasts={forecasts}
          weatherIcons={weatherIcons}
          weatherTranslator={weatherTranslator}
        />
      </div>
    );
  }
  return (
    <div className="weather">
      <img
        className="weather__loading"
        src="img/weather-loading.gif"
        alt="loading weather"
      />
    </div>
  );
};

export default Weather;
