import 'babel-polyfill'; // required for `async` keyword
import React, { Component } from 'react';

import DateAndTime from './DateAndTime.jsx';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';
import WelcomeText from './WelcomeText.jsx';

import { apiCalls, weatherInfo, dateInfo } from '../lib';

export default class App extends Component {
	constructor(props) {
    super(props);

		this.state = {
			forecasts: [],
			dadJoke: '',
			weatherBool: false,
			newsBool: false
		}
	}

	UNSAFE_componentWillMount() {
		this.dadJokeAPI();
		this.newsAPI();
		this.getWeather();
	}

	getJsonFromUrl = async (url, options) => {
		const result = await fetch(url, options);
		if (result.ok === false) {
			throw result
		} else {
			return await result.json();
		}
	}

	dadJokeAPI = async () => {
		let jokeData = await apiCalls.joke();

		this.setState({
			dadJoke: jokeData.joke
		});
	}

	newsAPI = async () => {
		let newsData = await apiCalls.news();
		this.setState({
			news: newsData.articles.slice(0,6),
			newsBool: true
		});
	}

	getWeather = async () => {
    let [city, state, weatherData] = await apiCalls.weather();
			this.setState({
				currentWeather: {
					weather: weatherData.currently.summary,
					temperature: Math.round(weatherData.currently.temperature),
					description: weatherData.hourly.summary, 
					time: weatherData.currently.time
				},
				location: `${city}, ${state}`,
				forecasts: weatherData.daily.data.slice(1),
				weatherBool: true
			})
	}

	render() {
		return (
			<div className="main">
				<div className="top">
					<Weather 
						currentWeather = {this.state.currentWeather}
						location = {this.state.location}
						forecasts = {this.state.forecasts} 
						weatherTranslator={weatherInfo.weatherTranslator}
						weatherIcons = {weatherInfo.weatherIcons}
						days = {dateInfo.days}
						forecasts = {this.state.forecasts}
						weatherBool = {this.state.weatherBool}
					/>
					<DateAndTime 
						months = {dateInfo.months}
						days = {dateInfo.days}
					/>
				</div>
				<div className="middle">
					<WelcomeText 
						dadJoke={this.state.dadJoke}
					/>
				</div>
				<div className="bottom">
					<Headlines 
						news = {this.state.news}
						newsBool = {this.state.newsBool}
					/>
				</div>
			</div>
		)
	};
};