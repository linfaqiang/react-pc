import React from 'react';
import TableView from '../core/components/TableList/TableView.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import Constants from '../core/common/constants.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Buttons from './buttons.js';
import store from './store';

module.exports = React.createClass({

	getInitialState:function(){
		return store.data;
	},

	componentWillUnmount () {
		this.listen();
	},


	componentDidMount:function(param){
		this.getData(this.state.queryParam);
		$('#createdOnStartAndEnd').daterangepicker({format:"YYYY-MM-DD",opens:"left",separator:" / "});
	},
	listen:function(){
				var self=this;
			self.state.listType=Constants.marketingListTypesLang[0];
			self.state.queryParam={//初始化过滤参数
						"q": "",
						"pageNo":1,
						"pageSize":10,
						"status":"",
						"startStartTime":"",
						"endStartTime":""

				}
	},
	getData(param) {
		var self = this;
		var index = self.state.listType.index;
		var url = CONFIG.APIS.marketing_list_url[index];
		var params = self.state.queryParam;

		self.refs.marketingList.beginLoad(params.pageNo);
		AjaxRequest.get(url, params, function(data){
			self.refs.marketingList.setPagerData(data);
		})
	},
	render:function(){
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<Buttons ref="buttons" getData={this.getData} deleteData={this.deleteData}></Buttons>

								<div className="tab-content tabs-flat">
									<div id="visits" className="tab-pane animated fadeInUp active">
										<TableView ref="marketingList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>


				{/*<Buttons ref="buttons" getData={this.getData} deleteData={this.deleteData}></Buttons>
				<TableView ref="marketingList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>
				 */}
			</div>
		)
	}
});