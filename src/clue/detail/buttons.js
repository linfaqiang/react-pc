import React, {
    PropTypes,
    Component
} from 'react'
import {
    render
} from 'react-dom';
import {
    hashHistory
} from 'react-router'

import Reflux from 'reflux'
import ReactMixin from 'react-mixin'

import TabSelect from '../../core/components/PublicSelect/TabSelect.js'
import Constants from '../../core/common/constants.js'
import dicts from '../../core/common/dicts.js'
import CONFIG from '../../core/common/config.js'
import AjaxRequest from '../../core/common/ajaxRequest.js';

import Select2 from '../../core/components/Select2/Select2.js'
import '../../core/components/Select2/select2.css'
import UserInfo from '../../core/common/UserInfo';

import store from './store'

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState: function () {

        return {};
    },

    componentWillUnmount: function () {

    },

    componentDidMount: function (param) {


    },

    handleClick: function () {
        //0未指派，1-新分配，2-处理中，3-已转商机，4-已转资源池,5-APP中新建
        let status = this.props.info.status;
        let clueId = this.props.info.id;
        if (status == 1 || status == 2 || status == 5) {
            hashHistory.push(`/clue/${clueId}/edit`);
        } else if (status == 0) {
            toastr.warning('线索未指派，不可编辑');
        } else if (status == 3) {
            toastr.warning('线索已转商机，不可编辑');
        } else if (status == 4) {
            toastr.warning('线索已转资源池，不可编辑');
        }
    },

    assignTo: function () {
        let self = this;
        let clueId = self.props.info.id;

        let fromDeptId = self.props.info.ownerDeptId;
        let fromStaffId = self.props.info.ownerStaffId;

        this.context.router.push({
            // pathname: '/clue/assign/' + clueId,
            pathname: '/clue/'+clueId+'/assign/',
            query: {
                fromDeptId: self.props.info.ownerDeptId,
                fromStaffId: self.props.info.ownerStaffId
            }
        });

    },

    toChance: function () {
        let self = this;
        let clueId = self.props.info.id;

        this.context.router.push({
            // pathname: '/clue/tochance/' + clueId,
            pathname: '/clue/'+clueId+'/tochance',
            query: {
                needs: self.props.info.needs,
                customerName: self.props.info.customerName,
                clueId: self.props.info.id,
                addressId: self.props.info.address.id
            }
        });
    },

    handleCancel: function () {
        if (this.state.changed) {
            bootbox.confirm("表单已修改，你确定不保存退出吗?", function (result) {
                if (result) {
                    history.go(-1);
                }
            });

        } else {
            history.go(-1);
        }

    },
    pickup: function () {
        let self = this;
        let clueId = self.props.info.id;
        let url = [CONFIG.APIS.clue, clueId, 'pickup'].join("/");

        bootbox.confirm("是否确定抢单?", function (result) {
            if (result) {
                AjaxRequest.put(url, null, function (data) {
                    if (data.code == "200") {
                        $('#modal-success').modal();

                    } else {
                        $('#modal-danger').modal();
                    }
                });
            }
        });


    },
    render: function () {
        var self = this;
        let clueId = this.props.info.id;

        //0未指派，1-新分配，2-处理中，3-已转商机，4-已转资源池,5-APP中新建
        let status = this.props.info.status;
        let ownerStaffId = this.props.info.ownerStaffId;
        let staffId = UserInfo.staffId();

        let canTrack,
            canAddLinkman,
            canAssignTo,
            canToChance,
            canEdit,
            canPickup;
        if (status == 1 || status == 2 || status == 5) {
            canTrack = {
                display: "block"
            };
            canAddLinkman = {
                display: "block"
            };
            canAssignTo = {
                display: "block"
            };

            canToChance = {
                display: this.props.info.ownerStaffId > 0 ? "block" : "none"
            };

            canPickup = {
                display: "none"
            }
            //待分配线索只有分配操作，取消跟进、联系人、转商机操作
            if (status == 1) {
                canTrack = {
                    display: "none"
                };
                canAddLinkman = {
                    display: "none"
                };
                canToChance = {
                    display: "none"
                };
                if (ownerStaffId == staffId) {
                    canTrack = {
                        display: "block"
                    };
                    canAddLinkman = {
                        display: "block"
                    };
                    canAssignTo = {
                        display: "block"
                    };
                    canToChance = {
                        display: "block"
                    };
                }
            }
        } else if (status == 0 || status == 3) {
            canTrack = {
                display: "none"
            };
            canAddLinkman = {
                display: "none"
            };
            canAssignTo = {
                display: "none"
            };
            canToChance = {
                display: "none"
            };
            canPickup = {
                display: "none"
            };
            canEdit = {
                display: "none"
            }
        } else if (status == 4) {
            canTrack = {
                display: "none"
            };
            canAddLinkman = {
                display: "none"
            };
            canAssignTo = {
                display: "none"
            };
            canToChance = {
                display: "none"
            };
            canPickup = {
                display: "block"
            };
            canEdit = {
                display: "none"
            }
        }

        let butttonTitle = this.props.info.ownerStaffId > 0 ? "转移" : "分配";
        return (
            <div className="row">
                <div className="page-header position-relative">
                    <div className="header-title">
                        <h1>
                            {this.props.info.needs}
                            <a onClick={this.handleClick} style={canEdit}><span
                                className="crm_edit pcicon pcicon-edit"></span></a>
                        </h1>
                    </div>
                    <div className="header-buttons">
                        <div className="glyphicon glyphicon-plus" style={canTrack}
                             onClick={()=>{hashHistory.push(`/clue/${clueId}/track`)}}>跟进
                        </div>
                        <div className="glyphicon glyphicon-plus" style={canAddLinkman}
                             onClick={()=>{hashHistory.push(`/clue/${clueId}/addLinkman/0`)}}>联系人
                        </div>
                        <div className="fa fa-share-square-o" style={canAssignTo}
                             onClick={this.assignTo}>{butttonTitle}</div>
                        <div className="fa fa-location-arrow" style={canToChance} onClick={this.toChance}>转商机</div>
                        <div className="fa fa-sign-in" style={canPickup} onClick={this.pickup}>抢单</div>
                    </div>
                </div>
            </div>
        )
    }
});