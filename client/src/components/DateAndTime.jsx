import React, { useState, useEffect } from 'react';

import { getTime } from '../lib';

const DateAndTime = (props) => {
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		setInterval(() => setCurrentDate(new Date()), 1000);
	});

	return (
		<div className="dateAndTime">
			<p className="dateAndTime__time">{getTime(currentDate)}</p>
			<p className="dateAndTime__date">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getDate()}, {currentDate.getFullYear()}</p>
			<p className="dateAndTime__date">{currentDate.toLocaleString("en-US", { weekday: 'long' })}</p>
		</div>
	);
};

export default DateAndTime;