import React from 'react';

const SingleHeadline = ({ headline }) => (
	<div className="singleHeadline">
		<img src="img/news.png" alt={headline.title} className="singleHeadline__icon" />
		<p><span className="singleHeadline__title">{headline.title}</span>, By <span className="singleHeadline__author">{headline.author}</span></p>
	</div>
);

export default SingleHeadline;