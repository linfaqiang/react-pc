import React, { Component } from 'react';
import {Link} from 'react-router';
import TableView from '../core/components/TableList/TableView.js';
import { render } from 'react-dom';

import Reflux from 'reflux'
import ReactMixin from 'react-mixin'
import CurrentPosition from '../core/components/layout/CurrentPosition'
import AjaxRequest from '../core/common/ajaxRequest.js';
import Buttons from './buttons.js';
import store from './store'
//import actions from './actions'

module.exports = React.createClass({

	getInitialState:function(){
		return store.data;
	},

	componentWillUnmount () {
	},


	componentDidMount:function(param){
		this.getData(this.state.queryParam);
	},

	getData(param) {
		var self = this;
		var index = this.state.listType.index;
		var url = CONFIG.APIS.competitor_list_url[index];
		var params = this.state.queryParam;

		self.refs.competitorList.beginLoad(params.pageNo);
		AjaxRequest.get(url, params, function(body){
			if(body.code == 200 || body.code == '200'){
				self.refs.competitorList.setPagerData(body);
			}
		});
	},

	render:function(){

		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<Buttons ref="buttons" getData={this.getData}></Buttons>

								<div className="tab-content tabs-flat">
									<div id="visits" className="tab-pane animated fadeInUp active">
										<TableView ref="competitorList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>
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