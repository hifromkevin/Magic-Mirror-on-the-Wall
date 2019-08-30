import React from 'react';

import Forecasts from './Forecasts.jsx';

const Weather = ({ currentWeather, location, forecasts, weatherIcons, days, weatherTranslator, weatherBool }) => {
	if (weatherBool) {
		return (
			<div className="weather">
				<p className="weather__temperature">{currentWeather.temperature}</p>
				<img 
					src={weatherIcons[weatherTranslator( currentWeather.weather, (new Date(currentWeather.time * 1000).getHours()) )]} 
					alt={currentWeather.weather} 
					className="weather__icon" 
				/>
				<p className="weather__location">in {location}</p>			
				<p className="weather__type">{currentWeather.weather}</p>
				<p className="weather__description">{currentWeather.description}</p>
				<Forecasts 
					forecasts={forecasts} 
					weatherIcons={weatherIcons}
					weatherTranslator={weatherTranslator}
					days={days} 
				/>
			</div>
		)
	}
		return (<div className="weather">WAITING FOR WEATHER</div>);
	}

export default Weather;