import React, { Component } from 'react';

import DateAndTime from './DateAndTime.jsx';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';
import WelcomeText from './WelcomeText.jsx';

import config from '../config'
// import { hardcodeCoords } from '../lib'


export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			days:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			currentWeather: {
					weather: 'Fog',
					location: 'Concord, CA',
					temperature: '102',
					description: 'Today is a good day to go jump in a lake!'
			},
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
			headlines: [
				{
					title: 'Corduroy Pillows', 
					author: 'James Brown'
				},
				{
					title: 'Drawing on Your Face With Sharpies', 
					author: 'Bob Ross'
				}
			],
			dadJoke: ''
		}

		this.dadJokeAPI = this.dadJokeAPI.bind(this);
		this.hardcodeCoords = this.hardcodeCoords.bind(this);
		this.getWeather = this.getWeather.bind(this);
		this.weatherTranslator = this.weatherTranslator.bind(this);
	}

	UNSAFE_componentWillMount() {
		this.dadJokeAPI();
		this.hardcodeCoords();
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

	hardcodeCoords() {
		let lat = 38.0296;
		let lon = -121.9799;
		let a = 37.7749;
		let b = 122.4194;
		this.getWeather(a,b);
	}

	getWeather(lat,lon) {
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
					forecasts: data.daily.data
				})
			})
			.catch(err => console.log(err));
	}

	weatherTranslator(text, time) {
		let icon;

		text = text.toLowerCase();

	  if (text.includes('partly')) {
			if (time >= 0 && (time <= 5 || time >= 19)) {
				icon = 'cloudyNight';
			} else {
				icon = 'partlyCloudy';	
			}	
		} else if (text.includes('cloudy') ) {
			if (time >= 0 && (time <= 5 || time >= 19)) {
				icon = 'cloudyNight';
			} else {
				icon = 'cloudy';	
			}
		} else if (text.includes('clear') || text.includes('sunny') ) {
			if (time >= 0 && (time <= 5 || time >= 19)) {
				icon = 'clearNight';
			} else {
				icon = 'clear';	
			}
	  } else if (text.includes('foggy') || text.includes('fog') || text.includes('overcast')) {
	  	icon = 'fog';
	  } else if (text.includes('rain') || text.includes('flurries') || text.includes('drizzle') ) {
	  	icon = 'rain';
	  } else if (text.includes('snow')) {
	  	icon = 'snow';
	  } else if (text.includes('windy')) {
	  	icon = 'wind';
	  } else if (text.includes('thunder') || text.includes('lightning')) {
	  	icon = 'thunderstorms';
	  }


	  return icon;
	}

	render() {
		return (
			<div className="main">
				<div className="top">
					<Weather 
						currentWeather = {this.state.currentWeather}
						forecasts = {this.state.forecasts} 
						weatherTranslator={this.weatherTranslator}
						weatherIcons = {this.state.weatherIcons}
						days = {this.state.days}
						forecasts = {this.state.forecasts}
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
						headlines = {this.state.headlines} 
					/>
				</div>
			</div>
		)
	}
} 