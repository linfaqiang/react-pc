import React from 'react';


module.exports = React.createClass({

	contextTypes: {
		router: React.PropTypes.object
	},

	intoChangeDetail:function (id) {
		this.context.router.push({
			pathname: '/chance/'+id
		});
	},

	render:function(){

		var lists = this.props.list;

		if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');
		
		var divs = lists.map(function(qst,key){
			return <div key={key} className="ppLi position-relative"
						style={{cursor:'pointer'}}
						onClick={this.intoChangeDetail.bind(this,qst.id)}>
				<h5 className="padding-left-20">{qst.chanceName}</h5>
				<div className="competitor-address padding-left-20">
					<span className="adrLeft">阶段:{qst.stageName || '-----'}</span>
				</div>
				<span className="right-zrr">责任人:{qst.createdName || '-----'}</span>
				<div className="detail-tab2-bottom">
					<span className="mag-1 padding-left-20">最后跟进时间: <span>{qst.trackDate}</span></span>
					<span className="mag-2 text-align-center">状态: <span>{qst.statusText}</span></span>
					<span className="mag-3 text-align-center">预测金额: <span>{qst.forecastAmount}</span></span>
				</div>
			</div>
		}.bind(this) );

		return (
			<div className="detail-tab2">
				{divs}
			</div>
		)
	}
});