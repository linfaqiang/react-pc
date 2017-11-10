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
		var lists = this.props.lists;

		var lis = lists.map(function(qst,key){
			return <li key={key} className="">
				<div className="left-img">
					<img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" width="65" height="65" />
				</div>
				<h5>{qst.name}</h5>
				<p>{qst.department}--{qst.title}</p>
				<p>{qst.mobile}</p>
			</li>
		}.bind(this));
		
		return (
			<div className="modal fade" id="linkmanModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">全部联系人</h4>
						</div>
						<div className="modal-body layer-public">
							<div className="detail-tab3">
								<div className="ppLi">
									<ul className="lianxiren row">
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