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

		var divs = lists.map(function(qst,key){
			if(CONFIG.Exclude && CONFIG.Exclude.chance){
				if(qst.field == 'chanceName')return null;
			}
			if(key == 2 || key == 3 || key == 4 || key == 5){
				return <div key={key} className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
							<div>
								<h5>{qst.name}</h5>
								<p>{qst.value}</p>
							</div>
						</div>
			}else{
				return <div key={key} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detail-tab1-list">
							<div>
								<h5>{qst.name}</h5>
								<p>{qst.value}</p>
							</div>
						</div>
			}
		}.bind(this) );
		
		return (
			<div className="row">
				{divs}
			</div>
		)
	}
});