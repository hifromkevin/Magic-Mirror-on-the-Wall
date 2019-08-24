import React from 'react';

const SingleHeadline = ({ headline }) => (
			<p className="singleHeadline">{ headline.title }, By <em>{ headline.author }</em></p>
);

export default SingleHeadline;