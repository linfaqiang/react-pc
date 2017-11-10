import React, {
	Component
} from 'react';
import {
	render
} from 'react-dom';
import {
	Link
} from 'react-router';
import Reflux from 'reflux'
import ReactMixin from 'react-mixin'

import CurrentPosition from '../core/components/layout/CurrentPosition'
import TableView from '../core/components/TableList/TableView.js';

import Constants from '../core/common/constants.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import Buttons from './buttons.js';
import Alert from '../core/components/alert.js';
import { Progress } from 'antd';

import store from './store'

module.exports = React.createClass({

	getInitialState: function() {
		return store.data;
	},

	componentWillUnmount() {},


	componentDidMount: function(param) {
		this.getData();
	},
	getDataForButton: function(listType, queryParam) {
		let self = this;

		let index = listType.index;
		let url = CONFIG.APIS.clue_list_url[index];
		let params = queryParam;

		self.refs.clueList.beginLoad(params.pageNo);
		AjaxRequest.get(url, params, function(data) {
			var o = data;
			/*if(typeof o.data == 'string'){
				o.data = JSON.parse(Base64.decode(o.data));
			}*/
			self.refs.clueList.setPagerData(o);
			self.setState({
				totalSize: o.totalSize,
				listType: listType,
				queryParam: queryParam
			})
		})
	},
	getData() {
		let self = this;

		let index = self.state.listType.index;
		let url = CONFIG.APIS.clue_list_url[index];
		let params = self.state.queryParam;

		self.refs.clueList.beginLoad(params.pageNo);
		AjaxRequest.get(url, params, function(data) {
			var o = data;
			/*if(typeof o.data == 'string'){
				o.data = JSON.parse(Base64.decode(o.data));
			}*/
			self.refs.clueList.setPagerData(o);
			self.setState({
				totalSize: o.totalSize
			})
		})
	},////clues/import-excel、clues/export-excel
	importData:function(f){
		var self = this;
		var fd = new FormData();
		fd.append("file", f);
		var req = new XMLHttpRequest();
		req.open("POST", APIS.importCluesExcel, true);
		req.onload = function (oEvent) {
			var data = JSON.parse(req.response);
			self.setState({startUpload: false});

			if (req.status == 200) {
				if (data.code == 200) {
					$('#modal-success').modal();
				} else {
					$('#modal-danger').modal().find('.modal-body').html('<p class="exportTipText">'+'操作失败: '+data.msg+'</p>');
				}
			} else {
				$('#modal-danger').modal().find('.modal-body').html('<p class="exportTipText">'+'操作失败: '+req.statusText+'</p>');
			}
		};
		req.onprogress = function(e) {
			if (e.lengthComputable) {
				var percentage = Math.round((e.loaded * 100) / e.total);
				self.setState({percentage: percentage});
			}
		};
		req.send(fd);
		self.setState({startUpload: true});
	},//导入
	stopEvent: function(e){
		e.stopPropagation();
		e.preventDefault();
	},
	exportData:function(){
		window.open(APIS.exportCluesExcel);
	},//导出
	render: function() {

		return (
			<div>
				<CurrentPosition name="线索"></CurrentPosition>
				<div className="page-body">
					<div className="widget lists">
						<div className="widget-body">
							<div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper form-inline no-footer">
								<Buttons ref="buttons" getData={this.getDataForButton} importData={this.importData} exportData={this.exportData}></Buttons>

								<TableView ref="clueList" getData={this.getData} tableData={this.state.tableData} initParam={this.state.queryParam}></TableView>
								{/*<List ref="clueList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>*/}
							</div>
						</div>
					</div>
				</div>

				<div className="uploadProgress" style={{display: (this.state.startUpload ? 'block' : 'none')}} onMouseDown={this.stopEvent} onTouchStart={this.stopEvent}>
					<Progress type="circle" percent={this.state.percentage} />
				</div>

				<Alert result="succees"></Alert>
				<Alert result="danger"></Alert>
			</div>
		)
	}
});