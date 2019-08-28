import React, { Component } from 'react';

import DateAndTime from './DateAndTime.jsx';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';
import WelcomeText from './WelcomeText.jsx';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			weatherToday: {
					weather: 'Rain',
					location: 'Concord, CA',
					high: '102',
					low: '82',
					description: 'Today is a good day to go jump in a lake!'
			},
			forecasts: [
				{
					day: 'Monday',
					weather: 'Sunny',
					high: '98',
					low: '72'
				},
				{
					day: 'Tuesday',
					weather: 'Windy',
					high: '62',
					low: '48'
				},
				{
					day: 'Wednesday',
					weather: 'Cloudy',
					high: '98',
					low: '72'
				},
				{
					day: 'Thursday',
					weather: 'Thunderstorm',
					high: '62',
					low: '48'
				},
			],
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
			welcome: [
				'I am mirror',
				'Oh heyyyyy',
				'Hey HEY hey'
			],
			weatherIcons: {
				Sunny: 'img/sun.png',
				Rain: 'img/rain.png',
				Cloudy: 'img/cloudy.png',
				Snow: 'img/snow.png',
				Thunderstorm: 'img/thunderstorms.png',
				Windy: 'img/wind.png',
				Fog: '',
				Sleet: '',
				Hail: ''
			},
			dadJoke: 'A guy walked into a bar. He said "ouch".'
		}

		this.dadJokeAPI = this.dadJokeAPI.bind(this);
	}

	UNSAFE_componentWillMount() {
		this.dadJokeAPI();
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
	
	render() {
		return (
			<div className="main">
				<div className="top">
					<Weather 
						weatherToday = {this.state.weatherToday}
						forecasts = {this.state.forecasts} 
						weatherIcons = {this.state.weatherIcons}
					/>
					<DateAndTime />
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