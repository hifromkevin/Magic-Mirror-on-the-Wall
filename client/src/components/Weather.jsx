import React from "react";

import Forecasts from "./Forecasts.jsx";

const Weather = ({
  currentWeather,
  location,
  forecasts,
  weatherIcons,
  days,
  weatherTranslator,
  weatherBool,
}) => {
  if (weatherBool) {
    return (
      <div className='weather'>
        <p className='weather__temperature'>{currentWeather.temperature}</p>
        <img
          src={weatherIcons[weatherTranslator(currentWeather.weatherCode)]}
          alt={currentWeather.description}
          className='weather__icon'
        />
        <p className='weather__location'>in {location}</p>
        <p className='weather__type'>{currentWeather.description}</p>
        {/* <p className="weather__description">{currentWeather.description}</p> */}
        <Forecasts
          forecasts={forecasts}
          weatherIcons={weatherIcons}
          weatherTranslator={weatherTranslator}
        />
      </div>
    );
  }
  return (
    <div className='weather'>
      <img
        className='weather__loading'
        src='img/weather-loading.gif'
        alt='loading weather'
      />
    </div>
  );
};

export default Weather;
