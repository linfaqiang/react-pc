import React from 'react';
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import AjaxRequest from '../core/common/ajaxRequest.js';
import './report.css';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
//商机阶段持续时间分析
module.exports = React.createClass({
	queryParam: {
		"type": "",
		"isContain": null,
		"startDate": "",
		"endDate": "",
		"deptList": [],
		"staffList": [],
		"pageNo": 1,
		"pageSize": 10
	},
	getInitialState: function () {
		return {
			showFilterLayer: false,
			showNextBth: true,
			salesCycle: 0,
			conversionRate: 0,
			chanceTypeText: '',
			rateArr: [],
			selectPP: {//存放帅选框的数据
				staffList: [], /*选择后的人员*/
				deptList: [], /*选择后的部门*/
				dataType: 1,
				startDate: "",
				endDate: "",
				chanceTypeId: '',
				isSub: 0,
				isDeptSub: 0,

				dataTypeArr: [
					{text: '按人员', id: 1},
					{text: '按部门', id: 2}
				], /* 数据筛选 */
				chanceTypeArr: [], /* 商机类型 */
				staffArr: [], /*选择人员列表*/
				deptArr: [] /*选择部门列表*/
			},
			dataList: [], /*列表数据*/
			originalList: [] /*原列表数据*/
		};
	},
	componentDidMount: function () {
		/* 初始化筛选条件 */
		var defaultStartEnd = this.defaultStartEnd();
		this.state.selectPP = {
			staffList: [], /*选择后的人员*/
			deptList: [], /*选择后的部门*/
			dataType: 1,
			chanceTypeId: '',
			isSub: 0,
			isDeptSub: 0,
			startDate: defaultStartEnd.start,
			endDate: defaultStartEnd.end,
			dataTypeArr: [
				{text: '按人员', id: 1},
				{text: '按部门', id: 2}
			], /* 数据筛选 */
			chanceTypeArr: [], /* 商机类型 */
			staffArr: [], /*选择人员列表*/
			deptArr: [] /*选择部门列表*/
		};
		this.queryParam = {
			"type": "",
			"isContain": null,
			"deptList": [],
			"startDate": defaultStartEnd.start,
			"endDate": defaultStartEnd.end,
			"staffList": [],
			"pageNo": 1,
			"pageSize": 10
		};
		this.setState(this.state.selectPP);
		var self = this;
		this.renderCharts(function () {
			self.getDataList();
		});
		$('#createdOnStartAndEnd').daterangepicker({
			format: "YYYY-MM-DD",
			opens: "left",
			separator: " / ",
			startDate: defaultStartEnd.start,
			endDate: defaultStartEnd.end
		});
	},
	componentWillMount: function () {
		var self = this;
		/* 商机类型 数据字典 */
		AjaxRequest.get(APIS.chanceType, null, function (body) {
			if (body.code == 200 || body.code == '200') {
				var newList = [];
				var list = body.data;
				if (list && list.length > 0) {
					for (var i = 0; i < list.length; i++) {
						var obj = list[i];
						obj.text = obj.name;
						newList.push(obj);
						if (i == 0) {
							self.queryParam.type = obj.id;
							self.state.selectPP.chanceTypeId = obj.id;
							self.setState({chanceTypeText: obj.name});
						}
					}
				}
				self.state.selectPP.chanceTypeArr = newList;
				self.setState(self.state.selectPP);
			}
		});
		/* 人员 */
		AjaxRequest.get(APIS.staffs_subs, null, function (body) {
			if (body.code == 200 || body.code == '200') {
				self.state.selectPP.staffArr = body.data;
				self.setState(self.state.selectPP);
			}
		});
		/* 部门 */
		AjaxRequest.get(APIS.dept_subs, null, function (body) {
			if (body.code == 200 || body.code == '200') {
				var lists = body.data;
				var deptArr = [];
				for (var i = 0; i < lists.length; i++) {
					deptArr.push({
						"id": lists[i].deptId,
						"text": lists[i].deptName
					});
				}
				self.state.selectPP.deptArr = deptArr;
				self.setState(self.state.selectPP);
			}
		});
	},
	defaultStartEnd: function () {
		var date = new Date();
		var fullYear = date.getFullYear();
		var month = date.getMonth() + 1;
		if (month < 7) {
			return {
				'start': fullYear + '-01-01',
				'end': fullYear + '-06-30'
			}
		} else {
			return {
				'start': fullYear + '-07-01',
				'end': fullYear + '-12-31'
			}
		}
	},
	renderCharts: function (cb) {
		var self = this;
		if (self.queryParam.type) {
			AjaxRequest.post(APIS.convert_rate_charts, self.queryParam, function (body) {
				if (body.code == 200 || body.code == '200') {
					var salesFunnel = body.data.salesFunnel || [];
					self.setState({salesCycle: body.data.salesCycle});
					self.setState({conversionRate: body.data.succeedRate});
					var rateData = body.data.salesStageList;
					var newArr = [];
					var colorList = [
						'#51b92c', '#02c1a5', '#00a1f1', '#2b6bc9', '#7b1893',
						'#b00454', '#dd0527', '#f75314', '#f3b831', '#efee18',
						'#008738', '#00947e', '#0678b4', '#0c50a3', '#4c007e',
						'#bc0282', '#fe0000', '#ff5a00', '#ff7f00', '#ffbf01'
					];
					for (var i = 0, len = rateData.length; i < len; i++) {
						newArr.push({
							value: rateData[i].days,
							name: rateData[i].stageName
						});
						rateData[i].backColor = colorList[i];
					}
					self.setState({rateArr: rateData});
					cb();
					var chartOption = {
						tooltip: {
							trigger: 'item',
							formatter: '{b} {d}%'
						},
						series: [
							{
								name: '商机阶段持续时间分析',
								type: 'pie',
								radius: ['30%', '90%'],
								avoidLabelOverlap: true,
								label: {
									normal: {
										show: false,
										position: 'center'
									},
									emphasis: {
										show: false,
										textStyle: {
											fontSize: '30',
											fontWeight: 'bold'
										}
									}
								},
								labelLine: {
									normal: {
										show: false
									}
								},
								data: newArr,
								itemStyle: {
									emphasis: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									},
									normal: {
										borderColor: '#fff',
										borderWidth: 0,
										color: function (params) {
											return colorList[params.dataIndex];
										}
									}
								}
							}
						]
					};
					var pieChart = echarts.init(document.getElementById('rateChart'));
					pieChart.setOption(chartOption);
				}
			});
		} else {
			setTimeout(function () {
				self.renderCharts(cb);
			}, 500);
		}
	},
	handlerToggleFilterLayer() {
		var self = this;
		self.setState({showFilterLayer: !self.state.showFilterLayer});
	},
	handlerConfirmFilter() {
		/* 筛选应用 */
		this.setState({showFilterLayer: false});
		this.state.originalList = [];
		var val = this.refs.createdOnStartAndEnd.value;
		if (val) {
			var subStr = val.split("/");
			this.state.selectPP.startDate = subStr[0].trim();
			this.state.selectPP.endDate = subStr[1].trim();
			this.setState(this.state.selectPP);
		}
		var selectData = this.state.selectPP;
		var isContain = null;
		if (selectData.isDeptSub == 1) {
			isContain = 1;
		} else {
			if (selectData.isSub == 1) {
				isContain = 0;
			}
		}
		this.queryParam = {
			"type": selectData.chanceTypeId,
			"isContain": isContain,
			"deptList": selectData.deptList || [],
			"staffList": selectData.staffList,
			"startDate": selectData.startDate,
			"endDate": selectData.endDate,
			"pageNo": 1,
			"pageSize": 10
		};
		var self = this;
		var chanceTypeArr = this.state.selectPP.chanceTypeArr;
		for (var i = 0; i < chanceTypeArr.length; i++) {
			if (chanceTypeArr[i].id == selectData.chanceTypeId) {
				self.setState({chanceTypeText: chanceTypeArr[i].name});
			}
		}
		this.renderCharts(function () {
			self.getDataList();
		});
	},
	handlerResetFilter() {
		/* 筛选重置 */
		this.setState({showFilterLayer: false});
		this.state.originalList = [];
		var chanceTypeId = this.state.selectPP.chanceTypeArr[0].id;
		this.queryParam = {
			"type": chanceTypeId,
			"isContain": null,
			"deptList": [],
			"staffList": [],
			"startDate": this.defaultStartEnd().start,
			"endDate": this.defaultStartEnd().end,
			"pageNo": 1,
			"pageSize": 10
		};
		/* 重置条件为初始化 */
		this.state.selectPP.staffList = [];
		this.state.selectPP.deptList = [];
		this.state.selectPP.dataType = 1;
		this.state.selectPP.chanceTypeId = chanceTypeId;
		this.state.selectPP.startDate = this.defaultStartEnd().start;
		this.state.selectPP.endDate = this.defaultStartEnd().end;
		this.state.selectPP.isSub = 0;
		this.state.selectPP.isDeptSub = 0;
		this.state.selectPP.dataTypeArr = [
			{text: '按人员', id: 1},
			{text: '按部门', id: 2}
		];
		this.state.selectPP.chanceTypeArr = this.state.selectPP.chanceTypeArr;
		this.state.selectPP.staffArr = this.state.selectPP.staffArr;
		this.state.selectPP.deptArr = this.state.selectPP.deptArr;
		this.setState(this.state.selectPP);
		var self = this;
		this.renderCharts(function () {
			self.getDataList();
		});
	},
	getDataList: function () {
		/* 获取数据 */
		var self = this;
		if (self.queryParam.type) {
			if (self.state.originalList.length == 0) {
				self.queryParam.pageNo = 1;
			}
			var params = "?pageNo=" + self.queryParam.pageNo + "&pageSize=" + self.queryParam.pageSize;
			AjaxRequest.post(APIS.convert_rate_lists + params, self.queryParam, function (body) {
				if (body.code == 200 || body.code == '200') {
					var originalList = self.state.originalList;
					var resultData = body.data;
					originalList = originalList.concat(resultData);
					self.setState({originalList: originalList});
					var dataList = self.disposeData(originalList);
					var rateArr = self.state.rateArr;
					for (var i = 0; i < dataList.length; i++) {
						dataList[i].list[0].total = rateArr[i].stageCount;
						dataList[i].list.push({
							stageDays: rateArr[i].days
						});
					}
					self.setState({dataList: dataList});
					/* 判断是否有下一页 */
					if (resultData.length < 10 || originalList.length == self.state.totalSize) {
						self.setState({showNextBth: false});
					} else {
						self.setState({showNextBth: true});
					}
				}
			});
		} else {
			setTimeout(function () {
				self.getDataList();
			}, 500);
		}
	},
	nextListPage: function () {
		this.queryParam.pageNo++;
		this.getDataList();
	},
	exportFn: function () {
		if (this.state.originalList.length == 0) {
			toastr.error('当前查询结果为空，请重设查询条件');
			return;
		}
		window.open(APIS.convert_rate_lists_export);
	},
	renderDataList: function (lists) {
		var self = this;
		var htmlList = lists.map(function (qst, key) {
			return self.getLiList(qst.list);
		}.bind(this));
		return (
			<table
				className={"table table-striped table-hover table-bordered dataTable no-footer"+(1==1 ? ' firstCenter' : '')}
				id="funnelTable" aria-describedby="editabledatatable_info">
				<thead>
				<tr role="row">
					<th width="10%">销售阶段</th>
					<th width="20%">商机</th>
					<th width="20%">责任人</th>
					<th width="20%">阶段开始日期</th>
					<th width="20%">阶段结束日期</th>
					<th width="10%">阶段持续时间(天)</th>
				</tr>
				</thead>
				<tbody className="public-body">
				{htmlList}
				</tbody>
			</table>
		);
	},
	getLiList: function (lists) {
		var len = lists.length;
		var self = this;
		var htmlList = lists.map(function (qst, key) {
			var returnFirstTd = function () {
				if (key == 0) {
					return <td rowSpan={len} className="stageTd">{qst.stageName}<br/><span>({qst.total}个记录)</span></td>;
				} else {
					return null;
				}
			};
			var returnSecondTd = function () {
				var chanceDetailHref = "#/chance/" + qst.id;
				if (key < (len - 1)) {
					return <td className="nameTd"><a href={chanceDetailHref}>{qst.chanceName}</a></td>;
				} else {
					return null;
				}
			};
			var returnThirdTd = function () {
				if (key < (len - 1)) {
					return <td>{qst.belongPerson}</td>;
				} else {
					return null;
				}
			};
			var returnFourthTd = function () {
				if (key < (len - 1)) {
					return <td>{qst.startedOn}</td>;
				} else {
					return null;
				}
			};
			var returnFifthTd = function () {
				if (key < (len - 1)) {
					return <td>{qst.finishedOn}</td>;
				} else {
					return null;
				}
			};
			var returnSixthTd = function () {
				if (key < (len - 1)) {
					return <td>{qst.days}</td>;
				} else {
					return null;
				}
			};
			var returnSeventhTd = function () {
				if (key == (len - 1)) {
					return <td className="subtotalTd" colSpan="5">平均<span>{qst.stageDays}天</span></td>;
				} else {
					return null;
				}
			}
			return (
				<tr key={key}>
					{returnFirstTd()}
					{returnSecondTd()}
					{returnThirdTd()}
					{returnFourthTd()}
					{returnFifthTd()}
					{returnSixthTd()}
					{returnSeventhTd()}
				</tr>
			)
		}.bind(this));
		return htmlList;
	},
	disposeData: function (listData) {
		var ele = [];
		var stageNameIcon = '';
		var list = [];
		var bl = false;
		var self = this;
		for (var i = 0; i < listData.length; i++) {
			var dataEle = listData[i];
			var stageName = dataEle.stageName;
			if (stageName != stageNameIcon) {
				if (bl) {
					ele.push({
						stageId: list[0].stageId,
						list: list
					});
					bl = false;
				}
				list = [];
				stageNameIcon = stageName;

				list.push(dataEle);
				bl = true;
			} else {
				list.push(listData[i]);
			}
			if (i === (listData.length - 1)) {
				ele.push({
					stageId: list[0].stageId,
					list: list
				});
			}
		}
		return ele;
	},
	setTypeValue: function () {
		/*商机类型赋值*/
		var type = this.refs.typeChance.el.val();
		if (type == -1) {
			type = null;
		}
		this.state.selectPP.chanceTypeId = type;
		this.setState(this.state.selectPP);
	},
	setDataValue: function () {
		var dataId = this.refs.typeData.el.val();
		this.state.selectPP.dataType = dataId;
		if (dataId == 1) {
			this.state.selectPP.deptList = [];
		} else if (dataId == 2) {
			this.state.selectPP.staffList = [];
			this.state.selectPP.isSub = 0;
			this.state.selectPP.isDeptSub = 0;
		}
		this.setState(this.state.selectPP);
	},
	setStaffList: function () {
		/*人员赋值*/
		var arrId = this.refs.staffs.el.val();
		this.state.selectPP.staffList = arrId;
		this.setState(this.state.selectPP);
	},
	setDeptList: function () {
		/*部门赋值*/
		var arrId = this.refs.dept.el.val();
		this.state.selectPP.deptList = arrId;
		this.setState(this.state.selectPP);
	},
	setSubValue: function () {
		var isSub = this.state.selectPP.isSub;
		if (isSub) {
			isSub = 0;
		} else {
			isSub = 1;
		}
		this.state.selectPP.isSub = isSub;
		this.setState(this.state.selectPP);
	},
	setDeptSubValue: function () {
		var isDeptSub = this.state.selectPP.isDeptSub;
		if (isDeptSub) {
			isDeptSub = 0;
		} else {
			isDeptSub = 1;
		}
		this.state.selectPP.isDeptSub = isDeptSub;
		this.setState(this.state.selectPP);
	},
	//商机类型
	renderSelectType: function () {
		return (
			<div>
				商机类型<br/>
				<Select2
					ref="typeChance"
					multiple={false}
					style={{width:"100%"}}
					onSelect={this.setTypeValue}     //选择回调 ,如果是单选,只调用这个就行了
					data={this.state.selectPP.chanceTypeArr}
					value={ this.state.selectPP.chanceTypeId}
					options={{placeholder: '选择商机类型'}}
				/>
			</div>
		);
	},
	//商机创建时间起止
	renderInputCreatedOnStartAndEnd: function () {
		return (
			<div>
				创建时间起止<br/>
				<div className="input-group">
					<input className="form-control date-picker" ref="createdOnStartAndEnd"
								 value={this.state.selectPP.startDate + ' / ' + this.state.selectPP.endDate} placeholder="选择创建时间起止"
								 id="createdOnStartAndEnd" type="text" readOnly="true"/>
					<span className="input-group-addon">
						<i className="fa fa-calendar"></i>
					</span>
				</div>
			</div>
		);
	},
	//数据筛选
	renderSelectData: function () {
		return (
			<div>
				数据筛选<br/>
				<Select2
					ref="typeData"
					multiple={false}
					style={{width:"100%"}}
					onSelect={this.setDataValue}     //选择回调 ,如果是单选,只调用这个就行了
					data={this.state.selectPP.dataTypeArr}
					value={ this.state.selectPP.dataType}
				/>
			</div>
		);
	},
	//指定人员
	renderSelectStaff: function () {
		if (this.state.selectPP.dataType == 2) {
			return "";
		}
		return (
			<div>
				指定人员<br/>
				<Select2
					multiple={true}
					ref="staffs"
					style={{width:"100%"}}
					onSelect={this.setStaffList}
					onUnselect={this.setStaffList}  //删除回调
					data={this.state.selectPP.staffArr}
					value={ this.state.selectPP.staffList}
					options={{placeholder: '选择指定人员'}}
				/>
			</div>
		);
	},
	//指定部门
	renderSelectDept: function () {
		if (this.state.selectPP.dataType == 1) {
			return "";
		}
		return (
			<div>
				指定部门<br/>
				<Select2
					multiple={true}
					ref="dept"
					style={{width:"100%"}}
					onSelect={this.setDeptList}
					onUnselect={this.setDeptList}  //删除回调
					data={this.state.selectPP.deptArr}
					value={ this.state.selectPP.deptList}
					options={{placeholder: '选择指定部门'}}
				/>
			</div>
		);
	},
	renderRadio: function () {
		if (this.state.selectPP.dataType == 2) {
			return "";
		}
		return (
			<div className="radio_in">
				<input type="checkbox" onChange={this.setSubValue} ref="isSub"
							 checked={this.state.selectPP.isSub}/><span>包含下属</span>
				<input type="checkbox" onChange={this.setDeptSubValue} ref="usDeptSub" checked={this.state.selectPP.isDeptSub}/><span>包含下级部门成员</span>
			</div>
		);
	},
	getHtmlRight: function (lists, num) {
		var htmlList = lists.map(function (qst, key) {
			if (key >= num * 6 && key < (num + 1) * 6) {
				return <p key={key}><span style={{background: qst.backColor}} className="point"></span><span
					className="stageName">{qst.stageName}</span><span className="amount">{qst.days}</span></p>
			}
		}.bind(this));
		return htmlList;
	},
	renderNextBth: function () {
		if (this.state.showNextBth) {
			return (
				<div className="next_btn" onClick={this.nextListPage}><a>下一页</a></div>
			);
		} else {
			return null;
		}
	},
	render: function () {
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params}/>
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my">
								<ul className="nav nav-tabs myTab">
									<li className="dropdown active">
										<a>商机阶段持续时间分析</a>
									</li>
									<div className="DTTT btn-group">
										<a onClick={this.handlerToggleFilterLayer} className="btn btn-default DTTT_button_collection">
											<i className="fa fa-filter"></i>
											<span>筛选 <i className="fa fa-angle-down"></i></span>
										</a>
										<a onClick={this.exportFn} className="btn btn-default DTTT_button_collection">
											<i className="glyphicon glyphicon-open"></i>
											<span>导出 </span>
										</a>
									</div>
									<div
										style={{display:this.state.showFilterLayer ? 'block' : 'none', width:380+'px',height:450+'px', zIndex:100, position:'absolute',right:1+'px',top:42+'px'}}>
										<div className="well with-header" style={{background:'#fff',height:'100%'}}>
											<div className="header bordered-blue">
												<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
													<button onClick={this.handlerResetFilter} className="btn btn-cancer">重置</button>
													<button onClick={this.handlerConfirmFilter} className="btn btn-danger">确定</button>
												</div>
											</div>
											<div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
												{this.renderSelectType()}<br/>
												{this.renderInputCreatedOnStartAndEnd()}<br/>
												{this.renderSelectData()}<br/>
												{this.renderSelectStaff()}<br/>
												{this.renderSelectDept()}
												{this.renderRadio()}
											</div>
										</div>
									</div>
								</ul>
								<div className="funnel">
									<div className="funnel_statistics">
										<p className="name"><span>平均销售周期</span><span className="amount">转化率</span></p>
										<p className="val"><span>{this.state.salesCycle}天</span><span className="amount">{this.state.conversionRate}</span></p>
									</div>
									<div className="funnel_charts">
										<p><span></span>{this.state.chanceTypeText}</p>
										<div id="rateChart" className="chart_pie"></div>
										<div className="background"></div>
										<div className="right_show">
											<div>
												{this.getHtmlRight(this.state.rateArr, 0)}
											</div>
											<div>
												{this.getHtmlRight(this.state.rateArr, 1)}
											</div>
										</div>
									</div>
									<div className="funnel_table">
										{this.renderDataList(this.state.dataList)}
										{this.renderNextBth()}
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