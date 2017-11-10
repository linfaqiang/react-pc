import React, { Component } from 'react';
import AddList from '../core/components/AddList/AddList';
import request from 'superagent';

module.exports = React.createClass({

	getInitialState:function(){ 
		return {
			list1:[
				{
					name:'客户',
					type:'normal',
					data:'',
					field:'customer',
					fieldId:0
				},
				{
					name:'客户简称',
					type:'normal',
					data:'',
					field:'shortname'
				},
				{
					name:'地址',
					type:'adr',
					field:'address',
					valueCode:''
				},
				{
					name:'客户等级',
					type:'base',
					field:'customerLevel',
					data:{
						value1: null,
						datas: [
							{ text: 'A级', id: 1 },
							{ text: 'B级', id: 2 },
							{ text: 'C级', id: 3 },
							{ text: 'D级', id: 4 }
						]
					},
					valueCode:''
				},
				{
					name:'联系人',
					type:'normal',
					data:'',
					field:'linkmanName'
				},
				{
					name:'行业类别',
					type:'base',
					field:'industry',
					data:{
						value1: null,
						datas: [
							{ text: '工业', id: 1 },
							{ text: '农业', id: 2 },
							{ text: '畜牧业', id: 3 },
							{ text: 'IT业', id: 4 }
						]
					},
					valueCode:''
				},
				{
					name:'电子邮箱',
					type:'normal',
					data:'',
					field:'email'
				},
				{
					name:'员工总数',
					type:'normal',
					data:'',
					field:'employeesTotal'
				},
				{
					name:'CEO',
					type:'normal',
					data:'',
					field:'ceo'
				}
			],
			list2:[
				{
					name:'客户责任人',
					type:'normal',
					field:'ceo',
					data:'staffName'
				},
				{
					name:'重要程度',
					type:'base',
					field:'level',
					data:{
						value1: null,
						datas:[
							{ text: '非常重要', id: 1 },
							{ text: '重要', id: 2 },
							{ text: '一般', id: 3 },
							{ text: '不重要', id: 4 }
						]
					},
					valueCode:''
				},
				{
					name:'联系人手机',
					type:'normal',
					field:'ceo',
					data:'linkmanMobile'
				},
				{
					name:'父客户',
					type:'normal',
					field:'parent',
					data:''
				},
				{
					name:'公司电话',
					type:'normal',
					field:'telephone',
					data:''
				},
				{
					name:'公司网址',
					type:'normal',
					field:'url',
					data:''
				},
				{
					name:'年度收入',
					type:'normal',
					field:'annualIncome',
					data:''
				}
			]
		}
	},

	componentWillMount:function(){

	},

	componentDidMount:function(){
		// var lists = this.state.list1,
		// 	self = this,
		// 	params = [
		// 		{
		// 			field:'customerLevel',
		// 			url:'http://192.168.8.24:8081/crm-web/v1/dicts/DictCustomerLevel'
		// 		},
		// 		{
		// 			field:'industry',
		// 			url:'http://192.168.8.24:8081/crm-web/v1/dicts/DictIndustry'
		// 		}
		// 	],
		// 	ii = 0,
		// 	len = params.length;
        //
		// function getDictData() {
        //
		// 	if(ii==len) {
		// 		return;
		// 	}
        //
		// 	request
		// 		.get(params[ii].url)
		// 		.send('')
		// 		.set('Content-Type', 'application/json;charset=utf-8')
		// 		.end(function(err,res){
		// 			if (res.ok) {
		// 				if (res.body.code == '200' && res.body.data.length) {
		// 					for(var j=0, len=lists.length; j<len; j++){
		// 						if(lists[j].field == params[ii].field){
		// 							lists[j].datas = res.body.data;
		// 						}
		// 					}
		// 					self.setState(self.state.list1);
        //
		// 					ii++;
		// 				}
        //
		// 				getDictData();
		// 			} else {
		// 				console.log('请求失败!')
		// 			}
		// 		});
		// }
        //
		// getDictData();

	},
	
	saveAdd:function () {
		alert('保存了')

	},
	saveCencer:function () {
		
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
						<li>
							<a href="javascript:void(0)">客户</a>
						</li>
						<li className="active">创建客户</li>
					</ul>
				</div>
				<AddList list1={this.state.list1} list2={this.state.list2} saveAdd={this.saveAdd} saveCancer={this.saveCancer}/>
			</div>
		)
	}
});