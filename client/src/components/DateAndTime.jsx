import React, { Component } from 'react';

export default class DateAndTime extends Component {
	constructor(props) {
		super(props);

		this.state = {
			months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			days:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		}

		this.realtimeDateAndTime = this.realtimeDateAndTime.bind(this);
		this.getTime = this.getTime.bind(this);
		this.getHour = this.getHour.bind(this);
		this.lessThanTen = this.lessThanTen.bind(this);
	}

	UNSAFE_componentWillMount() {
		this.realtimeDateAndTime();
	}

	realtimeDateAndTime() {
		let currentDate = new Date();

		this.setState({
			date: currentDate,
			seconds: this.lessThanTen(currentDate.getSeconds()),
			minutes: this.lessThanTen(currentDate.getMinutes()),
			hours: this.getHour(currentDate.getHours()), 
			day: currentDate.getDate(),
			dayOfTheWeek: this.state.days[currentDate.getDay()],
			month: this.state.months[currentDate.getMonth()],
			year: currentDate.getFullYear()
		});

		setTimeout(this.realtimeDateAndTime, 1000);
	}

	getTime() {
		let second = this.state.seconds;
		let minute = this.state.minutes;
		let hour = this.state.hours;

		let timeOfDay = (hour < 12) ? 'AM' : 'PM';

		return `${hour}:${minute}:${second} ${timeOfDay}`;
	}

	getHour(n) {
		if (n > 12) {
			n = n - 12;
		} else if (n === 0) {
			n = 12;
		} 

		return n;
	};

	lessThanTen(n) {
		return (n < 10) ? ('0' + n) : n;
	}

	render() { 
		return (
			<div className="dateAndTime">
				<p className="dateAndTime__time">{this.getTime()}</p>
				<p className="dateAndTime__date">{this.state.dayOfTheWeek}<br /> {this.state.month} {this.state.day}, {this.state.year}</p>
			</div>
		);
	}
};