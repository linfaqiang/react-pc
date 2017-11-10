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
		var lists = this.props.lists;
		//let userInfo = UserInfo.get();
		//let headPhotoUrl = userInfo.headPhotoUrl;

		var lis = lists.map(function(qst,key){
			return <li key={key}>
				<div className="tx-img">
					<img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" alt={qst.headPhotoUrl? '': '暂无头像'} width="55" height="55" alt=""/>
				</div>
				<h5>{qst.createdBy}</h5>
				<p>{qst.content}</p>
				<span className="time">{qst.createdOn}</span>
			</li>
		}.bind(this));
		
		return (
			<div className="modal fade" id="noteModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">备注</h4>
						</div>
						<div className="modal-body layer-public">
							<div className="detail-tab3">
								<div className="ppLi">
									<ul className="beizhu row">
										{lis}
									</ul>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});