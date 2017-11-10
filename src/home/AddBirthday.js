import React, {Component} from 'react';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';

module.exports = React.createClass({

    getInitialState:function(){
        console.log('--->');
        return {
            args: {
                "myScheduleId": '',
                "subject": '',
                "myScheduleDesc": '',
                "startTime": '',
                "isAllDay": 1,//1:当日全天，0：非当日全天
                "endTime": '',
                "audioSubjectFileId": 0,
                "picFileIds": '',
                "audioFileIds": '',
                "isAlert": 0,
                "alertMinutes": -1,
                "customerId": 0,
                "chanceId": 0,
                "customerLinkmanId": 0,
                "scheduleType": 1,
                "address": {}
            },
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
            startTime: '',
            endTime: '',
            title:'新建生日'
        }
    },
    componentDidMount:function(){
        var self = this;
        var dpicker = $('.date-picker');
        dpicker.datepicker({
            format:'yyyy-mm-dd',
            viewMode:'days',
            minViewMode:'days',
            local:'ZH_CN'
        }).on('changeDate', function(ev) {
            var str = ev.date.Format('yyyy-MM-dd');
            self.setState({
                startTime: str,//+ ' 00:00:00'
                //endTime: str + ' 23:59:59'
            });
        }).data('datepicker');

        $(document).on('editBirthday', function(e, id){
            self.renderData(id);
            self.setState({title: '编辑生日'});
        });
        $(document).on('addNewBirthday', function(){
            var start = localStorage.getItem('CRM_AddSchedule_StartTime');
            //var end = localStorage.getItem('CRM_AddSchedule_EndTime');
            self.refs.startTime.value = start.substr(0, 10);
            self.setState({
                startTime: start.substr(0, 10),//+ ' 00:00:00',
                //endTime: start.substr(0, 10)+ ' 23:59:59',
                title:'新建生日'
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
                if(key == 'startTime'){
                    self.refs.startTime.value = data.startTime.substr(0, 10);
                    self.setState({
                        startTime: data.startTime,
                        endTime: data.endTime
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
        //param = deepCopyByWX(param);

        for(var key in refs){
            if(key == 'startTime'){
                param.startTime = self.state.startTime.split(' ')[0];
                param.endTime = '';//self.state.endTime;
            }else{
                param[key] = self.refs[key].value;
            }
        }
        if(!(param.subject.length>0)){
            toastr.error('寿星名称必填');
            return;
        }
        if(!(param.startTime.length>0)){
            toastr.error('请选择生日');
            return;
        }
        if(self.refs.alertMinutes.value > -1){
            self.state.args.isAlert = 1;
        }
        if(param.myScheduleId>0){
            AjaxRequest.put(APIS.schedule+'/'+param.myScheduleId, param, function () {
                toastr.success('编辑生日成功');

                self.resetForm();
                self.updata();
            });
        }else{
            AjaxRequest.post(APIS.schedule, param, function () {
                toastr.success('新建生日成功');

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
                self.refs[key].value = -1;
            }else{
                self.refs[key].value = '';
                if(key == 'startTime'){
                    self.setState({
                        startTime: '',
                        endTime: ''
                    });
                }
            }
        }
        self.setState({
            args: {
                "myScheduleId": '',
                "subject": '',
                "myScheduleDesc": '',
                "startTime": '',
                "isAllDay": 1,//1:当日全天，0：非当日全天
                "endTime": '',
                "audioSubjectFileId": 0,
                "picFileIds": '',
                "audioFileIds": '',
                "isAlert": 0,
                "alertMinutes": -1,
                "customerId": 0,
                "chanceId": 0,
                "customerLinkmanId": 0,
                "scheduleType": 1,
                "address": {}
            },
            title:'新建生日'
        });
    }, 
    updata:function(){
        if(this.props.updata){
            this.props.updata();
        }
        $(document).trigger('hasNewBirthday');
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
            <div className="modal fade" id="addBirthdayModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.handleClose} data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title" id="myNoteModalLabel">{this.state.title}</h4>
                        </div>
                        <div className="modal-body layer-public" style={{padding:'15px 30px'}}>
                            <div className="row">
                                <div className="form-group">
                                    <label htmlFor="remark">寿星<sup>*</sup></label>
                                    <span className="input-icon icon-right">
                                        <input ref="subject" type="text" className="form-control" placeholder="寿星名称"></input>
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label htmlFor="remark">备注</label>
                                    <span className="input-icon icon-right">
                                        <textarea ref="myScheduleDesc" className="form-control" placeholder="备注"></textarea>
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6" style={{paddingLeft:'0px'}}>
                                    <div className="form-group">
                                        <label htmlFor="startDate">生日<sup>*</sup></label>
                                        <div className="input-icon icon-right">
                                            <div className="input-group">
                                                <input ref="startTime" className="form-control date-picker" type="text" readOnly="readOnly" placeholder="选择生日" />
                                                <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6" style={{paddingRight:'0px'}}>
                                    <div className="form-group">
                                        <label htmlFor="endDate">生日提醒</label>
                                        <div className="input-icon icon-right">
                                            <div className="input-group" style={{width:'100%'}}>
                                                <select ref="alertMinutes" className="form-control">
                                                    {opts}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={this.handleCancel} data-dismiss="modal">取消</button>
                            <button type="button" onClick={this.handleSave} className="btn btn-danger" data-dismiss="modal">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});