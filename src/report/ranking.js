import React from 'react';
import {APIS} from '../core/common/config.js';
import Tools from '../core/common/tools.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {}
	},
	componentDidUpdate:function(){
		if(this.props.list && this.props.list.length > 0){
			Tools.imgLoadError();
		}
	},
	render:function(){
		var self = this;
		var list = self.props.list||[];
		var myRanking = self.props.myRanking;
		
		var divs = list.map(function(qst,key){
			return <div className="rank sideline_up" key={key}>
						<span className={"list-ranking"+(myRanking.staffId == qst.staffId ? ' active':'')}>{qst.ranking}</span>
						<img src={`${APIS.img_path}/assets/img/default_contact.png`} name="defaultPic"/>
						<div>
							<p>{qst.staffName}</p>
							<p>成交额：<span className="fColorRed">￥{toThousands(qst.dealAmount)}</span></p>
						</div>
					</div>
		}.bind(this));
		function renderSelect(){
			if(myRanking && myRanking.staffId){
				return (
					<div className="selStaff">
						<div>
							<p>
								排名<br />
								<span style={{fontSize:'19px', color:'#d61518'}}>{myRanking.ranking}</span>
							</p>
						</div>
						<div>
							<p>
								成交额（元）<br />
								<span style={{fontSize:'19px', color:'#d61518'}}>￥{toThousands(myRanking.dealAmount)}</span>
							</p>
						</div>
					</div>
				);
			}else{
				return null;
			}
		}
		return (
			<div className="performance">
				{renderSelect()}
				{divs}

			</div>
		)
	}
});