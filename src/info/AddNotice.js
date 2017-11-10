import React from 'react';
import {DatePicker} from 'antd';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import Alert from '../core/components/alert.js';

module.exports = React.createClass({

    getInitialState: function () {
        return {
            routeId: this.props.params.id || 0,
            changed: false,
            toDeptId: [],
            toOrgId: [],
            orgSelList:[],
            info: {
                "id":'',
                //"picId":'',//标题图
                //"picIds":"",
                "catagoryId":1,
                "subject":"",
                "content":"",
                //"startDate":"开始时间",
                "endDate":"",
                "toDeptId":"",
                "toOrgId":""
            }
        };

    },

    componentDidMount: function () {
        var self = this;
        var dpicker = $('.date-picker');
        dpicker.datepicker({
            format:'yyyy-mm-dd',
            viewMode:'days',
            minViewMode:'days',
            local:'ZH_CN'
        });
        dpicker.on('changeDate', function(ev){
            //var t = new Date(ev.date);
            var info = self.state.info;
            info.endDate = ev.date.Format('yyyy-MM-dd');
            self.setState({info: info});
        });
        if(self.state.routeId > 0){
            self.getNoticeData();
        }else{
            self.getOrgDept();
        }

        $("#registrationForm").bootstrapValidator();
    },
    getNoticeData: function(){
        if(!this.state.routeId) return;
        var self = this;
        AjaxRequest.get(APIS.notices+'/'+self.state.routeId, null, function(res){
            if (res.code == 200) {
                var data = res.data;
                // var data = JSON.parse(Base64.decode(res.data));
                res.data = data;

                var info = self.state.info;
                for(var key in info){
                    info[key] = res.data[key];
                }
                self.setState({info: info});
                self.getOrgDept(function(data){
                    var tmp = [];
                    var toDeptId = info.toDeptId.split(',');
                    var toOrgId = info.toOrgId.split(',');

                    self.setState({toDeptId: toDeptId});
                    self.setState({toOrgId: toOrgId});

                    for(var i=0; i<toDeptId.length; i++){
                        for(var j=0; j<data.length; j++){
                            if(data[j].id == toDeptId[i]){
                                tmp.push({id: data[j].id, name: data[j].text, pId: data[j].parent});
                                break;
                            }
                        }
                    }
                    for(var i=0; i<toOrgId.length; i++){
                        for(var j=0; j<data.length; j++){
                            if(data[j].id == toOrgId[i]){
                                tmp.push({id: data[j].id, name: data[j].text, pId: data[j].parent});
                                break;
                            }
                        }
                    }
                    self.setState({orgSelList: tmp});
                });
            }
        });
    },
    getOrgDept: function(callBack){
        var self = this;
        AjaxRequest.get(APIS.org_dept, null, function(res){
            if (res.code == 200) {
                self.renderOrgTree(res.data);
                if( callBack && (typeof callBack == 'function') ){
                    callBack(res.data);
                }
            } else {
                console.error('获取公司部门组织结构树失败');
            }
        });
    },
    renderOrgTree: function(data){
        var self = this;
        $("#orgTree").jstree({
            "core":{
                "animation":0,
                "themes":{
                    "theme":"classic",
                    "dots":true,
                    "icons":true
                },
                "check_callback":true,
                'data': data
            },
            "types":{
                "default":{
                    "valid_children":["default","file"]
                }
            },
            "plugins":["types","wholerow", 'search']
        }).on('select_node.jstree',function(node,selectd){
            var id = selectd.node.id;
            var pId = selectd.node.parent;
            var name = selectd.node.text;
            var json={id: id, name: name, pId: pId};
            var list = self.state.orgSelList;
            var toDeptId = self.state.toDeptId;
            var toOrgId = self.state.toOrgId;

            if(list.length>0){
                for(var i=0; i<list.length; i++){
                    if(list[i].id == id){
                        return false;
                    }
                }
            }
            list.push(json);
            self.setState({orgSelList: list});
            if(json.pId == '#'){
                toOrgId.push(json.id);
            }else{
                toDeptId.push(json.id);
            }
        });
    },
    searchTree: function(e){
        var v = $.trim(e.target.value);
        $('#orgTree').jstree(true).search(v);
    },
    delHasSel: function(id){
        var list = this.state.orgSelList;

        for(var i=0; i<list.length; i++){
            if(list[i].id == id){
                if(list[i].pId == '#'){
                    this.delToOrgId(list[i]);
                }else{
                    this.delToDeptId(list[i]);
                }
                list.splice(i, 1);
            }
        }
        this.setState({orgSelList: list});
    },
    delToDeptId: function(data){
        var list = this.state.toDeptId;

        for(var i=0; i<list.length; i++){
            if(list[i] == data.id){
                list.splice(i, 1);
            }
        }
        this.setState({toDeptId: list});
    },
    delToOrgId: function(data){
        var list = this.state.toOrgId;

        for(var i=0; i<list.length; i++){
            if(list[i] == data.id){
                list.splice(i, 1);
            }
        }
        this.setState({toOrgId: list});
    },
    //保存
    handleSave: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var self = this;
        var params = self.state.info;
        params.toDeptId = self.state.toDeptId.join()||'0';
        params.toOrgId = self.state.toOrgId.join()||'0';

        var bootstrapValidator = $("#registrationForm").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {
            return false;
        }

        if(self.state.routeId){
            AjaxRequest.put(APIS.notices, params, function(res){
                if (res.code == 200) {
                    $('#modal-success').modal();
                } else {
                    $('#modal-danger').modal().find('.modal-body').html('操作失败: '+res.msg);
                }
            });
        }else{
            AjaxRequest.post(APIS.notices, params, function(res){
                if (res.code == 200) {
                    $('#modal-success').modal();
                } else {
                    $('#modal-danger').modal().find('.modal-body').html('操作失败: '+res.msg);
                }
            });
        }
    },
    handleCancel: function () {
        if (this.state.changed) {
            bootbox.confirm("表单已修改，你确定不保存退出吗?", function(result) {
                if (result) {
                    history.go(-1);
                }
            });

        } else {
            history.go(-1);
        }
    },
    handleChange: function(e){
        var info = this.state.info;
        info[e.target.getAttribute('name')] = e.target.value;

        this.setState({info: info});
        this.setState({changed: true});
    },
    render: function () {
        var self = this;
        var style100 = {width: "100%"};
        var style_button = {textAlign: 'left',padding: "10px 0 10px 0"};
        var orgList = this.state.orgSelList;
        var pDoms = orgList.map(function(item, key){
            return (
                <p className="orgNameList" key={key}><span>{item.name}</span><span className="orgDel" onClick={self.delHasSel.bind(this, item.id)}></span></p>
            );
        }.bind(this));

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my" >

                                <ul className="nav nav-tabs myTab noBorLR">
                                    <li className="dropdown active">
                                        <a>{this.props.route.name}</a>
                                    </li>
                                </ul>
                                <form id="registrationForm"
                                      data-bv-live={navigator.userAgent.match('Trident') ? 'disabled' : 'enabled'}
                                      data-bv-message="This value is not valid"
                                      data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
                                      data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
                                      data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

                                    <div className="widget-body padding-20" style={{boxShadow: 'none'}}>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label>标题<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input ref="subject" value={this.state.info.subject} type="text" className="form-control"
                                                               onChange={this.handleChange}
                                                               data-bv-notempty="true"
                                                               data-bv-notempty-message="公告标题必须输入"
                                                               name="subject" placeholder="请输入公告标题" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>公告栏目</label>
                                                    <div className="input-icon icon-right">
                                                        <select ref="infoCatagoryId" name="infoCatagoryId" onChange={this.handleChange} value={this.state.info.subject} style={{width: '100%'}}>
                                                            <option value="1">公司通知</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="birthday">有效日期</label>
                                                    <div className="controls">
                                                        <div className="input-group">
                                                            <input className="form-control date-picker"
                                                                   ref="endDate"
                                                                   value={this.state.info.endDate}
                                                                   placeholder="有效日期"
                                                                   type="text" />
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-calendar"></i>
                                                    </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label htmlFor="needs">发布范围</label>
                                                    <div className="input-icon icon-right">
                                                        <table className="table table-bordered">
                                                            <tbody>
                                                            <tr>
                                                                <td width="50%">
                                                                    <div className="input-icon icon-right" style={{marginBottom: '10px'}}>
                                                                        <input ref="orgSearch" onChange={this.searchTree} type="text" className="form-control" />
                                                                    </div>
                                                                    <div id="orgTree"></div>
                                                                </td>
                                                                <td width="50%">
                                                                    <div ref="orgSel">
                                                                        {pDoms}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label htmlFor="needs">正文<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                            <textarea ref="content" name="content" type="text" value={this.state.info.content} className="form-control"
                                                      data-bv-notempty="true"
                                                      data-bv-notempty-message="公告正文必须输入"
                                                      data-bv-stringlength="true"
                                                      data-bv-stringlength-min="2"
                                                      data-bv-stringlength-max="500"
                                                      data-bv-stringlength-message="公告正文在2到500个字符之间"
                                                      onChange={this.handleChange} rows="4" placeholder="公告正文"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="widget-header noShadow padding-20">
                                        <div className="buttons-preview" style={style_button}>
                                            <input type="button" onClick={this.handleCancel}
                                                   className="btn btn-cancer" value="取消"/>
                                            <button id="btnSave" onClick={this.handleSave}
                                                    className="btn btn-danger">保存
                                            </button>
                                        </div>
                                    </div>
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