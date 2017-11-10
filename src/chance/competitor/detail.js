import React from 'react'

import {APIS} from '../../core/common/config.js'
import AjaxRequest from '../../core/common/ajaxRequest.js';
import Select2 from '../../core/components/Select2/Select2.js';
import '../../core/components/Select2/select2.css';
import Alert from '../../core/components/alert.js'


module.exports = React.createClass({

	getInitialState: function() {
		return {
			changed: false,
			competitorList:[],
			detailInfo:{}
		}

	},

	componentDidMount: function() {
		var id = this.props.params.id;
		if (id && id > 0) {
			this.renderEdit();
		}else{
			this.initCompetitorList();
		}

		$("#competitorForm").bootstrapValidator();
	},

	initCompetitorList:function(){
		var self = this;
		var chanceId = self.props.location.query.chanceId;
		var productId = self.props.location.query.productId;

		AjaxRequest.get(APIS.competitors_list+"?chanceId="+chanceId+"&chanceProductId="+productId, null, function(data) {
			if (data.code == 200 || data.code == '200') {
				var newList = [];
				var list = data.data;
				if(list && list.length > 0){
					for(var i=0;i<list.length;i++){
						var obj = {};
						obj.id = list[i].id;
						obj.text = list[i].competitorName;
						newList.push(obj);
					}
				}
				self.setState({
					competitorList:newList
				})
			}
		});
	},

	//将数据渲染至对应的输入框
	renderEdit:function () {
		var self = this;
		AjaxRequest.get(APIS.chance_product_rival_detail.replace("{id}",this.props.params.id), null, function(body) {
			if (body.code == 200 || body.code == '200') {
				var thisRefs = self.refs;
				var datas = body.data;
				for(var attr in thisRefs){
					self.refs[attr].value = datas[attr]
				}
				self.setState({
					detailInfo:datas
				});
			}
		});
	},

	handleSave: function() {
		var self = this;

		//校验数据
		var bootstrapValidator = $("#competitorForm").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			return false;
		}

		var id = self.props.params.id;
		if (id && id > 0) {
			var chanceCompetitorId = self.state.detailInfo.chanceCompetitorId;
			var strengths = self.refs.strengths.value;
			var weaknesses = self.refs.weaknesses.value;
			var params = {
				"strengths":strengths,
				"weaknesses":weaknesses
			}
			AjaxRequest.put(APIS.chance_rival_good_bad.replace("{id}",chanceCompetitorId), params, function(data) {
				if (data.code == "200") {
					$('#modal-success').modal();
				} else {
					$('#modal-danger').modal();
				}
			});
		} else {
			var productId = self.props.location.query.productId;
			var chanceId =  self.props.location.query.chanceId;
			var list = self.refs.competitorId.el.val();
			var info = {
				"chanceId":chanceId,
				"competitorIdList":list
			}
			AjaxRequest.post(APIS.chance_product_rival.replace("{id}",productId), info, function(data) {
				if (data.code == "200") {
					$('#modal-success').modal();
				} else {
					$('#modal-danger').modal();
				}
			});
		}
	},

	handleCancel: function() {
		history.go(-1);
	},
	renderCompetitor:function(){
		var id = this.props.params.id;
		if(id && id >0){
			return (
				<div className="input-icon icon-right">
					<input type="text" name="competitorName" className="form-control" id="competitorName" ref="competitorName" readOnly="true"/>
				</div>
			);
		}else{
			return (
				<div className="input-icon icon-right">
					<Select2
						ref="competitorId"
						multiple={true}
						style={{width:"100%"}}
						data={this.state.competitorList}
						options={{placeholder: '选择竞争对手'}}
						/>
				</div>
			);
		}
	},

	renderDiv:function() {
		var id = this.props.params.id;
		if (id && id > 0) {
			return (
				<div>
					<div className="row">
						<div className="col-sm-12">
							<div className="form-group">
								<label htmlFor="strengths">优势</label>
								<div className="input-icon icon-right">
									<input type="text" name="strengths" className="form-control" id="strengths" ref="strengths" placeholder="请输入优势"
										   data-bv-stringlength="true"
										   data-bv-stringlength-min="2"
										   data-bv-stringlength-max="300"
										   data-bv-stringlength-message="优势在2到300个字符之间"/>
								</div>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-sm-12">
							<div className="form-group">
								<label htmlFor="strengths">劣势</label>
								<div className="input-icon icon-right">
									<input type="text" name="weaknesses" className="form-control" id="weaknesses" ref="weaknesses" placeholder="请输入劣势"
										   data-bv-stringlength="true"
										   data-bv-stringlength-min="2"
										   data-bv-stringlength-max="300"
										   data-bv-stringlength-message="劣势在2到300个字符之间"/>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	},

	render: function() {

		return (
			<div>
				<div className="page-breadcrumbs">
					<ul className="breadcrumb">
						<li>
							<i className="fa fa-home"></i>
							<a href="javascript:void(0)">首页</a>
						</li>
						<li>
							<a href="javascript:void(0)">商机详情</a>
						</li>
						<li className="active">{this.props.params.id==0?'添加产品竞争对手':'编辑产品竞争对手'}</li>
					</ul>
				</div>
				<div className="page-body">
					<div className="widget">
						<div className="widget-body">

							<div className="row">
				                <div className="col-lg-6 col-sm-6 col-xs-12" style={{width:100+'%'}}>
				                    <div className="widget flat radius-bordered">
					                    <form id="competitorForm" method="post"
				                              data-bv-message="This value is not valid"
				                              data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
				                              data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
				                              data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

					                        <div className="widget-body">
					                            <div id="competitor-form">
													<div className="form-title">
														{this.props.params.id==0?'添加产品竞争对手':'编辑产品竞争对手'}
													</div>
													<div className="row">
														<div className="col-sm-12">
															<div className="form-group">
																<label htmlFor="chanceId">竞争对手</label>
																{this.renderCompetitor()}
															</div>
														</div>
													</div>
													{this.renderDiv()}
													<div className="form-group">
														<div className="buttons-preview" style={{textAlign:'left',paddingTop:10+'px'}}>
															<button onClick={this.handleCancel} className="btn btn-cancer">取消</button>
															<button id="save-btn" onClick={this.handleSave}  className="btn btn-danger">保存</button>
														</div>
													</div>

					                            </div>
					                        </div>
					                    </form>

				                    </div>
				                </div> 
				            </div>

						</div>
					</div>
				</div>
	
				<Alert result="succees"></Alert>
				<Alert result="danger"></Alert>
		
			</div>


		)
	}
});