import React from 'react';

const WelcomeText = ({ welcome, random, dadJoke }) => (
	<div className="welcomeText">
		<p className="welcomeText__text">{dadJoke}</p>
	</div>
)

export default WelcomeText;