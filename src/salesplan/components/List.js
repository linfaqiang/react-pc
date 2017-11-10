import React from 'react'
import ListTable from './ListTable.js';
import store from '../add-store'

module.exports = React.createClass({

	getInitialState: function() {
		return store.data;
	},

	componentDidMount: function() {

	},
	setData: function(list) {
		store.data.info.lists = list;
		this.setState({
			info: store.data.info
		})
	},

	render: function() {
		return (
			<ListTable lists={this.state.info.lists} tableData={this.props.tableData}/>
		)
	}
});