import 'babel-polyfill'; // required for `async` keyword

import React, { Component } from 'react';

import DateAndTime from './DateAndTime.jsx';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';
import WelcomeText from './WelcomeText.jsx';

import config from '../config';
import { weatherTranslator, dadJokeCall, newsCall, weatherCall, weatherIcons, months, days } from '../lib';

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

	UNSAFE_componentDidMount() {
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
		let jokeData = await dadJokeCall();

		this.setState({
			dadJoke: jokeData.joke
		});
	}

	newsAPI = async () => {
		let newsData = await newsCall();
		this.setState({
			news: newsData.articles.slice(0,6),
			newsBool: true
		});
	}

	getWeather = async () => {
    let [city, state, weatherData] = await weatherCall();
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
						weatherTranslator={weatherTranslator}
						weatherIcons = {weatherIcons}
						days = {days}
						forecasts = {this.state.forecasts}
						weatherBool = {this.state.weatherBool}
					/>
					<DateAndTime 
						months = {months}
						days = {days}
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
	}
} 