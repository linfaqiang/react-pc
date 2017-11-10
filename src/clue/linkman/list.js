import React, {
	Component
} from 'react';
import {
	render
} from 'react-dom';
import {
	Link,
	hashHistory
} from 'react-router';
import Reflux from 'reflux'
import ReactMixin from 'react-mixin'

import CurrentPosition from '../../core/components/layout/CurrentPosition'
import TableView from '../../core/components/TableList/TableView.js';

import Constants from '../../core/common/constants.js';
import AjaxRequest from '../../core/common/ajaxRequest.js';
import Buttons from './list-buttons.js';

import store from './store'
import actions from './actions'

module.exports = React.createClass({

	getInitialState: function() {
		var data = store.data;
		data.tableData.tableName = 'clue/'+this.props.params.id+'/linkman';

		return data;
	},

	componentWillUnmount() {},


	componentDidMount: function(param) {
		this.getData();
	},

	//获取线索联系人
	getData() {
		let self = this;
		let clueId = self.props.params.id;
		// let clueId = self.props.params.clueId;
		let url = [CONFIG.APIS.clue, clueId, 'linkman'].join("/");

		var params = this.state.queryParam;
		self.refs.linkmanList.beginLoad(params.pageNo);
		AjaxRequest.get(url, params, function(body) {
			self.refs.linkmanList.setPagerData(body);
		});

	}, //end 线索联系人	

	render: function() {
		//let clueId = this.props.params.clueId;
		let clueId = this.props.params.id;
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<ul className="nav nav-tabs myTab">
									<li>
										<a className="btnBack" href={`#/clue/${clueId}?tab=moreInfo`}></a>
									</li>
									<li className="active">
										<a data-toggle="tab" href="">联系人</a>
									</li>
									<div className="DTTT btn-group">
										<a className="btn btn-default DTTT_button_copy" href={`#/clue/${clueId}/linkman/add/0`}>
											<i className="fa fa-plus"></i>
											<span>创建 </span>
										</a>
									</div>
								</ul>

								<div className="tab-content tabs-flat">
									<div id="visits" className="tab-pane animated fadeInUp active">
										<TableView ref="linkmanList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});