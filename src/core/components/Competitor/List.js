import React from 'react';
// import request from 'superagent';
import AjaxRequest from '../../common/ajaxRequest.js';
import {APIS} from '../../common/config';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			listShow:true,
			delShow:false
		}
	},
	
	componentDidMount:function(){

	},
	//点击删除产品按钮时
	btnDel:function(){
		this.setState({
			listShow:false,
			delShow:true
		});
	},
	deleteClick:function(id){
		var self = this;
		bootbox.confirm("确认删除吗?", function (result) {
			if (result) {
				AjaxRequest.delete(APIS.chance_rival_good_bad.replace('{id}',id), null, function(data) {
					if (data.code == 200 || data.code == '200') {
						toastr.info('删除成功！');
                        self.props.getCompetitor();
					}
				});
/*
				request
					.del()
					.send('')
					.set('Content-Type', 'application/json;charset=utf-8')
					.end(function(err,res){
						if (res.ok) {
							if (res.body.code == '200') {
								alert("删除成功！");
								self.props.getCompetitor();
							}
						} else {
							console.log('请求失败!')
						}
					});
*/
			}
		});
	},
	competitorCancelBtn:function () {
		this.setState({
			listShow:true,
			delShow:false
		})
	},
	render:function(){
		var lists = this.props.lists,
			len = lists.length;
		var delShow = this.state.delShow;
		var lis = lists.map(function(qst,key){
			if(!delShow && key > 1){
				return;
			}
			return <li key={key}>
						<p>{qst.competitorName}</p>
						<a onClick={this.deleteClick.bind(this,qst.id)} className="btn btn-danger btn-sm" style={{display:this.state.delShow ? 'block' : 'none',position: 'absolute',right: 36+'px',top: 12+'px'}} href="javascript:void(0);"><i className="fa fa-times"></i>删除</a>
					</li>
		}.bind(this) );
		
		return (
			<div className="ppLi">
				<div style={{display:this.state.listShow ? 'block' : 'none'}}>
					<h3 className="padding-left-20">竞争对手 ({len})</h3>
					<div className="top-btn">
						<a href="javascript:void(0)" onClick={this.props.initCompetitorList} className="btn btn-default btn-add" data-target="#addCompetitorModal" data-toggle="modal">添加对手</a>
						<a href="javascript:void(0)" className="btn btn-default btn-add" onClick={this.btnDel}>删除对手</a>
					</div>
					<ul className="competitor row">
						{lis}
					</ul>
					<div className="detail-bottom-pp">
						<a href="javascript:void(0)" onClick={this.props.bindInputValue} data-toggle="modal" data-target="#competitorModal">查看全部&nbsp;&nbsp;&gt;</a>
					</div>
				</div>

				<div style={{display:this.state.delShow ? 'block' : 'none', width:100+'%',height:350+'px'}}>
					<div className="well with-header" style={{background:'#fff',height:'100%',overflow:'auto'}}>
						<div className="header bordered-blue">
							<div style={{float:'left',width:400+'px',paddingTop:10+'px',paddingLeft:10+'px'}}>
								<h4 className="modal-title">删除竞争对手</h4>
							</div>

							<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
								<button onClick={this.competitorCancelBtn} className="btn btn-cancer">取消</button>
							</div>
						</div>
						<div style={{marginTop:30+'px'}}>
							<ul className="competitor row">
								{lis}
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
});