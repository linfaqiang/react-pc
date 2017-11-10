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
			return <li className="li-rt-border" key={key}>
						<h5 style={{paddingBottom: 10+'px'}}>{qst.productName}</h5>
						<p>类别：{qst.productTypeText}</p>
						<p style={{maxHeight:'44px', overflow:'hidden'}}>描述：{qst.description}</p>
						<span className="amount">￥{toThousands(qst.productPrice)}元</span>
					</li>
		}.bind(this) );

		return (
			<div className="ppLi">
				<h3 className="detailOther-h3">产品（{len}）</h3>
				<ul className="competitor-product row">
					{lis}
				</ul>
			</div>
		)
	}
});