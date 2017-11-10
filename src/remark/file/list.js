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
import Buttons from './buttons.js';


module.exports = React.createClass({

	getInitialState: function() {
		var type = this.props.location.query.type;
		var typeId = this.props.location.query.typeId;
		var tabName = 'clue/'+this.props.params.id+'/linkman/'+this.props.params.linkmanId+'/file';
		if(type == 'clue'){
			tabName = 'clue/'+this.props.params.id+'/file';
		}
		return {
			type: type,
			typeId: typeId,
			list: [],
			queryParam: {
				pageNo: 1,
				pageSize: 10,
			},
			tableData: {
				url: CONFIG.APIS.myClue,
				tableName: tabName,
				th: [ //列表表头
					{
						name: '标题',
						width: 300
					}, {
						name: '创建人',
						width: 90
					}, {
						name: '创建时间',
						width: 60
					}, {
						name: '大小',
						width: 120
					}, {
						name: '格式',
						width: 60
					}, {
						name: '操作',
						width: 60
					}
				],
				tr: ['originName', 'createdBy', 'createdOn', 'fileSize', 'extension', 'del'] //列表每列显示属性定义
			}

		}
	},

	componentWillUnmount() {},


	componentDidMount: function(param) {
		this.getData();
	},

	//获取备注附件列表
	getData() {
	    let self = this;
	    let type = self.state.type;
	    let typeId = self.state.typeId;
	    let url = [CONFIG.APIS.notes_add, "fileRemarkList", type, typeId].join("/");

		self.refs.remarkFileList.beginLoad(1);
	    AjaxRequest.get(url, null, function(body) {

	        //将amr后缀改为mp3
	        for (var i = 0; i < body.data.length; i++) {
	            var fileUrl=body.data[i].fileUrl;
	            var originName=body.data[i].originName;
	            if(fileUrl.length>3 && fileUrl.substring(fileUrl.length-4,fileUrl.length).toLowerCase() =='.amr'){
	                body.data[i].fileUrl=fileUrl.substring(0,fileUrl.length-4)+'.mp3';
	                body.data[i].extension='mp3';
	                body.data[i].originName=originName.substring(0,originName.length-4)+'.mp3';
	            }
	        }

	        self.refs.remarkFileList.setPagerData(body);
	        self.setState({
	            list: body.data
	        });
	    });

	}, //end 获取备注附件列表	

	//删除备注附件
	deleteClick(fileId) {
		let self = this;
		let remarkId = 0;

		let list = self.state.list;
		let fileIds = [];
		list.map(function(item, index) {
			remarkId = item.id;
			if (item.id != fileId) {
				fileIds.push(item.fileId);
			}
		});

		let url = [CONFIG.APIS.notes_add, remarkId].join("/");
		AjaxRequest.put(url, {
			picFileIds: fileIds.join(",")
		}, function(body) {
			self.getData();
		});

	}, //end 删除备注附件	
	openUrl:function(url){
	    if(url){
	        window.open(url);
	    }
	},
	clickBack(fileId,fileUrl){
	    this.openUrl(fileUrl);
	},
	render: function() {
		let self = this;
		let type = self.state.type;
		let typeId = self.state.typeId;
		let clueId = this.props.params.id;
		let linkmanId = this.props.params.linkmanId;

		function addBtn() {
			if(type == 'clue_linkman'){
				return (
					<a className="btn btn-default DTTT_button_copy" href={`#/clue/${clueId}/linkman/${linkmanId}/file/addFile/0?type=${type}&typeId=${typeId}`}>
						<i className="fa fa-plus"></i>附&nbsp;&nbsp;&nbsp;&nbsp;件
					</a>
				);
			}else if(type == 'clue'){
				return (
					<a className="btn btn-default DTTT_button_copy" href={`#/clue/${clueId}/file/addFile/0?type=${type}&typeId=${typeId}`}>
						<i className="fa fa-plus"></i>附&nbsp;&nbsp;&nbsp;&nbsp;件
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
										<a>附件</a>
									</li>
									<div className="DTTT btn-group">
										{addBtn()}
									</div>
								</ul>

								<div className="tab-content tabs-flat">
									<div id="visits" className="tab-pane animated fadeInUp active">
										<TableView ref="remarkFileList"
												   getData={this.getData}
												   initParam={this.state.queryParam}
												   tableData={this.state.tableData}
												   clickBack={this.clickBack}
												   deleteClick={this.deleteClick}
										/>
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