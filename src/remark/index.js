import React, {
	Component
} from 'react';

module.exports = React.createClass({

	render: function() {

		return (
			<div>
			{this.props.children}
		</div>
		)
	}
});