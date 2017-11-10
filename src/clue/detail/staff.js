import React, {
    Component
} from 'react';
import {
    render
} from 'react-dom';
import {
    Link,
    hashHistory
} from 'react-router';
import {
    Table
} from 'antd';

import CurrentPosition from '../../core/components/layout/CurrentPosition'
import Alert from '../../core/components/alert.js'

import CONFIG from '../../core/common/config.js'
import Constants from '../../core/common/constants.js';
import AjaxRequest from '../../core/common/ajaxRequest.js';
import Tools from '../../core/common/tools.js';
import {
    APIS
} from '../../core/common/config.js';

module.exports = React.createClass({
    getInitialState: function () {
        return {
            assignTo: {
                deptId: 0,
                staffId: 0,
                reason: ""
            },
            columns: [{
                title: 'name',
                key: 'name',
                render: (text, record) => (
                    <div className="tx-img">
                        <img
                            src={record.headPhotoUrl?record.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"}
                            name="headPhoto" width="55" height="55"/>
                        <span style={{marginLeft:'8px'}}>{record.name}</span>
                        <span>{record.title}</span>
                    </div>
                ),
            }],
            queryParam: {
                q: "",
                pageNo: 1,
                pageSize: 1000,
            },
            data: []
        }
    },

    componentWillUnmount() {
    },


    componentDidMount: function (param) {
        this.getData();
        Tools.imgLoadError();
    },

    handleRowClick: function (record, index) {
        let v = record;
        this.refs.listStaff.SelectedRowKeys = [record.id];
    },
    handleAssignToClick: function () {
        let self = this;
        //staff将线索转给其它员工传入json:
        //assignType:转移方式：
        // 0leder分配到部门，
        // 1leader分配到员工，
        // 2员工转移到其它销售，
        // 3转到资源池，
        // 4转商机，
        // 5销售抢单，
        // 6分配到分公司,
        // 7员工新建
        let assignType = 0;
        let toDeptId = self.state.assignTo.deptId;
        let toStaffId = self.state.assignTo.staffId;
        let fromStaffId = self.props.location.query.fromStaffId;
        let reason = "";

        if (toDeptId == 0 && toStaffId == 0) {
            assignType = 3;
            reason = "转资源池";
        } else if (fromStaffId > 0) { //转移
            assignType = 2;
            reason = "转移";
        } else if (toStaffId > 0) {
            assignType = 1;
            reason = "分配给员工";
        } else if (toDeptId > 0) {
            assignType = 0;
            reason = "分配给部门"
        }


        if (assignType == 0 || assignType == 1) {
            self.saveAssignResult(assignType, reason);
        } else {

            bootbox.prompt({
                title: "请输入转移原因：",
                inputType: 'textarea',
                callback: function (result) {
                    if (result === null) {
                        return;
                    } else {
                        self.saveAssignResult(assignType, result || reason);
                    }
                }
            });

        }

    },
    saveAssignResult: function (assignType, reason) {
        let self = this;
        let toJson = {
            fromDeptId: self.props.location.query.fromDeptId,
            fromStaffId: self.props.location.query.fromStaffId,
            toDeptId: self.state.assignTo.deptId,
            toStaffId: self.state.assignTo.staffId,
            toOrgId: 0,
            assignType: assignType,
            assignReason: reason
        };

        let clueId = self.props.params.id;
        let url = [CONFIG.APIS.clue, clueId, "assignto"].join("/");
        AjaxRequest.post(url, toJson, function (data) {
            if (data.code == "200") {
                $('#modal-success').modal();
            } else {
                $('#modal-danger').modal();
            }
        });
    },
    handleError: function () {

    },
    handleSearch: function () {
        var kinpt = this.refs.keyword;
        var kw = kinpt.value;
        this.getData(kw);
    },
    //获取线索联系人
    getData(keyword) {
        let self = this;
        let clueId = self.props.params.id;
        let fromStaffId = this.props.location.query.fromStaffId;


        let url = CONFIG.APIS.person_list; //是转移客户,可以转给任意员工
        if (fromStaffId == 0) { //是分配客户，只是分给直属下属（部门及员工）
            url = [url, "direct_reports"].join('/');
        }
        var params = this.state.queryParam;
        params.q = keyword;
        AjaxRequest.get(url, params, function (body) {
            let poolItems =
                [{
                    id: 0,
                    staffId: 0,
                    name: "线索池",
                    type: "detp",
                    headPhotoUrl: CONFIG.APIS.crm_pc + "\\assets\\img\\pool.gif",
                    deptId: 0
                }];

            let data = poolItems.concat(body.data);
            self.setState({
                data: data
            });
        });

    }, //end 线索联系人

    render: function () {
        let self = this;

        let rowSelection = {
            type: "radio",
            onChange(selectedRowKeys, selectedRows) {
                self.setState({
                    assignTo: {
                        deptId: selectedRows[0].deptId,
                        staffId: selectedRows[0].staffId,
                    }
                });
            }
        };
        let pagination = {
            pageSize: 10,
        };

        let clueId = this.props.params.id;
        let butttonTitle = this.props.location.query.fromStaffId > 0 ? "确认转移" : "确认分配";
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />

                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my" >
                                <ul className="nav nav-tabs myTab">
                                    <li>
                                        <a className="btnBack" href={`#/clue/${clueId}?tab=moreInfo`}></a>
                                    </li>
                                    <li className="active">
                                        <a>转移</a>
                                    </li>
                                    <div className="DTTT btn-group">
                                        <a className="btn btn-default DTTT_button_copy" onClick={this.handleAssignToClick}>
                                            <i className="fa fa-plus"></i>
                                            <span>{butttonTitle}</span>
                                        </a>
                                    </div>
                                </ul>
                                <div className="tab-content tabs-flat">
                                    <div className="tab-pane animated fadeInUp active">
                                        <div className="myBox" style={{paddingBottom:'0px', height:'auto'}}>
                                            <div className="searchBox">
                                                <span className="input-icon inverted">
                                                    <input type="text" ref='keyword' className="form-control input-sm" onChange={this.handleSearch} placeholder=""/>
                                                    <i className="glyphicon glyphicon-search bg-blue" onClick={this.handleSearch}></i>
                                                </span>
                                            </div>

                                            <Table ref="listStaff" showHeader={false} rowKey="id" size="small"
                                                   rowSelection={rowSelection}
                                                   columns={this.state.columns}
                                                   dataSource={this.state.data}
                                                   onRowClick={this.handleRowClick}
                                                   pagination={pagination}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<div className="page-body">
                    <div className="widget lists">
                        <div className="widget-body">
                            <div role="grid" id="editabledatatable_wrapper"
                                 className="dataTables_wrapper form-inline no-footer">
                                <div style={{marginBottom:8 + 'px'}}>

                                    <div className="DTTT btn-group" style={{right:0+'px'}}>
                                        <a className="btn btn-default DTTT_button_copy"
                                           onClick={this.handleAssignToClick}>
                                            <i className="fa fa-plus"></i>
                                            <span>{butttonTitle}</span>
                                        </a>
                                    </div>
                                    <div style={{height: 32+"px"}}>
                                        <a className="btn btn-default DTTT_button_copy"
                                           href={`#/clue/${clueId}?tab=moreInfo`}>
                                            <i className="fa fa-mail-reply"></i>
                                            <span>返回 </span>
                                        </a>
                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>
                </div>*/}


                {/*<div className="task-container">
                    <div className="task-search">
                        <span className="input-icon inverted">
                            <input type="text" ref='keyword' className="form-control input-sm" onChange={this.handleSearch} placeholder=""/>
                            <i className="glyphicon glyphicon-search bg-blue" onClick={this.handleSearch}></i>
                        </span>
                    </div>
                </div>
                <Table ref="listStaff" showHeader={false} rowKey="id" size="small"
                       rowSelection={rowSelection}
                       columns={this.state.columns}
                       dataSource={this.state.data}
                       onRowClick={this.handleRowClick}
                       pagination={pagination}/>*/}


                <Alert result="succees"></Alert>
                <Alert result="danger"></Alert>
            </div>
        )
    }
});