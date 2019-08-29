import React from 'react';

const SingleForecast = ({ forecast, weatherIcons, weatherTranslator, days }) => (
		<div className="singleForecast">
			<p className="singleForecast__date">{days[new Date(forecast.time * 1000).getDay()]}</p>
			<img 
				src={weatherIcons[weatherTranslator(forecast.summary)]} 
				alt={forecast.summary} 
				className="singleForecast__icon" 
			/>
			<p className="singleForecast__temperature">
				<span className="singleForecast__low">{Math.round(forecast.temperatureLow)}</span> / <span className="singleForecast__high">{Math.round(forecast.temperatureHigh)}</span>
			</p>
		</div>
)

export default SingleForecast;