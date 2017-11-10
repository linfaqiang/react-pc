import React, {Component} from 'react';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import {DatePicker} from 'antd';
import Alert from '../core/components/alert.js';
import {Modal, Button} from 'antd';
const confirm = Modal.confirm;
module.exports = React.createClass({

    getInitialState: function () {
        return {
            params: {
                summary: "",
                plan: "",
                reportType: "",
                startTime: "",
                endTime: "",
                status: 0,
                acceptorIds: ""
            },
            dataStatus: [
                {text: '日报', id: 0},
                {text: '周报', id: 1},
                {text: '月报', id: 2}
            ],
            param: {
                "q": "",
                "pageNo": 1,
                "pageSize": 9999
            },
            addPersonShow: [],
            dataStatusEdit: "",
            staffList: [],
            readOnly: false,
            workReportType: "",
            workTypeFormA: false,
            workTypeFormB: false,
            workTypeFormC: false,
            workTypeFormE: false
        }
    },

    componentWillMount: function () {

    },

    componentDidMount: function () {
        var self = this,
            params = this.state.param;
        self.getPerson(params);
        $('.date-picker').datepicker({
            local: 'ZH_CN'
        });
        if (self.props.params.id != '0' && self.props.params.id != 'a') {
            self.renderEdit();
            self.setState({
                readOnly: true
            });
        } else {
            self.setState({
                readOnly: false
            });
            self.getLeader();
        }

    },
    getPerson: function (params) {
        var self = this;
        AjaxRequest.get(APIS.person_list, params, function (body) {
            var newList = [];
            var list = body.data;
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    obj.text = obj.name;
                    newList.push(obj);
                }
            }
            self.setState({
                addPersonShow: newList
            })
        });
    },
    getLeader: function () {
        var self = this;
        AjaxRequest.get(APIS.get_lead, null, function (body) {
            var thisData = body.data,
                arr = [];
            for (var i = 0, len = thisData.length; i < len; i++) {
                arr.push(thisData[i].id);
            }
            self.setState({staffList: arr});
        })
    },
    renderEdit: function () {

        var self = this;
        AjaxRequest.get(APIS.work_report_detail + self.props.params.id, null, function (body) {
            var thisRefs = self.refs,
                datas = body.data;
            self.state.workReportType = datas.reportType;
            for (var attr in thisRefs) {
                if (attr == "addWorkStatus") {
                    self.refs[attr].value = datas.reportType;
                } else if (attr == "addWorkTime" && datas.reportType == 0) {
                    self.refs[attr].value = datas.startTime;
                } else if (attr == "daySummary") {
                    self.refs[attr].value = datas.summary;
                } else if (attr == "nextWorkReport") {
                    self.refs[attr].value = datas.plan;
                } else if (attr == "selectLeader") {
                    var thisData = datas.acceptorList,
                        arr = [];

                    for (var i = 0, len = thisData.length; i < len; i++) {
                        arr.push(thisData[i].acceptorId)
                    }
                    self.setState({staffList: arr});
                }
            }
            if (datas.reportType == 2) {
                self.state.params.startTime = datas.startTime;
                self.setState(self.state.params);
            } else if (datas.reportType == 1) {
                self.state.params.startTime = datas.startTime;
                self.state.params.endTime = datas.endTime;
                self.setState(self.state.params);
                self.refs.inputWeekDay.value = datas.startTime + '~' + datas.endTime;
            }
        });


    },
    saveCencer: function (e) {
        e.preventDefault();
        history.back();
    },
    workVerify: function (param) {
        var self = this,
            reportType = param.reportType,
            startTime = param.startTime,
            summary = param.summary,
            acceptorIds = param.acceptorIds;
        if (reportType == '') {
            self.setState({
                workTypeFormA: true
            });
            return false;

        } else {
            self.setState({
                workTypeFormA: false
            });
        }
        if (startTime == '') {
            self.setState({
                workTypeFormB: true
            });
            return false;

        } else {
            self.setState({
                workTypeFormB: false
            });
        }
        if (summary == '') {
            self.setState({
                workTypeFormC: true
            });
            return false;

        } else {
            self.setState({
                workTypeFormC: false
            });
        }
        if (acceptorIds == '') {
            self.setState({
                workTypeFormE: true
            });
            return false;

        } else {
            self.setState({
                workTypeFormE: false
            });
        }
        if (reportType && startTime && summary && acceptorIds) {
            return true;
        }

    },
    saveAdd: function () {
        var self = this;
        var param = self.state.params;
        if (self.props.params.id != '0' && self.props.params.id != 'a') {
            AjaxRequest.put(APIS.work_report_add + "/" + self.props.params.id, param, function (body) {
                $('#modal-success').modal();
            });
        } else {
            AjaxRequest.post(APIS.work_report_add, param, function (body) {
                $('#modal-success').modal();
            })
        }
    },
    selectWorkRport: function (e) {
        var self = this,
            workReport = e.target.value;

        self.setState({
            workReportType: workReport
        })


    },
    saveAddAndSubmit: function () {
        var self = this;
        var param = self.state.params;
        self.state.params.status = 1;
        if (self.props.params.id != '0' && self.props.params.id != 'a') {
            delete param.reportType;
            AjaxRequest.put(APIS.work_report_add + "/" + self.props.params.id, param, function (body) {
                $('#modal-success').modal();
            })

        } else {
            AjaxRequest.post(APIS.work_report_add, param, function (body) {
                $('#modal-success').modal();
            })
        }
    },
    handleDateChange: function (val) {
        var self = this;
        var newTime = self.timeChangType(val);
        self.state.params.startTime = newTime;
        self.state.params.endTime = newTime;
        self.setState(self.state.params);
    },
    timeChangType: function (time) {
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var strTime = year + "-" + month;
        return strTime;
    },

    setStaffsValue: function () {
        var self = this;
        self.state.staffList = self.refs.selectLeader.el.val();
        self.setState(self.state.staffList);
    },
    renderSelectStaff: function () {
        return (
            <div style={{marginTop:'22px'}}>
                <label className="reportLable" className={this.state.workTypeFormE ? 'addWorkRed':''}
                       style={{marginTop: 10+'px'}}>汇报对象<sup className="mustRed">*</sup></label>
                <br />
                <Select2
                    multiple={true}
                    ref="selectLeader"
                    name="selectLeader"
                    style={{width:"50%", height:'32px'}}
                    onSelect={this.setStaffsValue}
                    onUnselect={this.setStaffsValue}  //删除回调
                    data={this.state.addPersonShow}
                    value={ this.state.staffList}
                    options={{placeholder: '选择汇报对象'}}
                />
                <p className="erroText" style={{display:this.state.workTypeFormE ? 'block':'none'}}>请选择汇报对象</p>
            </div>
        );
    },

    getWeekday: function (num, date, type) {
        /*获取上下周的开始日期与结束日期 num(上下几周) type(start|end)*/
        date = date || new Date();
        var dayMSec = 24 * 3600 * 1000,
            today, dateTime = 0, start, end;
        today = date.getDay();
        start = date.getTime() - today * dayMSec;
        end = start + (7 - today) * dayMSec;

        if (num == 0) {
            end -= dayMSec;
        } else {
            start += num * 7 * dayMSec;
            end += num * 7 * dayMSec;
        }

        return {
            "start": getFormatTime(start),
            "end": getFormatTime(end)
        };

        function getFormatTime(time) {
            date.setTime(time);
            return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

        }
    },
    getWeekList: function(){
        var d = new Date();
        var month_x = d.getMonth()+1;
        var firstDate = {
            value: d,
            year: d.getFullYear(),
            month: d.getMonth(),
            date: d.getDate(),
            dayIndex: d.getDay()
        };
        if(firstDate.date !== 1){
            firstDate.value = new Date(firstDate.year, firstDate.month, 1, 0, 0, 0);
            firstDate.year = firstDate.value.getFullYear();
            firstDate.month = firstDate.value.getMonth();
            firstDate.date = firstDate.value.getDate();
            firstDate.dayIndex = firstDate.value.getDay();
        }

        var tmp = new Date(firstDate.year, firstDate.month+1, 0, 0, 0, 0);
        var lastDate = {
            value: tmp,
            year: tmp.getFullYear(),
            month: tmp.getMonth(),
            date: tmp.getDate(),
            dayIndex: tmp.getDay()
        };
        if(firstDate.dayIndex !== 1){//首周跨月
            var start = new Date(firstDate.year, firstDate.month, (firstDate.date - firstDate.dayIndex + 1), 0, 0, 0);
            firstDate = {
                value: start,
                year: start.getFullYear(),
                month: start.getMonth(),
                date: start.getDate(),
                dayIndex: start.getDay()
            };
        }
        if(lastDate.dayIndex !== 0){//末周跨月
            var end = new Date(lastDate.year, lastDate.month, (lastDate.date+ 7 - lastDate.dayIndex), 0, 0, 0);
            lastDate = {
                value: end,
                year: end.getFullYear(),
                month: end.getMonth(),
                date: end.getDate(),
                dayIndex: end.getDay()
            };
        }
        var arr = [];
        var t = {
            dates: [],
            text: ''
        };
        var weekIndex = ['一','二','三','四','五','六','七','八'];
        var index = 0;
        for(var i=1; i<43; i++){
            var tt = new Date(firstDate.year, firstDate.month, (firstDate.date + i-1), 0, 0, 0);
            var str = tt.Format('yyyy-MM-dd');
            t.dates.push({date:tt, value: str, text:str.substring(5)});
            if( (i>0) && (i%7 === 0) ){
                t.text = t.dates[0].text+'至'+t.dates[6].text+' ('+month_x+'月 第'+weekIndex[index++]+'周)';
                t.start = t.dates[0].value;
                t.end = t.dates[6].value;
                arr.push(t);
                t = {
                    dates: [],
                    text: ''
                };
            }

            if(tt.getTime() == lastDate.value.getTime()) {
                break;
            }
        }
        console.log(JSON.stringify(arr));
        // this.props.setWeeks(arr);
        return arr
    },
    /*getWeekList: function () {
        var self = this;
        var lists = [],
            upThree = self.getWeekday(-3),
            upTwo = self.getWeekday(-2),
            upOne = self.getWeekday(-1),
            now = self.getWeekday(0),
            nextOne = self.getWeekday(1);
        lists.push({
            value: upThree.start + "~" + upThree.end,
            text: upThree.start + "~" + upThree.end + "(第" + self.getWeekNum(upThree.start, 1) + "周)"
        });
        lists.push({
            value: upTwo.start + "~" + upTwo.end,
            text: upTwo.start + "~" + upTwo.end + "(第" + self.getWeekNum(upTwo.start, 1) + "周)"
        });
        lists.push({
            value: upOne.start + "~" + upOne.end,
            text: upOne.start + "~" + upOne.end + "(第" + self.getWeekNum(upOne.start, 1) + "周)"
        });
        lists.push({
            value: now.start + "~" + now.end,
            text: now.start + "~" + now.end + "(第" + self.getWeekNum(now.start, 1) + "周)"
        });
        lists.push({
            value: nextOne.start + "~" + nextOne.end,
            text: nextOne.start + "~" + nextOne.end + "(第" + self.getWeekNum(nextOne.start, 1) + "周)"
        });
        return lists;
    },
    getWeekNum: function (date, type) {
        var totalDays = 0,
            now = new Date(date) || new Date(),
            years = now.getFullYear();
        if (years < 1000)
            years += 1900;
        var days = new Array(12);
        days[0] = 31;
        days[2] = 31;
        days[3] = 30;
        days[4] = 31;
        days[5] = 30;
        days[6] = 31;
        days[7] = 31;
        days[8] = 30;
        days[9] = 31;
        days[10] = 30;
        days[11] = 31;

        //判断是否为闰年，针对2月的天数进行计算
        if (Math.round(now.getFullYear() / 4) == now.getFullYear() / 4) {
            days[1] = 29;
        } else {
            days[1] = 28;
        }

        if (now.getMonth() == 0) {
            totalDays = totalDays + now.getDate();
        } else {
            var curMonth = now.getMonth();
            for (var count = 1; count <= curMonth; count++) {
                totalDays = totalDays + days[count - 1];
            }
            totalDays = totalDays + now.getDate();
        }
        //得到第几周
        var week = Math.round(totalDays / 7);
        if (!type) {
            return years + "年第" + week + "周";
        } else {
            return week;
        }
    },*/

    renderWeekList: function () {
        var list = this.getWeekList();
        return list.map(function (qst, key) {
            return <option key={key} value={qst.start+'~'+qst.end}>{qst.text}</option>
        }.bind(this));

    },
    showConfirm: function (e) {
        e.preventDefault();
        var self = this;
        var allRef = self.refs;
        var param = self.state.params;
        if (self.state.workReportType == 1) {
            var weekDayVal = allRef.inputWeekDay.value;
            var weekDayAll = weekDayVal.split('~');
            var weekDayStart = weekDayAll[0];
            var weekDayEnd = weekDayAll[1];
            param.startTime = weekDayStart;
            param.endTime = weekDayEnd;
        }
        for (var attr in allRef) {
            if (attr == "addWorkStatus") {
                param.reportType = allRef.addWorkStatus.value;
            } else if (attr == "addWorkTime" && self.state.workReportType == 0) {
                param.startTime = allRef.addWorkTime.value;
                param.endTime = allRef.addWorkTime.value;
            } else if (attr == "daySummary") {
                param.summary = allRef.daySummary.value;
            } else if (attr == "nextWorkReport") {
                param.plan = allRef.nextWorkReport.value;
            } else if (attr == "selectLeader") {
                var arr = self.state.staffList;
                param.acceptorIds = arr.join(",");
            }
        }
        if (self.workVerify(param)) {
            confirm({
                title: '是否提交工作报告?',
                content: '点击取消则只保存,点击确定则提交!',
                onOk() {
                    self.saveAddAndSubmit();
                },
                onCancel() {
                    self.saveAdd();
                }
            });
        }
    },

    render: function () {
        const MonthPicker = DatePicker.MonthPicker;
        var self = this;
        var style_form_group = {
            marginBottom: "15px",
            verticalAlign: "middle",
            width: "100%"
        };
        var lists = self.state.dataStatus;
        var ops = lists.map(function (qst, key) {
            return <option key={key} value={qst.id}>{qst.text}</option>
        }.bind(this));
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params}/>

                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my">
                                <ul className="nav nav-tabs myTab noBorLR">
                                    <li className="dropdown active">
                                        <a>
                                            {this.props.route.name}
                                        </a>
                                    </li>
                                </ul>

                                <form id="addWorkForm" method="post">
                                    <div className="row otherRow padding-20">
                                        <div className="addWorkType">
                                            <label className={this.state.workTypeFormA ? 'addWorkRed':''}>工作报告类型<sup
                                                className="mustRed">*</sup></label>
                                            <div className="input-icon icon-right addWorkTypeInput">
                                                <select onChange={this.selectWorkRport}
                                                        ref="addWorkStatus"
                                                        className="form-control"
                                                        name="workTypeSelect"
                                                        placeholder="所有"
                                                        readOnly={this.state.readOnly}
                                                        disabled={this.state.readOnly}>
                                                    <option value="">--请选择--</option>
                                                    {ops}
                                                </select>
                                                <p className="erroText"
                                                   style={{display:this.state.workTypeFormA ? 'block':'none'}}>请选择工作报告类型</p>
                                            </div>
                                        </div>

                                        <div className="addWorkScreening">
                                            <label className={this.state.workTypeFormB ? 'addWorkRed':''}>时间选择<sup
                                                className="mustRed">*</sup></label>
                                            <div className="input-group"
                                                 style={{display:this.state.workReportType==0 ? 'table':'none'}}>
                                                <input className="form-control date-picker"
                                                       ref="addWorkTime"
                                                       name="addWorkTime"
                                                       id="extimateDealDate"
                                                       type="text"
                                                       placeholder="请选择日期"
                                                       data-date-format="yyyy-mm-dd"/>
											<span className="input-group-addon">
												<i className="fa fa-calendar"/>
											</span>
                                            </div>
                                            <div className="input-group inputWeekDay"
                                                 style={{display:this.state.workReportType==1 ? 'table':'none'}}>
                                                <select className="inputWeekDaySelect"
                                                        ref="inputWeekDay">{this.renderWeekList()}</select>
                                            </div>
                                            <div className="input-icon icon-right"
                                                 style={{display:this.state.workReportType==2 ? 'block':'none'}}>
                                                <MonthPicker ref="addWorkMonthTime"
                                                             style={style_form_group}
                                                             value={this.state.params.startTime}
                                                             onChange={this.handleDateChange}
                                                             size="large"
                                                             format="yyyy-MM"
                                                             name="addWorkMonthTime"
                                                             id="addWorkMonthTime"/>
                                            </div>
                                            <p className="erroText" style={{display:this.state.workTypeFormB ? 'block':'none'}}>
                                                请选择工作报告时间</p>
                                        </div>

                                        <div className="addWorkSummary">
                                            <label
                                                className={this.state.workTypeFormC ? 'addWorkRed':''}>{this.state.workReportType == 0 ? '今日' : ''}
                                                {this.state.workReportType == 1 ? '本周' : ''}
                                                {this.state.workReportType == 2 ? '本月' : ''}工作总结<sup className="mustRed">*</sup></label>
                                            <div className="SummaryInput">
                                                <div id="horizontal-form">
                                            <textarea id="workAddSummary" name="workAddSummary" ref="daySummary"
                                                      className="form-control" placeholder="输入工作总结"/>
                                                    <p className="erroText"
                                                       style={{display:this.state.workTypeFormC ? 'block':'none'}}>请填写工作总结</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="addWorkSummary"
                                             style={{display:this.state.workReportType==0 ? 'none':'block'}}>
                                            <label>下{this.state.workReportType == 1 ? '周' : ''}
                                                {this.state.workReportType == 2 ? '月' : ''}工作计划</label>
                                            <div className="SummaryInput">
                                                <div id="horizontal-form">
                                            <textarea id="workAddSummary" name="workAddSummary" ref="nextWorkReport"
                                                      className="form-control" placeholder="输入工作计划"/>
                                                </div>
                                            </div>
                                        </div>
                                        {this.renderSelectStaff()}
                                    </div>


                                    <hr />
                                    <div className="widget-header noShadow" style={{padding:'20px 0px 20px 20px'}}>
                                        <div className="buttons-preview" style={{textAlign: 'left', padding: "10px 0 10px 0"}}>
                                            <input type="button" onClick={this.saveCencer} className="btn btn-cancer" value="取消" />
                                            <button id="btnSave" onClick={this.showConfirm} className="btn btn-danger">保存</button>
                                        </div>
                                    </div>

                                    {/*<div className="form-group">
                                        <div className="col-lg-9">
                                            <div className="buttons-preview" style={{paddingLeft:15+'px'}}>
                                                <button onClick={this.saveCencer} className="btn btn-cancer">取消</button>
                                                <button id="save-btn" onClick={this.showConfirm} className="btn btn-danger">保存
                                                </button>
                                            </div>
                                        </div>
                                    </div>*/}
                                </form>

                            </div>
                        </div>
                    </div>
                </div>





                <Alert result="succees"></Alert>
                <Alert result="danger"></Alert>
            </div>
        )
    }
});