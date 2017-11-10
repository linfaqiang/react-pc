import React from 'react';
import {APIS} from '../../common/config.js';
import Tools from '../../common/tools.js';
module.exports = React.createClass({

	getInitialState:function(){
		return {
			
		}
	},
	
	componentDidMount:function(){
		var type = this.props.type;
		if(type == 'chance'){
			$("#linkmanAdd").hide();
			$("#linkmanSearch").show();
		}else{
			$("#linkmanAdd").show();
			$("#linkmanSearch").hide();
		}
	},
	componentDidUpdate:function(){
		if(this.props.lists && this.props.lists.length > 0){
			Tools.imgLoadError();
		}
	},
	addLinkman:function () {
		this.props.addLinkman();
	},

	render:function(){
		var lists = this.props.lists,
			len = lists.length;

		var lis = lists.map(function(qst,key){
			if(key > 1){
				return;
			}
			return <li key={key} className="li-lrt-border">
						<div className="left-img">
							<img src={qst.headPhotoUrl?qst.headPhotoUrl: APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" width="65" height="65"/>
						</div>
						<h5>{qst.name}</h5>
						<p>{qst.department}--{qst.title}</p>
						<p>{qst.mobile}</p>
			       </li>
		}.bind(this) );
		
		return (
			<div className="ppLi">
				<h3 className="detailOther-h3" style={{fontSize:'14px'}}>联系人 ({len})</h3>
				<div className="top-btn">
					<a href="javascript:void(0)" id="linkmanAdd"  onClick={this.addLinkman}  className="btn btn-default btn-add"><i className="fa fa-plus"></i>添加联系人</a>
					<a href="javascript:void(0)" id="linkmanSearch" data-toggle="modal" onClick={this.props.initLinkmanSearch} data-target="#addLinkmanSearchModal" className="btn btn-default btn-add">添加联系人</a>
				</div>
				<ul className="lianxiren row">
					{lis}
				</ul>
				<div className="detail-bottom-pp">
					<a href="javascript:void(0)"  data-toggle="modal" data-target="#linkmanModal">查看全部&nbsp;&nbsp;&gt;</a>
				</div>
			</div>
		)
	}
});