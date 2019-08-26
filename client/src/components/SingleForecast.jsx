import React from 'react';

const SingleForecast = ({ forecast, weatherIcons }) => (
		<div className="singleForecast">
			<p className="singleForecast__date">{forecast.day}</p>
			<img 
				src={weatherIcons[forecast.weather]} 
				alt={forecast.weather} 
				className="singleForecast__icon" 
			/>
			<p className="singleForecast__temperature">
				<span className="singleForecast__low">{forecast.low}</span> / <span className="singleForecast__high">{forecast.high}</span>
			</p>
		</div>
)

export default SingleForecast;