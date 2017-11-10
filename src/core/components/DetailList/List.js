import React from 'react'

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	

	componentDidMount:function(){

	},

	render:function(){
		var lists = this.props.lists;

		function fomartAmount(field, text, val){//dealAmount
			if( field.match(/amount/i) || field.match(/price/i) || field.match(/income/i) || text.match('金额') || text.match('价格') || text.match('收入')){
				var r = new RegExp("^\\d+(\\.\\d+)?$");
				if((typeof val == 'number') || r.test(val)){
					return (<span style={{color: 'red'}}>￥{toThousands(val)}</span>);
				}
			}
			return val;
		}

		var divs = lists.map(function(qst,key){
			var isHide = qst.isHide;
			return <div key={key} className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list" style={{display:isHide? 'none' : 'block'}}>
					<div>
						<h5>{qst.name}</h5>
						<p>{fomartAmount(qst.field, qst.name, qst.value)}</p>
					</div>
				</div>
		}.bind(this) );
		
		return (
			<div className="row">
				{divs}
			</div>
		)
	}
});