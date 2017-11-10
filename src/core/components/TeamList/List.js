import React from 'react';
import {APIS} from '../../common/config.js';
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

		var lis = lists.map(function(qst,key){

			if(key>5){
				return '';
			}

			return <li key={key} className="">
						<div className="tx-img"><img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" width="55" height="55" alt=""/></div>
						<p>{qst.staffName}</p>
					</li>
		}.bind(this) );
		
		return (
			<div className="ppLi">
				<h3 className="detailOther-h3" style={{fontSize:'14px'}}>销售团队 ({len})</h3>
				<div className="top-btn">
					<a href="javascript:void(0)" data-toggle="modal" onClick={this.props.initTeamSearch}
					   data-target="#addTeamModal" className="btn btn-default btn-add"><i className="fa fa-plus"></i>添加成员</a>
					<a href="javascript:void(0)" data-toggle="modal" onClick={this.props.initTeamList}
					   data-target="#delTeamModal" className="btn btn-default btn-add">删除成员</a>
				</div>

				<ul className="tuandui row">
					{lis}
				</ul>
				<div className="detail-bottom-pp">
					<a href="javascript:void(0)" data-toggle="modal" data-target="#teamModal">查看全部&nbsp;&nbsp;&gt;</a>
				</div>
			</div>
		)
	}
});