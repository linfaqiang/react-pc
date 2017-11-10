import React from 'react'

import TabSelect2 from '../core/components/PublicSelect/TabSelect2.js';
import Constants from '../core/common/constants.js';
import dicts from '../core/common/dicts.js';
import CONFIG from '../core/common/config.js';
import AjaxRequest from '../core/common/ajaxRequest.js';

import store from './store'

export default class Buttons extends React.Component{
	constructor (props) {
		super(props);
		var self = this;
		self.state = store.data;
		dicts.get(function(){
			store.data. priceSourceList = Dicts.PRICE_SOURCE_LIST;
			self.state = store.data;
		});

		AjaxRequest.get(CONFIG.APIS.staffs_subs, null, function(body){
			self.state.staffList = body.data;
			store.data.staffList = body.data;
		});

		self.unsubscribe = store.listen(self.onStatusChange.bind(self));
	}

	componentWillUnmount () {
		this.unsubscribe();
	}

	componentDidMount () {
		var self = this;
		var dpicker = $('.date-picker');
		dpicker.datepicker({
			local:'ZH_CN'
		});//日期控件特殊处理
		dpicker.on('changeDate', function(e){
			var index = dpicker.index(e.target);
			if(index === 0){
				self.state.queryParam.startCreatedOn = e.target.value;
			}
			if(index === 1){
				self.state.queryParam.endCreatedOn = e.target.value;
			}
			self.setState({queryParam:store.data.queryParam});
		});
	}

	onStatusChange (data) {
		this.setState(data);
	}
	handleListTypeChange(index,name){
		var self = this;
		var selectType = {name:name,index:index};

        if(!self.state.Permit.isLeader) return;//销售员不能选

		this.resetStoreQueryParam();

		if(index == 0){//全部报价
			self.setState({hideMineStatus:false});
			self.setState({hideApprovalStatus:false});
		}
		if(index == 1){//我的报价
			self.setState({hideMineStatus:false});
			self.setState({hideApprovalStatus:true});
		}
		if(index == 2){//报价审批
			self.setState({hideMineStatus:true});
			self.setState({hideApprovalStatus:false});
		}
		store.data.listType = selectType;
		self.setState({listType:store.data.listType});
		self.setState({queryParam:store.data.queryParam});
		self.props.getData();
	}

	handleFieldChange(fieldName, e){//字段值改变
		var self = this;
		var val = e.target.value;

		if(fieldName === 'status'){
			val = parseInt(val);
		}

		self.state.queryParam[fieldName] = val;
		self.setState({queryParam:store.data.queryParam});
	}
	handlerToggleFilterLayer() {
		var self = this;
		self.setState({
			showFilterLayer:!self.state.showFilterLayer
		});
	}
	handlerConfirmFilter() {
		var self = this;
		self.setState({showFilterLayer:false});
		self.props.getData();
	}

	handlerResetFilter() {
		this.resetStoreQueryParam();
		this.refs.startCreatedOn.value = this.state.queryParam.startCreatedOn;
		this.refs.endCreatedOn.value = this.state.queryParam.endCreatedOn;

		this.setState({queryParam:store.data.queryParam});
	}

	resetStoreQueryParam(){
		store.data.queryParam.q = "";
		store.data.queryParam.status = -1;
		store.data.queryParam.isApproved = "";
		store.data.queryParam.chanceName = "";
		store.data.queryParam.startCreatedOn = "";
		store.data.queryParam.endCreatedOn = "";
	}

