import React from 'react'
import Select2 from '../Select2/Select2.js';
import '../Select2/select2.css';

module.exports = React.createClass({

	getInitialState:function(){
		return {
		}
	},
	addCompetitor:function () {
		var params = {
			competitorId:this.refs.competitor.el.val(),
			strengths:this.refs.strengths.value,
			weaknesses:this.refs.weaknesses.value
		};
		this.props.addCompetitor(params);
	},
	setCompetitorValue:function () {
		var text = $(".select2-selection__rendered").text();
		this.refs.competitorName.value = text;
	},

	renderSelectCompetitor:function() {
		return (
			<div>
				搜索竞争对手<br/>
				<Select2
					ref="competitor"
					multiple={false}
					style={{width:"100%"}}
					onSelect={this.setCompetitorValue}     //选择回调 ,如果是单选,只调用这个就行了
					data={this.props.competitorSearchList}
					value=""
					options={{placeholder: '搜索竞争对手'}}
					/>
			</div>
		);
	},
	renderInputCompetitorName:function() {
		return (
			<div>
				竞争对手<br/>
				<input type="text" className="form-control" ref="competitorName" readOnly="true"/>
			</div>
		);
	},
	//优势
	renderInputStrengths:function() {
		return (
			<div>
				优势<br/>
				<input type="text" className="form-control" ref="strengths" />
			</div>
		);
	},
	//劣势
	renderInputWeaknesses:function() {
		return (
			<div>
				劣势<br/>
				<input type="text" className="form-control" ref="weaknesses" />
			</div>
		);
	},
	setSelectValue:function(){
		this.refs.competitor.setValue("");
		this.refs.competitorName.value = "";
		this.refs.strengths.value = "";
		this.refs.weaknesses.value = "";
	},

	componentDidMount:function(){

	},

	render:function(){

		return (
			<div className="modal fade" id="addCompetitorModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog" style={{width:800+'px'}}>
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">添加竞争对手</h4>
						</div>
						<div className="modal-body layer-public">
							<div id="horizontal-form">
									{this.renderSelectCompetitor()}<br/>
									{this.renderInputCompetitorName()}<br/>
									{this.renderInputStrengths()}<br/>
									{this.renderInputWeaknesses()}<br/>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">取消
							</button>
							<button type="button" onClick={this.addCompetitor} className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});