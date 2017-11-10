import React, { Component } from 'react';

module.exports = React.createClass({

	getInitialState:function(){ 
		return {}
			
	},


	
	componentDidMount:function(){

	},
	
	render:function(){

		return (
		<div>
			{this.props.children}
		</div>
		)
	}
});