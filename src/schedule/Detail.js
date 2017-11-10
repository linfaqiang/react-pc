import React from 'react';
import {hashHistory} from 'react-router';
import AjaxRequest from '../core/common/ajaxRequest.js';
import DetailTable from '../core/components/DetailTable/List';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import DetailList from '../core/components/DetailList/List';
import { APIS } from '../core/common/config';

module.exports = React.createClass({

    getInitialState: function() {
        return {
            routeId: this.props.params.id,
            tableData: { //详情首行表格
                firstList: [{
                    name: '客户',
                    value: '',
                    filed: 'customerName',
                    iconClass: 'yellow pcicon-customer'
                }, {
                    name: '位置',
                    value: '',
                    filed: 'address.address',
                    iconClass: 'blue pcicon-addr'
                }, {
                    name: '开始时间',
                    value: '',
                    filed: 'startTime',
                    iconClass: 'green pcicon pcicon-clock'
                }, {
                    name: '结束时间',
                    value: '',
                    filed: 'endTime',
                    iconClass: 'red pcicon pcicon-clock'
                }],
                lists: []
            },
            detailList: [ //详情
                {
                    name: '商机',
                    field: 'chanceName',
                    value: ''
                }, {
                    name: '联系人',
                    field: 'linkman',
                    value: ''
                }, {
                    name: '提醒',
                    field: 'alertMinutes',
                    value: ''
                }, {
                    name: '内容',
                    field: 'myScheduleDesc',
                    value: ''
                }
            ]
        }

    },

    componentDidMount: function() {
        var self = this;
        $(document).on('hasNewBirthday hasNewSchedule', function(e){
            self.getData();
        });
        self.getData(); //详情首行
    },
    componentWillUnmount: function () {
        $(document).off('hasNewBirthday');
        $(document).off('hasNewBirthday');
    },
    setDetailData: function(data) { //设置详情
        var list = this.state.detailList;

        for (var i = 0, len = list.length; i < len; i++) {
            var field = this.state.detailList[i].field;
            this.state.detailList[i].value = data[field] || '------'
        }

        this.setState(this.state.detailList)
    },

    setFirstList: function(data) { //设置首行列表
        var list = this.state.tableData.firstList;
        for (var i = 0, len = list.length; i < len; i++) {
            var field = list[i].filed;
            if (field.split('.').length == 2) {
                var arrs = field.split('.'),
                    arr_1 = arrs[0],
                    arr_2 = arrs[1];
                list[i].value = data[arr_1][arr_2] || '------';
            } else {
                list[i].value = data[field] || '------';
            }

        }
    },

    renderAlertText: function(n, isAlert){
        if(isAlert == 0){
            return '无提醒';
        }else{
            var alertList = {
                '0': '正点提醒',
                '5': '提前5分钟',
                '10': '提前10分钟',
                '20': '提前20分钟',
                '30': '提前30分钟',
                '60': '提前一小时',
                '3600': '提前一天'
            }
            return alertList[n+''];
        }
    },

    getData: function() {
        var self = this;

        AjaxRequest.get(APIS.schedule +'/'+ self.state.routeId, null, function(body) {
            var data = body.data;
            data.alertMinutes = self.renderAlertText(data.alertMinutes, data.isAlert);

            self.state.tableData.lists = data; //设置首页表格数据
            self.setFirstList(data); //设置首行列表数据
            self.setState(self.state.tableData);
            self.setDetailData(data); //设置详情*/
        });

    },
    openEdit: function(){
        var path = this.props.route.path;
        var id = this.props.params.id;

        if(path.match('schedule')){
            $(document).trigger('editSchedule', id);
            $('#addScheduleModal').modal('show');
        }else if(path.match('birthday')){
            $(document).trigger('editBirthday', id);
            $('#addBirthdayModal').modal('show');
        }
    },

    /*contextTypes: {
        router: React.PropTypes.object
    },*/
    addTask: function() {
        hashHistory.push('/task/addTask/0');
        /*this.context.router.push({
            pathname: '/task/add/0',
            query: {
            }
        });*/
    },
    addActivity: function() {
        hashHistory.push('/activity/add/0');
       /* this.context.router.push({
            pathname: '/activity/add/0',
            query: {
            }
        });*/
    },

    render: function() {

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params}/>
                <div className="page-body">
                    <div className="row">
                        <div className="page-header position-relative" style={{marginTop:'0px'}}>
                            <div className="header-title">
                                <h1>
                                    {this.state.tableData.lists.subject}
                                    <span className="crm_edit pcicon pcicon-edit" onClick={this.openEdit}></span>
                                </h1>
                            </div>
                            <div className="header-buttons">
                                <div className="glyphicon glyphicon-plus" onClick={this.addActivity}>活动</div>
                                <div className="glyphicon glyphicon-plus" onClick={this.addTask}>任务</div>
                            </div>
                        </div>
                    </div>
                    <div className="detail-table">
                        <DetailTable lists={this.state.tableData.firstList} />
                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="dashboard-box">
                                <div className="box-tabbs">
                                    <div className="tabbable">
                                        <ul className="nav nav-tabs myTab">
                                            <li className="active">
                                                <a data-toggle="tab" href="#customer-khxq">
                                                    {this.state.tableData.lists.scheduleType == 0 ? '日程详情' : '生日详情'}
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content tabs-flat detail-left">
                                            <div id="customer-khxq" className="animated fadeInUp tab-pane in active">
                                                <DetailList lists={this.state.detailList}/>
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