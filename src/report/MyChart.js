import React from 'react'
import {hashHistory} from 'react-router';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest';
import './report.css';
import DetailTable from '../core/components/DetailTable/List';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import Ranking from './ranking';
import {DatePicker} from 'antd';
import tools from '../core/common/tools';
import UserInfo from '../core/common/UserInfo.js';

var finishedRateChart = null;
var chanceTop10 = null;
module.exports = React.createClass({
    getInitialState: function () {
        var firstList = [{
            name: '新增客户',
            value: '',
            filed: 'customerCount',
            iconClass: 'blue pcicon-customer'
        }, {
            name: '新增联系人',
            value: '',
            filed: 'customerLinkmanCount',
            iconClass: 'green pcicon pcicon-contacts'
        }];
        if (!(CONFIG.Exclude && CONFIG.Exclude.clue)) {
            firstList.unshift({
                name: '新增线索',
                value: '',
                filed: 'clueCount',
                iconClass: 'yellow pcicon-clue'
            })
        }
        if (!(CONFIG.Exclude && CONFIG.Exclude.chance)) {
            firstList.push({
                name: '新增商机',
                value: '',
                filed: 'chanceCount',
                iconClass: 'red pcicon pcicon-business'
            });
        }
        var isManager = UserInfo.isManager();
        var rolePermit = UserInfo.getRolePermit();
        var info = UserInfo.get();
        //var targetName = isManager ? info.mainBelongDeptName : info.name;
        var targetName = rolePermit.isLeader ? info.mainBelongDeptName : info.name;
        return {
            targetName: targetName,
            staffId: isManager? 0 : info.staffId,
            departmentId: isManager ? info.mainManageDeptId : 0,
            analyList: [],
            firstList: firstList,
            noDataAnaly: false,
            //noDataTranslation: false,
            noChanceTop10: false,
            nameList:'',
            zhouqi: '',
            succeedRate: '',
            translateList: [],
            ranking: [],
            myRanking: null,
            chanceType: [],
            currentChance: {},
            currentMonth: tools.formatDate(new Date(), 'yyyy-mm')
        }
    },

    componentDidMount: function () {
        this.getFirstList(this.state.currentMonth);
        this.initFinishRateChart();
        this.renderFinishRateChart();
        this.initChanceTop10();
        this.renderChanceTop10();
        this.renderRanking('monthly');

        tools.imgLoadError();
    },
    getFirstList: function (month) {      //设置首行列表
        var self = this;

        AjaxRequest.get(APIS.sales_report + 'count', {month: month}, function (data) {
            if (data.code = "200") {

                var list = self.state.firstList,
                    datas = data.data;

                for (var i = 0, len = list.length; i < len; i++) {
                    var thisList = list[i],
                        field = list[i].filed;
                    for (var j = 0, ell = datas.length; j < ell; j++) {
                        if (datas[j].type == field) {
                            thisList.value = datas[j].newCount;
                        }
                    }

                }
                self.setState(self.state.firstList);
            }
        });
    },
    //销售目标完成情况
    initFinishRateChart: function () {
        var getOption = function (chartType) {
            var chartOption = {
                title: {
                    show: false
                },
                legend: {
                    data: []
                },
                grid: {
                    left: 50,
                    right: 50,
                    height: '60%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                    axisLine: {
                        show: false    //是否显示坐标轴
                    },
                    splitLine: {
                        show: true   //默认分隔线
                    },
                    data: [],
                    axisLabel: {
                        interval: 0,//横轴信息全部显示
                    }

                }],
                yAxis: [{
                    name: '单位：万元',
                    nameLocation: 'end',
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    splitArea: {
                        show: true
                    },
                    axisLabel: {
                        interval: 0,//横轴信息全部显示
                    }
                }],
                series: [
                    {
                        name: '实际销售业绩',
                        type: chartType,
                        data: [],
                        itemStyle: {
                            normal: {
                                color: '#f00'
                            }
                        }
                    }]
            };
            return chartOption;
        };
        var byId = function (id) {
            return document.getElementById(id);
        };

        finishedRateChart = echarts.init(byId('analyChart'));
        finishedRateChart.setOption(getOption('line'));
    },
    renderFinishRateChart: function () {//完成率接口
        var self = this;
        var param = {
                "staffId": self.state.staffId,
                "departmentId": self.state.departmentId,
                "analysisDate": self.state.currentMonth,
                "dimension": 'monthly'
            };
        self.refs.loader1.style.display = 'block';
        AjaxRequest.get(APIS.sales_report + 'sales_performance_analysis', param, function (data) {
            self.refs.loader1.style.display = 'none';

            if (!data.data.length) {
                self.setState({
                    noDataAnaly: true
                });
                return;
            } else {
                self.setState({
                    noDataAnaly: false,
                    analyList: data.data
                });

            }
            var years = [], data_1 = [], data_2 = [],
                datas = data.data,
                rotates = 0,
                manys = (datas.length > 3) ? true : false;  //如果X轴大于3条数据,就倾斜显示,因为ihpone5只能显示3个
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].forecastAmount > 100000) {
                    rotates = 60
                }

                years.push(datas[i].name);
                data_1.push(datas[i].forecastAmount);
                data_2.push(datas[i].dealAmount);
            }

            finishedRateChart.setOption({
                series: [{data: data_2}],
                xAxis: {
                    data: years
                }
            });
        })
    },
    //进行中的商机TOP 10
    initChanceTop10: function(){
        //chanceTop10
        chanceTop10 = echarts.init(document.getElementById('chanceTop10'));
        chanceTop10.setOption({
            title:{
                show: false
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '0px',
                right: '5%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: []
            },
            series: [
                {
                    name: '商机金额',
                    type: 'bar',
                    barWidth: '60%',
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: 'red'
                            }
                        }
                    },
                    itemStyle:{
                        normal: {
                            color: function (params) {
                                var colorList = [
                                    '#9d5ae5', '#5a95db', '#7dbb00', '#ffbb00', '#f75314',
                                    '#b00454', '#00a1f1', '#02c1a5', '#efee18', '#dd0527'
                                ];
                                return colorList[params.dataIndex];
                            }
                        }

                    },
                    data: []
                }
            ]
        });
    },
    renderChanceTop10: function(type){
        var self = this;
        self.refs.loader2.style.display = 'block';
        AjaxRequest.get(APIS.chanceTop10, {dimension:type}, function (data) {
            self.refs.loader2.style.display = 'none';
            var list = data.data.list;
            var nameList = data.data.nameList;
            var str = '';
            var chanceName = [];
            var forecastAmount = [];

            if(list.length>0){
                this.state.noChanceTop10 = false;
                for(var i=0; i<list.length; i++){
                    chanceName.push(list[i].chanceName);
                    forecastAmount.push(list[i].forecastAmount);
                }
                for(var j=0; j<nameList.length; j++){
                    str += (nameList[j].name+'，');
                }
                if(str.length>0){
                    str = str.substr(0, str.length-1);
                }
            }else {
                this.state.noChanceTop10 = true;
            }
            chanceTop10.setOption({
                yAxis:{data: chanceName},
                series:{
                    data: forecastAmount
                }
            });
            this.setState({nameList: str});
        }.bind(this));
    },
    //个人业绩排行榜
    renderRanking: function (type) {
        var self = this;
        AjaxRequest.get(APIS.sales_report + 'performance_ranking', {"dimension": type}, function (data) {
            if (data.code = "200") {
                var list = data.data.list;
                var myRanking = data.data.my;
                self.setState({
                    ranking: list,
                    myRanking: myRanking
                })
            }
        })
    },
    //时间跨度切换
    timeChangeHandle: function (type, flag, e) {
        e.preventDefault();
        e.stopPropagation();
        var el = e.target;
        // var p = e.target.parentNode;
        var b = e.target.parentNode.getElementsByTagName('li');
        for(var i=0; i<b.length; i++){
            if(b[i] == el){
                b[i].setAttribute('class', 'active');
            }else{
                b[i].removeAttribute('class');
            }
        }
        this[type](flag);
    },

    /*changeRankingSelect: function (data) {
        this.setState({
            currentRanking: {
                name: data.name,
                value: data.value
            }
        });
        this.renderRanking(data.value)
    },
    changeChanceSelect: function (data) {
        this.setState({
            currentChance: {
                name: data.name,
                value: data.id
            }
        });
        this.renderCharts_1(data.id)
    },
    getChanceList: function () {
        var self = this;
        AjaxRequest.get(APIS.chanceType, null, function (data) {
            if (data.code = "200") {
                self.setState({
                    chanceType: data.data,
                    currentChance: data.data[0]
                });
                self.renderCharts_1(data.data[0].id);
            }
        })
    },
    changeMonthTime: function (val) {
        var thisMonth = tools.formatDate(val, 'yyyy-mm');
        this.setState({
            currentMonth: thisMonth
        });
        this.getFirstList(thisMonth)
    },*/

    newStyle: function () {
        return {
            btnMarginRight: {
                width: 'auto',
                marginRight: '15px'
            },
            btnTabType:{
                width: 'auto',
                margin: '0px',
                borderRadius: '0px'
            },
            btnTabTypeMr1:{
                width: 'auto',
                margin: '0px',
                borderRadius: '0px',
                marginRight: '-1px'
            }
        }
    },
    render: function () {
        var newStyle = this.newStyle();
        var trs = this.state.analyList.map(function (qst, key) {
            return <tr key={key}>
                <td>{qst.name}</td>
                <td className="color_red">￥{toThousands(qst.forecastAmount)}</td>
                <td className="color_red">￥{toThousands(qst.dealAmount)}</td>
                <td>{qst.dealRate}%</td>
            </tr>
        }.bind(this));
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params}/>
                <div className="page-body noTopPadding">
                    <div className="row">
                        <div className="page-header position-relative">
                            <div className="header-title">
                                <h1>{'我的报表'}</h1>
                            </div>
                            <div className="report-first-r" style={{right:'15px', top:'4px'}}>
                                <span className="right-top-btn" style={newStyle.btnMarginRight}>
                                    <i className="monthLabel">{this.state.currentMonth}</i>
                                    {/*<a className="btn btn-default DTTT_button_copy" href="javascript:void(0);">
                                       {this.state.currentMonth}
                                    </a>*/}
                                </span>
                                <span className="right-top-btn" style={newStyle.btnTabTypeMr1}>
                                    <a className="btn btn-default DTTT_button_copy" href="#/report/">
                                        图&nbsp;&nbsp;&nbsp;&nbsp;表
                                    </a>
                                </span>
                                <span className="right-top-btn" style={newStyle.btnTabType}>
                                    <a className="btn btn-default DTTT_button_copy" href="#/report/list">
                                        报&nbsp;&nbsp;&nbsp;&nbsp;表
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="page-1">
                        <div className="detail-table">
                            <DetailTable lists={this.state.firstList}/>
                        </div>
                        <div className="tubiao-sy">
                            <div className="dashboard-box" style={{marginBottom:15+'px'}}>
                                <div className="box-tabbs">
                                    <div className="tabbable">
                                        <ul className="nav nav-tabs myTab">
                                            <li className="active">
                                                <a>
                                                    销售目标完成情况
                                                </a>
                                            </li>
                                            <li>
                                                <a>{this.state.targetName}</a>
                                            </li>

                                        </ul>
                                        <div className="tab-content tabs-flat">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    <div id="fxxjh" className="animated fadeInUp tab-pane in active">
                                                        <div id="analyChart" style={{width: 100+'%', height: 263+'px', marginTop: '-25px'}}></div>
                                                        <div ref="loader1" className="chartLoading">加载中...</div>
                                                        <div className="noData" style={{display:this.state.noDataAnaly?'block':'none'}}>暂无数据</div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    <div className="customerAnalysis-table">
                                                        <div className="line-top"></div>
                                                        <table>
                                                            <colgroup>
                                                                <col width="30%"/>
                                                                <col width="20%"/>
                                                                <col width="20%"/>
                                                                <col width="30%"/>
                                                            </colgroup>
                                                            <thead>
                                                            <tr>
                                                                <th>维度-月</th>
                                                                <th>目标(万元)</th>
                                                                <th>已完成(万元)</th>
                                                                <th>完成百分比</th>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="page-2">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="tubiao-sy">
                                    <div className="dashboard-box">
                                        <div className="box-tabbs">
                                            <div className="tabbable position-relative">
                                                <ul className="nav nav-tabs myTab">
                                                    <li className="active"><a>进行中的商机TOP 10</a></li>
                                                </ul>{/*  style={{minHeight:'662px'}} */}
                                                <div className="tab-content tabs-flat">
                                                    <div id="xszhl" className="animated fadeInUp tab-pane in active">
                                                        <div className="timeBar" style={{position: 'absolute', top: '10px', zIndex: '9'}}>
                                                            <ul className="toggleTime">
                                                                <li className="active" onClick={this.timeChangeHandle.bind(this, 'renderChanceTop10', 'monthly')}>本月</li>
                                                                <li onClick={this.timeChangeHandle.bind(this, 'renderChanceTop10', 'quarterly')}>本季</li>
                                                                <li onClick={this.timeChangeHandle.bind(this, 'renderChanceTop10', 'annual')}>本年</li>
                                                            </ul>
                                                        </div>
                                                        <div style={{marginTop: '-12px'}}>
                                                            <div id="chanceTop10" style={{width: '100%', height: '300px'}}></div>
                                                            <div ref="loader2" className="chartLoading">加载中...</div>
                                                            <div className="noData" style={{display:this.state.noChanceTop10?'block':'none'}}>暂无数据</div>
                                                        </div>
                                                        <p className="nameList">{this.state.nameList}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="tubiao-sy">
                                    <div className="dashboard-box">
                                        <div className="box-tabbs">
                                            <div className="tabbable position-relative">
                                                <ul className="nav nav-tabs myTab">
                                                    <li className="active">
                                                        <a>
                                                            业绩排行榜
                                                        </a>
                                                    </li>
                                                </ul>
                                                <div className="tab-content tabs-flat" style={{padding:'16px 0 0 0'}}>
                                                    <div className="timeBar" style={{marginBottom: '10px'}}>
                                                        <ul className="toggleTime">
                                                            <li className="active" onClick={this.timeChangeHandle.bind(this, 'renderRanking', 'monthly')}>本月</li>
                                                            <li onClick={this.timeChangeHandle.bind(this, 'renderRanking', 'quarterly')}>本季</li>
                                                            <li onClick={this.timeChangeHandle.bind(this, 'renderRanking', 'annual')}>本年</li>
                                                        </ul>
                                                    </div>
                                                    <div id="yjphb" className="animated fadeInUp tab-pane in active">
                                                        <Ranking list={this.state.ranking} myRanking={this.state.myRanking} />
                                                    </div>
                                                </div>
                                            </div>
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