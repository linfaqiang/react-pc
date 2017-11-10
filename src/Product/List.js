import React from 'react';
import TableView from '../core/components/TableList/TableView.js';
import TabSelect2 from '../core/components/PublicSelect/TabSelect2.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Detail from './Detail';
import {APIS} from '../core/common/config';
import UserInfo from '../core/common/UserInfo.js';

module.exports = React.createClass({

	getInitialState: function() {
		var isManger = UserInfo.isManager();
		return {
			isManger: isManger,
			initParam: { //筛选参数
				"q": "",
				"productTypeId": '',
				"pageNo": 1,
				"pageSize": 10,
				"selectType":0//0:全部产品；1:最新产品
			},
			selectShow: false, //帅选框显示/隐藏
			liList: [{ //帅选类型
				name: '全部产品',
				index: 0
			}, {
				name: '最新产品',
				index: 1
			}, {
				name: '我关注的产品',
				index: 2
			}],
			curentSelect: { //当前帅选到的类型 
				name: '全部产品',
				index: 0
			},
			tableData: { //存放表头
				tableName: 'product',
				url: APIS.product_list,
				th: [{
					name: '产品名称',
					width: 146
				}, {
					name: '类别',
					width: 220
				}, {
					name: '产品价格',
					width: 96
				}],
				tr: ['productName', 'productTypeText', 'productPrice']
			},
			productTypeList: [], //产品类型
			detailData: {},
			currentProductId: '',
		}
	},
	setSelectType: function(index, text) {

		this.setState({
			curentSelect: {
				name: text,
				index: index
			}
		});

		//如果选择的是"我关注的客户",ulr不同
		if (index == 2) {
			this.state.tableData.url = APIS.product_follows
		} else {
			this.state.tableData.url = APIS.product_list
		}
		this.setState(this.state.tableData);

		this.state.initParam.selectType = index;
		this.setState(this.state.initParam);

		this.clearMoreSelect();

		this.getData(this.state.initParam);
	},
	componentWillMount: function() {

	},
	componentDidMount: function() {
		this.getData(this.state.initParam);
		this.getProductType();
	},
	confirmSelect: function() { //保存后进行查询
		this.setState({selectShow: false});
		this.state.initParam['q'] = this.refs.productName.value;
		this.state.initParam['productTypeId'] = this.refs.productType.value;
		this.setState(this.state.initParam);
		this.getData(this.state.initParam);
	},
	clearMoreSelect: function() {
		this.refs.productName.value = '';
		this.refs.productType.value = '';//.setValue('');


		this.state.initParam['q'] = '';
		this.state.initParam['productTypeId'] = '';
		this.setState(this.state.initParam);
	},
	cancerSelect: function() {
		this.setState({
			selectShow: false
		})
	},
	follows:function () {
		var self = this;
		var id = self.state.detailData.id;
		var isFollow = self.state.detailData.isFollow;

		if(isFollow == 0){
			AjaxRequest.post(APIS.product_follows, {productId:id}, function(data) {
				if (data.code == 200) {
					self.state.detailData.isFollow = 1;
					self.setState(self.state.detailData);
					self.getData();
					//toastr.success('收藏成功', '', {timeOut: 200});
				}
			});
		}else{
			AjaxRequest.delete(APIS.product_follows+'?productId='+id, null, function(data) {
				if (data.code == 200) {
					self.state.detailData.isFollow = 0;
					self.setState(self.state.detailData);
					self.getData();
					//toastr.info('取消收藏', '', {timeOut: 200})
				}
			});
		}
	},
	selectShowHide: function(e) {
		//e.preventDefault();
		this.setState({
			selectShow: !this.state.selectShow
		})
	},
	getData: function(args) {
		var self = this;
		var param = args || self.state.initParam;

		var thisUrl = self.state.tableData.url + '?pageSize=' + param.pageSize + '&pageNo=' +
			param.pageNo + '&productTypeId=' + param.productTypeId + '&q=' + param.q+"&selectType="+param.selectType;

		self.refs.productList.beginLoad(param.pageNo);
		AjaxRequest.get(thisUrl, null, function(data) {
			if (data.code == '200') {
				self.refs.productList.setPagerData(data);
			}
			if (data.data.length) {
				self.clickBack(data.data[0].id);
				self.refs.detailDiv.setNoData(true);
			}else{
				self.setState({
					detailData:{}
				});
				self.refs.detailDiv.setNoData(false);
			}
		});

	},
	clickBack: function(id) {
		var self = this;
		self.setState({currentProductId: id});
		AjaxRequest.get(APIS.product_list + '/' + id, null, function(data) {
			if (data.code == 200) {

				self.setState({
					detailData: data.data
				});
			}
		});

	},
	getProductType: function() {
		var self = this;

		AjaxRequest.get(APIS.data_wordbook+'DictProductType', null, function(data) {
			if (data.code == 200) {
				var thisData = data.data,
					newData = [];

				for (var i = 0, len = thisData.length; i < len; i++) {
					newData.push({
						text: thisData[i].name,
						id: thisData[i].id
					})
				}
				newData.unshift({
					text: '-- 请选择产品类型 --',
					id: ''});
				self.setState({
					productTypeList: newData
				})
			}
		});

	},

	render: function() {
		var self = this;
		var isManger = self.state.isManger;
		
		var typeList = this.state.productTypeList;
		var opts = null;

		if(typeList.length>0){
			opts = typeList.map(function(item, key){
				return (
					<option value={item.id} key={key}>{item.text}</option>
				);
			}.bind(this));
		}

		function renderBtn(){
			if(!isManger) return null;
			return (
				<div className="DTTT btn-group" style={{right:'150px',zIndex:100}}>
					<a className="btn btn-default DTTT_button_collection" href="#/product/classList">
						<span>产品分类设置</span>
					</a>
				</div>
			);
		}
		function renderAddBtn(){
			if(!isManger) return null;
			return (
				<a className="btn btn-default DTTT_button_collection" href="#/product/add/a">
					<i className="fa fa-plus"></i>
					<span>新建</span>
				</a>
			);
		}
		
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				{/*<div className="page-breadcrumbs">
					<ul className="breadcrumb">
						<li>
							<i className="fa fa-home"></i>
							<a href="javascript:void(0)">首页</a>
						</li>
						<li className="active">产品</li>
					</ul>
				</div>*/}

				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<ul className="nav nav-tabs myTab">
									<TabSelect2 liList={this.state.liList}
											   curentSelect={this.state.curentSelect}
											   setSelectType={this.setSelectType}/>


									{renderBtn()}

									<div className="DTTT btn-group">
										{renderAddBtn()}
										<a onClick={this.selectShowHide} className="btn btn-default DTTT_button_collection">
											<i className="fa fa-filter"></i>
											<span>筛选 <i className="fa fa-angle-down"></i></span>
										</a>
									</div>

									<div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:1+'px',top:42+'px'}}>
										<div className="well with-header" style={{background:'#fff',height:'100%'}}>
											<div className="header bordered-blue">
												<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
													<button onClick={this.clearMoreSelect} className="btn btn-cancer">重置</button>
													<button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
												</div>
											</div>
											<div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
												<div className="form-group form-li" >
													<label>产品名称</label><br/>
													<input type="text" ref="productName" className="form-control" />
												</div>
												<div className="form-li">
													产品类型<br/>
													<select ref="productType">
														{opts}
													</select>
												</div>
											</div>
										</div>
									</div>
								</ul>

								<div className="row">
									<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
										<div style={{padding:'20px 0px 20px 20px'}}>
											<TableView ref="productList" getData={this.getData}
													   initParam={this.state.initParam}
													   clickBack={this.clickBack}
													   allClick = {true}
													   tableData={this.state.tableData}/>
										</div>
									</div>
									<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">{/* style={{paddingLeft:0+'px'}}*/}
										<Detail ref="detailDiv" follows={this.follows} detailData={this.state.detailData} currentProductId={this.state.currentProductId} getData={this.getData} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/*
				<div className="page-body">
					<div className="widget lists">
						<div className="widget-body">
							<div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper form-inline no-footer">
								<div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
									<div className="well with-header" style={{background:'#fff',height:'100%'}}>
										<div className="header bordered-blue">
											<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
												<button onClick={this.clearMoreSelect} className="btn btn-cancer">重置</button>
												<button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
											</div>
										</div>
										<form style={{marginTop:30+'px',paddingLeft:10+'px'}}>
											<div className="form-group form-li" >
												<label>产品名称</label><br/>
												<input type="text" ref="productName" className="form-control" />
											</div>
											<div className="form-li">
												产品类型<br/>
												<select ref="productType">
													{opts}
												</select>
											</div>
											
										</form>
									</div>
								</div>
								{renderBtn()}
								<div className="DTTT btn-group" style={{right:'0px',zIndex:100}}>
									{renderAddBtn()}
									<a onClick={this.selectShowHide} className="btn btn-default DTTT_button_collection">
										<i className="fa fa-filter"></i>
										<span>筛选 <i className="fa fa-angle-down"></i></span>
									</a>
								</div>
								<div className="row">
									<div className="col-lg-9 col-md-8 col-sm-12 col-xs-12">
										<div style={{marginBottom:8+'px'}}>
											<TabSelect liList={this.state.liList}
													   curentSelect={this.state.curentSelect}
													   setSelectType={this.setSelectType}/>
										</div>

										<TableView ref="productList" getData={this.getData}
											  initParam={this.state.initParam}
											  clickBack={this.clickBack}
											  allClick = {true}
											  tableData={this.state.tableData}/>
									</div>
									<div className="col-lg-3 col-md-4 col-sm-12 col-xs-12" style={{paddingLeft:0+'px'}}>
										<Detail ref="detailDiv" follows={this.follows} detailData={this.state.detailData} currentProductId={this.state.currentProductId} getData={this.getData} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>*/}
				
			</div>
		)
	}
});