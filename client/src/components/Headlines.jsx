import React from 'react';
import SingleHeadline from './SingleHeadline.jsx';

const Headlines = ({ news, newsBool }) => {
	if (newsBool) {
		return (
			<div className="headlines">
				<h1 className="headlines__title">Headlines</h1>
				{news.map((headline, i) => <SingleHeadline headline={headline} key={i} />)}
			</div>
		)
	}
	return (<div className="headlines">WAITING FOR HEADLINES</div>)
}

export default Headlines;