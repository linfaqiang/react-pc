import React from 'react';


module.exports = React.createClass({
	
	render:function(){
		var lists = this.props.lists;

		function fomartAmount(field, text, val){//dealAmount
			if( field.match(/amount/i) || field.match(/price/i) || text.match('金额') || text.match('价格')){
				var r = new RegExp("^\\d+(\\.\\d+)?$");
				if((typeof val == 'number') || r.test(val)){
					return (<span style={{color: 'red'}}>￥{toThousands(val)}</span>);
				}
			}
			return val;
		}
		var cls = 'col-lg-3 col-md-3 col-sm-6 col-xs-12';
		if(lists.length == 2){
			cls = 'col-lg-6 col-md-6 col-xs-6 col-xs-12 no-padding';
		}

		if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');
		var lis = lists.map(function(qst,key){
			return <div key={key} className={cls}>
					<div className="databox databox-graded">
						<div className={"databox-left no-padding "+qst.iconClass}></div>
						<div className="databox-right">
							<div className="databox-text slate-gray">{qst.name}</div>
							<div className="databox-text silver" title={qst.value}>{fomartAmount(qst.field||qst.filed, qst.name, qst.value)}</div>
						</div>
					</div>
				</div>
		}.bind(this) );

		return (
			<div className="row otherRow">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className="row">
						{lis}
					</div>
				</div>
			</div>


		)
	}
});