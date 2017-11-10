import React from 'react'
import ListTable from './ListTable.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {
		}
	},
	

	componentDidMount:function(){

	},

	render:function(){
		return (
		<div>
			<ListTable lists={this.props.lists} tableData={this.props.tableData}/>
		</div>
		)
	}
});