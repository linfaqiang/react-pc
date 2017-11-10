import React from 'react';
import {APIS} from '../../core/common/config.js';
import AjaxRequest from '../../core/common/ajaxRequest';
import AllDayEvents from './AllDayEvents';
import EventsInDay from './EventsInDay';
import NewData from './NewData';

module.exports = React.createClass({
    getInitialState: function () {
        var now = new Date();
        return {
            pamra:{
                pageNo:1,
                pageSize: 1000
            },
            Mon:'',
            Sun:'',
            today: now, //今天
            week: [], //本周
            tempList: [], //缓存列表数据
            evInDays:{'1':[], '2':[], '3':[], '4':[], '5':[], '6':[], '0':[]}, //同一天的日程
            allDaye:[
            ] //跨天的日程
        }
    },
    componentDidMount: function () {
        var self = this;
        self.getData();
        $(document).on('hasNewBirthday hasNewSchedule', function(e){
            self.getData();
        });
    },
    componentWillUnmount: function () {
        $(document).off('hasNewSchedule');
        $(document).off('hasNewBirthday');
    },
    getData: function(){
        var self = this;
        var week = self.getWeek();
        self.setState({week: week});
        self.getWeekSchedule(week);
    },
    getWeekSchedule: function(week){
        var self = this;
        var thisUrl = APIS.week_schedule;
        var week = week || self.state.week;
        var pamra = self.state.pamra;

        thisUrl = thisUrl.replace('{pageNo}', pamra.pageNo);
        thisUrl = thisUrl.replace('{pageSize}', pamra.pageSize);
        thisUrl = thisUrl.replace('{startDate}', week[0].text);
        thisUrl = thisUrl.replace('{endDate}', week[6].text);

        AjaxRequest.get(thisUrl, null, function(data){
            self.generateData(data.data);
        })
    },
    /*ex:{
        "isAllDay": 0,
        "subject": "www",
        "RN": 1,
        "endTime": 1478102340000,
        "alertMinutes": 0,
        "audioSubjectFileUrl": "",
        "scheduleTypeName": "生日",
        "startTime": 1478016000000,
        "myScheduleDesc": "ddddd",
        "myScheduleId": 500,
        "scheduleType": 1,
        "audioSubjectFileId": 0,
        "isAlert": 0,
        "isAcrossDay": 0,
        "audioSubjectFileLength": ""
    },*/
    generateData: function(list){
        var self =this;
        var text = [
            '星期日',
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六'
        ];
        if(list.length>0){
            var crossList = [];//跨天数据
            var other = [];//非跨天数据

            for(var i=0; i<list.length; i++){
                var d1 = new Date(list[i].startTime);
                var d2 = new Date(list[i].endTime);
                list[i].start = d1.Format('yyyy-MM-dd');
                list[i].tipStart = d1.Format('yyyy-MM-dd hh:mm');
                list[i].startDay = d1.getDay();
                list[i].weekStart = text[list[i].startDay];
                list[i].end = d2.Format('yyyy-MM-dd');
                list[i].endDay = d2.getDay();
                list[i].weekEnd = text[list[i].endDay];
                list[i].tipEnd = d2.Format('yyyy-MM-dd hh:mm');
                list[i].multi_day = (list[i].endTime - list[i].startTime)/(1000*60*60*24);
                if(list[i].multi_day >= 1){
                    list[i].multi_day = parseInt(list[i].multi_day)+1;
                }else{
                    list[i].multi_day = 1;
                }
                list[i].multi_min = Math.ceil((list[i].endTime - list[i].startTime)/(1000*60));
                if(list[i].isAcrossDay == 1 || list[i].isAllDay == 1){
                    crossList.push(list[i]);
                }else{
                    other.push(list[i]);
                }
            }
            //tempList
            self.setState({
                allDaye: crossList,
                tempList: list,
                evInDays: self.getNonCrossData(other)
            });
        }else{
            self.setState({
                allDaye:[],
                tempList: [],
                evInDays:{'1':[], '2':[], '3':[], '4':[], '5':[], '6':[], '0':[]}
            });
        }
    },
    getNonCrossData: function(list){
        var tmp = {'1':[], '2':[], '3':[], '4':[], '5':[], '6':[], '0':[]};
        for(var i=0; i<list.length; i++){
            var d = list[i].startDay;
            switch(d){
                case 1:
                    tmp['1'].push(list[i]);
                    break;
                case 2:
                    tmp['2'].push(list[i]);
                    break;
                case 3:
                    tmp['3'].push(list[i]);
                    break;
                case 4:
                    tmp['4'].push(list[i]);
                    break;
                case 5:
                    tmp['5'].push(list[i]);
                    break;
                case 6:
                    tmp['6'].push(list[i]);
                    break;
                case 0:
                    tmp['0'].push(list[i]);
                    break;
                default:
                    break;
            }
        }
        return tmp;
    },
    showNewData:function(o){
        this.refs.newData.show(o);
    },
    setToday:function (d) {
        var self = this;
        var week = self.getWeek(d);
        self.setState({today: d});
        self.setState({week: week});
        self.setState({evInDays:{'1':[], '2':[], '3':[], '4':[], '5':[], '6':[], '0':[]}});
        self.setState({allDaye:[]});
        return week;
    },
    getWeek:function(t){
        var d = null, today = '';
        var week = new Array();
        var text = [
            '星期日',
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六'
        ];
        if(t){
            if(t instanceof Date){
                d = t;
            }else if(typeof t == 'string' && /^(d{4})-(d{2})-(d{2}) (d{2}):(d{2})$/.test(t) ){
                t = t.split(/-| |:/);
                d = new Date(parseInt(t[0]), parseInt(t[1])-1, parseInt(t[2]), 0, 0, 0);
            }
        }
        if(d){
            d = d;
            today = (new Date()).Format('yyyy-MM-dd');
        }else{
            d = new Date();
            today = d.Format('yyyy-MM-dd');
        }
        var weekIndex = d.getDay();

        for(var i=0; i<7; i++){
            var sub = 0;
            if(weekIndex==0){
                sub = weekIndex - i;
            }else{
                sub = i - weekIndex+1;
            }
            var nd = new Date(d.getFullYear(), d.getMonth(), d.getDate()+sub, 0, 0, 0);
            var str = nd.Format('yyyy-MM-dd');
            week.push({text: str, week: text[nd.getDay()], day:nd.getDay(), date:nd.getDate(), isToday:(today===str ? true : false)});
        }
        if(weekIndex==0){
            week.reverse();
        }
        this.setState({Mon: week[0].text});
        this.setState({Sun: week[6].text});
        return week;
    },
    /*goDetail: function(id, type){
        this.goToPage(id, type);
    },

    contextTypes: {
        router: React.PropTypes.object
    },
    goToPage:function (id, type) {
        this.context.router.push({
            pathname: '/schedule/'+id,
            query: {
                scheduleType: type
            }
        });
    },*/
    /*
     * 快捷新建：起始时间默认为当前时间，结束时间默认为当前时候后一小时。生日为当天。
     * */
    addSchedule:function(){
        $('#addScheduleModal').modal('show');
    },
    addBirthday:function(){
        $('#addBirthdayModal').modal('show');
    },
    render: function () {
        var week = this.state.week;
        var ths = week.map(function(item, key){
            return (
                <th key={key} className={item.isToday ? 'cur':''}>
                    {item.week} {item.date}
                </th>
            );
        }.bind(this));
        return (
            <div className="dashboard-box">
                <div className="box-tabbs">
                    <div className="tabbable">
                        <ul className="nav nav-tabs myTab">
                            <li>
                                <a className="btnBack"></a>
                            </li>
                            <li className="active">
                                <a data-toggle="tab" href="#visits">日程 ({this.state.Mon +' ~ '+ this.state.Sun})</a>
                            </li>
                            <li className="tabBtns btnGroup">
                                <a onClick={this.addBirthday}>
                                    <i className="fa fa-plus"></i> 生日
                                </a>
                                <a onClick={this.addSchedule}>
                                    <i className="fa fa-plus"></i> 日程
                                </a>
                                <a href="#/task/addTask/0">
                                    <i className="fa fa-plus"></i> 任务
                                </a>
                                <a href="#/activity/add/0">
                                    <i className="fa fa-plus"></i> 活动
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content tabs-flat no-padding" style={{border:'0px!important'}}>
                            <div className="tab-pane animated fadeInUp active">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <table className="table richBox">
                                            <thead>
                                            <tr>
                                                <th>
                                                    GMT +8
                                                </th>
                                                {ths}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="richTD" colSpan="8">
                                                    <AllDayEvents list={this.state.allDaye} week={this.state.week}></AllDayEvents>{/* goDetail={this.goDetail}*/}
                                                    <NewData ref="newData"></NewData>
                                                    <EventsInDay list={this.state.evInDays} week={this.state.week} showNewData={this.showNewData}></EventsInDay>
                                                </td>
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
        )
    }
});