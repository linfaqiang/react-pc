import React from 'react'

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	AddComment:function () {
		var self=this;
		var val = self.refs.noteContent.value;
		self.props.AddComment(val);
		self.refs.noteContent.value='';
	},
	
	componentDidMount:function(){

	},

	render:function(){
		
		return (
			<div className="modal fade" id="addNoteModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">新增评论</h4>
						</div>
						<div className="modal-body layer-public">
							<div id="horizontal-form">
								<form className="form-horizontal" role="form">
									<textarea id="workAddComment" ref="noteContent" className="form-control"  placeholder="输入评论" />
								</form>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">取消
							</button>
							<button type="button" onClick={this.AddComment} className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});