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
        return {
            analyList: [],
            firstList: firstList,
            noDataAnaly: false,
            noDataTranslation: false,
            zhouqi: '',
            succeedRate: '',
            translateList: [],
            ranking: {
                list: [],
                my: {
                    ranking: '',
                    dealAmount: ''
                }
            },
            currentRanking: {
                name: '本月',
                value: 'monthly'
            },
            rankingSelect: [   //销售排行榜帅选类型
                {
                    name: '本月',
                    value: 'monthly'
                }, {
                    name: '本季',
                    value: 'quarterly'
                }, {
                    name: '本年',
                    value: 'annual'
                }
            ],
            chanceType: [],
            currentChance: {},
            currentMonth: tools.formatDate(new Date(), 'yyyy-mm')
        }
    },

    componentDidMount: function () {

        this.renderCharts();
        this.getFirstList(this.state.currentMonth);
        this.renderRanking('monthly');
        this.getChanceList();
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
    renderCharts: function () {           //销售转化率
        var self = this,
            param = {
                "staffId": 0,
                "departmentId": 0,
                "analysisDate": self.state.currentMonth,
                "dimension": 'monthly'
            };
        AjaxRequest.get(APIS.sales_report + 'sales_performance_analysis', param, function (data) {

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

            var getOption = function (chartType) {
                var chartOption = {
                    title: {
                        show: false
                    },
                    legend: {
                        data: []
                    },
                    /*grid: {
                     x: 45,
                     x2: 10,
                     y: 30,
                     y2: manys ? 75 : 65
                     },*/
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
                        data: years,
                        axisLabel: {
                            interval: 0,//横轴信息全部显示
                            //rotate:manys ? 30 : 0
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
                            //rotate: rotates //60度角倾斜显示
                        }
                    }],
                    series: [
                        {
                            name: '实际销售业绩',
                            type: chartType,
                            data: data_2,
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

            var barChart = echarts.init(byId('analyChart'));
            barChart.setOption(getOption('line'));
        })
    },
    renderCharts_1: function (type) {
        var self = this,
            param = {
                "staffId": 0,
                "deptId": 0,
                "fromDate": '2016-01-01',
                "toDate": '2016-09-26',
                "type": type
            };

        AjaxRequest.get(APIS.sales_report + 'sales_conversion_rate', param, function (data) {

            if (!data.data.list.length) {
                self.setState({
                    noDataTranslation: true
                });
                return;
            } else {
                self.setState({
                    noDataTranslation: false,
                    succeedRate: data.data.succeedRate,
                    zhouqi: data.data.list[0].days
                });

            }


            var datas = [], datas_1 = [], dataList = [], thisData = data.data.list,
                colors = ['', '#6CB105', '#883BDC', '#FDAE0A', '#F13B12', '#4A80D2'],
                noDays = true; //如果所有天数都为0,不显示图标

            for (var i = 1; i < thisData.length; i++) {

                var thisValue = parseInt(thisData[i].days),
                    thisName = thisData[i].stageName,
                    otherName = thisName + thisValue + '天';

                datas.push({
                    value: thisValue,
                    name: thisName,
                    itemStyle: {
                        normal: {color: colors[i]}
                    }
                });

                datas_1.push({
                    value: thisValue,
                    name: otherName,
                    icon: 'bar',   //图标决定标注的形状是扇形还是方形
                    itemStyle: {
                        normal: {color: colors[i]}
                    }
                });

                dataList.push(thisData[i]);
                if (thisData[i].days > 0) {
                    noDays = false;
                }
            }


            if (noDays) {
                self.setState({
                    noDataTranslation: true
                });
                return;
            }


            self.setState({
                translateList: dataList
            });

            var getOption = function () {
                var chartOption = {
                    legend: {
                        orient: 'vertical',
                        x: '60%',
                        y: '25%',
                        //height:400,
                        data: datas_1,
                        textStyle: {
                            color: '#333',
                            fontFamily: '微软雅黑',
                            fontSize: 14
                        },
                        selectedMode: false
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    backgroundColor: 'rgba(255,255,255,1)',
                    series: [{
                        "type": "pie",
                        "center": ["50%", "50%"],
                        "radius": "65%",
                        "minAngle": 10,
                        "itemStyle": {
                            "normal": {
                                "label": {
                                    "show": true,
                                    "formatter": function (a, b, c, d) {
                                        if (c != 0) {
                                            return b;
                                        }
                                    }

                                },
                                "labelLine": {
                                    "show": false,
                                    "length": 5

                                }
                            }
                        },
                        "data": datas
                    }]
                };
                return chartOption;
            };
            var byId = function (id) {
                return document.getElementById(id);
            };

            var barChart = echarts.init(byId('translationChart'));
            barChart.setOption(getOption('pie'));
        })
    },
    renderRanking: function (type) {

        var self = this;

        AjaxRequest.get(APIS.sales_report + 'performance_ranking', {"dimension": type}, function (data) {
            if (data.code = "200") {
                self.setState({
                    ranking: {
                        list: data.data.list,
                        my: data.data.my
                    }
                })
            }
        })

    },

    changeRankingSelect: function (data) {
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
    },


    render: function () {
        var MonthPicker = DatePicker.MonthPicker,
            style_form_group = {
                marginBottom: "15px",
                verticalAlign: "middle",
                width: "100%"
            };
        var headPhotoUrl = UserInfo.headPhotoUrl();

        var trs = this.state.analyList.map(function (qst, key) {
            return <tr key={key}>
                <td>{qst.name}</td>
                <td className="color_red">￥{toThousands(qst.forecastAmount)}</td>
                <td className="color_red">￥{toThousands(qst.dealAmount)}</td>
                <td>{qst.dealRate}%</td>
            </tr>
        }.bind(this));

        var rankingLi = this.state.rankingSelect.map(function (qst, key) {
            return <li key={key} onClick={this.changeRankingSelect.bind(this,qst)}>
                <a href="javascript:void(0);">{qst.name}</a>
            </li>
        }.bind(this));

        var chanceLi = this.state.chanceType.map(function (qst, key) {
            return <li key={key} onClick={this.changeChanceSelect.bind(this,qst)}>
                <a href="javascript:void(0);">{qst.name}</a>
            </li>
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
                            <div className="report-first-r">
                                <span className="right-top-btn">
                                    <a className="btn btn-default DTTT_button_copy" href="javascript:void(0);">
                                       {this.state.currentMonth}
                                    </a>
                                </span>
                                <span className="right-top-btn">
                                    <a className="btn btn-default DTTT_button_copy" href="#/report/">
                                        图&nbsp;&nbsp;&nbsp;&nbsp;表
                                    </a>
                                </span>
                                <span className="right-top-btn">
                                    <a className="btn btn-default DTTT_button_copy" href="#/report/list">
                                        报&nbsp;&nbsp;&nbsp;&nbsp;表
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="page-1">
                        <div className="position-relative">
                            <div className="header-title detail-tab3 report-first">
                                <div className="tx-img report-img">
                                    <img src={headPhotoUrl?headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user_bak.png"}
                                        name="headPhoto" width="45" height="45"/>
                                </div>
                                <h1>
                                    {UserInfo.get().loginName}
                                </h1>
                            </div>
                            <div className="report-first-r">
                                <span className="right-top-btn">
                                    <MonthPicker ref="selectMonth"
                                                 style={style_form_group}
                                                 value={this.state.currentMonth}
                                                 onChange={this.changeMonthTime}
                                                 size="large"
                                                 format="yyyy-MM"
                                                 name="addWorkMonthTime"
                                                 id="selectMonth"/>
                                </span>
                                <span className="right-top-btn">
                                    <a className="btn btn-default DTTT_button_copy" href="#/report/">
                                        图&nbsp;&nbsp;&nbsp;&nbsp;表
                                    </a>
                                </span>
                                <span className="right-top-btn">                                    
                                    <a className="btn btn-default DTTT_button_copy" href="#/report/list">
                                        报&nbsp;&nbsp;&nbsp;&nbsp;表
                                    </a>
                                </span>
                            </div>
                        </div>

                        <div className="detail-table">
                            <DetailTable lists={this.state.firstList}/>
                        </div>


                        <div className="tubiao-sy">
                            <div className="dashboard-box" style={{marginBottom:15+'px'}}>
                                <div className="box-tabbs">
                                    <div className="tabbable">
                                        <ul className="nav nav-tabs myTab" id="myTab11">
                                            <li className="active">
                                                <a data-toggle="tab" href="#fxxjh">
                                                    销售业绩分析
                                                </a>
                                            </li>

                                        </ul>
                                        <div className="tab-content tabs-flat">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    <div id="fxxjh" className="animated fadeInUp tab-pane in active">
                                                        <div
                                                            style={{width: 100+'%', height: 263+'px', marginTop: '-25px'}}
                                                            id="analyChart"></div>
                                                        <div className="noData"
                                                             style={{display:this.state.noDataAnaly?'block':'none'}}>
                                                            暂无数据
                                                        </div>
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
                                                <div className="btn-group right-drop">
                                                    <a className="btn btn-default "
                                                       href="javascript:void(0);">{this.state.currentChance.name}</a>
                                                    <a className="btn btn-default  dropdown-toggle"
                                                       data-toggle="dropdown" href="javascript:void(0);"><i
                                                        className="fa fa-angle-down"></i></a>
                                                    <ul className="dropdown-menu dropdown-inverse">
                                                        {chanceLi}
                                                        <li className="divider"></li>
                                                    </ul>
                                                </div>
                                                <ul className="nav nav-tabs myTab" id="myTab11">
                                                    <li className="active">
                                                        <a data-toggle="tab" href="#xszhl">
                                                            销售转化率
                                                        </a>
                                                    </li>

                                                </ul>
                                                <div className="tab-content tabs-flat">
                                                    <div id="xszhl" className="animated fadeInUp tab-pane in active">

                                                        <div>
                                                            <div style={{width: 100+'%', height: 263+'px'}}
                                                                 className="chart" id="translationChart"></div>
                                                            <div className="noData"
                                                                 style={{display:this.state.noDataTranslation?'block':'none'}}>
                                                                暂无数据
                                                            </div>
                                                        </div>

                                                        <div className="customerAnalysis-table"
                                                             style={{marginBottom:15+'px'}}>
                                                            <table>
                                                                <colgroup>
                                                                    <col width="70%"/>
                                                                    <col width=""/>
                                                                </colgroup>
                                                                <tbody>
                                                                <tr>
                                                                    <td>销售周期</td>
                                                                    <td className="color_red">{this.state.zhouqi}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>成功转化率</td>
                                                                    <td className="color_red">{this.state.succeedRate}</td>
                                                                </tr>
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
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="tubiao-sy">
                                    <div className="dashboard-box">
                                        <div className="box-tabbs">
                                            <div className="tabbable position-relative">
                                                <div className="btn-group right-drop">
                                                    <a className="btn btn-default "
                                                       href="javascript:void(0);">{this.state.currentRanking.name}</a>
                                                    <a className="btn btn-default  dropdown-toggle"
                                                       data-toggle="dropdown" href="javascript:void(0);"><i
                                                        className="fa fa-angle-down"></i></a>
                                                    <ul className="dropdown-menu dropdown-inverse">
                                                        {rankingLi}
                                                        <li className="divider"></li>
                                                    </ul>
                                                </div>
                                                <ul className="nav nav-tabs myTab" id="myTab11">
                                                    <li className="active">
                                                        <a data-toggle="tab" href="#yjphb">
                                                            业绩排行榜
                                                        </a>
                                                    </li>
                                                </ul>
                                                <div className="tab-content tabs-flat" style={{padding:0+'px'}}>
                                                    <div id="yjphb" className="animated fadeInUp tab-pane in active">
                                                        <Ranking list={this.state.ranking.list}
                                                                 ranking={this.state.ranking.my.ranking}
                                                                 dealAmount={this.state.ranking.my.dealAmount}
                                                        />
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