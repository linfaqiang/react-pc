import React from 'react'
import request from 'superagent';
import {APIS} from '../../common/config';
import Tools from '../../common/tools.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			searchList:[]
		}
	},
	addLinkmans:function () {
		var arr = [];
		var thisObj = this.state.searchList;
		for(var i=0,len=thisObj.length; i<len; i++){
			
			if(thisObj[i].checked){
				arr.push(thisObj[i].id)
			}
		}
		this.props.addLinkmans(arr)
	},

	componentDidMount:function(){
	},
	componentDidUpdate:function(){
		if(this.state.searchList && this.state.searchList.length > 0){
			Tools.imgLoadError();
		}
	},
	initLinkmanSearch:function () {
		this.refs.inputVal.value = '';
		if(this.state.searchList.length){
			this.setState({
				searchList:[]
			})
		}
	},

	searchLinkmanList:function () {
		var self = this,
			q = this.refs.inputVal.value;

		request
			.get(APIS.contact_list+'?q='+q+"&chanceId="+this.props.chanceId)
			.send('')
			.set('Content-Type', 'application/json;charset=utf-8')
			.end(function(err,res){
				if (res.ok) {
					if (res.body.code == '200') {
						var newData = res.body.data;
						for(var i=0,len=newData.length;i<len;i++){
							newData[i].checked = false;
						}
						self.setState({
							searchList:newData
						})
					}
				} else {
					console.log('请求失败!')
				}
			});
	},
	selectAddLinkman:function (key) {
		this.state.searchList[key].checked = !this.state.searchList[key].checked;
		this.setState(this.state.searchList);
	},

	render:function(){

		var lists = this.state.searchList;

		var lis = lists.map(function(qst,key){
			return <li key={key} onClick={this.selectAddLinkman.bind(this,key)}>
				<div className="tx-img"><img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" width="55" height="55" alt=""/></div>
				<p>{qst.name}</p>
				<span className={'right crm-pp '+(qst.checked?'crm-check':'')}></span>
			</li>
		}.bind(this));
		
		return (
			<div className="modal fade" id="addLinkmanSearchModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">添加联系人</h4>
						</div>
						<div className="modal-body layer-public">
							<div id="horizontal-form">
								<div className="list_search not_type">
									<span className="crm-pp crm-glass"></span>
									<input id="personInputId" ref="inputVal" type="text" placeholder="输入姓名搜索" />
										<span className="search" onClick={this.searchLinkmanList}>搜索</span>
								</div>
								<ul className="tuandui-search-ul">
									{lis}
								</ul>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">取消
							</button>
							<button type="button" onClick={this.addLinkmans} className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});