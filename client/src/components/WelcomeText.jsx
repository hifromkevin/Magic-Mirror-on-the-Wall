import React from 'react';

const WelcomeText = ({ welcome, random }) => (
	<div className="welcomeText">
		<p className="welcomeText__text">{welcome[random(welcome)]}</p>
	</div>
)

export default WelcomeText;