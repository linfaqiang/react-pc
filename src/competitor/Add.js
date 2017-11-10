import React from 'react';
import CONFIG from '../core/common/config.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Alert from '../core/components/alert.js';
import CurrentPosition from '../core/components/layout/CurrentPosition'
import ThreeLevel from '../core/components/ThreeLevel/threeLevel';
var AreaComponents = React.createFactory(ThreeLevel);

module.exports = React.createClass({

	getInitialState: function() {
		return {
			competitorId:false,
			prov: '',        //三级联动
			city: '',
			county: '',
			competitorInfo: {
				"id": 0,
				"competitorName": "",
				"competitorPhone": "",
				"remrakId": 0,
				"remark": "",
				"status": 5,
				"fromEntityType": "",
				"inputSource": 0,
				"address": {
					"id":null,
					"address":"",
					"country":"中国",
					"adcode":""
				},
			}
		};

	},
	//选择省份
	selectProvs: function (data) {
		this.setState({
			prov: data,
			city: '',
			county: ''
		})
	},
	//选择城市
	selectCitys: function(data){
		this.setState({
			city: data,
			county: ''
		})
	},
	//选择地区
	selectCountys: function(data){
		var newState = this.state.competitorInfo;
		newState.address.adcode = data;
		this.setState({
			county: data,
			competitorInfo:newState
		})
	},
	componentDidMount: function(param) {
		var self = this;

		var id = self.props.params.id;
		if (id && id > 0) {
			var url = CONFIG.APIS.competitor + "/" + id;
			AjaxRequest.get(url, null, function(body) {
				if(body.code == 200 ||body == '200'){
					var info = self.state.competitorInfo;
					for (var key in info) {
						if (key == "address") {
							for (var k in info[key]) {
								info[key][k] = body.data[key][k];
							}
						} else {
							info[key] = body.data[key];
						}
					}
					var path = body.data["regionPath"];
					var subStr = path.split(",");
					if(subStr && subStr.length > 0){
						var province = subStr[0];
						var city = subStr[1];
						var county = 0;
						if(subStr.length > 2){
							county = subStr[2];
						}
						self.refs.adcode.resetStates({
							prov:province,
							city:city,
							county:county
						});
						self.setState({
							prov: province,        //三级联动
							city: city,
							county: county
						});
					}

					self.setState({
						competitorInfo: info
					});
				}
			});
		};
		$("#competitorForm").bootstrapValidator();
	},


	handleChange: function(e) {
		var newState = this.state.competitorInfo;
		var name = e.target.name;
		if(name == 'address'){
			newState.address.address = e.target.value;
		}else{
			newState[name] = e.target.value;
		}
		this.setState({
			competitorInfo: newState,
			competitorId: true
		});
	},
	handleSave: function(e) {
		var self = this;

		var bootstrapValidator = $("#competitorForm").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			return false;
		}

		var info = this.state.competitorInfo;
		var id = self.props.params.id;
		if (id && id > 0) {
			AjaxRequest.put(CONFIG.APIS.competitor + '/' + id, info, function(data) {
				if (data.code == 200) {
					$('#modal-success').modal();

				} else {
					$('#modal-danger').modal();
				}
			});
		} else {
			AjaxRequest.post(CONFIG.APIS.competitor, info, function(data) {
				if (data.code == 200) {
					$('#modal-success').modal();

				} else {
					$('#modal-danger').modal();
				}
			});
		}
	},

	handleCancel: function() {
		if (this.state.competitorId) {
			bootbox.confirm("表单已修改，你确定不保存退出吗?", function(result) {
				if (result) {
					history.go(-1);
				}
			});

		} else {
			history.go(-1);
		}

	},


	render: function() {
		var style100 = {
			width: "100%"
		};

		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<ul className="nav nav-tabs myTab noBorLR">
									<li className="dropdown active">
										<a>
											{this.props.route.name}
										</a>
									</li>
								</ul>
								<form id="competitorForm" method="post"
									  data-bv-live={navigator.userAgent.match('Trident') ? 'disabled' : 'enabled'}
									  data-bv-message="This value is not valid"
									  data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
									  data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
									  data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

									<div className="widget-body padding-20" style={{boxShadow: 'none'}}>
										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="competitorName">竞争对手名称<sup>*</sup></label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control"
															   value={this.state.competitorInfo.competitorName}
															   onChange={this.handleChange}
															   name="competitorName" id="competitorName" placeholder="请输入竞争对手名称"
															   data-bv-notempty="true"
															   data-bv-notempty-message="竞争对手名称必须输入"
															   data-bv-stringlength="true"
															   data-bv-stringlength-min="2"
															   data-bv-stringlength-max="100"
															   data-bv-stringlength-message="竞争对手名称在2到100个字符之间"/>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="competitorPhone">竞争对手电话<sup>*</sup></label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control"
															   value={this.state.competitorInfo.competitorPhone}
															   onChange={this.handleChange}
															   name="competitorPhone" id="competitorPhone" placeholder="请输入竞争对手电话，电话格式区号+号码，区号以0开头，3位或4位"
															   data-bv-notempty="true"
															   data-bv-notempty-message="竞争对手电话必须输入"
															   data-bv-regexp="true"
															   data-bv-regexp-regexp="^0\d{2,3}-?\d{7,8}$"
															   data-bv-regexp-message="请输入正确格式的电话号码"/>
													</div>
												</div>
											</div>
										</div>

										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label>公司地址<sup>*</sup></label>
													<div>
														{
															AreaComponents({
																ref:'adcode',
																data: __areaData__,
																options: {
																	prov:this.state.prov,
																	city:this.state.city,
																	county:this.state.county,
																	defaultText:['省份','城市','区县']
																},
																selectProvs:this.selectProvs,
																selectCitys:this.selectCitys,
																selectCountys:this.selectCountys
															})
														}
													</div>
													<div className="form-group">
														<div className="input-icon icon-right">
															<input type="text" name="address" id="address" placeholder="详细街道(具体地址)" className="form-control" value={this.state.competitorInfo.address.address} onChange={this.handleChange}/>
														</div>
													</div>
												</div>
											</div>
											{/*<div className="col-sm-6">
											 <div className="form-group">
											 <label htmlFor="remark">详细地址<sup></sup></label>
											 <div className="input-icon icon-right">
											 <input type="text" name="address" id="address" placeholder="详细街道(具体地址)" className="form-control" value={this.state.competitorInfo.address.address} onChange={this.handleChange}/>
											 </div>
											 </div>
											 </div>*/}
										</div>
										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label htmlFor="description">备注</label>
													<div className="input-icon icon-right">
															<textarea className="form-control"
																	  value={this.state.competitorInfo.remark}
																	  onChange={this.handleChange}
																	  disabled={this.props.params.id && this.props.params.id > 0 ?true:false}
																	  rows="3"
																	  id="remark"
																	  placeholder="请输入备注"
																	  data-bv-stringlength-min="2"
																	  data-bv-stringlength-max="500"
																	  data-bv-stringlength-message="备注在2到500个字符之间"
																	  name="remark"></textarea>
													</div>
												</div>
											</div>
										</div>
									</div>
									<hr />
									<div className="widget-header noShadow padding-20">
										<div className="buttons-preview" style={{textAlign:'left',paddingTop:10+'px'}}>
											<input type="button" onClick={this.handleCancel} className="btn btn-cancer" value="取消" />
											<button id="btnSave" onClick={this.handleSave}  className="btn btn-danger">保存</button>
										</div>
									</div>
								</form>
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