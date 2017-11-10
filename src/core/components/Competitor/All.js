import React from 'react'

module.exports = React.createClass({

	getInitialState:function(){
		return {
		}
	},
	
	componentDidMount:function(){

	},
	saveBtn:function(id){
		var params = {
			id:id,
			strengths:this.refs['strengths'+id].value,
			weaknesses:this.refs['weaknesses'+id].value
		}
		this.props.saveBtn(params);
	},
	setInputValue:function(){
		var list = this.props.lists;
		if(list && list.length > 0){
			for(var i=0;i<list.length;i++){
				var qst = list[i];
				this.refs['strengths'+qst.id].value = qst.strengths;
				this.refs['weaknesses'+qst.id].value = qst.weaknesses;
			}
		}
	},

	render:function(){
		var lists = this.props.lists;

		var divs = lists.map(function(qst,key){

			return <div className="panel panel-default" key={key}>
						<div className="panel-heading ">
							<h4 className="panel-title">
								<a className="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href={'#collapse'+qst.id}>
									{qst.competitorName}
								</a>
							</h4>
						</div>
						<div id={'collapse'+qst.id} className="panel-collapse collapse">
							<div className="panel-body border-red">
								<div className="row">
									<div className="widget-body">
										<form className="form-horizontal">
											<div className="form-group">
												<label className="col-lg-3 control-label">优势</label>
												<div className="col-lg-9">
													<input type="text" ref={'strengths'+qst.id} className="form-control" defaultValue={qst.strengths}/>
												</div>
											</div>
											<div className="form-group">
												<label className="col-lg-3 control-label">劣势</label>
												<div className="col-lg-9">
													<input type="text" ref={'weaknesses'+qst.id} className="form-control" defaultValue={qst.weaknesses}/>
												</div>
											</div>
											<div className="form-group">
												<div className="col-lg-9 col-lg-offset-3">
													<div className="buttons-preview" style={{textAlign:'left',paddingTop:10+'px'}}>
														<button onClick={this.saveBtn.bind(this,qst.id)} className="btn btn-danger">保存</button>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>

							</div>
						</div>
					</div>
		}.bind(this));
		
		return (
			<div className="modal fade" id="competitorModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog" style={{width:800+'px'}}>
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">竞争对手</h4>
						</div>
						<div className="modal-body layer-public">
							<div className="detail-tab3">
								<div className="widget-body no-padding">
									<div className="widget-main ">
										<div className="panel-group accordion" id="accordion">
											{divs}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});