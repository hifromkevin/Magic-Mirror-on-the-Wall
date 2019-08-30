import React from 'react';
import SingleHeadline from './SingleHeadline.jsx';

const Headlines = ({ news }) => (
	<div className="headlines">
		<h1 className="headlines__title">Headlines</h1>
		{news.map((headline, i) => <SingleHeadline headline={headline} key={i} />)}
	</div>
)

export default Headlines;