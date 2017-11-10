import React from 'react';
import AjaxRequest from '../core/common/ajaxRequest';
import {APIS} from '../core/common/config';
import '../home/home.css';
import CRMcalendar from  '../home/CRMcalendar';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import CalenderList from '../home/CalenderListNew';
import Scheduls from './componets/Schedule';


module.exports = React.createClass({
    getInitialState: function () {
        return {
            isFirstRender: true,
            calenderData: {
                pageSize: 5,
                pageNo: 1,
                today: ''
            }
        };
    },
    //是否跨天的字段， isAcrossDay=1代表跨天，=0代表不跨天
    componentDidMount: function () {
        var self = this;
        new CRMcalendar("#sangCalender", {
            thisDom: '#calender-first',
            inWeek: true,
            onSelect: function (oDate) {

                self.state.calenderData.today = oDate.back;
                self.setState(self.state.calenderData);

                self.renderCalender(self.state.calenderData);
                var week = self.refs.scheduls.setToday(oDate.date);
                self.refs.scheduls.getWeekSchedule(week);
                return week;
            },
            onSelectBack: function (oDate) {
                return false;
            },
            onMonthChange: function (data) {
                self.getEveryday(data);
            }
        });
    },
    componentWillUnmount: function () {
    },
    renderCalender: function (param) {
        var self = this;
        var args = {
            pageSize: 5,
            pageNo: 1,
            today: ''
        };
        if (param) {
            for (var key in param) {
                args[key] = param[key];
            }
        }

        AjaxRequest.get(APIS.schedule_detail + 'today', args, function (data) {
            self.refs.calenderList.setPagerData(data);
            self.setState({isFirstRender: false});
        })
    },
    getEveryday: function (data) {
        var self = this;
        if (data !== self.state.calendarDate) {
            self.setState({calendarDate: data});
        }
        data = JSON.parse(data);
        data.month += 1;//月份是 0 ~ 11
        AjaxRequest.get(APIS.get_everyday.replace('{month}', data.year + '-' + data.month), null, function (data) {
            //console.log(JSON.stringify(data));
            var list = data.data;
            var days = $('#calender-first .ui-date-days a');

            for (var i = 0; i < list.length; i++) {
                for (var j = 0; j < days.length; j++) {
                    if (days.eq(j).attr('data-date') == list[i]) {
                        days.eq(j).closest('div').eq(0).addClass('hasMsg');
                        break;
                    }
                }
            }
            if (self.state.isFirstRender) {
                self.renderCalender();
            } else {
                self.refs.calenderList.setPagerData({
                    pageNo: 1,
                    pageSize: 5,
                    totalSize: 0,
                    data: [],
                    code: "200",
                    msg: "OK"
                });
            }
        })
    },
    render: function () {
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params}/>
                <div className="page-body">
                    <div className="row">
                        <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <Scheduls ref="scheduls"></Scheduls>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" style={{position:'static'}}>
                            <div id="calender-first">
                                <input type="text" style={{display: 'none'}} id="sangCalender"/>
                            </div>
                            <CalenderList
                                ref="calenderList"
                                getData={this.renderCalender}
                                trackData={this.state.calenderData}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});