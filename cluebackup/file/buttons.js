import React, {
	PropTypes,
	Component
} from 'react'
import {
	render
} from 'react-dom';

import Reflux from 'reflux'
import ReactMixin from 'react-mixin'

import TabSelect from '../../core/components/PublicSelect/TabSelect.js'
import Constants from '../../core/common/constants.js'
import dicts from '../../core/common/dicts.js'
import CONFIG from '../../core/common/config.js'
import AjaxRequest from '../../core/common/ajaxRequest.js';

import Select2 from '../../core/components/Select2/Select2.js'
import '../../core/components/Select2/select2.css'


export default class Buttons extends React.Component {
	constructor(props) {
		super(props);

		var self = this;
		self.state = {};

	}

	componentWillUnmount() {}

	render() {
		var self = this;
		let clueId = this.props.clueId;
		var style100 = {
			width: "100%"
		};
		var style_form_group = {
			display: "block",
			marginBottom: "15px",
			verticalAlign: "middle"
		};

		return (
			<div style={{marginBottom:8 + 'px'}}>

					<div className="DTTT btn-group" style={{right:0+'px'}}>
						<a className="btn btn-default DTTT_button_copy" href={`#/clue/file/0?clueId=${clueId}`}>
							<i className="fa fa-plus"></i>
							<span>附件 </span>
						</a>						
					</div>
					<div style={{height: 32+"px"}}>
						<a className="btn btn-default DTTT_button_copy" href={`#/clue/${clueId}?tab=moreInfo`}>
							<i className="fa fa-mail-reply"></i>
							<span>返回 </span>
						</a>
					</div>
	

				</div>


		)
	}
}