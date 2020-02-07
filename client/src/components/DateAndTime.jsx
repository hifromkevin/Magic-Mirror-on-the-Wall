import React, { useState, useEffect } from 'react';

import { getTime } from '../lib';

function DateAndTime({ months, days }) {
	console.log(useState(new Date()))
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		setInterval( () => setCurrentDate(new Date()), 1000 );
	});
 
	return (
		<div className="dateAndTime">
			<p className="dateAndTime__time">{getTime(currentDate)}</p>
			<p className="dateAndTime__date">{days[currentDate.getDay()]}<br /> {months[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}</p>
		</div>
	);
};

export default DateAndTime;