	render() {
        var self = this;
		var style100 = {width:"100%"};
		var style_form_group = {display: "block", marginBottom: "15px", verticalAlign: "middle"};

		function setListTypes(){
            var data = new Array();
            var permit = self.state.Permit;

            if(!permit.isLeader){
                data.push(Constants.priceListTypesLang[1]);
                return data;
            }else{
                data = Constants.priceListTypesLang;
                return data;
            }
        }

		return (
			<ul className="nav nav-tabs myTab">
				<TabSelect2 liList={setListTypes()}  curentSelect={this.state.listType} setSelectType={this.handleListTypeChange.bind(this)}/>

				<div className="DTTT btn-group">
					<a className="btn btn-default DTTT_button_copy" onClick={this.props.goAdd}>
						<i className="fa fa-plus"></i>
						<span>创建 </span>
					</a>
					<a onClick={this.handlerToggleFilterLayer.bind(this)} className="btn btn-default DTTT_button_collection">
						<i className="fa fa-filter"></i>
						<span>筛选 <i className="fa fa-angle-down"></i></span>
					</a>
				</div>

				<div style={{display:this.state.showFilterLayer ? 'block' : 'none', width:380+'px',height:'auto', zIndex:100, position:'absolute',right:1+'px',top:42+'px'}}>
					<div className="well with-header" style={{background:'#fff',height:'100%'}}>
						<div className="header bordered-blue">
							<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
								<button onClick={this.handlerResetFilter.bind(this)} className="btn btn-cancer">重置</button>
								<button onClick={this.handlerConfirmFilter.bind(this)} className="btn btn-danger">确定</button>
							</div>
						</div>
						<div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
							<div className="form-group" style={style_form_group}>
								<label htmlFor="filterCustomer">{Constants.priceLang.quotationName}</label>
								<input type="text"
									   value={this.state.queryParam.q||""}
									   className="form-control"
									   id="filterCustomer"
									   placeholder={Constants.priceLang.quotationName}
									   style={style100}
									   onChange={this.handleFieldChange.bind(this, 'q')} />
							</div>
							<div className="form-group" style={style_form_group}>
								<label htmlFor="filterCustomer">商机</label>
								<input type="text"
									   value={this.state.queryParam.chanceName||""}
									   className="form-control"
									   id="filterClue"
									   placeholder={'商机名称'}
									   style={style100}
									   onChange={this.handleFieldChange.bind(this, 'chanceName')}  />
							</div>
							<div className={this.state.hideMineStatus ? "form-group hide" : "form-group"} style={style_form_group}>
								<label>状态</label><br />
								<select className="form-control" style={style100} onChange={this.handleFieldChange.bind(this, 'status')} value={this.state.queryParam.status}>
									<option value="-1">全部</option>
									<option value="0">拟定</option>
									<option value="1">审批中</option>
									<option value="2">已同意</option>
									<option value="3">已拒绝</option>
								</select>
							</div>
							<div className={this.state.hideApprovalStatus ? "form-group hide" : "form-group"} style={style_form_group}>
								<label>审批分类</label><br />
								<select className="form-control" style={style100} onChange={this.handleFieldChange.bind(this, 'isApproved')} value={this.state.queryParam.isApproved}>
									<option value="">全部</option>
									<option value="0">未审批</option>
									<option value="1">已审批</option>
								</select>
							</div>
							<div className="form-group" style={style_form_group}>
								<label>创建日期起</label><br />
								<div className="input-group">
									<input ref="startCreatedOn" className="form-control date-picker" value={this.state.startCreatedOn} type="text" placeholder="请选择创建日期起" data-date-format="yyyy-mm-dd" />
									<span className="input-group-addon"><i className="fa fa-calendar"></i></span>
								</div>
							</div>
							<div className="form-group" style={style_form_group}>
								<label>创建日期止</label><br />
								<div className="input-group">
									<input ref="endCreatedOn" className="form-control date-picker" value={this.state.endCreatedOn} type="text" placeholder="请选择创建日期止" data-date-format="yyyy-mm-dd" />
									<span className="input-group-addon"><i className="fa fa-calendar"></i></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</ul>
		);

		/*return (
			<div style={{marginBottom:8 + 'px'}}>
				<TabSelect liList={setListTypes()}  curentSelect={this.state.listType} setSelectType={this.handleListTypeChange.bind(this)}/>

				<div className="DTTT btn-group" style={{right:0+'px'}}>
					<a className="btn btn-default DTTT_button_copy" href="#/price/add/0">
						<i className="fa fa-plus"></i>
						<span>创建 </span>
					</a>
					<a onClick={this.handlerToggleFilterLayer.bind(this)} className="btn btn-default DTTT_button_collection">
						<i className="fa fa-filter"></i>
						<span>筛选 <i className="fa fa-angle-down"></i></span>
					</a>
				</div>

				<div style={{display:this.state.showFilterLayer ? 'block' : 'none', width:380+'px',height:'auto', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
					<div className="well with-header" style={{background:'#fff',height:'100%'}}>
						<div className="header bordered-blue">
							<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
								<button onClick={this.handlerResetFilter.bind(this)} className="btn btn-cancer">重置</button>
								<button onClick={this.handlerConfirmFilter.bind(this)} className="btn btn-danger">确定</button>
							</div>
						</div>
						<div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
							<div className="form-group" style={style_form_group}>
								<label htmlFor="filterCustomer">{Constants.priceLang.quotationName}</label>
								<input type="text"
									   value={this.state.queryParam.q||""}
									   className="form-control"
									   id="filterCustomer"
									   placeholder={Constants.priceLang.quotationName}
									   style={style100}
									   onChange={this.handleFieldChange.bind(this, 'q')} />
							</div>
							<div className="form-group" style={style_form_group}>
								<label htmlFor="filterCustomer">商机</label>
								<input type="text"
									   value={this.state.queryParam.chanceName||""}
									   className="form-control"
									   id="filterClue"
									   placeholder={'商机名称'}
									   style={style100}
									   onChange={this.handleFieldChange.bind(this, 'chanceName')}  />
							</div>
							<div className={this.state.hideMineStatus ? "form-group hide" : "form-group"} style={style_form_group}>
								<label>状态</label><br />
								<select className="form-control" style={style100} onChange={this.handleFieldChange.bind(this, 'status')} value={this.state.queryParam.status}>
									<option value="-1">全部</option>
									<option value="0">拟定</option>
									<option value="1">审批中</option>
									<option value="2">已同意</option>
									<option value="3">已拒绝</option>
								</select>
							</div>
							<div className={this.state.hideApprovalStatus ? "form-group hide" : "form-group"} style={style_form_group}>
								<label>审批分类</label><br />
								<select className="form-control" style={style100} onChange={this.handleFieldChange.bind(this, 'isApproved')} value={this.state.queryParam.isApproved}>
									<option value="">全部</option>
									<option value="0">未审批</option>
									<option value="1">已审批</option>
								</select>
							</div>
							<div className="form-group" style={style_form_group}>
								<label>创建日期起</label><br />
								<div className="input-group">
									<input ref="startCreatedOn" className="form-control date-picker" value={this.state.startCreatedOn} type="text" placeholder="请选择创建日期起" data-date-format="yyyy-mm-dd" />
									<span className="input-group-addon"><i className="fa fa-calendar"></i></span>
								</div>
							</div>
							<div className="form-group" style={style_form_group}>
								<label>创建日期止</label><br />
								<div className="input-group">
									<input ref="endCreatedOn" className="form-control date-picker" value={this.state.endCreatedOn} type="text" placeholder="请选择创建日期止" data-date-format="yyyy-mm-dd" />
									<span className="input-group-addon"><i className="fa fa-calendar"></i></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)*/
	}
}


/**
 * <label>
 <label htmlFor="approval">{Constants.priceLang.approavalText} ({this.state.queryParam.isApproved !== "" ? this.state.approvalStatus[this.state.queryParam.isApproved] : ""})：&nbsp;&nbsp;</label>
 <input id="approval" ref="approval" onChange={this.handleApprovedChange.bind(this)} data-value="0" className="checkbox-slider toggle colored-success" type="checkbox" />
 <span className="text my" style={{verticalAlign: "-8px"}}></span>
 </label>
 */