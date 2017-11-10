import React from 'react';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import CONFIG from '../core/common/config.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Alert from '../core/components/alert.js';
import UserInfo from '../core/common/UserInfo.js';

module.exports = React.createClass({

    getInitialState: function() {
        console.log('--->');
        return {
            routeId: this.props.params.id || '',
            changed: false,//是否有值改变
            permit: {
                isLeader: false,
                isOwner: false
            }, //当前用户的权限
            info: {
                id: 0,
                startDate: "",
                endDate: "",
                targetAmount: 0,
                planAmount: 0,
                assignAmount: 0,
                ownerStaffId: 0,
                ownerOrgId: 0,
                ownerDeptId: 0,
                remark: "",
                createdBy:"",
                lists: []
            },
            list: [{
                ownerOrgId: 0,
                ownerStaffId: 0,
                ownerDeptId: 0,
                departmentId: 0,
                owner: "",
                targetAmount: 0
            }],
            queryParam: { //初始化过滤参数
                pageNo: 1,
                pageSize: 20
            },
            tableName: 'linkman',
            step: 0.01 //数字精度
        };
    },


    componentDidMount: function() {
        var self = this;
        var id = self.state.routeId;

        if (id && id > 0) {
            var url = CONFIG.APIS.sale_plans_pc + "/" + id;
            AjaxRequest.get(url, null, function(body) {
                var info = self.state.info;
                for (var key in info) {
                    if (key != "lists" && key != "id") {
                        if(key == 'assignAmount'){
                            info.assignAmount = body.data.assignAmount;
                        }else{
                            info[key] = body.data[key];
                        }
                    }
                }
                self.setState({
                    info: info
                });

                self.refs.endDate.value = info.endDate;
                self.refs.startDate.value = info.startDate;

                self.state.list = body.data.list||[];
                self.setState(self.state.list);

                var p = UserInfo.getRolePermit(body.data);
                self.state.permit.isLeader = p.isLeader;
                self.state.permit.isOwner = p.isOwner;
                self.setState(self.state.permit);

                var staffId = UserInfo.staffId();
                if(info.createdBy != staffId){
                    self.refs.targetAmount.setAttribute('readonly', 'readonly');
                    self.refs.targetAmount.parentNode.querySelectorAll('.spinner-buttons')[0].style.display = 'none';
                }
            });

            self.refs.startDate.setAttribute('readonly', 'readonly');
            self.refs.endDate.setAttribute('readonly', 'readonly');
        } else {
            self.getData(); //配额人员及子部门列表
            var p = UserInfo.getRolePermit();
            self.state.permit.isLeader = p.isLeader;
            self.state.permit.isOwner = p.isOwner;
            self.setState(self.state.permit);
        }

        if(id==0 || !id){//新建时初始化时间
            var dpicker = $('.date-picker');
            dpicker.datepicker({
                format: 'yyyy-mm',
                viewMode: 'months',
                minViewMode: 'months',
                local: 'ZH_CN'
            });
        }
    },
    handleSave: function(e) {
        e.preventDefault();
        var self = this;
        var info = self.state.info;
        var list = self.state.list;
        var id = self.state.routeId;
        var endDate = self.refs.endDate.value;
        var startDate = self.refs.startDate.value;
        info.startDate = startDate;
        info.endDate = endDate;
        info.lists = list;

        if (info.targetAmount == 0) {
            toastr.error('请设置 “销售目标金额”');
            return;
        }

        if ((info.targetAmount - info.assignAmount) < 0) {
            toastr.error('请检查您的分配方案');
            return;
        }

        if(!endDate || !startDate) {
            toastr.error('请设置 “销售计划起” 和 “销售计划止” 字段');
            return;
        }else{
            startDate = startDate.split('-');
            endDate = endDate.split('-');

            startDate = new Date(parseInt(startDate[0]), (parseInt(startDate[1]) - 1), 0, 0, 0, 0).getTime();
            endDate = new Date(parseInt(endDate[0]), (parseInt(endDate[1]) - 1), 0, 0, 0, 0).getTime();

            if ((endDate - startDate ) < 0) {
                toastr.error('“销售计划起” 不能晚于“销售计划止”  !!');
                return;
            }
        }

        if (id && id > 0) {
            info.id = id;
            AjaxRequest.put(CONFIG.APIS.sale_plans_pc + "/" + id, info, function(data) {
                /*if (data.code == "200") {
                    toastr.success('保存成功!');
                    history.go(-1);
                } else {
                    toastr.error('保存成功失败：'+data.msg);
                }*/
                showAjaxCallbackModal(data);
            });
        } else {
            XHR.post({
                url:CONFIG.APIS.sale_plans_pc,
                data:info,
                success:function(res){
                    /*toastr.success('保存成功!');
                    history.go(-1);*/

                    showAjaxCallbackModal(res);
                }
            });
        }
    }, //保存
    handleCancel: function() {
        if (this.state.changed) {
            bootbox.confirm("表单已修改，你确定不保存退出吗?", function(result) {
                if (result) {
                    history.go(-1);
                }
            });

        } else {
            history.go(-1);
        }

    }, //取消
    handleChange: function(fieldName, e) {
        var self = this;
        var el = e.target;
        var val = e.target.value.trim();

        if (el.getAttribute('min') == 0) {
            self.state.info[fieldName] = parseFloat(val || 0);
        } else {
            self.state.info[fieldName] = val;
        }
        self.setState(self.state.info);
        self.setState({changed: true});

        if (fieldName === 'targetAmount') {
            self.resetAlloc();
        }
    },
    minuAmount: function(fieldName) {
        var self = this;
        var step = 0 - (self.state.step);
        var val = self.state.info[fieldName];

        if (val > 0) {
            val = parseFloat((val + step).toFixed(2));
            self.state.info[fieldName] = val;
            self.setState(self.state.info);
        }
    }, //计划总额减
    plusAmount: function(fieldName) {
        var self = this;
        var step = self.state.step;
        var val = self.state.info[fieldName];

        if (val >= 0) {
            val = parseFloat((val + step).toFixed(2));
            self.state.info[fieldName] = val;
            self.setState(self.state.info);
        }
    }, //计划总额加
    setValue: function(index, Increment) {
        var self = this;
        var list = self.state.list;
        var assignAmount = 0;

        list[index].targetAmount = parseFloat((list[index].targetAmount + Increment).toFixed(2));
        for (var i = 0; i < list.length; i++) {
            assignAmount += list[i].targetAmount;
        }

        self.state.info.assignAmount = parseFloat(assignAmount.toFixed(2));
        self.setState(self.state.info);
        self.setState({
            list: list
        });

    },
    handleListChange: function(index, e) {
        var self = this;
        var list = self.state.list;
        var val = parseFloat(e.target.value.trim() || 0);
        var assignAmount = 0;

        list[index].targetAmount = parseFloat(val.toFixed(2));
        for (var i = 0; i < list.length; i++) {
            assignAmount += list[i].targetAmount;
        }
        self.state.info.assignAmount = parseFloat(assignAmount.toFixed(2));
        self.setState(self.state.info);
        self.setState({
            list: list
        });
        self.setState({changed: true});
    },
    minuValue: function(index) {
        var self = this;
        var step = 0 - (self.state.step);
        self.setValue(index, step);
    }, //任务减
    plusValue: function(index) {
        var self = this;
        var step = self.state.step;
        self.setValue(index, step);
    }, //任务加
    equalAlloc: function() {
        console.log('--->');
        var self = this;
        var list = self.state.list;
        var all = self.state.info.targetAmount,
            n = list.length,
            mod = all % n,
            dist = all / n;

        if(n==1){
            mod = 0;
        }

        for (var i = 0; i < list.length; i++) {
            if (i === 0) {
                list[i].targetAmount = parseFloat((dist + mod).toFixed(2));
            } else {
                list[i].targetAmount = parseFloat((dist).toFixed(2));
            }
        }
        self.setState({
            list: list
        });
        self.state.info.assignAmount = parseFloat(all.toFixed(2));
        self.setState(self.state.info);
    }, //平均分配
    resetAlloc: function() {
        var self = this;
        var list = self.state.list;

        for (var i = 0; i < list.length; i++) {
            list[i].targetAmount = 0;
        }
        self.setState({
            list: list
        });
        self.state.info.assignAmount = 0;
        self.setState(self.state.info);
    }, //重置

    getData() {
        var self = this;
        var url = CONFIG.APIS.staffs_direct_reports;
        var params = self.state.queryParam;
        AjaxRequest.get(url, params, function(body) {
            let lists = body.data;
            let targetLists = [];

            lists.map(function(item, key) {
                let newItem = {
                    id: 0,
                    ownerStaffId: item.staffId,
                    ownerDeptId: item.staffId > 0 ? 0 : item.deptId,
                    departmentId: item.staffId > 0 ? item.deptId : 0,
                    owner: item.name,
                    targetAmount: 0
                };
                targetLists.push(newItem);
            });
            self.setState({
                list: targetLists
            });
        });
    }, //获取直属部门及直属员工

    render: function() {
        var style100 = {
            width: "100%"
        };
        var style_button = {
            textAlign: 'left',
            padding: "10px 0 10px 0"
        };
        var style_form_group = {
            display: "block",
            marginBottom: "15px",
            verticalAlign: "middle",
            width: "100%"
        };
        var hideDiv = {display:'none'};
        var id = this.state.routeId;
        var list = this.state.list;
        var self = this;
        var allAmount = self.state.info.targetAmount;
        var trs;

        trs = list.map(function(item, key) {
            return (
                <tr key={key}>
                    <td>{item.owner}</td>
                    <td>
                        <div className="spinner spinner-horizontal spinner-right" style={style_form_group}>
                            <div className="spinner-buttons btn-group">
                                <button type="button" className="btn spinner-down danger" disabled={!item.targetAmount} onClick={self.minuValue.bind(self, key)}>
                                    <i className="fa fa-minus"></i>
                                </button>
                                <button type="button" className="btn spinner-up danger" disabled={item.targetAmount>=allAmount} onClick={self.plusValue.bind(self, key)}>
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                            <input type="text" value={item.targetAmount} onChange={self.handleListChange.bind(self, key)} className="spinner-input form-control" style={style100} />
                        </div>
                    </td>
                </tr>
            )
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
                                        <a>
                                            {this.props.route.name}
                                        </a>
                                    </li>
                                </ul>

                                <form id="registrationForm" method="post">
                                    <div className="widget-body padding-20" style={{boxShadow: 'none'}}>
                                        <div id="registration-form">
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="startDate">销售计划起<sup>*</sup></label>
                                                        <div className="input-icon icon-right">
                                                            <div className="input-group">
                                                                <input ref="startDate" className="form-control date-picker" type="text" placeholder="请选择创建日期止" data-date-format="yyyy-mm" />
                                                                <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="endDate">销售计划止<sup>*</sup></label>
                                                        <div className="input-icon icon-right">
                                                            <div className="input-group">
                                                                <input ref="endDate" className="form-control date-picker" type="text" placeholder="请选择创建日期止" data-date-format="yyyy-mm" />
                                                                <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="targetAmount">销售目标金额(万元)<sup>*</sup></label>
                                                        <div className="spinner spinner-horizontal spinner-right" style={style_form_group}>
                                                            <div className="spinner-buttons btn-group">
                                                                <button type="button" className="btn spinner-down danger" disabled={!this.state.info.targetAmount} onClick={this.minuAmount.bind(this, 'targetAmount')}>
                                                                    <i className="fa fa-minus"></i>
                                                                </button>
                                                                <button type="button" className="btn spinner-up danger" onClick={this.plusAmount.bind(this, 'targetAmount')}>
                                                                    <i className="fa fa-plus"></i>
                                                                </button>
                                                            </div>
                                                            <input ref="targetAmount" type="text" value={this.state.info.targetAmount} onChange={this.handleChange.bind(this, 'targetAmount')} min="0" className="spinner-input form-control" style={style100} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="planAmount">销售计划金额(万元)</label>
                                                        <div className="spinner spinner-horizontal spinner-right" style={style_form_group}>
                                                            <div className="spinner-buttons btn-group">
                                                                <button type="button" className="btn spinner-down danger" disabled={!this.state.info.targetAmount} onClick={this.minuAmount.bind(this, 'planAmount')}>
                                                                    <i className="fa fa-minus"></i>
                                                                </button>
                                                                <button type="button" className="btn spinner-up danger" onClick={this.plusAmount.bind(this, 'planAmount')}>
                                                                    <i className="fa fa-plus"></i>
                                                                </button>
                                                            </div>
                                                            <input type="text" value={this.state.info.planAmount} onChange={this.handleChange.bind(this, 'planAmount')} min="0" className="spinner-input form-control" style={style100} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="remark">备注</label>
                                                        <span className="input-icon icon-right">
                                                            <textarea id="remark" name="remark" className="form-control" rows="2"
                                                                      placeholder="备注"
                                                                      value={this.state.info.remark}
                                                                      onChange={this.handleChange.bind(this, 'remark')}
                                                                      data-bv-stringlength="false"
                                                                      data-bv-stringlength-min="6"
                                                                      data-bv-stringlength-max="500"
                                                                      data-bv-stringlength-message="客户名称在6到500个字符之间"></textarea>
                                                        </span>
                                            </div>

                                            <div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper form-inline no-footer" style={this.state.permit.isLeader ? {} : hideDiv}>
                                                <div style={{marginBottom:8 + 'px'}}>
                                                    <div className="DTTT btn-group" style={{right:0+'px'}}>
                                                        <a className="btn btn-default DTTT_button_copy" onClick={this.resetAlloc}>
                                                            <span>重置 </span>
                                                        </a>
                                                        <a className="btn btn-default DTTT_button_collection" onClick={this.equalAlloc}>
                                                            <span>平均分配 </span>
                                                        </a>
                                                    </div>
                                                    <div style={{height: "32px", lineHeight: '32px'}}>
                                                        <span className="widget-caption databox-number">未分配(万元):<span>{(this.state.info.targetAmount - this.state.info.assignAmount).toFixed(2)}</span></span>
                                                        <span className="widget-caption databox-number">已分配(万元):<span>{this.state.info.assignAmount}</span></span>
                                                    </div>
                                                </div>
                                                <table className="table table-striped table-hover table-bordered dataTable no-footer" aria-describedby="editabledatatable_info">
                                                    <thead>
                                                    <tr>
                                                        <th width='40'>分配组织</th>
                                                        <th width='300'>销售配额(万元)</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {trs}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="widget-header noShadow padding-20">
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


                <Alert result="succees"></Alert>
                <Alert result="danger"></Alert>
            </div>

        )
    }
});