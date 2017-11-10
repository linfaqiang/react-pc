import React from 'react'
import request from 'superagent';

import {
    hashHistory
} from 'react-router';
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition'
//import Constants from '../core/common/constants.js'
import CONFIG from '../core/common/config.js'
import AjaxRequest from '../core/common/ajaxRequest.js';

//import Select from '../core/components/Select.js'
//import RegionSelect from '../core/components/RegionSelect.js'
import Alert from '../core/components/alert.js'
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';


module.exports = React.createClass({

    getInitialState: function() {
        return {
            routeId: this.props.params.id,
            changed: false,
            customerList: [],
            linkman: {
                "id": 0,//编辑， 联系人id
                "name": "",//姓名
                "title": "",//职务
                "mobile": "",//手机
                "telephone": "",//电话
                "customerId": 0,//所属的客户id, 公司
                "department": "",//部门
                "birthday": "",//生日
                "qq": "",//
                "email": "",//
                "wechat": "",//
                "sortIndex": 1,//排序号
                "headPhotoId": 0//头像
            },
            cid: this.props.location.query.customerId,
            customer:{id:'', text:''}

        };

    },

    componentDidMount: function(param) {

        let self = this;


        let id = self.props.params.id;

        if (id && id > 0) {
            let url = CONFIG.APIS.customer_linkmen + "/" + id;
            AjaxRequest.get(url, null, function(body) {
                let info = self.state.linkman;
                for (let key in info) {
                    info[key] = body.data[key];
                }

                self.setState({linkman: info});
                self.state.cid = body.data.customerId;

                $("#birthday").val(info.birthday);

                self.getAllCustomer();
            });
        }else{
            self.getAllCustomer();
        }

        $('.date-picker').datepicker({
            local:'ZH_CN'
        });

        $("#registrationForm").bootstrapValidator();
    },

    //获取所有客户
    getAllCustomer: function() {
        var self = this;
        AjaxRequest.get(APIS.myCustomer_list, null, function(data) {
            if (data.code == 200 || data.code == '200') {
                self.setState({
                    customerList:data.data
                });

                if(self.state.cid){
                    self.handleCustomerChange(self.state.cid);
                }
            }
        });
    },
    handleCustomerChange(e) {
        var self = this;
        var id = parseInt((e.target ? e.target.value : e));
        var list = self.state.customerList;

        for(var i=0; i<list.length; i++){
            if(id === list[i].id){
                self.state.customer = list[i];
                self.state.linkman.customerId = id;
                self.setState(self.state.customer);
                break;
            }
        }
        this.setState({changed: true});
    },

    handleChange: function(e) {
        let newState = this.state.linkman;
        let name = e.target.name;

        newState[name] = e.target.value;
        this.setState({
            linkman: newState,
            changed: true
        });
        this.setState({changed: true});
    },
    handleSave: function(e) {
        let self = this;

        let info = this.state.linkman;
        //info.customerId = this.refs.customerId.state.value;
        info.birthday = $("#birthday").val();

        let id = self.props.params.id;
        let clueId = self.props.location.query.tab;
        if (id && id > 0) {
            info.id = id;
            AjaxRequest.put(CONFIG.APIS.customer_linkmen + "/" + id, info, function(data) {
                if (data.code == 200) {
                    $('#modal-success').modal();
                    //hashHistory.push(`#clue/${clueId}?tab=moreInfo`);
                } else {
                    $('#modal-danger').modal();
                }
            });
        } else {
            AjaxRequest.post(CONFIG.APIS.contact_list, info, function(data) {
                if (data.code == 200) {
                    $('#modal-success').modal();
                    //hashHistory.push(`#clue/${clueId}?tab=moreInfo`);
                } else {
                    $('#modal-danger').modal();
                }
            });
        }
    },

    handleCancel: function() {
        //let clueId = this.props.location.query.tab;
        if ($("#birthday").val() != this.state.linkman.birthday) {
            this.state.changed = true;
        }

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


    render: function() {
        let style_none = {
            display: "none"
        };
        let style100 = {
            width: "100%"
        };
        let style_button = {
            textAlign: 'left',
            padding: "10px 0 10px 0"
        };

        return (
            <div>
                <CurrentPosition name={this.state.routeId ? "联系人 / 编辑联系人" : "联系人 / 新增联系人"}></CurrentPosition>
                <div className="page-body">
                    <div className="widget">
                        <div className="widget-body">

                            <div className="row">
                                <div className="col-lg-6 col-sm-6 col-xs-12" style={style100}>
                                    <div className="widget flat radius-bordered">
                                        <form id="registrationForm" method="post"
                                              data-bv-message="This value is not valid"
                                              data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
                                              data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
                                              data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

                                            <div className="widget-body">
                                                <div id="registration-form">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label htmlFor="name">姓名<sup>*</sup></label>
                                                                <div className="input-icon icon-right">
                                                                    <input type="text" className="form-control"
                                                                           value={this.state.linkman.name}
                                                                           onChange={this.handleChange}
                                                                           name="name" id="name" placeholder="姓名"
                                                                           data-bv-notempty="true"
                                                                           data-bv-notempty-message="姓名必须输入"
                                                                           data-bv-stringlength="true"
                                                                           data-bv-stringlength-min="2"
                                                                           data-bv-stringlength-max="50"
                                                                           data-bv-stringlength-message="姓名在2到50个字符之间"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label htmlFor="title">职位<sup>*</sup></label>
                                                                <div className="input-icon icon-right">
                                                                    <input type="text" className="form-control"
                                                                           value={this.state.linkman.title}
                                                                           onChange={this.handleChange}
                                                                           name="title" id="title" placeholder="职位"
                                                                           data-bv-notempty="true"
                                                                           data-bv-notempty-message="职位必须输入"
                                                                           data-bv-stringlength="true"
                                                                           data-bv-stringlength-min="2"
                                                                           data-bv-stringlength-max="100"
                                                                           data-bv-stringlength-message="职位在3到100个字符之间"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label htmlFor="telephone">电话</label>
                                                                <div className="input-icon icon-right">
                                                                    <input type="text" className="form-control"
                                                                           value={this.state.linkman.telephone}
                                                                           onChange={this.handleChange}
                                                                           name="telephone" id="telephone" placeholder="联系人电话"
                                                                           data-bv-regexp="true"
                                                                           data-bv-regexp-regexp="^0\d{2,3}-?\d{7,8}$"
                                                                           data-bv-regexp-message="请输入正确的电话号码"/>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label htmlFor="mobile">手机<sup>*</sup></label>
                                                                <div className="input-icon icon-right">
                                                                    <input type="text" className="form-control"
                                                                           value={this.state.linkman.mobile}
                                                                           onChange={this.handleChange}
                                                                           name="mobile" id="mobile" placeholder="联系人手机"
                                                                           data-bv-notempty="true"
                                                                           data-bv-regexp="true"
                                                                           data-bv-regexp-regexp="^((\+?86)|(\(\+86\))|(0))?1\d{10}$"
                                                                           data-bv-regexp-message="请输入正确的手机号码"/>
                                                                </div>{/* /^((\+?86)|(\(\+86\)))?1\d{10}$/  /^1(3|4|5|7|8)\d{9}$/  /^(0?86)?1[\d]{10}$/  */}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            {/*<div className="form-group">
                                                                <label htmlFor="customerId">公司<sup>*</sup></label>
                                                                <div className="input-icon icon-right">
                                                                    <Select ref="customerId"
                                                                            value={this.state.linkman.customerId}
                                                                            list={this.state.customerList}
                                                                            name="customerId" id="customerId"
                                                                            placeholder="所属客户"
                                                                            onChange={this.handleChange}
                                                                    />
                                                                </div>
                                                            </div>*/}
                                                            <div className="form-group">
                                                                <label htmlFor="customerId">公司</label>
                                                                <Select2
                                                                    ref="customerId"
                                                                    multiple={false}
                                                                    style={{width:"100%"}}
                                                                    data={this.state.customerList}
                                                                    onSelect={this.handleCustomerChange}
                                                                    value={this.state.customer.id}
                                                                    options={{placeholder: this.state.customer.text||'选择公司'}}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label htmlFor="department">部门</label>
                                                                <div className="input-icon icon-right">
                                                                    <input type="text" className="form-control"
                                                                           value={this.state.linkman.department}
                                                                           onChange={this.handleChange}
                                                                           name="department" id="department" placeholder="部门"
                                                                           data-bv-stringlength-min="2"
                                                                           data-bv-stringlength-max="50"
                                                                           data-bv-stringlength-message="部门在3到50个字符之间"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label htmlFor="birthday">生日</label>
                                                                <div className="controls">
                                                                    <div className="input-group">
                                                                        <input className="form-control date-picker"
                                                                               name="birthday"
                                                                               id="birthday"
                                                                               placeholder="生日"
                                                                               onChange={this.handleChange}
                                                                               type="text"
                                                                               data-date-format="yyyy-mm-dd"
                                                                               data-bv-date="true"
                                                                               data-bv-date-format="YYYY-MM-DD"
                                                                               data-bv-date-message="生日格式:2016-10-01" />
					                                                	<span className="input-group-addon">
					                                                    	<i className="fa fa-calendar"></i>
					                                                	</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label htmlFor="qq">QQ</label>
                                                                <div className="input-icon icon-right">
                                                                    <input type="text" className="form-control"
                                                                           value={this.state.linkman.qq}
                                                                           onChange={this.handleChange}
                                                                           name="qq" id="qq" placeholder="QQ"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label htmlFor="email">Email</label>
                                                                <div className="input-icon icon-right">
                                                                    <input type="text" className="form-control"
                                                                           value={this.state.linkman.email}
                                                                           onChange={this.handleChange}
                                                                           name="email" id="email" placeholder="Email"
                                                                           data-bv-emailAddress="true"
                                                                           data-bv-emailAddress-message="请输入正确的Email号码"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label htmlFor="wechat">微信</label>
                                                                <div className="input-icon icon-right">
                                                                    <input type="text" className="form-control"
                                                                           value={this.state.linkman.wechat}
                                                                           onChange={this.handleChange}
                                                                           name="wechat" id="wechat" placeholder="联系人微信"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="wide" />
                                            <div className="widget-header">
                                                <div className="buttons-preview" style={style_button}>
                                                    <input type="button" onClick={this.handleCancel} className="btn btn-cancer" value="取消" />
                                                    <button id="btnSave" onClick={this.handleSave} className="btn btn-danger">保存</button>

                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                </div>
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