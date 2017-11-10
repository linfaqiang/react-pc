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
			len = lists.length;

		var lis = lists.map(function(qst,key){
			if(key > 1){
				return;
			}
			if(key%2 == 0){
				return <li className="li-border-right" key={key}>
					<h5 style={{paddingBottom:5+'px'}}>{qst.quotationName}</h5>
					<p>责任人：{qst.createdName}</p>
					<p>{qst.createdOn}</p>
					<span className="amount">￥{qst.amount?qst.amount:0}元</span>
					<span className="status">{qst.statusText}</span>
				</li>
			}else{
				return <li className="li-right" key={key}>
					<h5 style={{paddingBottom:5+'px'}}>{qst.quotationName}</h5>
					<p>责任人：{qst.createdName}</p>
					<p>{qst.createdOn}</p>
					<span className="amount">￥{qst.amount?qst.amount:0}元</span>
					<span className="status">{qst.statusText}</span>
				</li>
			}
		}.bind(this) );

		return (
			<div className="ppLi">
				<h3 className="detailOther-h3">报价 ({len})</h3>
				<div className="top-btn">
					<a href="javascript:void(0)" onClick={this.props.addQuote} className="btn btn-default btn-add">新建报价</a>
				</div>
				<ul className="quote row">
					{lis}
				</ul>
				<div className="detail-bottom-pp">
					<a href="javascript:void(0)" onClick={this.props.selectAllQuote}>查看全部&nbsp;&nbsp;&gt;</a>
				</div>
			</div>

		)
	}
});