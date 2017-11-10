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

		var divs = lists.map(function(qst,key){
			if(key > 1){
				return;
			}
			return <div className="databox-top" key={key}>
						<div className="imgbox">
							<img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto"/>
						</div>
						<div className="infoBox">
							<p className="databox-header carbon no-margin">{qst.createdBy}</p>
							<p className="databox-text gray no-margin">
								{qst.content} <span>{qst.createdOn}</span>
							</p>
						</div>
					</div>
		}.bind(this) );
		
		return (
			<div className="dataItem">
				<h5 className="row-title before-darkorange"><span>备注&nbsp;(&nbsp;<span className="num-count">{len}</span>&nbsp;)</span>
					<a className="btn" href="javascript:void(0);" data-toggle="modal" data-target="#addNoteModal">
						<i className="fa fa-plus"></i>
						备注
					</a>
				</h5>
				<div className="dataItem-body">
					<div className="baseList">
						{divs}
					</div>
					<p>
						<a href="javascript:void(0)" data-toggle="modal" data-target="#noteModal">查看全部&nbsp;&nbsp;&gt;</a>
					</p>
				</div>
			</div>
		)
	}
});