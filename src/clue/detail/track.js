import React from 'react'
import request from 'superagent';
import {
	hashHistory
} from 'react-router'

import CurrentPosition from '../../core/components/layout/CurrentPosition'
import Constants from '../../core/common/constants.js'
import CONFIG from '../../core/common/config.js'
import AjaxRequest from '../../core/common/ajaxRequest.js';

import Select from '../../core/components/Select.js'
import RegionSelect from '../../core/components/RegionSelect.js'
import Alert from '../../core/components/alert.js'


module.exports = React.createClass({

	getInitialState: function() {
		return {
			changed: false,
			info: {
				clueId: "",
				content: ""
			}
		}

	},

	componentDidMount: function(param) {
		$("#registrationForm").bootstrapValidator();
	},


	handleChange: function(e) {
		let newState = this.state.info;
		let name = e.target.name;

		newState[name] = e.target.value;
		this.setState({
			info: newState,
			changed: true
		});
	},
	handleSave: function(e) {
		let self = this;

		//校验数据
		var bootstrapValidator = $("#registrationForm").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			return false;
		}

		//let clueId = self.props.params.clueId;
		let clueId = self.props.params.id;
		let info = {
			address: {},
			trackContent: this.state.info.content,
			clueId: clueId
		}
		AjaxRequest.post(CONFIG.APIS.clueTracks, info, function(data) {
			if (data.code == "200") {
				$('#modal-success').modal();
			} else {
				$('#modal-danger').modal();
			}
		});

	},

	handleCancel: function() {
		if (this.state.changed) {
			bootbox.confirm("表单已修改，你确定不保存退出吗?", function(result) {
				if (result) {
					history.go(-1);
				}
			});

		} else {
			history.go(-1);
		}

	},


	render: function() {
		let style_none = {
			display: "none"
		};
		let style100 = {
			width: "100%"
		};
		let style_button = {
			textAlign: 'left',
			padding: "10px 0 10px 0"
		};
		let id = this.props.params.id;
		let title = "新增跟进记录";

		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<ul className="nav nav-tabs myTab noBorLR">
									<li className="active">
										<a>{title}</a>
									</li>
								</ul>
								<form id="registrationForm" method="post"
									  data-bv-message="This value is not valid"
									  data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
									  data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
									  data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

									<div className="widget-body padding-20" style={{boxShadow: 'none'}}>
										<div id="registration-form">
											<div className="form-group">
												<label htmlFor="content">跟进内容<sup>*</sup></label>
				                                        <span className="input-icon icon-right">
				                                            <textarea id="content" name="content" className="form-control" rows="10"
																	  value={this.state.info.content}
																	  onChange={this.handleChange}
																	  placeholder="跟进内容"
																	  data-bv-notempty="true"
																	  data-bv-notempty-message="必须输入内容"
																	  data-bv-stringlength="false"
																	  data-bv-stringlength-min="6"
																	  data-bv-stringlength-max="500"
																	  data-bv-stringlength-message="客户名称在6到500个字符之间"></textarea>
				                                        </span>
											</div>
										</div>
									</div>
									<hr />
									<div className="widget-header noShadow padding-20">
										<div className="buttons-preview" style={style_button}>
											<input type="button" onClick={this.handleCancel} className="btn btn-cancer" value="取消" />
											<button id="btnSave" onClick={this.handleSave} className="btn btn-danger">保存</button>
										</div>
									</div>
								</form>
				            </div>
						</div>
					</div>
				</div>
	
				<Alert result="succees"></Alert>
				<Alert result="danger"></Alert>
		
			</div>


		)
	}
});