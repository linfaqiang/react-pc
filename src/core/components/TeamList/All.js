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
				<div className="tx-img"><img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" width="55" height="55" alt=""/></div>
				<p>{qst.staffName}</p>
			</li>
		}.bind(this));
		
		return (
			<div className="modal fade" id="teamModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">销售团队</h4>
						</div>
						<div className="modal-body layer-public">
							<div className="detail-tab3">
								<div className="ppLi">
									<ul className="tuandui row">
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