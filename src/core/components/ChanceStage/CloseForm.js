import React from 'react';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			closeReason: this.props.closeReason
		}
	},
	closeSave:function () {
		var bootstrapValidator = $("#closeForm").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			return false;
		}

		var fields = this.refs;
		var params = {
			stageId: this.props.chanceStageId,
			isClosed:1,
			closeReason:this.state.closeReason,
			isFinished:false,
			isLastStage:false
		};
		for (var attr in fields) {
			params[attr] = this.refs[attr].value;
		}
		this.props.finishedTask(params);
		$("#closeFormModal").modal("hide");
	},

	clearValue:function (closeReason) {
		var bootstrapValidator = $("#closeForm").data('bootstrapValidator');
		bootstrapValidator.resetForm();
		this.setState({closeReason: closeReason});
		for (var attr in this.refs) {
			this.refs[attr].value = '';
		}
	},
	
	componentDidMount:function(){
		$('.date-picker').datepicker({
			local:'ZH_CN'
		});
		$("#closeForm").bootstrapValidator();
	},

	render:function(){
		var flag = (this.state.closeReason==0 ? true : false);
		var txt = {
			t1:'我方签单',
			t2:'成交金额',
			t3:'成交日期'
		};
		if(!flag){
			txt = {
				t1:'项目丢单',
				t2:'输单金额',
				t3:'输单日期'
			};
		}
		
		return (
			<div className="modal fade" id="closeFormModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">{txt.t1}</h4>
						</div>
						<div className="modal-body layer-public">
								<form id="closeForm" method="post" data-bv-message="This value is not valid"
									  data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
									  data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
									  data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

									<div>
										<div id="close-form">
											<div className="row">
												<div className="col-sm-12">
													<div className="form-group">
														<label htmlFor="closeAmount">{txt.t2}</label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control" name="closeAmount" data-bv-digits="true" data-bv-digits-message="请输入数字格式" data-bv-notempty="true" data-bv-notempty-message="必须输入" ref="closeAmount" placeholder={this.props.closeReason==0?'请输入成交金额':'请输入输单金额'} />
														</div>
													</div>
												</div>
											</div>

											<div className="row">
												<div className="col-sm-12">
													<div className="form-group">
														<label htmlFor="closeDate">{txt.t3}</label>
														<div className="input-group">
															<input className="form-control date-picker" data-bv-notempty="true"
																   data-bv-notempty-message="必须选择" ref="closeDate" name="closeDate" type="text" placeholder={this.props.closeReason==0?'请选择成交日期':'请选择输单日期'} data-date-format="yyyy-mm-dd" />
															<span className="input-group-addon">
																<i className="fa fa-calendar"></i>
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</form>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
							<button type="button" onClick={this.closeSave} className="btn btn-danger">确定</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});