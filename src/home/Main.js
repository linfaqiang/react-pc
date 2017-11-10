import React from 'react'
import AjaxRequest from '../core/common/ajaxRequest';
import {APIS} from '../core/common/config';
import CRMcalendar from  './CRMcalendar';
import './home.css';
import CalenderList from './CalenderListNew';
import NoticeList from './NoticeList';
import AddBirthday from './AddBirthday'
import AddSchedule from './AddSchedule'


module.exports = React.createClass({

    getInitialState:function(){
        var t = new Date();
        var m = t.getMonth()+1;
        var str  = t.getFullYear() + '-' + ( m<10 ? ('0'+m) : m);
        return {
            noDataChart:false,
            noticeList:[],
            calenderList:[],
            noticeData:{
                pageSize:5,
                pageNo:1,
                today:'',
                isDesktop:1
            },
            calenderData:{
                pageSize:5,
                pageNo:1,
                today:''
            },
            thisMonth: str,
            isFirstRender: true,
            hasNewData:'',
            calendarDate: ''
        }
    },

    componentDidMount:function(){
        var self = this;
        new CRMcalendar("#sangCalender", {
            thisDom:'#calender-first',
            onSelect: function(oDate){

                self.state.calenderData.today = oDate.back;
                self.setState(self.state.calenderData);
                
                self.renderCalender(self.state.calenderData);

                //这里是选择后的回调
                return true;
            },
            onSelectBack: function(oDate){
                return false;
            },
            onMonthChange: function(data){
                self.getEveryday(data);
            }
        });


        if(!CONFIG.Exclude){
            this.renderCharts();
        }
        this.renderNotice(this.state.noticeData);
        //this.renderCalender(this.state.calenderData);
        this.bindHasNewDataEvent();
    },
    componentWillUnmount: function(){
        this.unbindHasNewDataEvent();
    },
    renderCharts:function () {
        var self = this,
            param = {
                "staffId":0,
                "departmentId": 0,
                "analysisDate":self.state.thisMonth,
                "dimension":'monthly'
            };
        AjaxRequest.get(APIS.sales_report+'new_opportunities', param, function(data){

            if(!data.data.length){
                self.setState({
                    noDataChart:true
                });
                return;
            }else{
                self.setState({
                    noDataChart:false
                });
            }

            var years = [],
                datas = data.data,
                data_1 = [],
                rotates = 0,
                manys = (datas.length > 5) ? true : false;  //如果X轴大于3条数据,就倾斜显示,因为ihpone5只能显示3个
            for (var i = 0; i < datas.length; i++) {

                if(datas[i].forecastAmount > 1000000){     //如果数值太大,就倾斜显示
                    rotates = 60
                }

                years.push(datas[i].name);
                data_1.push(datas[i].forecastAmount);

            }

            var getOption = function (chartType) {
                var chartOption = {
                    title:{
                        show: false
                    },
                    legend: {
                        data: []
                    },
                    /*grid: {
                        x: 50,
                        x2: 10,
                        y: 15,
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
                            interval:0,//横轴信息全部显示
                            rotate:manys ? 30 : 0
                        }
                    }],
                    yAxis: [{
                        name : '单位：万元',
                        nameLocation: 'end',
                        //max: 300,
                        type: 'value',
                        axisLine: {
                            show: false
                        },
                        splitArea: {
                            show: true
                        },
                        axisLabel: {
                            interval:0,//横轴信息全部显示
                            //rotate: 60//60度角倾斜显示
                            rotate:rotates
                        }
                    }],
                    series: [{
                        name: '销售机会金额',
                        type: chartType,
                        data: data_1,
                        itemStyle: {
                            normal: {
                                color: '#C71D27'
                            }
                        }
                    }]
                };
                return chartOption;
            };
            var byId = function (id) {
                return document.getElementById(id);
            };

            var barChart = echarts.init(byId('barChart'));
            barChart.setOption(getOption('line'));
        })
    },
    renderNotice:function (param) {
        var self = this;

        AjaxRequest.get(APIS.message_list, param, function(data){
            /*var tmp = JSON.parse(Base64.decode(data.data));
            data.data = tmp;*/

            self.state.messegeList=data;
            self.setState(self.state.messegeList);
            self.refs.noticeList.setPagerData(data)

        })

    },
    renderCalender:function (param) {
        var self = this;
        var args ={
            pageSize:5,
            pageNo:1,
            today:''
            };
        if(param){
            for (var key in param){
                args[key] = param[key];
            }
        }

        AjaxRequest.get(APIS.schedule_detail+'today', args, function(data){
            self.refs.calenderList.setPagerData(data);
            self.setState({isFirstRender:false});
        })
    },
    getEveryday:function(data){
        var self = this;
        if(data !== self.state.calendarDate){
            self.setState({calendarDate: data});
        }
        data = JSON.parse(data);
        data.month += 1;//月份是 0 ~ 11
        AjaxRequest.get(APIS.get_everyday.replace('{month}', data.year+'-'+data.month), null, function(data){
            //console.log(JSON.stringify(data));
            var list = data.data;
            var days = $('#calender-first .ui-date-days a');

            for(var i=0; i<list.length; i++){
                for(var j=0; j<days.length; j++){
                    if(days.eq(j).attr('data-date') == list[i]){
                        days.eq(j).closest('div').eq(0).addClass('hasMsg');
                        break;
                    }
                }
            }
            if(self.state.isFirstRender){
                self.renderCalender();
            }else{
                self.refs.calenderList.setPagerData({pageNo: 1, pageSize: 5, totalSize: 0, data: [], code: "200", msg: "OK"});
            }
        })
    },
    bindHasNewDataEvent:function(){
        var self = this;
        $(document).on('hasNewSchedule hasNewBirthday', self.handleHasNewData);
    },
    handleHasNewData:function(e){
        var self = this;
        self.setState({hasNewData: e.timestamp});
        self.setState({isFirstRender:true});
        self.getEveryday(self.state.calendarDate);
    },
    unbindHasNewDataEvent:function(){
        var self = this;
        $(document).off('hasNewBirthday');
        $(document).off('hasNewSchedule');
    },
   /* contextTypes: {
        router: React.PropTypes.object
    },
    listen: function() {
        var self = this;
        self.context.router.listen(function(location) {
            //console.log(JSON.stringify(location));
            var t = location.query.hasNewData ? location.query.hasNewData : null;
            if(t && (t != self.state.hasNewData) && (location.pathname == '/')){
                self.setState({hasNewData: t});
                self.setState({isFirstRender:true});
                self.getEveryday(self.state.calendarDate);
            }
        });
    },*/
    render:function(){

        var exculde = CONFIG.Exclude;
        var noChance = false;
        if( (exculde !== null) ){
            if(exculde.hasOwnProperty('chance'))
                noChance = true;
        }

        return (
            <div className="page-body">
                <div className="row">
                    <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                        <div className="tubiao-sy" style={{display: (noChance? 'none': 'inherit')}}>
                            <div className="dashboard-box" style={{marginBottom:15+'px'}}>
                                <div className="box-tabbs">
                                    <div className="tabbable">
                                        <ul className="nav nav-tabs myTab" id="myTab11">
                                            <li className="active">
                                                <a data-toggle="tab" href="#fxxjh">
                                                    发现新机会
                                                </a>
                                            </li>

                                        </ul>
                                        <div className="tab-content tabs-flat" style={{paddingBottom:0+'px'}}>
                                            <div id="fxxjh" className="animated fadeInUp tab-pane in active">
                                                <div style={{width: 100+'%', height: 280+'px', marginTop: '-30px', marginLeft: '20px'}} id="barChart"></div>
                                                <div className="noData" style={{display:this.state.noDataChart?'block':'none'}}>暂无数据</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tongzhi-sy">
                            <div className="dashboard-box">
                                <div className="box-tabbs">
                                    <div className="tabbable position-relative">
                                        <span className="right-fresh" onClick={this.renderNotice.bind(this,this.state.noticeData)}><span className="fa fa-refresh"></span></span>
                                        <ul className="nav nav-tabs myTab" id="myTab11">
                                            <li className="active">
                                                <a data-toggle="tab" href="#tongzhi">
                                                    通知
                                                </a>
                                            </li>

                                        </ul>
                                        <div className="tab-content tabs-flat">
                                            <div id="tongzhi" className="animated fadeInUp tab-pane in active">
                                                <div className="detail-tab3">
                                                    <div className="ppLi no-border-bottom">
                                                        <NoticeList
                                                            ref="noticeList"
                                                            getData={this.renderNotice}
                                                            trackData={this.state.noticeData}/>
                                                    </div>
                                                    <p><a href="#/messege">查看更多>></a></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                        <div id="calender-first">
                            <input type="text" style={{display: 'none'}} id="sangCalender" />
                        </div>
                        <CalenderList
                            ref="calenderList"
                            getData={this.renderCalender}
                            trackData={this.state.calenderData}/>
                    </div>
                </div>
                {/*
                <AddBirthday updata={this.renderCalender}></AddBirthday>
                <AddSchedule updata={this.renderCalender}></AddSchedule>*/}
            </div>
        )
    }
});