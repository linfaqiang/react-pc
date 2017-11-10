import React from 'react';
import {APIS} from '../../common/config';
import AjaxRequest from '../../common/ajaxRequest';
import Select2 from '../Select2/Select2';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			departmentList:[]
		}
	},
	addLinkmans:function () {
		var fields = this.refs, params = {};
		for (var attr in fields) {
			params[attr] = this.refs[attr].value;
			/*if(attr == 'department'){
				params[attr] = parseInt(this.refs[attr].el.val());
			}else{
				params[attr] = this.refs[attr].value;
			}*/

		}

		this.props.addLinkmans(params);

	},

	clearValue:function () {
		for (var attr in this.refs) {
			this.refs[attr].value = '';
			/*if(attr == 'department'){
				this.refs[attr].setValue('');
			}else{
				this.refs[attr].value = '';
			}*/
		}
	},
	
	componentDidMount:function(){
		$('.date-picker').datepicker({
			local:'ZH_CN'
		});
		//this.getDepartmentList();

	},
	/*getDepartmentList:function () {
		var self = this;
		AjaxRequest.get(APIS.dept_list, '', function(data){
			if(data.code="200"){
				var arr = [];
				for(var i=0,len=data.data.length;i<len;i++){
					arr.push({
						text:data.data[i].deptName,
						id:data.data[i].deptId
					})
				}
				self.setState({
					departmentList:arr
				})
			}else{
				console.log('请求失败!')
			}
		});
	},*/

	render:function(){
		
		return (
			<div className="modal fade" id="addLinkmanModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">新增联系人</h4>
						</div>
						<div className="modal-body layer-public">
							<div id="horizontal-form">
								<form className="form-horizontal linkman-form" role="form">
									<div className="linkman-add">
										<label>联系人姓名</label>
										<input type="text" ref="name" className="form-control"/>
									</div>
									<div className="linkman-add">
										<label>职务</label>
										<input type="text" ref="title" className="form-control"/>
									</div>
									<div className="linkman-add">
										<label>电话</label>
										<input type="text" ref="telephone" className="form-control"/>
									</div>
									<div className="linkman-add">
										<label>手机</label>
										<input type="text" ref="mobile" className="form-control"/>
									</div>
									<div className="linkman-add">
										<label>所属部门</label>
										<input type="text" ref="department" className="form-control"/>
									</div>
									<div className="linkman-add">
										<label>微信</label>
										<input type="text" ref="wechat" className="form-control"/>
									</div>
									<div className="linkman-add">
										<label>email</label>
										<input type="text" ref="email" className="form-control"/>
									</div>
									<div className="linkman-add">
										<label>生日</label>
										<div className="input-group">
											<input className="form-control date-picker" ref="birthday" name="extimateDealDate"
												   id="extimateDealDate" type="text" placeholder="请选择生日"
												   data-date-format="yyyy-mm-dd" />
											<span className="input-group-addon">
												<i className="fa fa-calendar"></i>
											</span>
										</div>
									</div>
									<div className="linkman-add">
										<label>QQ</label>
										<input type="text" ref="qq" className="form-control"/>
									</div>

								</form>
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