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
					weather: 'Sunny',
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
					weather: 'Rainy',
					high: '62',
					low: '48'
				}
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
			]
		}

		this.randomNum = this.randomNum.bind(this);
	}

	randomNum(arr) {
		return Math.floor(Math.random() * Math.floor(arr.length));
	}
	
	render() {
		return (
			<div className="main">
				<div className="top">
					<Weather 
						weatherToday = {this.state.weatherToday}
						forecasts = {this.state.forecasts} 
					/>
					<DateAndTime />
					<div className="clear"></div>
				</div>
				<div className="middle">
					<WelcomeText welcome={this.state.welcome} />
					<div className="clear"></div>
				</div>
				<div className="bottom">
					<Headlines 
						headlines = {this.state.headlines} 
					/>
					<div className="clear"></div>
				</div>
			</div>
		)
	}
} 