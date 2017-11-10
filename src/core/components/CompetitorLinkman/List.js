import React from 'react';
import {APIS} from '../../common/config';
import Tools from '../../common/tools.js';

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
	clearAddValue:function () {
		this.props.clearAddValue();
	},

	render:function(){
		var lists = this.props.lists,
			len = lists.length;

		var lis = lists.map(function(qst,key){
			if(key > 2){
				return;
			}
			return <li key={key} className="li-rt-border">
						<div className="left-img">
							<img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" width="65" height="65" alt=""/>
						</div>
						<h5>{qst.name}</h5>
						<p>{qst.department}--{qst.title}</p>
						<p>{qst.mobile}</p>
			       </li>
		}.bind(this) );
		
		return (
			<div className="ppLi">
				<h3 className="detailOther-h3">联系人 ({len})</h3>
				<div className="top-btn">
					<a href="javascript:void(0)" data-toggle="modal" onClick={this.clearAddValue} data-target="#addLinkmanModal" className="btn btn-default btn-add">添加联系人</a>
				</div>
				<ul className="competitor-linkman row">
					{lis}
				</ul>
				<div className="detail-bottom-pp">
					<a href="javascript:void(0)"  data-toggle="modal" data-target="#linkmanModal">查看全部&nbsp;&nbsp;&gt;</a>
				</div>
			</div>
		)
	}
});