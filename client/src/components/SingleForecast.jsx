import React from 'react';

const SingleForecast = ({ forecast }) => (
		<div className="singleForecast">
			<p className="singleForecast__date">{forecast.day}</p>
			<p className="singleForecast__temperature">
				<span className="singleForecast__low">{forecast.low}</span> / <span className="singleForecast__high">{forecast.high}</span>
			</p>
			<p className="singleForecast__weather">{forecast.weather}</p>
		</div>
)

export default SingleForecast;