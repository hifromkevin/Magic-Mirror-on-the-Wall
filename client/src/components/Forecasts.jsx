import React from "react";
import SingleForecast from "./SingleForecast.jsx";

const Forecasts = ({ forecasts, weatherIcons, weatherTranslator }) => (
  <div className='forecasts'>
    <h1 className='forecasts__title'>Forecast</h1>
    <div className='forecasts__list'>
      {forecasts &&
        forecasts.map((forecast, i) => {
          return (
            <SingleForecast
              date={`${new Date(forecast.Date)} `}
              forecast={forecast}
              weatherIcons={weatherIcons}
              weatherTranslator={weatherTranslator}
              key={i}
            />
          );
        })}
    </div>
  </div>
);

export default Forecasts;
