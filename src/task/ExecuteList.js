import React from 'react';
import {APIS} from '../core/common/config.js';
import Tools from '../core/common/tools';

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	

	componentDidMount:function(){
	},
	componentDidUpdate:function(){
		if(this.props.lists && this.props.lists.length > 0){
			Tools.imgLoadError();
		}
	},

	render:function(){
		var lists = this.props.lists;

		var divs = lists.map(function(qst,key){
			return <div className="databox-top" key={key} >
						<div className="imgbox">
							<img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto"/>
						</div>
						<div className="infoBox">
							<p className="databox-header carbon no-margin">{qst.executorName}<span>{qst.createdOn}</span></p>
							<p className="databox-header carbon no-margin">更改为<span className="fColorRed">{qst.statusText}</span></p>
							<p className="databox-text gray no-margin">
								{qst.resultDesc}<span></span>
							</p>
						</div>
					</div>
		}.bind(this) );
		
		return (
			<div className="dataItem scrollDiv">
				<h5 className="row-title before-darkorange"><span>执行情况</span></h5>
				<div className="dataItem-body">
					<div className="baseList exe">
						{divs}
					</div>
				</div>
			</div>
		)
	}
});