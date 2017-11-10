import React from 'react'

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	addNotes:function () {
		var val = this.refs.noteContent.value;
		this.props.addNotes(val);
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
							<h4 className="modal-title" id="myNoteModalLabel">新增备注</h4>
						</div>
						<div className="modal-body layer-public">
							<div id="horizontal-form">
								<form className="form-horizontal" role="form">
									<textarea ref="noteContent" className="form-control"  placeholder="输入备注"></textarea>
								</form>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">取消
							</button>
							<button type="button" onClick={this.addNotes} className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});