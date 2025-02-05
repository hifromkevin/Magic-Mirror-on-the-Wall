import React from 'react';

const SingleHeadline = ({ headline: { title, author } }) => (
	<div className="singleHeadline">
		<img src="img/news.png" alt={title} className="singleHeadline__icon" />
		<span><span className="singleHeadline__title">{title}</span><span className="singleHeadline__author">{author ? ', By ' : ''}{author}</span></span>
	</div>
);

export default SingleHeadline;