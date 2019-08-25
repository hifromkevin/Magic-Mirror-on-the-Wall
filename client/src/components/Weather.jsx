import React from 'react';

import Forecasts from './Forecasts.jsx';

const Weather = ({ weatherToday, forecasts }) => (
		<div className="weather">
			<p className="weather__temperature"><span className="weather__low">{weatherToday.low}</span> / <span className="weather__high">{weatherToday.high}</span></p>
			<img 
				src="img/sunny.png" 
				alt="sunny" 
				className="weather__icon" 
			/>
			<p className="weather__location">in {weatherToday.location}</p>			
			<p className="weather__type">{weatherToday.weather}</p>
			<p className="weather__description">{weatherToday.description}</p>
			
			<Forecasts forecasts={forecasts} />
		</div>
)

export default Weather;