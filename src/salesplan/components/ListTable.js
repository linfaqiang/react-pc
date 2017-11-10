import React from 'react';
import {
	Form,
	DatePicker,
	InputNumber
} from 'antd';

import store from '../add-store'

var ListTr = React.createClass({
	getInitialState: function() {
		return store.data;
	},
	handleChange: function(val) {
		let lists = this.state.info.lists;
		lists[this.props.index].targetAmount = val;

		store.data.info.lists = lists
		this.setState({
			info: store.data.info
		});
	},
	render: function() {
		var style_form_group = {
			verticalAlign: "middle",
			width: "100%"
		};

		var lists = this.props.tableData.tr;
		var tableName = this.props.tableData.tableName;
		var detailUrl = '#/' + tableName + '/add/' + this.props.list.id;
		if (!Array.isArray(lists)) throw new Error('this.props.lists必须是数组');

		var tds = lists.map(function(qst, key) {

			var arrs = qst.split('.'),
				val;

			if (arrs.length == 2) {
				var ar1 = arrs[0],
					ar2 = arrs[1];
				val = this.props.list[ar1];
				if (typeof val == 'object') {
					val = val[ar2];
				}
			} else if (arrs.length == 1) {
				val = this.props.list[qst];
			}

			if (key == 0) {
				return <td key={key}>{val}</td>;
			} else {
				return (
					<td key={key}>
						<InputNumber style={style_form_group} size="large" min={0} max={9999999} step={0.01} onChange={this.handleChange}/>
				    </td>
				)
			}
		}.bind(this));

		return (
			<tr>
				{tds}
			</tr>
		)
	}
});

var ListThead = React.createClass({

	render: function() {
		var lists = this.props.tableData.th;

		if (!Array.isArray(lists)) throw new Error('this.props.lists必须是数组');
		var ths = lists.map(function(qst, key) {
			return <th key={key} width={qst.width}>
				{qst.name}
			</th>
		}.bind(this));

		return (
			<tr role="row">
				{ths}
			</tr>
		)
	}
});


module.exports = React.createClass({

	render: function() {

		var lists = this.props.lists;
		if (!Array.isArray(lists)) throw new Error('this.props.lists必须是数组');
		var ListTrs = lists.map(function(qst, key) {
			return <ListTr key={key} index={key} list= {qst} tableData={this.props.tableData}/>
		}.bind(this));

		return (
			<table className="table table-striped table-hover table-bordered dataTable no-footer" id="editabledatatable" aria-describedby="editabledatatable_info">
				<thead>
				  <ListThead tableData={this.props.tableData}/>
				</thead>

				<tbody>
				    {ListTrs}
				</tbody>
			</table>
		)
	}
})