import React from 'react';

import Forecasts from './Forecasts.jsx';

const Weather = ({ weatherToday, forecasts }) => (
		<div className="weather">
			<h1>Weather</h1>
				<h2 className="weather__temperature">
					<span className="weather__low">{weatherToday.low}</span> / <span className="weather__high">{weatherToday.high}</span>
				</h2>
			<p>{weatherToday.weather}</p>
			<Forecasts forecasts={forecasts} />
		</div>
)

export default Weather;