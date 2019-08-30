import React, { Component } from 'react';

import DateAndTime from './DateAndTime.jsx';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';
import WelcomeText from './WelcomeText.jsx';

import config from '../config'
import { weatherTranslator } from '../lib'


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
			dadJoke: ''
		}

		this.dadJokeAPI = this.dadJokeAPI.bind(this);
		this.newsAPI = this.newsAPI.bind(this);
		this.hardcodeCoords = this.hardcodeCoords.bind(this);
		this.getWeather = this.getWeather.bind(this);
		this.getLocation = this.getLocation.bind(this);
		this.showPosition = this.showPosition.bind(this);
	}

	UNSAFE_componentWillMount() {
		this.dadJokeAPI();
		this.newsAPI();
		this.hardcodeCoords();
		this.getLocation();
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
					news: data.articles.slice(0,6)
				})
			})
			.catch(err => 'uh oh...')
	}

	hardcodeCoords() {
		let lat = 38.0296;
		let lon = -121.9799;
		let a = 37.7912;
		let b = 122.1919;
		this.getWeather(a,b);
	}

	getLocation() {
	  if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(this.showPosition);
	  } else { 
	    console.log("Geolocation is not supported by this browser.");
	  }
	}
	showPosition(position) {
	  console.log('?¿', position.coords.latitude,position.coords.longitude);
	}

	getWeather(lat,lon) {
		// data.daily.data[0] is today (but sometimes it's yesterday?), so I can get high, low, etc.
		fetch(`https://api.darksky.net/forecast/${config.DarkSkyAPI}/${lat},${lon}`)
			.then(res => res.json())
			.then(data => {
				this.setState({
					currentWeather: {
						weather: data.currently.summary,
						location: 'Concord, CA',
						temperature: Math.round(data.currently.temperature),
						description: data.hourly.summary, 
						time: data.currently.time	
					},
					forecasts: data.daily.data.slice(1)
				})
			})
			.catch(err => console.log(err));
	}


	render() {
		return (
			<div className="main">
				<div className="top">
					{this.state.currentWeather && <Weather 
						currentWeather = {this.state.currentWeather}
						forecasts = {this.state.forecasts} 
						weatherTranslator={weatherTranslator}
						weatherIcons = {this.state.weatherIcons}
						days = {this.state.days}
						forecasts = {this.state.forecasts}
					/>}
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
					{this.state.news && <Headlines 
						news = {this.state.news}
					/>}
				</div>
			</div>
		)
	}
} 