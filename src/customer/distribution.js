import React from 'react'
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import Tools from '../core/common/tools.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			searchList:[],
			selectTarget:{}
		}
	},
	distribution:function () {
		
		this.props.distribution(this.state.selectTarget)
	},

	componentDidMount:function(){
	},
	componentDidUpdate:function(){
		if(this.state.searchList && this.state.searchList.length > 0){
			Tools.imgLoadError();
		}
	},

	initDistributionSearch:function () {
		this.refs.inputVal.value = '';
		if(this.state.searchList.length){
			this.setState({
				searchList:[]
			})
		}
		this.setState({
			selectTarget:{}
		})
	},

	searchTeamList:function () {
		var self = this,
			q = this.refs.inputVal.value;

		AjaxRequest.get(APIS.detpOrStaffList+'//subordinates?q='+q, null, function(body) {

			var thisData = body.data,
				newData = [];
			for(var i=0,len=thisData.length;i<len;i++){
				var thisObj = thisData[i];
				    thisObj.checked = false;
				    thisObj.text = thisData[i].name;

				newData.push(thisObj);
			}
			self.setState({
				searchList:newData
			})

		});

	},
	selectAddTeam:function (key) {
		this.state.searchList[key].checked = !this.state.searchList[key].checked;
		this.setState(this.state.searchList);
		
		this.setState({
			selectTarget:this.state.searchList[key]
		})
	},
	
	ex:{"id":10002,"name":"亮剑组","type":"dept","headPhotoUrl":"","title":""},

	render:function(){

		var lists = this.state.searchList;

		var lis = lists.map(function(qst,key){
			return <li key={key} onClick={this.selectAddTeam.bind(this,key)}>
				<div className="tx-img"><img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" width="55" height="55" alt=""/></div>
				<p>{qst.text}</p>
				<span className={'right crm-pp '+(qst.checked?'crm-check':'')}></span>
			</li>
		}.bind(this));
		
		return (
			<div className="modal fade" id="distribution"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">选择人员</h4>
						</div>
						<div className="modal-body layer-public">
							<div id="horizontal-form">
								<div className="list_search not_type">
									<span className="crm-pp crm-glass"></span>
									<input id="personInputId" ref="inputVal" type="text" placeholder="姓名" />
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
							<button type="button" onClick={this.distribution} className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});