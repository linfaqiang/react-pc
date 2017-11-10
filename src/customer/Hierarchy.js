import React from 'react'

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	
	componentDidMount:function(){

	},

	render:function(){
		var lists = this.props.lists.subdirectories;

		var lis = lists.map(function(qst,key){
			if(key > 1){
				return;
			}
			return <p key={key}>{qst.name}</p>
		}.bind(this) );
		
		return (
			<div className="ppLi">
				<h3 className="detailOther-h3" style={{fontSize:'14px'}}>客户层级</h3>
				<div className="top-btn">
					<a href="javascript:void(0)" data-toggle="modal"  data-target="#hierarchyEdit" className="btn btn-default btn-add">编辑</a>
				</div>
				<ul className="khcj row">
					<li>
						<span className="kehu-title">父客户</span>
						<p style={{borderBottom:0+'px'}}>{this.props.lists.parent.name}</p>
					</li>
					<li>
						<span className="kehu-title">子客户</span>
						{lis}
					</li>
				</ul>
			</div>
		)
	}
});