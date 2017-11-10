import React from 'react';


module.exports = React.createClass({
	handleClick: function() {
		if (this.props.result == "succees") {
			if(this.props.disableGoto) return;
			history.go(-1);
		}
	},
	handleErrorClick: function () {
		if(this.props.canGoBack){
			history.go(-1);
		}
	},
	render: function() {
		if (this.props.result == "succees") {
			return (
				<div id="modal-success" className="modal modal-message modal-success fade" style={{display: "none"}} aria-hidden="true">
			        <div className="modal-dialog">
			            <div className="modal-content">
			                <div className="modal-header">
			                    <i className="glyphicon glyphicon-check"></i>
			                </div>
			                <div className="modal-title">提示</div>

			                <div className="modal-body">操作成功!</div>
			                <div className="modal-footer">
			                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.handleClick}>确定</button>
			                </div>
			            </div> 
			        </div> 
			    </div>
			)
		} else if(this.props.result == "info"){
			return (
				<div id="modal-info" className="modal modal-message modal-info fade" style={{display: "none"}} aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<i className="fa fa-envelope"></i>
							</div>
							<div className="modal-title">提示</div>

							<div className="modal-body">执行人必须选择!</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-info" data-dismiss="modal">确定</button>
							</div>
						</div>
					</div>
				</div>

			)
		} else {

			return (
				<div id="modal-danger" className="modal modal-message modal-danger fade" style={{display: "none"}} aria-hidden="true">
			        <div className="modal-dialog">
			            <div className="modal-content">
			                <div className="modal-header">
			                    <i className="glyphicon glyphicon-fire"></i>
			                </div>
			                <div className="modal-title">提示</div>

			                <div className="modal-body">操作失败，请稍后再试!</div>
			                <div className="modal-footer">
			                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.handleErrorClick}>确定</button>
			                </div>
			            </div> 
			        </div>
			    </div>
			)
		}
	}
});