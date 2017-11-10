import React, { Component } from 'react';
import Select2 from '../core/components/Select2/Select2.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import '../core/components/Select2/select2.css';
import TabSelect from './TabSelect.js';
import request from 'superagent';
import {APIS} from '../core/common/config';
import Detail from './Detail';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {Pagination, Select} from 'antd';


var ListList = React.createClass({
	clickBack:function (id) {
		var self=this;
		self.props.clickBack(id);
	},
	componentDidUpdate:function(){
		playAudio();
	},
	componentDidMount:function(){
	},
	getLiList:function (data) {
		var lis = data.map(function(qst,key){
			return  <li key={key} className="content workListBackground"
						onClick={this.clickBack.bind(this,qst.id)}>
				<p>{qst.time}</p>
				<p className="block">{qst.createdName}</p>
				<p className="block" style={(qst.subject && qst.subject.length>0) ? {} : {display:'none'}}><span>{qst.subject}</span></p>

				<div className="audioBox" style={qst.audioSubjectFileUrl? {marginLeft:'42px', marginTop:'10px'} : {display:'none'}}>
					<audio  src={qst.audioSubjectFileUrl.replace('.amr', '.mp3')}>你的浏览器不支持audio</audio>
					<p className='audioInfo'>
						<span className="currentTime"></span><span className="duration"></span>
					</p>
				</div>
				{/*<p className="block" style={{display:qst.audioSubjectFileUrl ? 'block':'none',height:32+'px'}}><audio src={qst.audioSubjectFileUrl} controls="controls" preload="auto"></audio></p>*/}
				<p className="block"><span>{qst.address||'地址信息暂无'}</span></p>
				<span className="point"></span>
				<div  className={data.length>1 ? 'line_left':''}></div>
			</li>
		}.bind(this) );

		return lis;
	},
	render:function(){
		var lists = this.props.list;

		if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');
		var Uls = lists.map(function(qst,key){
			return <ul key={key}>
				<li className="group">
					<span className="title">{qst.date}</span>
					<span className="line"></span>
				</li>
				{this.getLiList(qst.list)}
			</ul>
		}.bind(this) );

		return (
			<div className="activity_list activityListHd" style={{minHeight: '652px', paddingBottom:'48px', position:'relative'}}>
				{Uls}

				<div className={this.props.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '20%', left:'50%', position:'absolute'}}><div className='crmNoData'>暂无数据</div></div>

			</div>
		)
	}
});
module.exports = React.createClass({
	getInitialState:function(){ 
		return {
			screeningCustomer:"",
			screeningChance:"",
			activityChance:[],
			activityCustomer:[],
			changed: false,
			fileList:[],
			noteList:[],       //备注
			initParam:{           //筛选参数
				activityType: 0,
				chanceId: "",
				customerId: "",
				days: -1,
				fromDate: "",
				isSelf: 0,
				pageNo: 1,
				pageSize: 10,
				staffIdList: [],
				toDate: ""
			},
			selectShow:false,      //帅选框显示/隐藏
			liList:[{               //帅选类型
				name:'全部活动',
				index:0
			},{
				name:'我的活动',
				index:1
			},{
				name:'本周活动',
				index:2
			}],
			curentSelect:{         //当前帅选到的类型 
				name:'全部活动',
				index:0
			},
			selectPP:{
				dataStatus: [
					{ text: '日报', id: 0 },
					{ text: '周报', id: 1 },
					{ text: '月报', id: 2 }
				]
			},
			detailData:{},
			lists:[],
			trackData: {
				pageNo: 1,
				pageSize: 5
			},
			/*pageData:{
				currentPage:1,
				totalSize:0,
				num:0
			}*/
			pageData: {
				pageNo: 1,
				totalSize: 0,
				pageSize: 10
			},
			hideNoData: true
			
		}
	},
	setSelectType:function (index,text) {
		var self=this;
		self.setState({
			curentSelect:{
				name:text,
				index:index
			}
		});
		self.clearValue();
		//选择类型后,ulr不同
		if(index==0){
			self.state.initParam.isSelf=0;
			self.state.initParam.days=-1;
			console.log("选择了全部活动,默认为显示三天内的活动.")
		}else if(index==1){
			self.state.initParam.isSelf=1;
		}else if(index==2){
			self.state.initParam.days=7;
		}
		self.getTracks(self.state.initParam);
	},
	componentWillMount:function(){

	},
	componentDidMount:function(){
		var self=this;
		self.getCustomerAndChance();
		self.getTracks(self.state.initParam);
		$('.date-picker').datepicker({
			local:'ZH_CN'
		});
	},
	//获取客户和商机
	getCustomerAndChance: function () {
		var self=this,
			param={
				"q": "",
				"isSelf": 0,
				"pageNo": 1,
				"pageSize": 9999
			},
			paramChance={
				customerId: "",
				endCreatedOn: "",
				isOwner: 0,
				orderType: 0,
				pageNo: 1,
				pageSize: 9999,
				q: "",
				staffList: [],
				stageList: [],
				startCreatedOn: "",
				statusList: []

			};
		AjaxRequest.post(APIS.customer, param, function(body) {
			if (body.code == '200' && body.data) {
				var newList = [];
				var list = body.data;
				if(list && list.length > 0){
					for(var i=0;i<list.length;i++){
						var obj = list[i];
						obj.text = obj.name;
						newList.push(obj);
					}
				}
				self.setState({
					activityCustomer:newList
				});
			}else{
				alert('客户列表请求失败!')
			}
		});
		AjaxRequest.post(APIS.chance_list, paramChance, function(body) {
			if (body.code == '200' && body.data) {
				var newList = [];
				var list = body.data;
				if(list && list.length > 0){
					for(var i=0;i<list.length;i++){
						var obj = list[i];
						obj.text = obj.chanceName;
						newList.push(obj);
					}
				}
				self.setState({
					activityChance:newList
				});
			}else{
				alert('商机列表请求失败!')
			}
		});
	},
	setTypeValue: function (e) {
		var self=this,
			name=e.target.name,
			val=e.target.value;
		if(name=='activityCustomer'){
			var paramChance={
				customerId: val,
				endCreatedOn: "",
				isOwner: 0,
				orderType: 0,
				pageNo: 1,
				pageSize: 10,
				q: "",
				staffList: [],
				stageList: [],
				startCreatedOn: "",
				statusList: []

			};
			AjaxRequest.post(APIS.chance_list, paramChance, function(body) {
				if (body.code == '200' && body.data) {
					var newList = [];
					var list = body.data;
					if(list && list.length > 0){
						for(var i=0;i<list.length;i++){
							var obj = list[i];
							obj.text = obj.chanceName;
							newList.push(obj);
						}
					}
					self.setState({
						activityChance:newList
					});
				}else{
					alert('客户列表请求失败!')
				}
			});
		}else if(name=='activityChance'){

			var thisList = self.state.activityChance,
				customerId = '';
			for(var i=0,len=thisList.length; i<len; i++){
				if(thisList[i].id == val){
					customerId = thisList[i].customerId
				}
			}
			self.refs.activityCustomer.setValue(customerId);
		}
	},
	confirmSelect:function () {      //保存后进行查询
		var self=this;
		self.setState({
			selectShow:false
		});
		var fields = self.refs, params = {};
		for (var attr in fields) {
			if(attr == 'activityCustomer'){
				params[attr] = self.refs[attr].el[0].value;
			}else if(attr == 'activityChance'){
				params[attr] = self.refs[attr].el[0].value;
			}else{
				params[attr] = self.refs[attr].value;
			}
		}
		self.state.initParam.chanceId=params.activityChance;
		self.state.initParam.customerId=params.activityCustomer;
		self.state.initParam.fromDate=params.activityTimeStart;
		self.state.initParam.toDate=params.activityTimeEnd;
		self.setState(self.state.initParam);
		self.getTracks(self.state.initParam);

	},
	clearValue:function () {
		var self=this;
		self.state.initParam={
			activityType: 0,
			chanceId: "",
			customerId: "",
			days: 3,
			fromDate: "",
			isSelf: 0,
			pageNo: 1,
			pageSize: 10,
			staffIdList: [],
			toDate: ""
		}
	},
	cancerSelect:function () {
		var self=this,
			thisRef=self.refs;
		thisRef.activityCustomer.setValue('');
		thisRef.activityChance.setValue('');
		thisRef.activityTimeEnd.value='';
		thisRef.activityTimeStart.value='';
	},
	selectShowHide:function () {
		var self=this;
		self.setState({
			selectShow:!self.state.selectShow
		});
	},
	setPagerData:function(data){
		var self = this;
		var param = self.state.pageData;

		param.pageNo = self.state.initParam.pageNo || data.pageNo || 1;
		param.totalSize = data.totalSize || 0;
		param.pageSize = self.state.initParam.pageSize || data.pageSize || 10;

		self.setState({
			lists: data.data,
			pageData: param
		});
	},
	PageChange:function(page){
		var self = this;
		var initParam = self.state.initParam;

		initParam.pageNo = page;
		self.setState({initParam: initParam});
		self.getTracks();
	},
	
	getTracks:function () {
		var self=this;
		var param=self.state.initParam;
		AjaxRequest.post(APIS.activity_list, param, function(body) {
				if (body.code == '200') {
					self.setPagerData(body);
					if(body.data.length){
						self.clickBack(body.data[0].id);
						self.refs.detailDiv.setNoData(true);

						self.setState({
							hideNoData: true
						});
						window.scroll(0,0);
					}else{
						self.setState({
							detailData:{},
							hideNoData: false
						});
						self.refs.detailDiv.setNoData(false);
					}
				} else {
				console.log('请求失败!')
			}
		})
	},
	refreshNote:function () {
		var self = this,
			noteUrl = APIS.notes_list.replace('{type}','activity').replace('{id}',self.state.detailData.id);
		request
			.get(noteUrl)
			.send('')
			.set('Content-Type', 'application/json;charset=utf-8')
			.end(function(err,res){
				if (res.ok) {
					if (res.body.code == '200') {

						self.setState({
							noteList:res.body.data
						})

					}
				} else {
					console.log('联系人列表请求失败!')
				}
			});
	},
	//附件
	getFiles:function(){
		var self = this,
			fileUrl = APIS.remark_files_list.replace('{type}','activity').replace('{id}',self.state.detailData.id);
		request
			.get(fileUrl)
			.send('')
			.set('Content-Type', 'application/json;charset=utf-8')
			.end(function(err,res){
				if (res.ok) {
					if (res.body.code == '200') {

						self.setState({
							fileList:res.body.data
						})

					}
				} else {
					console.log('附件列表请求失败!')
				}
			});
	},
	clickBack:function (id) {
		var self = this;
		self.workListBackground();
		AjaxRequest.get(APIS.activity_detail +id, null, function(body) {
			if (body.code == '200') {
				self.setState({
					detailData:body.data
				});
				self.refreshNote();
				self.getFiles();
			} else {
				console.log('请求失败!')
			}
		})
	},
	workListBackground: function(){
		var h = document.getElementsByClassName("workListBackground");
		for(var i=0;i<h.length;i++){
			h[i].onclick=function(){
				//重置颜色
				for(var k=0;k<h.length;k++){
					h[k].style.backgroundColor="#fff";
				}
				//设置当前的样式
				this.style.backgroundColor="#f5f5f5";
			}
		}
	},
	workTimeStart: function () {
		return(
			<div className="workScreening">
				<label className="workTimeLabel">活动时间起</label>
				<div className="input-group">
					<input className="form-control date-picker" ref="activityTimeStart" name="extimateDealDate"
						   id="extimateDealDate" type="text" placeholder="请选择活动时间起"
						   data-date-format="yyyy-mm-dd" />
											<span className="input-group-addon">
												<i className="fa fa-calendar" />
											</span>
				</div>
			</div>
		)
	},
	workTimeEnd:function () {
		return(
			<div className="workScreening">
				<label className="workTimeLabel">活动时间止</label>
				<div className="input-group">
					<input className="form-control date-picker" ref="activityTimeEnd" name="extimateDealDate"
						   id="extimateDealDate" type="text" placeholder="请选择活动时间止"
						   data-date-format="yyyy-mm-dd" />
											<span className="input-group-addon">
												<i className="fa fa-calendar" />
											</span>
				</div>
			</div>
		)
	},
	getToday:function () {
		var now = new Date(),
			year = now.getFullYear(),
			month = now.getMonth()+ 1,
			day = now.getDate();
		return year + "-" + ((month < 10)?("0" + month):month) + "-" + ((day < 10)?("0" + day):day)
	},
	disposeData: function (listData) {
		var ele = [];
		var yearMonth = "";
		var list=[];
		var bl=false;
		for( var i = 0; i < listData.length; i++ ) {
			var dataEle = listData[i],
				str = dataEle.startTime.split(" "),
				strData = str[0];
			dataEle.time = str[1];
			if(strData != yearMonth){
				if(bl){
					var dateTi = yearMonth;
					if (yearMonth == this.getToday()) {
						dateTi = "今天";
					}
					ele.push({
						date : dateTi,
						list : list
					});
					bl=false;
				}
				list=[];
				yearMonth = strData;

				list.push(dataEle);
				bl=true;
			}else{
				list.push(listData[i]);
			}
			if(i == (listData.length-1)){
				ele.push({
					date : strData,
					list : list
				});
			}
		}
		return ele;
	},
	render:function(){
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />

				<div className="page-body workingLeftAll activityContentAll">
					<div className="widget lists">
						<div className="widget-body">
							<div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper no-footer">
								<div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:1+'px',top:42+'px'}}>
									<div className="well with-header" style={{background:'#fff',height:'100%'}}>
										<div className="header bordered-blue">
											<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
												<button onClick={this.cancerSelect} className="btn btn-cancer">重置</button>
												<button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
											</div>
										</div>
										<form style={{marginTop:30+'px',paddingLeft:10+'px'}}>
											<div className="">
												<label htmlFor="activityCustomer">客户</label>
												<div className="input-icon icon-right">
													<Select2
														ref="activityCustomer"
														name="activityCustomer"
														value={this.state.screeningCustomer}
														multiple={false}
														style={{width:"100%"}}
														onSelect={this.setTypeValue}     //选择回调 ,如果是单选,只调用这个就行了
														data={this.state.activityCustomer}
														options={{placeholder: '选择客户'}}
													/>
												</div>
											</div>

											<div className="" style={{display: CONFIG.Exclude && CONFIG.Exclude.chance ? 'none' : 'block'}}>
												<label htmlFor="activityChance">商机</label>
												<div className="input-icon icon-right">
													<Select2
														ref="activityChance"
														name="activityChance"
														value={this.state.screeningChance}
														multiple={false}
														style={{width:"100%"}}
														onSelect={this.setTypeValue}     //选择回调 ,如果是单选,只调用这个就行了
														data={this.state.activityChance}
														options={{placeholder: '选择商机'}}
													/>
												</div>
											</div>

											{this.workTimeStart()}
											{this.workTimeEnd()}
										</form>
									</div>
								</div>

								<div className="row">
									<div id="dropdownbuttons" className="activityDropdownbuttons">
										<TabSelect liList={this.state.liList}
												   curentSelect={this.state.curentSelect}
												   setSelectType={this.setSelectType}/>
										<div className="DTTT btn-group" style={{right:3+'px',zIndex:100,top:'-5px'}}>
											<a className="btn btn-default DTTT_button_copy" href="#/activity/add/a">
												<i className="fa fa-plus" />
												<span>创建 </span>
											</a>
											<a onClick={this.selectShowHide} className="btn btn-default DTTT_button_collection">
												<i className="fa fa-filter" />
												<span>筛选 <i className="fa fa-angle-down" /></span>
											</a>
										</div>
									</div>
									<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 col-work-left">
										<div className="workLeftContent" style={{position:'relative'}}>

											<ListList list={this.disposeData(this.state.lists)}
													  hideNoData={this.state.hideNoData}
													  clickBack={this.clickBack}/>
											{/*<ListPager pageData={this.state.pageData}
													   num={this.state.pageData.num}
													   prePage={this.prePage}
													   goPage={this.goPage}
													   nextPage={this.nextPage}
													   style={{display:this.state.lists.length>0?'none':'block'}}
											/>*/}
											<div style={{position:'absolute', right:'0px', bottom:'10px'}}>
												<Pagination
													selectComponentClass={Select}
													total={this.state.pageData.totalSize}
													showTotal={total => `共 ${total} 条记录`}
													pageSize={this.state.pageData.pageSize}
													defaultCurrent={this.state.pageData.pageNo}
													current={this.state.pageData.pageNo}
													onChange={this.PageChange}
													showQuickJumper
												/>
											</div>
										</div>
									</div>
									<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 col-work-right">
										<div className="workRightContent ativityRight" style={{minHeight: '622px'}}>
											<Detail ref="detailDiv" detailData={this.state.detailData} getTracks={this.getTracks} fileList={this.state.fileList} noteList={this.state.noteList}
													refreshNote={this.refreshNote}
													getFiles={this.getFiles}/>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});