import React from 'react'

module.exports = React.createClass({

	getInitialState: function() {
		return {

		}
	},


	componentDidMount: function() {

	},

	render: function() {
		let lists = this.props.lists;

		let divs = lists.map(function(qst, key) {
			let className = `databox-left no-padding ${qst.color} pcicon-${qst.icon}`;
			return (
				<div key={key} className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
					<div className="databox databox-graded">
						<div className={className}></div>
						<div className="databox-right">
							<div className="databox-text slate-gray">{qst.name}</div>
							<div className="databox-text silver">{qst.value}</div>
						</div>
					</div>
				</div>
			)
		}.bind(this));

		return (
			<div className="row">
				{divs}
			</div>
		)
	}
});