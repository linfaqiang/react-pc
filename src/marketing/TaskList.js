import React from 'react'

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	
	componentDidMount:function(){

	},

	render:function(){
		var lists = this.props.lists,
			len = lists.length,
			marketingId = this.props.marketingId;

		var lis = lists.map(function(qst,key){
			if(key > 1){
				return;
			}
			return <li key={key}>
						<p>{qst.subject}</p>
						<span className="time">{qst.createdOn}</span>
					</li>
		}.bind(this) );
		
		return (
			<div className="ppLi">
				<h3 className="detailOther-h3">未完成任务 ({len})</h3>
				<div className="top-btn">
					
				</div>
				<ul className="renwu row">
					{lis}
				</ul>
				<div className="detail-bottom-pp">
					<a href={"#/marketing/" + marketingId + "/task"}>查看全部&nbsp;&nbsp;&gt;</a>
				</div>
			</div>
		)
	}
});