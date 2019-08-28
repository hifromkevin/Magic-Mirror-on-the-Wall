import React from 'react';

import Forecasts from './Forecasts.jsx';

const Weather = ({ weatherToday, forecasts, weatherIcons }) => (
		<div className="weather">
			<p className="weather__temperature">{weatherToday.tempurature}</p>
			<img 
				src={weatherIcons[weatherToday.weather]} 
				alt={weatherToday.weather} 
				className="weather__icon" 
			/>
			<p className="weather__location">in {weatherToday.location}</p>			
			<p className="weather__type">{weatherToday.weather}</p>
			<p className="weather__description">{weatherToday.description}</p>

			<Forecasts forecasts={forecasts} weatherIcons={weatherIcons} />
		</div>
)

export default Weather;