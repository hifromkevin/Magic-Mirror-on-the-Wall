import 'babel-polyfill'; // required for `async` keyword

import React, { Component } from 'react';

import DateAndTime from './DateAndTime.jsx';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';
import WelcomeText from './WelcomeText.jsx';

import config from '../config'
import { weatherTranslator, dadJokeCall, newsCall, weatherCall } from '../lib';

let backoff = 1000;

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			days:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

			forecasts: [],
			weatherIcons: {
				clear: 'img/sun.png',
				partlyCloudy: 'img/partly-cloudy.png',
				rain: 'img/rain.png',
				cloudy: 'img/cloudy.png',
				snow: 'img/snow.png',
				thunderstorm: 'img/thunderstorms.png',
				wind: 'img/wind.png',
				fog: 'img/fog.png',
				sunrise: '',
				clearNight: 'img/clear-night.png',
				cloudyNight: 'img/cloudy-night.png',
				sleet: '',
				hail: ''
			},
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
    let weatherData = await weatherCall();
    console.log('!!!', weatherData)
			this.setState({
				currentWeather: {
					weather: weatherData[2].currently.summary,
					temperature: Math.round(weatherData[2].currently.temperature),
					description: weatherData[2].hourly.summary, 
					time: weatherData[2].currently.time
				},
				location: `${weatherData[0]}, ${weatherData[1]}`,
				forecasts: weatherData[2].daily.data.slice(1),
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
						weatherIcons = {this.state.weatherIcons}
						days = {this.state.days}
						forecasts = {this.state.forecasts}
						weatherBool = {this.state.weatherBool}
					/>
					<DateAndTime 
						months = {this.state.months}
						days = {this.state.days}
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