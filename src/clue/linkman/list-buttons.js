import React, {
	PropTypes,
	Component
} from 'react'
import {
	render
} from 'react-dom';
import {
	hashHistory
} from 'react-router'

import Reflux from 'reflux'
import ReactMixin from 'react-mixin'
import store from './store'

module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object
	},
	getInitialState: function() {

		return {};
	},

	componentWillUnmount: function() {

	},

	componentDidMount: function(param) {


	},

	render: function() {
		var self = this;
		let clueId = self.props.clueId;
		var style100 = {
			width: "100%"
		};
		var style_form_group = {
			display: "block",
			marginBottom: "15px",
			verticalAlign: "middle"
		};

		/*return (
			<div style={{marginBottom:8 + 'px'}}>

					<div className="DTTT btn-group" style={{right:0+'px'}}>
						<a className="btn btn-default DTTT_button_copy" href={`#/clue/${clueId}/linkman/add/0`}>
							<i className="fa fa-plus"></i>
							<span>创建 </span>
						</a>
{/!*												
						<a className="btn btn-default DTTT_button_collection">
							<i className="glyphicon glyphicon-save"></i>
							<span>导入</span>
						</a>
						<a className="btn btn-default DTTT_button_collection">
							<i className="glyphicon glyphicon-open"></i>
							<span>导出</span>
						</a>
*!/}
					</div>
					<div style={{height: 32+"px"}}>
						<a className="btn btn-default DTTT_button_copy" href={`#/clue/${clueId}?tab=moreInfo`}>
							<i className="fa fa-mail-reply"></i>
							<span>返回 </span>
						</a>
					</div>
	

				</div>


		)*/
		return (
			<ul className="nav nav-tabs myTab">
				<li>
					<a className="btnBack" href={`#/clue/${clueId}?tab=moreInfo`}></a>
				</li>
				<li className="active">
					<a data-toggle="tab" href="">客户详情</a>
				</li>
				<li className="tabBtns btnGroup">
					<a href={`#/clue/${clueId}/linkman/add/0`}>
						<i class="fa fa-file-text"></i>
						新建
					</a>
				</li>
			</ul>
		);
	}
});