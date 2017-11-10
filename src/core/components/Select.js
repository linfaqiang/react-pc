import React from 'react';


module.exports = React.createClass({
	getInitialState: function() {
		return {

		};
	},
	handleChange: function(e) {
		this.setState({
			value: e.target.value
		});

	},
	setValue: function(val){
		this.setState({
			value: val
		});
	},
	render: function() {

		var lists = this.props.list;

		if (!Array.isArray(lists)) throw new Error('this.props.lists必须是数组');

		var options = lists.map(function(item, key) {
			return <option key={key} value={item.id}>{item.text}</option>
		}.bind(this));

		return (
			<select className="form-control" name={this.props.name} id={this.props.id}
				value={this.state.value}
				placeholder={this.props.placeholder} 
				onChange={this.handleChange}
				data-bv-notempty="true"
				data-bv-notempty-message="必须选择一项" 
			>

				<option value="">--请选择--</option>
				{options}
			</select>
		)
	}
});