import React from 'react';
import CurrentPosition from '../core/components/layout/CurrentPosition'
import TableView from '../core/components/TableList/TableView.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import { hashHistory } from 'react-router';


module.exports = React.createClass({

	getInitialState: function() {
		var type = this.props.location.query.type;
		var typeId = this.props.location.query.typeId;
		var tabName = 'clue/'+this.props.params.id+'/linkman/'+this.props.params.linkmanId+'/remark';
		if(type == 'clue'){
			tabName = 'clue/'+this.props.params.id+'/remark';
		}
		return {
			type: type,
			typeId: typeId,
			title: '备注',//this.props.location.query.title,
			queryParam: {
				"pageNo": 1,
				"pageSize": 20
			},
			tableData: {
				url: CONFIG.APIS.myClue,
				tableName: tabName,
				th: [ //列表表头
					{
						name: '备注内容',
						width: 300
					}, {
						name: '创建人',
						width: 90
					}, {
						name: '创建时间',
						width: 60
					}, {
						name: '上次修改时间',
						width: 120
					}, {
						name: '上次修改人',
						width: 60
					}
				],
				tr: ['content', 'createdBy', 'createdOn', 'updatedOn', 'updatedBy'] //列表每列显示属性定义
			}

		}
	},
	componentDidMount: function(param) {
		this.getData();
	},

	//获取线索备注内容
	getData(args) {
		let self = this, url='';
		let type = self.state.type;
		let typeId = self.state.typeId;
		var params = args || self.state.queryParam;
		if(type == 'clue_linkman'){
			url = CONFIG.APIS.clue_linkmen_notes.replace('{id}', typeId)
		}else{
			url = [CONFIG.APIS.notes_add, type, typeId].join("/");
		}

		self.refs.remarkList.beginLoad(1);
		AjaxRequest.get(url, params, function(body) {
			self.refs.remarkList.setPagerData(body);
		});

	}, //end 线索备注内容	


	render: function() {
		let self = this;
		let type = self.state.type;
		let typeId = self.state.typeId;
		let title = self.state.title;
		let clueId = this.props.params.id;
		let linkmanId = this.props.params.linkmanId;

		function addBtn() {
			if(type == 'clue_linkman'){
				return (
					<a className="btn btn-default DTTT_button_copy" href={`#/clue/${clueId}/linkman/${linkmanId}/remark/addRemark/0?type=${type}&typeId=${typeId}`}>
						<i className="fa fa-plus"></i>备&nbsp;&nbsp;&nbsp;&nbsp;注
					</a>
				);
			}else if(type == 'clue'){
				return (
					<a className="btn btn-default DTTT_button_copy" href={`#/clue/${clueId}/remark/addRemark/0?type=${type}&typeId=${typeId}`}>
						<i className="fa fa-plus"></i>备&nbsp;&nbsp;&nbsp;&nbsp;注
					</a>
				);
			}
		}
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<ul className="nav nav-tabs myTab">
									<li>
										<a className="btnBack" onClick={()=>{hashHistory.go(-1)}}></a>
									</li>
									<li className="active">
										<a data-toggle="tab" href="">{title}</a>
									</li>
									<div className="DTTT btn-group">
										{addBtn()}
										{/*<a className="btn btn-default DTTT_button_copy" href={`#/remark/0?type=${type}&typeId=${typeId}`}>
											<i className="fa fa-plus"></i>
											<span>创建 </span>
										</a>*/}
									</div>
								</ul>

								<div className="tab-content tabs-flat">
									<div id="visits" className="tab-pane animated fadeInUp active">
										<TableView ref="remarkList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/*<Buttons ref="buttons" type={type} typeId={typeId}></Buttons>
				<TableView ref="remarkList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>*/}

			</div>
		)
	}
});