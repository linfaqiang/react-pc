import React  from 'react';
import Reflux from 'reflux';
import ReactMixin from 'react-mixin';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import TableView from '../core/components/TableList/TableView.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Buttons from './buttons.js';
import store from './store';

module.exports = React.createClass({

	getInitialState: function() {
		return store.data;
	},

	componentWillUnmount() {},


	componentDidMount: function(param) {
		this.getData(this.state.queryParam);
	},
	getData(param) {
		var self = this;

		var url = store.data.tableData.url;
		var params = this.state.queryParam;

		self.refs.salesplanList.beginLoad(params.pageNo);
		AjaxRequest.get(url, params, function(data) {
			var tmp = data;

			if(data.data){
				var list = data.data;

				for(var i=0; i<list.length; i++){
					/*list[i].finishedAmount = toThousands((list[i].finishedAmount * 0.0001).toFixed(4));
					list[i].targetAmount= toThousands(list[i].targetAmount);*/
					if(list[i].finishedAmount>0){
						list[i].finishedAmount = (list[i].finishedAmount * 0.0001).toFixed(4);
					}
				}

				tmp.data = list;
			}
			self.refs.salesplanList.setPagerData(tmp);
		})
	},
	render: function() {

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
										<TableView ref="salesplanList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>
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