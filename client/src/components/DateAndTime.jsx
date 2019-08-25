import React, { Component } from 'react';

export default class DateAndTime extends Component {
	constructor(props) {
		super(props);

		this.state = {
			months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			days:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		}
	}

	render() { 
		return (
			<div className="dateAndTime">
				<h1>Date and Time</h1>
			</div>
		);
	}
};