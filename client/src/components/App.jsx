import React, { Component } from 'react';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}
	
	render() {
		return (
			<div className="main">
				<div className="top">
					<p>Top</p>
					<div className="clear"></div>
				</div>
				<div className="middle">
					<p>Middle</p>
					<div className="clear"></div>
				</div>
				<div className="bottom">
					<p>Bottom</p>
					<div className="clear"></div>
				</div>
			</div>
		)
	}
} 