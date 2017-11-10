/**
 * Created by Administrator on 2016/8/23 0023.
 */
import React, { Component } from 'react';
import {Link} from 'react-router';
import '../core/components/Select2/select2.css';
import request from 'superagent';
import DetailTable from '../core/components/DetailTable/List';
import TrackList from '../core/components/TrackList/List';
import DetailList from '../core/components/DetailList/List';
import ApprovalList from './approvalList';
import ProductList from '../core/components/PriceProduct/DetailList';

import NoteList from '../core/components/NoteList/List';
import NoteAll from '../core/components/NoteList/All';
import NoteAdd from '../core/components/NoteList/Add';

import FileList from '../core/components/FileList/List';
import FileAll from '../core/components/FileList/All';
import FileAdd from '../core/components/FileList/Add';

import AjaxRequest from '../core/common/ajaxRequest.js';

import {APIS} from '../core/common/config';



module.exports = React.createClass({

    getInitialState:function(){
		return {
			routeId: this.props.params.id,
			tableData: {//详情首行表格
				firstList:[
					{
						name: '客户名称',
						value: '',
						filed:'customerName',
						iconClass:'yellow pcicon-customer'
					}, {
						name: '商机',
						value: '',
						filed:'chanceName',
						iconClass:'blue pcicon-contacts'
					},{
						name: '总金额',
						value: '',
						filed:'amount',
						iconClass:'green'
					},{
						name: '过期日',
						value: '',
						filed:'overdueDate',
						iconClass:'red'
					},{
						name: '状态',
						value: '',
						filed:'statusText',
						iconClass:'red'
					},{
						name: '责任人',
						value: '',
						filed:'saler',
						iconClass:'red'
					}
				],
				lists: []
				
			},
			trackData: {            //跟进记录
				pageNo: 1,
				pageSize: 5
			},
			chanceData: {            //审批记录列表
				pageNo: 1,
				pageSize: 5,
				chancLength:0
			},
			detailList: [],
			productList:[],      //产品列表
			noteList:[],         //备注
			fileList:[]
		}

    },

	componentWillMount:function(){

	},

    componentDidMount:function(){
		this.getData();  //详情首行
	//	this.getProductList();
    },
    
	getChanceEven:function () {
		this.getChances({   //跟进记录
			pageNo:1,
			pageSize:5
		})
	},
	setFirstList:function (data) {      //设置首行列表
		var list = this.state.tableData.firstList;
		for(var i=0,len=list.length; i<len; i++){
			var field = list[i].filed;
			if(field.split('.').length == 2){
				var arrs = field.split('.'),
					arr_1 = arrs[0],
					arr_2 = arrs[1];
				list[i].value = data[arr_1][arr_2];
			}else{
				list[i].value = data[field];
			}

		}
	},
	//详情
	getData:function () {
		var self = this;
		var url = APIS.sales_price_detail+'/'+self.state.routeId;
		AjaxRequest.get(url, null, function(data){
        	
        	self.state.tableData.lists = data.data;  //设置首页表格数据
			self.setFirstList(data.data); //设置首行列表数据
			self.state.productList = data.data.productList;
			self.setState(self.state.tableData);
      });
	},
	
	getProductList:function(){
		var self = this,
			productUrl = APIS.sales_price_detail+'/'+self.state.routeId;
		AjaxRequest.get(productUrl, null, function(data){
        	
			self.state.productList = data.data.productList;
      });
	},
	//修改产品的单价和数量
	btnSave:function (params) {
		var self = this;
		var url = APIS.sales_price_detail+'/'+self.state.routeId;
		AjaxRequest.put(url, params, function(data){
        	
        	self.getProductList();
			self.hideEditForm(params.id);
			
      });
	},
	addProduct:function (arr) {
		if(arr.length == 0){
			return;
		}
		var self = this,
			param={
				id: self.state.routeId,
				productIdList: arr
			};
		var url = APIS.sales_price_detail+'/'+self.state.routeId;
		AjaxRequest.put(url, param, function(data){
        	
        	alert('添加产品成功!');
			self.getProductList();
      });
	},
	cancelBtn:function(type){
		if(type == 'del'){//如果是删除操作，那么取消时重新获取列表数据
			this.getProductList();
		}
	},

	showEditForm:function(id){
		var num = $("#productNumber"+id).val();
		$('#spinner'+id).spinner({value:parseInt(num)});
		$("#"+id).show();
	},

	hideEditForm:function(id){
		$("#"+id).hide();
	},
	
	//审批记录列表
	getChances:function (param) {
		var self = this,
			thisUrl = APIS.sales_price_detail_approvalsList + self.state.routeId + '/approvals';
		AjaxRequest.get(thisUrl, param, function(data){
        	
			self.refs.changeList.setPagerData(data);
			self.state.chanceData.chancLength = data.data.length;
			self.setState(self.state.chanceData);
      });
	},
	
	refreshNote:function () {
		var self = this,
			noteUrl = APIS.notes_list.replace('{type}','price').replace('{id}',self.state.routeId);
		AjaxRequest.get(noteUrl, null, function(data){
        	
			self.setState({
							noteList:data.data
					});
      });
	},

	//备注
	addNotes:function (val) {
		var self = this;

		if(!val){
			alert('请输入备注内容')
		}
		var param = {
				content: val,
				entityId:self.state.routeId,
				remarkType: "price"
		};
		AjaxRequest.post(APIS.notes_add, param, function(data){
        	
			alert('新增备注成功!');
			self.refreshNote();
      });
	},
	
	addFile:function (data) {
		var self = this,
			ids = [];
		for(var i=0,len=data.length;i<len;i++){
			ids.push(data[i].fId);
		}
		ids = ids.join(',');
		var param = {
				"content":"",
				"remarkType":"price",
				"picFileIds":ids,
				"entityId":self.state.routeId
		};
		AjaxRequest.post(APIS.notes_add, param, function(data){
        	
			alert('上传成功!');
			self.refreshNote();
			self.getFiles();
      });
	},
	
	//附件上传
	getFiles:function(){
		var self = this,
			fileUrl = APIS.remark_files_list.replace('{type}','price').replace('{id}',self.state.routeId);
			
		AjaxRequest.get(fileUrl, null, function(data){
        	
			self.setState({
							fileList:data.data
					});
      });
	},
	
	clearUpList:function () {
		this.refs.fileAdd.clearList();
	},
	
	getOtherMsg:function () {
		this.refreshNote();
		this.getFiles();
	},	
	
	render:function(){

		return (
			<div>
				<div className="page-breadcrumbs">
					<ul className="breadcrumb">
						<li>
							<i className="fa fa-home"></i>
							<a href="javascript:void(0)">首页</a>
						</li>
						<li className="active">报价详情</li>
					</ul>
				</div>
				<div className="page-body">
					<h2>{this.state.tableData.lists.quotationName} <a style={{fontSize:15+'px',marginLeft:20+'px'}} href={'#/price/add/'+this.state.routeId}>编辑</a></h2>
					<div className="padding-bottom-20 padding-top-10 detail-table">
						
						<DetailTable lists={this.state.tableData.firstList} />
					</div>
					<div className="row">
						<div className="col-lg-12 col-md-8 col-sm-12 col-xs-12">
							<div className="dashboard-box">
							<div className="box-tabbs">
								<div className="tabbable">
									<ul className="nav nav-tabs myTab" id="myTab11">
										<li className="active">
											<a data-toggle="tab" href="#price-khxq">
												报价行
											</a>
										</li>
										<li onClick={this.getChanceEven}>
											<a data-toggle="tab" href="#price-sj">
												审批记录{this.state.chanceData.chancLength ? '(' + this.state.chanceData.chancLength + ')' : ''}
											</a>
										</li>
										<li onClick={this.getOtherMsg}>
											<a data-toggle="tab" href="#price-qtxg">
												其他相关
											</a>
										</li>
									</ul>
									<div className="tab-content tabs-flat detail-left">
										<div id="price-khxq" className="tab-pane in active detail-tab3">
											<ProductList lists={this.state.productList} chanceId={this.state.routeId} cancelBtn={this.cancelBtn} addProduct={this.addProduct} btnSave={this.btnSave} hideEditForm={this.hideEditForm} showEditForm={this.showEditForm}/>
										</div>

										<div id="price-sj" className="tab-pane">
											<ApprovalList ref="changeList"
														getData={this.getChances}
														trackData={this.state.chanceData}
											/>
										</div>
										<div id="price-qtxg" className="tab-pane">
											<div className="detail-tab3">
												<NoteList lists={this.state.noteList}/>
												
												<FileList clearUpList={this.clearUpList} lists={this.state.fileList} />
											</div>
										</div>
									</div>
								</div>
							</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container-fluid text-center">
					<NoteAll lists={this.state.noteList} />
					<NoteAdd addNotes={this.addNotes} />

					<FileAll lists={this.state.fileList}/>
					<FileAdd addFile={this.addFile} ref="fileAdd"/>

				</div>
				
			</div>
		)
	}
});