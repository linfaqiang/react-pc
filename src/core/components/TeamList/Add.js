import React from 'react'
import request from 'superagent';
import {APIS} from '../../common/config';
import Tools from '../../common/tools.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			searchList:[],
			isSearch:false
		}
	},
	addTeams:function () {
		var arr = [];
		var thisObj = this.state.searchList;
		for(var i=0,len=thisObj.length; i<len; i++){
			
			if(thisObj[i].checked){
				arr.push(thisObj[i].id)
			}
		}
		this.props.addTeams(arr)
	},

	componentDidMount:function(){
	},
	componentDidUpdate:function(){
		if(this.state.searchList && this.state.searchList.length > 0){
			Tools.imgLoadError();
		}
	},

	initTeamSearch:function () {
		this.refs.inputVal.value = '';
		if(this.state.searchList.length){
			this.setState({
				searchList:[]
			})
		}
	},

	searchTeamList:function () {
		var self = this,
			q = this.refs.inputVal.value;

		var url = APIS.person_list+'?q='+q;
		var chanceId = this.props.chanceId;
		var customerId = this.props.customerId;
		if(chanceId && chanceId > 0){
			url = url + "&chanceId=" + chanceId;
		}else if(customerId && customerId > 0){
			url = url + "&customerId=" + customerId;
		}
		request
			.get(url)
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
							searchList:newData,
							isSearch:true
						})
					}
				} else {
					console.log('请求失败!')
				}
			});
	},
	selectAddTeam:function (key) {

		this.state.searchList[key].checked = !this.state.searchList[key].checked;
		this.setState(this.state.searchList);
	},

	render:function(){

		var lists = this.state.searchList;
		var lis = "";
		if(lists && lists.length > 0){
			lis = lists.map(function(qst,key){
				return <li key={key} onClick={this.selectAddTeam.bind(this,key)}>
					<div className="tx-img"><img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" width="55" height="55" alt=""/></div>
					<p>{qst.name}</p>
					<span className={'right crm-pp '+(qst.checked?'crm-check':'')}></span>
				</li>
			}.bind(this));
		}else{
			if(this.state.isSearch){
				lis = <li><p>没有搜索到数据</p></li>
			}
		}

		return (
			<div className="modal fade" id="addTeamModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">新增销售团队</h4>
						</div>
						<div className="modal-body layer-public">
							<div id="horizontal-form">
								<div className="list_search not_type">
									<span className="crm-pp crm-glass"></span>
									<input id="personInputId" ref="inputVal" type="text" placeholder="输入姓名进行搜索" />
										<span className="search" onClick={this.searchTeamList}>搜索</span>
								</div>
								<ul className="tuandui-search-ul">
									{lis}
								</ul>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">取消
							</button>
							<button type="button" onClick={this.addTeams} className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});