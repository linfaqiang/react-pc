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
			queryParam: {
				"pageNo": 1,
				"pageSize": 20,
			},
			tableData: {
				url: CONFIG.APIS.myClue,
				tableName: 'clue/remark',
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

	componentWillUnmount() {},


	componentDidMount: function(param) {
		this.getData();
	},

	//获取线索备注内容
	getData() {
		let self = this;
		let clueId = self.props.params.clueId;
		let url = [CONFIG.APIS.notes_add, "clue", clueId].join("/");

		AjaxRequest.get(url, null, function(body) {
			self.refs.remarkList.setPagerData(body);
		});

	}, //end 线索备注内容	


	render: function() {
		let clueId = this.props.params.clueId;
		return (
			<div>
				<CurrentPosition name=" 线索 / 附件"></CurrentPosition>
				<div className="page-body">
					<div className="widget lists">
						<div className="widget-body">
							<div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper form-inline no-footer">
								<Buttons ref="buttons" clueId={clueId}></Buttons>
								<List ref="remarkList" getData={this.getData} initParam={this.state.queryParam}  tableData={this.state.tableData}/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});