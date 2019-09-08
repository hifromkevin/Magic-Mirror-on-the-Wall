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

	dadJokeAPI() {
		fetch('https://icanhazdadjoke.com', { headers: { 'Accept': 'application/json' }})
			.then(res => res.text())
			.then(data => data)
			.then(body => {
				let lol = JSON.parse(body);
				this.setState({
					dadJoke: lol.joke
				})
			})
			.catch(err => 'uh oh...')
	}

	newsAPI() {
		fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${config.NewsAPI}`)
			.then(res => res.json())
			.then(data => {
				this.setState({
					news: data.articles.slice(0,6),
					newsBool: true
				})
			})
			.catch(err => 'uh oh...')
	}

	getWeather() {
		fetch('https://json.geoiplookup.io/')
			.then(res => res.json())
			.then(data => {
				const { longitude, latitude } = data;
				fetch(`https://api.darksky.net/forecast/${config.DarkSkyAPI}/${latitude},${longitude}`, )
					.then(res => {
						if (res.ok === false) {
							throw res;
						} else {
							backoff = 1000;
							return res.json();
						}
					})
					.then(data => {
						this.setState({
							currentWeather: {
								weather: data.currently.summary,
								temperature: Math.round(data.currently.temperature),
								description: data.hourly.summary, 
								time: data.currently.time	
							},
							forecasts: data.daily.data.slice(1),
							weatherBool: true
						})
					})
					.catch(err => {
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
					});
			});
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