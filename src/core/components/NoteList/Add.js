import React from 'react'

module.exports = React.createClass({

	getInitialState:function(){
		return {
			approval:null
		}
	},
	addNotes:function () {
		var self=this;
		var val = self.refs.noteContent.value;
		self.props.addNotes(val)
		self.refs.noteContent.value='';
	},
	
	componentDidMount:function(){

	},

	approval:function(){
		var val = this.refs.noteContent.value;
		var approvalType = this.state.approval;
		if(this.props.approval){
			this.props.approval(val, approvalType);
		}
	},//同意或拒绝报价
	handleRadio:function(e){
		console.log(e.target.value);//0同意 ，1拒绝
		this.setState({approval:e.target.value});
	},

	render:function(){
		var title = this.props.title;
		var footer, radios;

		if(title && title==='报价审批'){
			footer = (
				<div className="modal-footer">
					<button type="button" onClick={this.approval.bind(this, 'refuse')} className="btn btn-default" data-dismiss="modal">
						取消</button>
					<button type="button" onClick={this.approval.bind(this, 'agree')} className="btn btn-danger" data-dismiss="modal">
						确认</button>
				</div>

			);
			radios = (
				<div className="control-group" style={{marginBottom:'15px', overflow:'hidden'}}>
					<div className="radio" style={{float:'left'}}>
						<label style={{paddingLeft:'0px'}}>
							<input name="approvalResult" type="radio" value="0" onChange={this.handleRadio} className="colored-success" />
							<span className="text"> 同意</span>
						</label>
					</div>
					<div className="radio" style={{float:'left'}}>
						<label>
							<input name="approvalResult" type="radio" value="1" onChange={this.handleRadio} className="colored-danger" />
							<span className="text"> 拒绝</span>
						</label>
					</div>
				</div>
			);
		}else{
			footer = (
				<div className="modal-footer">
					<button type="button" className="btn btn-default" data-dismiss="modal">取消
					</button>
					<button type="button" onClick={this.addNotes} className="btn btn-danger" data-dismiss="modal">
						确定
					</button>
				</div>
			);
			radios = null;
		}

		return (
			<div className="modal fade" id={this.props.target || "addNoteModal"}  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">{this.props.title||'新增备注'}</h4>
						</div>
						<div className="modal-body layer-public">
							<div id="horizontal-form">
								<form className="form-horizontal" role="form">
									{radios}
									<textarea ref="noteContent" className="form-control"  placeholder={(this.props.title? "请输入审批意见(非必填)": "输入备注")}></textarea>
								</form>
							</div>
						</div>
						{footer}
					</div>
				</div>
			</div>
		)
	}
});