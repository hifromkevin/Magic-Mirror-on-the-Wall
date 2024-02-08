import React from 'react';

const SingleHeadline = ({ headline }) => (
	<div className="singleHeadline">
		<img src="img/news.png" alt={headline.title} className="singleHeadline__icon" />
		<span><span className="singleHeadline__title">{headline.title}</span><span className="singleHeadline__author">{headline.author ? ', By ' : ''}{headline.author}</span></span>
	</div>
);

export default SingleHeadline;