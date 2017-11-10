import React from 'react';
import CurrentPosition from '../core/components/layout/CurrentPosition'
import TableView from '../core/components/TableList/TableView.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Buttons from './buttons.js';
import store from './store'

module.exports = React.createClass({

	getInitialState: function() {
		return store.data;
	},

	componentWillUnmount() {},


	componentDidMount: function() {
		this.getData();
	},
	getData(args) {
		var self = this;

		var url = store.data.tableData.url;
		var params = this.state.queryParam;
		
		for(var key in args){
			params[key] = args[key];
		}
		self.refs.linkmanList.beginLoad(params.pageNo);
		AjaxRequest.get(url, params, function(data) {
			self.refs.linkmanList.setPagerData(data);
		})
	},
	render: function() {
		return (
			<div>
				<CurrentPosition name="联系人"></CurrentPosition>
				<div className="page-body">
					<div className="widget lists">
						<div className="widget-body">
							<div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper form-inline no-footer">
								<Buttons ref="buttons" getData={this.getData}></Buttons>
								{/*<List ref="linkmanList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>
								 */}
								<TableView ref="linkmanList" getData={this.getData} tableData={this.state.tableData}></TableView>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});