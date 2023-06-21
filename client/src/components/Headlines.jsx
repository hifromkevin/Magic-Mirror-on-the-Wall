import React from 'react';
import SingleHeadline from './SingleHeadline.jsx';

const Headlines = ({ news, newsBool }) => {
	if (!newsBool) return (<div className="headlines">WAITING FOR HEADLINES</div>)

	return (
		<div className="headlines">
			<h1 className="headlines__title">Headlines</h1>
			<div className="headlines__list">
				{news.map((headline, i) => <SingleHeadline headline={headline} key={i} />)}
			</div>
		</div>
	)
}

export default Headlines;