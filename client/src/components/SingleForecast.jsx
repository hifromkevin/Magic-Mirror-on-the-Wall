import React from 'react';

const SingleForecast = ({ date, forecast, weatherIcons, weatherTranslator }) => (
		<div className="singleForecast">
			<p className="singleForecast__date">{`${date[1]}/${date[2]}`}</p>
			<img 
				src={weatherIcons[weatherTranslator(forecast.weather.icon)]} 
				alt={forecast.weather.description} 
				className="singleForecast__icon" 
			/>
			<p className="singleForecast__temperature">
				<span className="singleForecast__low">{Math.round((forecast.min_temp * (9/5)) + 32)}</span> / <span className="singleForecast__high">{Math.round((forecast.max_temp * (9/5)) + 32)}</span>
			</p>
		</div>
)

export default SingleForecast;