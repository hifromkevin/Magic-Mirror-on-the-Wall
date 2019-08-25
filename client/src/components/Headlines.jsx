import React from 'react';
import SingleHeadline from './SingleHeadline.jsx';

const Headlines = ({ headlines }) => (
	<div className="headlines">
		<h1 className="headlines__title">Headlines</h1>
		{headlines.map((headline, i) => <SingleHeadline headline={headline} key={i} />)}
	</div>
)

export default Headlines;