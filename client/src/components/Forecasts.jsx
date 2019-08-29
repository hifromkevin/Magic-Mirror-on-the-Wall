import React from 'react';
import SingleForecast from './SingleForecast.jsx';

const Forecasts = ({ forecasts, weatherIcons, weatherTranslator, days }) => (
	<div className="forecasts">
		<h1 className="forecasts__title">Forecast</h1>
		{forecasts && forecasts.map((forecast, i) => <SingleForecast forecast={forecast} weatherIcons={weatherIcons} weatherTranslator={weatherTranslator} days={days} key={i} />)}
	</div>
)

export default Forecasts;