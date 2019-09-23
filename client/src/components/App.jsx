import 'babel-polyfill'; // required for `async` keyword

import React, { Component } from 'react';

import DateAndTime from './DateAndTime.jsx';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';
import WelcomeText from './WelcomeText.jsx';

import config from '../config'
import { weatherTranslator } from '../lib'

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

		this.dadJokeAPI = this.dadJokeAPI.bind(this);
		this.newsAPI = this.newsAPI.bind(this);
		this.getWeather = this.getWeather.bind(this);
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
		try {
			const jokeResult = await fetch('https://icanhazdadjoke.com', { headers: { 'Accept': 'application/json' }});
			const jokeText = await	jokeResult.text();
			const lol = JSON.parse(jokeText);
			this.setState({
				dadJoke: lol.joke,
			})
		} catch (err) {
			console.error('failed to get dad joke', err);
		}
	}

	newsAPI = async () => {
		try {
			const newsData =	this.getJsonFromUrl(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${config.NewsAPI}`);
			this.setState({
				news: newsData.articles.slice(0,6),
				newsBool: true
			});
	  } catch (err) {
			console.error('call to newsapi.org failed', err);
		}
	}

	getWeather = async () => {
		try {
			const { longitude, latitude } = await this.getJsonFromUrl(('https://json.geoiplookup.io/'));
			const weatherData = await this.getJsonFromUrl(`https://api.darksky.net/forecast/${config.DarkSkyAPI}/${latitude},${longitude}`);
			this.setState({
				currentWeather: {
					weather: weatherData.currently.summary,
					temperature: Math.round(weatherData.currently.temperature),
					description: weatherData.hourly.summary, 
					time: weatherData.currently.time	
				},
				forecasts: weatherData.daily.data.slice(1),
				weatherBool: true
			})
		} catch (err) {
			console.error('something went wrong', err);
			if (err.status === 400 && backoff < 10000) {
				console.error('error details:', err);
				console.error('bad request, trying again in', backoff, 'ms');
				setTimeout(this.getWeather, backoff)
				backoff += 1000;
			}
			if (err.status === 403) {
				console.error('call failed, check request and/or API key', err);
			}
		}
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