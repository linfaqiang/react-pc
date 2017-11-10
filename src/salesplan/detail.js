import React from 'react';
import {Link} from 'react-router';
import AjaxRequest from '../core/common/ajaxRequest';
import DetailTable from '../core/components/DetailTable/List';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import {APIS} from '../core/common/config';
import UserInfo from '../core/common/UserInfo.js';

module.exports = React.createClass({

    getInitialState: function () {
        return {
            routeId: this.props.params.id,
            showEditBtn: false,
            permit: {
                isLeader: false,
                isOwner: false
            }, //当前用户的权限
            startDate: "",//开始年月
            endDate: "",//结束年月
            firstList: [
                {
                    name: '销售目标金额（万元）',
                    value: '',
                    filed: 'targetAmount',
                    iconClass: 'yellow pcicon-salesdest'
                }, {
                    name: '销售计划金额（万元）',
                    value: '',
                    filed: 'planAmount',
                    iconClass: 'blue pcicon-salesplan'
                }, {
                    name: '实际销售金额（万元）',
                    value: '',
                    filed: 'finishedAmount',
                    iconClass: 'green pcicon pcicon-realMoney'
                }, {
                    name: '计划组织',
                    value: '',
                    filed: 'owner',
                    iconClass: 'red pcicon pcicon-orgArch'
                }
            ],
            remark: "", //备注
            allocList: [], //分配表
            assignAmount: 0, //已分配金额
            unAllocAmount: 0, //未分配金额
        }

    },

    componentWillMount: function () {

    },

    componentDidMount: function () {
        this.getData();  //详情首行
    },

    setShowEditBtn: function (data) {
        //console.error("vvvv");
        var endMonth = data.endDate ? data.endDate.split('-') : null;//计划的结束时间
        var now = new Date();
        if (endMonth) {
            var endDate = new Date(parseInt(endMonth[0]), parseInt(endMonth[1]), 0, 0, 0, 0).getDate();//计划结束月的最后一天
            endMonth = (new Date(parseInt(endMonth[0]), parseInt(endMonth[1]) - 1, endDate, 0, 0, 0)).getTime();
            now = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)).getTime();
            if( (now < endMonth) &&  this.state.permit.isOwner)  {//未过期的且是计划的所属者，才允许编辑按钮出现
                this.setState({showEditBtn: true});
            }
        }
    },
    setFirstList: function (data) {      //设置首行列表
        var list = this.state.firstList;
        for (var i = 0, len = list.length; i < len; i++) {
            var field = list[i].filed;
            if (typeof data[field] === 'number') {
                if(field == 'targetAmount' || field == 'planAmount' ){
                    list[i].value = toThousands(data[field]);
                }else if(field == 'finishedAmount'){
                    list[i].value = toThousands(data[field] * 0.0001);
                }else{
                    list[i].value = data[field];
                }
            }
            if (typeof data[field] === 'string') {
                list[i].value = data[field] || "暂无";
            }
        }
        this.state.firstList = list;//更新状态firstList
    },

    setBarChart:function(dest, plan){
        //console.error("xxxx");
        var myChart = echarts.init(document.getElementById('barChart'));

        /*var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['目标完成率', '计划完成率'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'//,
                    // max: 150,
                    // min:0
                }
            ],
            series : [
                {
                    type:'bar',
                    barWidth: 60,
                    data:[
                        {
                            value:parseFloat(dest),//目标完成率
                            itemStyle:{
                                normal:{color:'#ffbb00'}
                            }
                        },
                        {
                            value:parseFloat(plan),//计划完成率
                            itemStyle:{
                                normal:{color:'#7dbb00'}
                            }
                        }
                    ]
                }
            ]
        };*/
        var opt = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    var tar = params[0];
                    return tar.name + '<br/>' +  ' : ' + tar.value+'%';
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['目标完成率', '计划完成率'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    barWidth: '40%',
                    data:[
                        {
                            value:parseFloat(dest),//目标完成率
                            itemStyle:{
                                normal:{color:'#ffbb00'}
                            }
                        },
                        {
                            value:parseFloat(plan),//计划完成率
                            itemStyle:{
                                normal:{color:'#7dbb00'}
                            }
                        }
                    ]
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(opt);
    },

    setStartDate:function(data){
        var str = data.split(/-|\/|:| /);
        this.setState({startDate: (str[0]+'-'+str[1])});
    },

    setEndDate: function(data){
        var str = data.split(/-|\/|:| /);
        this.setState({endDate: (str[0]+'-'+str[1])});
    },

    setAllocList: function(data){
        if(!data || data.length==0) return null;
        var list = new Array();

        for(var i=0; i<data.length; i++){
            list.push({
                "owner": data[i]["owner"],
                "targetAmount": data[i]["targetAmount"],
                "finishedAmount": data[i]["finishedAmount"],
            });
        }
        this.state.allocList = list;
        this.setState(this.state.allocList);

    },

    getData: function () {
        var self = this,
            thisUrl = APIS.saleplansDetail + this.state.routeId;
        AjaxRequest.get(thisUrl, '', function (res) {
            if (res.code = "200") {
                self.setState({remark: res.data.remark});//修改状态remark
                self.setState({assignAmount: res.data.assignAmount});//修改状态assignAmount
                self.setState({unAllocAmount: (res.data.targetAmount - res.data.assignAmount)});//修改状态unallocAmount

                self.setFirstList(res.data);             //设置状态firstList, render首航
                self.setAllocList(res.data.list);        //设置allocList
                self.setStartDate(res.data.startDate);
                self.setEndDate(res.data.endDate);
                //self.setState({permit: UserInfo.getRolePermit(res.data)});


                var p = UserInfo.getRolePermit(res.data);
                self.state.permit.isLeader = p.isLeader;
                self.state.permit.isOwner = p.isOwner;
                self.setState(self.state.permit);

                self.setShowEditBtn(res.data);           //设置是否显示编辑按钮
                self.setBarChart(res.data.finishedRate, res.data.planFinishedRate);   //绘制图表
            } else {
                console.log('请求失败!')
            }
        });
    },

    exampledata: {
        "planFinishedRate": "9999999.00%",/*计划销售率的实际完成率*/
        "startDate": "2016-08",
        "ownerDeptId": 83,
        "ownerStaffId": 0,
        "finishedRate": "19999998.00%",/*目标销售率的实际完成率*/
        "finishedAmount": 19999998,/*实际销售额*/
        "endDate": "2016-08",
        "targetAmount": 100,/*目标销售额*/
        "type": "dept",
        "ownerOrgId": 0,/*所属分公司*/
        "id": 430,
        "planAmount": 200,/*计划销售额*/
        "assignAmount": 10,/* 已分配金额 */
        "name": "2016-08",
        "owner": "销售一部",
        "list": [{
            "planFinishedRate": "-",
            "startDate": "2016-08",
            "ownerDeptId": 0,/*所属部门*/
            "ownerStaffId": 576, /*所属员工*/
            "finishedRate": "-",
            "finishedAmount": 0,/*实际完成*/
            "endDate": "2016-08",
            "targetAmount": 0,/*销售配额*/
            "type": "user",
            "id": 16833,
            "planAmount": 0,
            "name": "2016-08",
            "owner": "绿豆蛙",/*分配组织*/
            "departmentId": 83
        }]
    },

    render: function () {
        var self = this;
        var lists = this.state.allocList;
        var trs = lists.map(function(item, key){
            return <tr key={key}>
                <td>{item.owner}</td>
                <td>{item.targetAmount}</td>
                <td>{item.finishedAmount}</td>
            </tr>
        }.bind(this) );

        function renderList(){
            if(self.state.permit.isLeader){
                return (
                    <div className="row otherRow">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="orders-container">
                                    <div className="orders-header fenpei">
                                        <h6>
                                            未分配（万元）：<label className="fColorRed">￥{toThousands(self.state.unAllocAmount)}</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                            已分配（万元）：<label className="fColorRed">￥{toThousands(self.state.assignAmount)}</label>
                                        </h6>
                                    </div>
                                    <table className="table table-bordered table-striped table-condensed flip-content">
                                        <thead>
                                        <tr>
                                            <th>分配组织</th>
                                            <th>销售配额（万元）</th>
                                            <th>实际完成（万元）</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {trs}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }else{
                return null;
            }
        }
        
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body noTopPadding">
                    <div className="row">
                        {/* Page Header */}
                        <div className="page-header position-relative">
                            <div className="header-title">
                                <h1>
                                    {this.state.name}销售计划
                                    <Link className={this.state.showEditBtn ? "crm_edit pcicon pcicon-edit" : ""}
                                          to={'/salesplan/'+this.state.routeId+'/edit'}></Link>
                                </h1>
                            </div>
                            {/*Header Buttons*/}
                            {/*Header Buttons End*/}
                        </div>
                        {/* /Page Header */}
                    </div>
                    {/*首行4块*/}
                    <DetailTable lists={this.state.firstList}/>
                    <div className="row otherRow">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="orders-container">
                                    <div className="orders-header">
                                        <h6>
                                            <span>完成率</span>
                                        </h6>
                                    </div>
                                    <div className="row otherRow mychar">
                                        <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                            <div className="databox databox-xxlg databox-vertical databox-inverted">
                                                <div className="databox-row no-padding">
                                                    <div id="barChart" className="chart chart-lg"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                            <div className="widget-body planTxt">
                                                <h4>销售计划备注</h4>
                                                <p>{this.state.remark || '暂无备注信息'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {renderList()}

                </div>
            </div>
        )
    }
});