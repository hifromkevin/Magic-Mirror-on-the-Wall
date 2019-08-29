import React from 'react';

import Forecasts from './Forecasts.jsx';

const Weather = ({ currentWeather, forecasts, weatherIcons }) => (
		<div className="weather">
			<p className="weather__temperature">{currentWeather.temperature}</p>
			<img 
				src={weatherIcons[currentWeather.weather]} 
				alt={currentWeather.weather} 
				className="weather__icon" 
			/>
			<p className="weather__location">in {currentWeather.location}</p>			
			<p className="weather__type">{currentWeather.weather}</p>
			<p className="weather__description">{currentWeather.description}</p>

			<Forecasts forecasts={forecasts} weatherIcons={weatherIcons} />
		</div>
)

export default Weather;