import React from 'react';
import {APIS} from '../../common/config.js';
import UserInfo from '../../common/UserInfo.js';
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

	render:function(){
		var lists = this.props.lists,
			len = lists.length;
		//let userInfo = UserInfo.get();
		//let headPhotoUrl = userInfo.headPhotoUrl;

		var lis = lists.map(function(qst,key){
			if(key > 1){
				return;
			}
			return <li key={key}>
						<div className="tx-img">
							<img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" type="head" alt={qst.headPhotoUrl? '': '暂无头像'} width="55" height="55" alt=""/>
						</div>
						<h5>{qst.createdBy}</h5>
						<p>{qst.content}</p>
						<span className="time">{qst.createdOn}</span>
					</li>
		}.bind(this) );
		
		return (
			<div className="ppLi">
				<h3 className="detailOther-h3" style={{fontSize:'14px'}}>备注 ({len})</h3>
				<div className="top-btn">
					<a href="javascript:void(0)" data-toggle="modal" data-target="#addNoteModal"
					   className="btn btn-default btn-add"><i className="fa fa-plus"></i>添加备注</a>
				</div>
				<ul className="beizhu row">
					{lis}
				</ul>
				<div className="detail-bottom-pp">
					<a href="javascript:void(0)" data-toggle="modal" data-target="#noteModal">查看全部&nbsp;&nbsp;&gt;</a>
				</div>
			</div>
		)
	}
});