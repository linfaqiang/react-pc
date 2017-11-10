import React from 'react'

module.exports = React.createClass({

	getInitialState:function(){
		return {
		}
	},

	componentDidMount:function(){

	},

	renderProduct:function(list){
		var lis = list.map(function(qst,key){
			return <li className = "li-r-border" key={key}>
							<h5 style={{paddingBottom: 5+'px'}}>{qst.productName}</h5>
							<span className="amount">￥{toThousands(qst.productPrice)}元</span>
						</li>
		}.bind(this) );
		return lis;
	},

	render:function(){
		var lists = this.props.lists;
		var divs = lists.map(function(qst,key){
			return <div className="poLi" key={key}>
						<h3 className="poLih3">{qst.chanceName}</h3>
						<div className="ppLi ppLi-border">
							<h3 style={{border: 0,marginLeft:10 + 'px'}}>{qst.customerName}</h3>
							<ul className="competitor-chance row">
								{this.renderProduct(qst.productList)}
							</ul>
						</div>
					</div>
		}.bind(this) );

		return (
			<div>
				{divs}
			</div>
		)
	}
});