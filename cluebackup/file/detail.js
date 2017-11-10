import React from 'react'
import request from 'superagent';
import {
	hashHistory
} from 'react-router'

import {
	Upload,
	Button,
	message,
	Icon
} from 'antd';


import CurrentPosition from '../../core/components/layout/CurrentPosition'
import Constants from '../../core/common/constants.js'
import CONFIG from '../../core/common/config.js'
import AjaxRequest from '../../core/common/ajaxRequest.js';

import Select from '../../core/components/Select.js'
import RegionSelect from '../../core/components/RegionSelect.js'
import Alert from '../../core/components/alert.js'

const Dragger = Upload.Dragger;
let fileTypes = new Set(['.png', '.gif', '.jpg', '.jpeg', '.doc', '.docx', '.xsl', '.xslx', '.ppt', '.pptx', '.pdf']);


module.exports = React.createClass({


	getInitialState: function() {
		return {
			changed: false,
			fileIds: new Set(),
			info: {
				id: 0,
				ontent: "",
				entityId: this.props.location.query.clueId,
				picFileIds: "",
				remarkType: "clue"
			},
			fileList: [],
		}

	},

	componentWillMount: function(param) {},

	componentDidMount: function(param) {

		let self = this;

		let id = self.props.params.id;
		if (id && id > 0) {
			let url = CONFIG.APIS.notes_add + "/" + id;
			AjaxRequest.get(url, null, function(body) {
				let info = self.state.info;
				for (let key in info) {
					info[key] = body.data[key];
				}

				self.setState({
					info: info
				});

			});
		};

		$("#registrationForm").bootstrapValidator();

	},

	//获取线索附件列表
	getData: function() {
		let self = this;
		let clueId = self.props.params.clueId;
		let url = [CONFIG.APIS.notes_add, "fileRemarkList/clue", clueId].join("/");

		AjaxRequest.get(url, null, function(body) {
			self.refs.remarkFileList.setPagerData(body);
		});

	}, //end 获取线索附件列表		

	handleRemove: function(file) {
		let ids = this.state.fileIds;
		ids.delete(file.response.fId);
		this.setState({
			fileIds: ids
		});
	},
	handleChange: function(info) {
		if (info.file.status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (info.file.status === 'done') {
			let ids = this.state.fileIds;
			ids.add(info.file.response.fId);
			this.setState({
				fileIds: ids
			});

			message.success(`${info.file.name} 上传成功。`);
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} 上传失败。`);
		}
	},
	handleSave: function(e) {
		let self = this;

		let info = this.state.info;
		let id = self.props.params.id;
		if (id && id > 0) {
			info.id = id;
			AjaxRequest.put(CONFIG.APIS.notes_add + "/" + id, info, function(data) {
				if (data.code == "200") {
					$('#modal-success').modal();

				} else {
					$('#modal-danger').modal();
				}
			});
		} else {
			let clueId = self.props.location.query.clueId;
			let info = {
				content: "",
				entityId: clueId,
				picFileIds: Array.from(this.state.fileIds).join(','),
				remarkType: "clue"
			}
			AjaxRequest.post(CONFIG.APIS.notes_add, info, function(data) {
				if (data.code == "200") {
					$('#modal-success').modal();
				} else {
					$('#modal-danger').modal();
				}
			});
		}
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
		let props = {
			name: 'file',
			showUploadList: true,
			listType: 'picture',
			action: CONFIG.APIS.upload_file,
			defaultFileList: this.state.fileList,
			beforeUpload(file) {
				var filename = file.name;
				var index = filename.lastIndexOf(".");
				var fileType = filename.substring(index, filename.length);
				if (!fileTypes.has(fileType)) {
					message.error('文件格式不正确！');
					return false;
				}
				return true;
			},
			onChange(info) {
				if (info.file.status !== 'uploading') {
					console.log(info.file, info.fileList);
				}
				if (info.file.status === 'done') {
					message.success(`${info.file.name} file uploaded successfully.`);
				} else if (info.file.status === 'error') {
					message.error(`${info.file.name} file upload failed.`);
				}
			},
		};



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
		let title = "上传";

		return (
			<div>
				<CurrentPosition name={" 线索 / 附件 / " + title}></CurrentPosition>
				<div className="page-body">
					<div className="widget">
						<div className="widget-body">

							<div className="row">
				                <div className="col-lg-6 col-sm-6 col-xs-12" style={style100}>
				                    <div className="widget flat radius-bordered">
					                    <form id="registrationForm" method="post"
				                              data-bv-message="This value is not valid"
				                              data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
				                              data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
				                              data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

					                        <div className="widget-body">
					                            <div id="registration-form">
				                                    <div className="form-group">
														<Dragger {...props} onChange={this.handleChange} onRemove={this.handleRemove}>
															<p className="ant-upload-drag-icon">
															<Icon type="inbox" />
															</p>
															<p className="ant-upload-text">点击或将文件拖拽到此区域上传</p>
															<p className="ant-upload-hint">支持单个或批量上传，严禁上传公司内部资料及其他违禁文件</p>
														</Dragger>	
									 
									            	</div>
					                            </div>
					                        </div>
											<hr className="wide" />
					                       	<div className="widget-header">
												<div className="buttons-preview" style={style_button}>
													<input type="button" onClick={this.handleCancel} className="btn btn-cancer" value="取消" />
													<button id="btnSave" onClick={this.handleSave} className="btn btn-success">保存</button>
													
												</div>  
							
					                        </div>
					                    </form>
				                    </div>
				                </div> 
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