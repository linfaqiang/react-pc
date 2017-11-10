import React from 'react'

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	executeTask:function () {
		var status = this.refs.status.value;
		var description = this.refs.description.value;
		var params = {
			status:status,
			resultDesc:description
		};
		this.props.executeTask(params);
	},
	
	componentDidMount:function(){

	},

	render:function(){
		
		return (
			<div className="modal fade" id="executeTaskModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">执行任务</h4>
						</div>
						<div className="modal-body layer-public">
							<div id="horizontal-form">
								<form className="form-horizontal linkman-form">
									<div className="linkman-add">
										<label>状态<sup>*</sup></label>
										<select ref="status" name="status">
											<option value="0">未开始</option>
											<option value="1">进行中</option>
											<option value="2">已完成</option>
										</select>
									</div>
									<div className="linkman-add">
										<label>备注</label>
										<textarea className="form-control" placeholder="请输入备注" ref="description" name="description"></textarea>
									</div>
								</form>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">取消
							</button>
							<button type="button" onClick={this.executeTask} className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});