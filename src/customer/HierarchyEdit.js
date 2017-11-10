import React from 'react';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest';
import Select2 from '../core/components/Select2/Select2';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			parentList:[],
			childrenList:[],

			addSunComponent:false,  //添加子客户选项
			addParentComponent:false,  //添加父客户选项

			addChildrenBtn:true,   //添加子客户按钮
			addParentBtn:true,   //添加父客户按钮
			parentRemark:''

	    }
	},
	componentDidMount:function(){

		var self = this,
			thisUrl = APIS.customerDetail+'getNotSubsidiaryCustomer/'+this.props.ids;
		AjaxRequest.get(thisUrl, '', function(data){
			if(data.code="200"){

				var lists = data.data,
					arr = [];
				for(var i=0,len=lists.length;i<len;i++){
					arr.push({
						text:lists[i].name,
						id:lists[i].id
					})
				}

				self.setState({
					parentList:arr,
					childrenList:arr
				});

			}else{
				console.log('请求失败!')
			}
		});

	},

	showAddSun:function () {   //添加子客户按钮事件
		this.setState({
			addSunComponent:true,
			addChildrenBtn:false
		});
		this.refs.subdirectories.setValue('');

	},
	showAddParent:function () {   //添加父客户按钮事件
		this.setState({
			addParentComponent:true,
			addParentBtn:false
		})
	},

	setShowHideBtn:function () {     //设置按钮和添加选择的显示隐藏

		var flag = this.props.hierarchyList;

		if(flag.parent && flag.parent.id){
			this.setState({
				addParentComponent:false,
				addParentBtn:false
			})
		}else{
			this.setState({
				addParentComponent:false,
				addParentBtn:true
			})
		}

		if(flag.subdirectories.length){
			this.setState({
				addSunComponent:false,
				addChildrenBtn:true
			})
		}else{
			this.setState({
				addSunComponent:false,
				addChildrenBtn:true
			})
		}

		this.setState({
			parentRemark:this.props.hierarchyList.parent.remark || ''
		});
	},

	addChildren:function () {
		var self = this,
			thisUrl = APIS.customerDetail+'updateCustomerCorrelationChart',
			param = {
				id: this.refs.subdirectories.el.val(),
				name:this.refs.subdirectories.el.find("option:selected").text(),
				parentId: this.props.ids
			};
		if(!param.id){
			toastr.error('请选择子客户');
			return;
		}

		bootbox.confirm("确认要添加子客户吗?", function (result) {
			if(result){
				AjaxRequest.put(thisUrl, param, function(data){
					if(data.code="200"){

						self.props.refreshHierarchy();

						toastr.success('添加子客户成功!');

					}else{
						toastr.error('添加子客户失败!')
					}
				});
			}

		})


	},

	changeParent:function () {
		var self = this,
			thisUrl = APIS.customerDetail+'updateCustomerCorrelationChart',
			param = {
				id:this.props.ids,
				name:this.props.thisName,
				parentId:this.refs.parent.el.val()
			};

		bootbox.confirm("确认要添加父客户吗?", function (result) {
			if(result){
				AjaxRequest.put(thisUrl, param, function(data){
					if(data.code="200"){

						self.props.refreshHierarchy();
						toastr.success('添加父客户成功!')

					}else{
						toastr.error('添加父客户失败!')
					}
				});
			}
		})

	},

	deleteParent:function () {
		var self = this,
			thisUrl = APIS.customerDetail+this.props.ids+'/removeCustomerCorrelationChart';

		bootbox.confirm("确认要解除父客户吗?", function (result) {
			if(result){
				AjaxRequest.put(thisUrl, '', function(data){
					if(data.code="200"){
						self.props.refreshHierarchy();
						toastr.success('解除父客户成功!')
					}else{
						toastr.error('解除父客户失败!')
					}
				});
			}
		})
	},

	deleteChildren:function (obj) {
		var self = this,
			thisUrl = APIS.customerDetail+obj.id+'/removeCustomerCorrelationChart';
		bootbox.confirm("确认要删除子客户吗?", function (result) {
			if(result){
				AjaxRequest.put(thisUrl, '', function(data){
					if(data.code="200"){
						self.props.refreshHierarchy();
						toastr.success('删除子客户客户成功!')

					}else{
						toastr.error('解除父客户失败!')
					}
				});
			}
		})

	},
	changeParentNote:function () {
		var self = this,
			thisUrl = APIS.customerDetail+'updateCustomerCorrelationChart',
			param = {
				id:this.props.ids,
				name:this.props.thisName,
				parentRemark:this.refs.parentNote.value
			};
		AjaxRequest.put(thisUrl, param, function(data){
			if(data.code="200"){

				self.props.refreshHierarchy();
				bootbox.success('修改备注成功!')

			}else{
				toastr.error('修改备注失败!')
			}
		});
	},
	changeSunNote:function (obj) {
		var self = this,
			thisUrl = APIS.customerDetail+'updateCustomerCorrelationChart',
			param = {
				id:obj.id,
				name:obj.name,
				parentRemark:this.refs['child-'+obj.id].value
			};
		AjaxRequest.put(thisUrl, param, function(data){
			if(data.code="200"){

				self.props.refreshHierarchy();
				toastr.success('修改备注成功!')

			}else{
				toastr.error('修改备注失败!')
			}
		});
	},
	onTextChange:function (e) {
		var val = e.target.value;

		this.setState({
			parentRemark:val
		})
	},
	noChange:function () {

	},


	render:function(){
		
		var lists = this.props.hierarchyList.subdirectories;

		var childrens = lists.map(function(qst,key){
			return <div key={key} className="hierarchy-list clearfix">
				        <input className="hierarchy-child form-control" onChange={this.noChange}  value={qst.name}/>
						<input type="text" ref={'child-'+qst.id}
							   className="hierarchy-note form-control"
							   defaultValue={qst.remark || ''} placeholder="请输入备注"/>
				        <button className="margin-left-10" onClick={this.changeSunNote.bind(this,qst)}>修改备注</button>
						<a href="javascript:void(0)"
						   onClick={this.deleteChildren.bind(this,qst)}
						   className="btn btn-danger btn-xs delete">
						<i className="fa fa-trash-o"></i> 删除 </a>
					</div>
		}.bind(this));
		
		return (
			<div className="modal fade" id="hierarchyEdit" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">编辑客户层级</h4>
						</div>
						<div className="modal-body">
							<div className="layer-hierarchy">
								<h5 className="text-align-left">父客户</h5>
								<a href="javascript:void(0)"
								   style={{display : this.state.addParentBtn? 'block' : 'none'}}
								   className="btn hierarchy-add btn-default btn-add"
								   onClick={this.showAddParent}><i className="fa fa-plus"></i>添加父客户</a>
								<div className="hierarchy-list clearfix"
									 style={{display : this.state.addParentComponent ? 'block' : 'none'}}>
									<Select2
										ref="parent"
										multiple={false}
										data={this.state.parentList}
										value=""

									/>
									<button className="margin-left-10" onClick={this.changeParent}>确认添加</button>
								</div>
								<div className="hierarchy-list clearfix"
									 style={{display : this.props.hierarchyList.parent.id ? 'block' : 'none'}}>
									<input onChange={this.noChange}  className="hierarchy-child form-control"  value={this.props.hierarchyList.parent.name}/>
									<input type="text"   className="hierarchy-note form-control" ref="parentNote" onChange={this.onTextChange}  value ={this.state.parentRemark} placeholder="请输入备注"/>
									<button className="margin-left-10" onClick={this.changeParentNote}>修改备注</button>
									<a href="javascript:void(0)" onClick={this.deleteParent} className="btn btn-danger btn-xs delete">
										<i className="fa fa-trash-o"></i> 删除
									</a>
								</div>
							</div>
							<div className="layer-hierarchy">
								<h5 className="text-align-left">子客户</h5>
								<a href="javascript:void(0)" onClick={this.showAddSun}
								   style={{display:this.state.addChildrenBtn?'block':'none'}}
								   className="btn hierarchy-add btn-default btn-add"><i className="fa fa-plus"></i>添加子客户</a>
								<div className="hierarchy-list clearfix" style={{display:this.state.addSunComponent?'block':'none'}}>
									<Select2
										ref="subdirectories"
										multiple={false}
										data={this.state.childrenList}
										value=""
									/>
									<button className="margin-left-10" onClick={this.addChildren}>确认添加</button>
								</div>
								{childrens}

							</div>
							
						</div>
						<div className="modal-footer">
							<div className="modal-footer">
								<button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
								<button type="button" className="btn btn-danger" data-dismiss="modal">确认</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});