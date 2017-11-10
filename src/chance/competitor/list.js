import React, {Component} from 'react';
import {APIS} from '../../core/common/config.js';
import ListTable from '../../core/components/TableList/ListTable.js';
import AjaxRequest from '../../core/common/ajaxRequest.js';

module.exports = React.createClass({

	getInitialState: function() {
		return {
			queryParam: {
				"pageNo": 1,
				"pageSize": 20,
			},
			tableData: {
				url: APIS.chance_product_rival,
				tableName: 'chance/competitor',
				th: [ //列表表头
					{
						name: '竞争对手',
						width: 200
					}, {
						name: '优势',
						width: 200
					}, {
						name: '劣势',
						width: 200
					}, {
						name: '操作',
						width: 100
					}
				],
				tr: ['competitorName', 'strengths', 'weaknesses','del'] //列表每列显示属性定义
			},
			lists:[]
		}
	},

	componentDidMount: function() {
		this.getData();
	},

	getData : function() {
		var self = this;
		var chanceId = self.props.params.chanceId;
		var id = self.props.params.id;//产品id

		AjaxRequest.get(self.state.tableData.url.replace("{id}",id)+'?chanceId='+chanceId, null, function(data) {
			if (data.code == 200 || data.code == '200') {
				self.setState({
					lists:data.data
				})
			}
		});
	},
	deleteClick:function(id){
		var self = this;
		bootbox.confirm("确认删除吗?", function (result) {
			if (result) {
				AjaxRequest.delete(APIS.chance_delete_product_rival.replace("{id}",id), null, function(data) {
					if (data.code == 200 || data.code == '200') {
						alert("删除成功！");
						self.getData();
					}
				});

			}
		});
	},


	render: function() {
		var chanceId = this.props.params.chanceId;
		var productId = this.props.params.id;
		return (
			<div>
				<div className="page-breadcrumbs">
					<ul className="breadcrumb">
						<li>
							<i className="fa fa-home"></i>
							<a href="javascript:void(0)">首页</a>
						</li>
						<li>
							<a href="javascript:void(0)">商机详情</a>
						</li>
						<li className="active">产品竞争对手</li>
					</ul>
				</div>
				<div className="page-body">
					<div className="widget lists">
						<div className="widget-body">
							<div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper form-inline no-footer">
								<div style={{marginBottom:8 + 'px'}}>
									<div className="DTTT btn-group" style={{right:0+'px'}}>
										<a className="btn btn-default DTTT_button_copy" href={`#/chance/competitor/0?chanceId=${chanceId}&productId=${productId}`}>
											<i className="fa fa-plus"></i>
											<span>添加 </span>
										</a>
									</div>
									<div style={{height: 32+"px"}}>
										<a className="btn btn-default DTTT_button_copy" href={`#/chance/${chanceId}?tab=product-quote`}>
											<i className="fa fa-mail-reply"></i>
											<span>返回 </span>
										</a>
									</div>
								</div>

								<ListTable lists={this.state.lists} tableData={this.state.tableData} deleteClick={this.deleteClick}/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});