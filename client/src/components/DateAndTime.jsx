import React, { useState, useEffect } from 'react';

function DateAndTime({ months, days }) {
	const [currentDate, setCurrentDate] = useState(new Date());

	const getHour = (n) => {
		if (n > 12) {
			n = n - 12;
		} else if (n === 0) {
			n = 12;
		} 

		return n;
	};

	const lessThanTen = (n) => {
		return (n < 10) ? ('0' + n) : n;
	}

	const getTime = () => {
		let second = lessThanTen(currentDate.getSeconds());
		let minute = lessThanTen(currentDate.getMinutes());
		let hour = getHour(currentDate.getHours());

		let timeOfDay = (currentDate.getHours() < 12) ? 'AM' : 'PM';

		return `${hour}:${minute}:${second} ${timeOfDay}`;
	};

	useEffect(() => {
		setInterval( () => setCurrentDate(new Date()), 1000 );
	});
 


	return (
		<div className="dateAndTime">
			{console.log()}
			<p className="dateAndTime__time">{getTime()}</p>
			<p className="dateAndTime__date">{days[currentDate.getDay()]}<br /> {months[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}</p>
		</div>
	);
};

export default DateAndTime;