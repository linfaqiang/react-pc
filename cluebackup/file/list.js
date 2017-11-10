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
import List from '../../core/components/TableList/List.js';

import Constants from '../../core/common/constants.js';
import AjaxRequest from '../../core/common/ajaxRequest.js';
import Buttons from './buttons.js';


module.exports = React.createClass({

	getInitialState: function() {
		return {
			list: [],
			queryParam: {
				pageNo: 1,
				pageSize: 10,
			},
			tableData: {
				url: CONFIG.APIS.myClue,
				tableName: 'clue/file',
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

	//获取线索附件列表
	getData() {
		let self = this;
		let clueId = self.props.params.clueId;
		let url = [CONFIG.APIS.notes_add, "fileRemarkList/clue", clueId].join("/");

		AjaxRequest.get(url, null, function(body) {
			self.refs.remarkFileList.setPagerData(body);
			self.setState({
				list: body.data
			});
		});

	}, //end 获取线索附件列表	

	//获取线索附件列表
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

	}, //end 获取线索附件列表	
	render: function() {
		let clueId = this.props.params.clueId;
		return (
			<div>
				<CurrentPosition name=" 线索 / 备注"></CurrentPosition>
				<div className="page-body">
					<div className="widget lists">
						<div className="widget-body">
							<div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper form-inline no-footer">
								<Buttons ref="buttons" clueId={clueId}></Buttons>
								<List ref="remarkFileList" 
									getData={this.getData} 
									initParam={this.state.queryParam}  
									tableData={this.state.tableData}
									deleteClick={this.deleteClick}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});