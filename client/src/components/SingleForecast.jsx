import React from 'react';

const SingleForecast = ({ date, forecast, weatherIcons, weatherTranslator }) => {
	date = date.split(' ');
	
	return (
		<div className="singleForecast">
			<p className="singleForecast__date">{`${date[1]}/${date[2]}`}</p>
			<img 
				src={weatherIcons[weatherTranslator(forecast.Day.Icon)]} 
				alt={forecast.Day.IconPhrase} 
				className="singleForecast__icon" 
			/>
			<p className="singleForecast__temperature">
				<span className="singleForecast__low">{forecast.Temperature.Minimum.Value}</span> / <span className="singleForecast__high">{forecast.Temperature.Maximum.Value}</span>
			</p>
		</div>
	);	
};

export default SingleForecast;