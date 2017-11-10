import React from 'react';
import {hashHistory} from 'react-router';
import TableView from '../core/components/TableList/TableView.js';
import CurrentPosition from '../core/components/layout/CurrentPosition'
import Constants from '../core/common/constants.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Buttons from './buttons.js';
import store from './store'

module.exports = React.createClass({
	getInitialState:function(){
		var priceListTypesLang,
			permit = store.data.Permit;

		if(!permit.isLeader){
			priceListTypesLang = Constants.priceListTypesLang[1];
			store.data.listType = priceListTypesLang;
			store.data.hideMineStatus = false;
			store.data.hideApprovalStatus = true;
		}

		store.data.queryParam.chanceName = this.props.location.query.chanceName||'';
		
		return store.data;
		
	},

	componentWillUnmount () {
	},
	
	componentDidMount:function(param){
		this.getData();//全部报价
		$('#createdOnStartAndEnd').daterangepicker({format:"YYYY-MM-DD",opens:"left",separator:" / "});
	},

	getData() {
		if(!store.data.Permit.isLeader){
			this.getMine();//我的报价
		}else{
			var index = this.state.listType.index;
			if(index === 0){
				this.getAll();//全部报价
			}
			if(index === 1){
				this.getMine();//我的报价
			}
			if(index === 2){
				this.getApproval();//报价审批
			}
		}
	},

	//全部报价
	getAll:function(){
		var self = this;
		var url = CONFIG.APIS.price_list_url[6];
		var params = store.data.queryParam;
		url+='?pageNo='+params.pageNo+'&pageSize='+params.pageSize;
        var args= self.copyData(params);
        if(args.status===-1) args.status='';

		self.refs.priceList.beginLoad(args.pageNo);
		AjaxRequest.post(url, args, function(data){
			var tmp = data.data;
			data.data = tmp;
			self.refs.priceList.setPagerData(data);
		})
	},

	//我的报价列表
	getMine(){
		var self = this;
        var params = store.data.queryParam;
		var url = CONFIG.APIS.price_list_url[params.status+1];
		url+='?pageNo='+params.pageNo+'&pageSize='+params.pageSize;
        var args= self.copyData(params);
		if(args.status===-1) args.status='';

		self.refs.priceList.beginLoad(args.pageNo);
		AjaxRequest.post(url, args, function(data){
			var tmp = data.data;
			data.data = tmp;
			self.refs.priceList.setPagerData(data);
		});
	},
	//我的报价列表
	getApproval(){
		var self = this;
		var params = store.data.queryParam;
        var url = CONFIG.APIS.price_list_url[5];
        var args= self.copyData(params);
        if(args.status===-1) args.status='';

		self.refs.priceList.beginLoad(args.pageNo);
		AjaxRequest.get(url, args, function(data){
			var tmp = data.data;
			data.data = tmp;
			self.refs.priceList.setPagerData(data);
		})
	},

    copyData(src){
        var o = {};
        for(var key in src){
            o[key] = src[key];
        }
        return o;
    },
	goAdd: function(){
		var rPath = this.props.routes[1].path;
		var chanceId = this.props.params.chanceId;

		if(rPath == 'price'){
			hashHistory.push(`/price/addPrice/0`);
		}else if(rPath == 'chance'){
			hashHistory.push(`/chance/${chanceId}/price/addPrice/0`);
		}
	},

	render:function(){

		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<Buttons ref="buttons" getData={this.getData} goAdd={this.goAdd}></Buttons>
								<div className="tab-content tabs-flat">
									<div id="visits" className="tab-pane animated fadeInUp active">
										<TableView ref="priceList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>
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