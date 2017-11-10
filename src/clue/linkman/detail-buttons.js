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
		return (
			<div className="row">
				<div className="page-header position-relative">
					<div className="header-title">
						<h1>
							{this.props.info.name}
							<a href={`#/clue/${this.props.info.clueId}/linkman/${this.props.info.id}/edit`}><span className="crm_edit pcicon pcicon-edit"></span></a>
						</h1>
					</div>
					{/*<div className="header-buttons">
						<div className="fa fa-mail-reply" onClick={()=>{hashHistory.go(-1)}}>返回</div>

					</div>*/}
				</div>
			</div>
		)
	}
});