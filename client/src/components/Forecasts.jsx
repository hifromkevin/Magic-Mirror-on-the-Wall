import React from 'react';
import SingleForecast from './SingleForecast.jsx';

const Forecasts = ({ forecasts }) => (
	<div className="forecasts">
		<h1 className="forecasts__title">Forecast</h1>
		{forecasts.map((forecast, i) => <SingleForecast forecast={forecast} key={i} />)}
	</div>
)

export default Forecasts;