import React, {Component} from 'react';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import { DatePicker } from 'antd';
const RangePicker = DatePicker.RangePicker;

module.exports = React.createClass({

    getInitialState:function(){
        console.log('--->');

        var t = new Date();
        var m = t.getMonth()+1;
        var d = t.getDate();
        var str  = t.getFullYear() + '-' + ( m<10 ? ('0'+m) : m)+'-'+( d<10 ? ('0'+d) : d);
        return {
            args: {
                "myScheduleId": '',
                "subject": '',
                "myScheduleDesc": '',
                "startTime": str+' 00:00',
                "endTime": str+' 23:59',
                "isAllDay": 1,//1:当日全天，0：非当日全天
                "audioSubjectFileId": 0,
                "audioSubjectFileLength": 0,
                "picFileIds": '',
                "audioFileIds": '',
                "isAlert": 0,
                "alertMinutes": -1,
                "customerId": 0,
                "chanceId": 0,
                "customerLinkmanId": 0,
                "scheduleType": 0,
                "address": {},
                "sourceId": 0,
                "fromEntityType": ""//MARKETING_ACTIVITY
            },
            startTime: str+' 00:00',
            endTime: str+' 23:59',
            alertList: [
                {"id": 0, "name": "无提醒", "value": -1},
                {"id": 1, "name": "正点提醒", "value": 0},
                {"id": 2, "name": "提前5分钟", "value": 5},
                {"id": 3, "name": "提前10分钟", "value": 10},
                {"id": 4, "name": "提前20分钟", "value": 20},
                {"id": 5, "name": "提前30分钟", "value": 30},
                {"id": 6, "name": "提前一小时", "value": 60},
                {"id": 7, "name": "提前一天", "value": 3600}
            ],
            endOpen: false,
            startValue: null,
            endValue: null,
            isOneDay:true,
            title:'新建日程'
        }
    },
    componentDidMount:function(){
        var self = this;
        $(document).on('editSchedule', function(e, id){
            self.renderData(id);
            self.setState({title: '编辑日程'});
        });
        $(document).on('addNewSchedule', function(){
            var start = localStorage.getItem('CRM_AddSchedule_StartTime');
            var end = localStorage.getItem('CRM_AddSchedule_EndTime');

            var t1 = start.parseDateCreateByWX().getTime();
            var t2 = end.parseDateCreateByWX().getTime();
            var sub = (t2 - t1) - 1000*60*60*24;

            self.setState({
                startTime: start+':00',
                endTime: end+':00',
                isOneDay: (sub === 0 ? true : false),
                title: '新建日程'
            });
        });
    },
    renderData: function(id){
        var self = this;

        AjaxRequest.get(APIS.schedule +'/'+ id, null, function(body) {
            var data = body.data;
            var refs = self.refs;
            self.state.args = data;

            if(!self.state.args.address){
                self.state.args.address = {}
            }

            for(var key in refs){
                if(key == 'rangePicker'){
                    var start = data.startTime.parseDateCreateByWX().getTime();
                    var end = data.endTime.parseDateCreateByWX().getTime();
                    var sub = (end - start) - 1000*60*60*24;

                    self.setState({
                        startTime: data.startTime,
                        endTime: data.endTime,
                        isOneDay: (sub === 0 ? true : false)
                    });
                }else{
                    refs[key].value = data[key];
                }
            }
        });
    },
    handleSave:function(){
        var self=this;
        var refs = self.refs;
        var param = self.state.args;
        param = deepCopyByWX(param);
        
        for(var key in refs){
            if(key == 'rangePicker'){
                param.startTime = '';
                param.startTime = self.state.startTime;
                param.endTime = '';
                param.endTime = self.state.endTime;
            }else{
                param[key] = self.refs[key].value;
            }
        }
        if(!(param.subject.length>0)){
            toastr.error('日程主题必填');
            return;
        }
        if(!(param.startTime.length>0)){
            toastr.error('开始时间必填');
            return;
        }
        if(!(param.startTime.length>0)){
            toastr.error('结束时间必填');
            return;
        }
        if(param.alertMinutes != -1){
            param.isAlert = 1;
        }
        if(!self.state.isOneDay){
            param.isAllDay = 0;
        }
        if(location.href.indexOf('#/marketing/')>-1){
            var url = location.href;
            var str = url.substring(url.indexOf('#')+2, url.indexOf('?'));
            if( str.match(/chance|task|clue/)){
                ;
            }else{
                str = str.split('/');
                param.sourceId = str[1];
                param.fromEntityType = 'MARKETING_ACTIVITY';
            }
        }
        if(param.myScheduleId>0){
            AjaxRequest.put(APIS.schedule+'/'+param.myScheduleId, param, function () {
                toastr.success('编辑日程成功');

                self.resetForm();
                self.updata();
            });
        }else{
            AjaxRequest.post(APIS.schedule, param, function () {
                toastr.success('新建日程成功');

                self.resetForm();
                self.updata();
            });
        }
    },
    handleCancel:function(){
        this.resetForm();
    },
    handleClose:function(){
        this.resetForm();
    },
    resetForm:function(){
        var self = this;
        var refs = self.refs;
        for(var key in refs){
            if(key == 'alertMinutes'){
                self.refs.alertMinutes.value = -1;
            }else{
                self.refs[key].value = '';
            }
        }
        var str = (new Date()).Format('yyyy-MM-dd');
        self.setState({
            args: {
                "myScheduleId": '',
                "subject": '',
                "myScheduleDesc": '',
                "startTime": str+' 00:00:00',
                "endTime": str+' 23:59:59',
                "isAllDay": 1,//1:当日全天，0：非当日全天
                "audioSubjectFileId": 0,
                "audioSubjectFileLength": 0,
                "picFileIds": '',
                "audioFileIds": '',
                "isAlert": 0,
                "alertMinutes": -1,
                "customerId": 0,
                "chanceId": 0,
                "customerLinkmanId": 0,
                "scheduleType": 0,
                "address": {},
                "sourceId": 0,
                "fromEntityType": ""//MARKETING_ACTIVITY
            },
            startTime: str + ' 00:00',
            endTime: str + ' 23:59',
            isOneDay: true,
            title: '新建日程'
        });
    },
    getStartEndTime:function(value, dateString){
        var self = this;
        self.setState({
            startTime: dateString[0],
            endTime: dateString[1]
        });
        var start = value[0].getTime();
        var end = value[1].getTime();
        var sub = (end - start) - 1000*60*60*24;

        if(sub === 0){
            self.setState({isOneDay:true});
        }else{
            self.setState({isOneDay:false});
        }
    },
    updata:function(){
        if(this.props.updata){
            this.props.updata();
        }
        $(document).trigger('hasNewSchedule');
    },

    render:function(){
        var list = this.state.alertList;
        var opts = list.map(function(item, key){
            if(key == 0){
                return <option key={key} value={item.value} checked="checked">{item.name}</option>
            }else{
                return <option key={key} value={item.value}>{item.name}</option>
            }
        }.bind(this));

        return (
            <div className="modal fade" id="addScheduleModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" onClick={this.handleClose} className="close" data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title" id="myNoteModalLabel">{this.state.title}</h4>
                        </div>
                        <div className="modal-body layer-public" style={{padding:'15px 30px'}}>
                            <div className="row">
                                <div className="form-group">
                                    <label htmlFor="remark">主题<sup>*</sup></label>
                                    <span className="input-icon icon-right">
                                        <input ref="subject" type="text" className="form-control" placeholder="日程主题"></input>
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label htmlFor="remark">日程内容</label>
                                    <span className="input-icon icon-right">
                                        <textarea ref="myScheduleDesc" className="form-control" placeholder="日程内容，非必填"></textarea>
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12"style={{paddingLeft:'0px',paddingRight:'0px'}}>
                                    <div className="form-group">
                                        <label htmlFor="subject">开始日期时间 - 结束日期时间 <sup>*</sup></label>
                                        <div className="input-icon icon-right">
                                            <RangePicker ref="rangePicker" showTime format="yyyy-MM-dd HH:mm" style={{width:'100%'}} size="large" onChange={this.getStartEndTime} value={[this.state.startTime,this.state.endTime]} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6" style={{paddingLeft:'0px', paddingRight:'0px'}}>
                                    <div className="form-group">
                                        <label htmlFor="endDate">日程提醒</label>
                                        <div className="input-icon icon-right">
                                            <div className="input-group" style={{width:'100%'}}>{/*onChange={this.handleAlertChange}  value={this.state.alertMinutes}*/}
                                                <select ref="alertMinutes" className="form-control">
                                                    {opts}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6" style={{paddingRight:'0px'}}>&nbsp;&nbsp;</div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={this.handleCancel} className="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" onClick={this.handleSave} className="btn btn-danger" data-dismiss="modal">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});