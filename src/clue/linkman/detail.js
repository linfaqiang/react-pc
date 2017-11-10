import React, {
    Component
} from 'react'
import {
    render
} from 'react-dom'
import {
    Link
} from 'react-router'
import Reflux from 'reflux'
import ReactMixin from 'react-mixin'

import CurrentPosition from '../../core/components/layout/CurrentPosition'
import MainInfo from '../../core/components/DetailList/MainInfo'
import DetailList from '../../core/components/DetailList/List';

import CONFIG from '../../core/common/config.js'
import Constants from '../../core/common/constants'
import AjaxRequest from '../../core/common/ajaxRequest'
import Alert from '../../core/components/alert.js'

import RemarkFile from '../../remark/file/file'
import Remark from '../../remark/remark'
import Buttons from './detail-buttons'

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState: function() {
        return {
            routeId: this.props.params.linkmanId,
            // routeId: this.props.params.id,
            remarkMsg: [],
            remarkLen: 0,
            remarkFile: [],
            remarkFileLen: 0,
            mainInfo: [],
            info: {},
            detailList: [{
                    name: '座机',
                    field: 'telephone',
                    value: ''
                }, {
                    name: '地址',
                    field: 'address',
                    value: ''
                }, {
                    name: '生日',
                    field: 'birthday',
                    value: ''
                }, {
                    name: 'QQ',
                    field: 'qq',
                    value: ''
                }, {
                    name: '微信',
                    field: 'wechat',
                    value: ''
                }, {
                    name: 'E-Mail',
                    field: 'email',
                    value: ''
                }

            ],
        }
    },
    componentDidMount: function(param) {
        let self = this;
        let id = self.state.routeId;
        if (id && id > 0) {
            this.getDetail();
            this.getOtherMsg();
        }

        let tab = self.props.location.query.tab;
        if (tab) {
            $(`#myTab a[href="#${tab}"]`).tab('show');
        }

    },

    //获取线索详情
    getDetail: function() {
        let self = this;
        let id = self.state.routeId;
        let url = [CONFIG.APIS.linkman, "clue", id].join("/");

        AjaxRequest.get(url, null, function(body) {
            let info = body.data;

            let mainInfo = [{
                name: "部门",
                value: info.department || "(未填写)",
                color: "yellow",
                icon: "salesdest"
            }, {
                name: "职位",
                value: info.title || "(未填写)",
                color: "blue",
                icon: "contacts"
            }, {
                name: "联系方式",
                value: info.mobile || info.telephone || "(无)",
                color: "green",
                icon: "phone"
            }, {
                name: "客户",
                value: info.customerName || "(未填写)",
                color: "red",
                icon: "customer pcicon"
            }];

            self.setDetailData(body.data); //设置详情
            self.setState({
                mainInfo: mainInfo,
                info: info
            });

        });


    }, // end 线索详情

    getOtherMsg: function() {
        this.getRemarkMsg();
        this.getRemarkFile();
    },
    setDetailData: function(data) { //设置详情
        var list = this.state.detailList;

        for (var i = 0, len = list.length; i < len; i++) {
            var field = list[i].field;
            list[i].value = data[field] || '------';
        }
        this.state.detailList = list;
        this.setState(this.state.detailList)
    },
    //获取线索联系人的备注内容
    getRemarkMsg: function() {
        let self = this;
        let id = self.state.routeId;
        let url = CONFIG.APIS.clue_linkmen_notes.replace('{id}', id);//[CONFIG.APIS.notes_add, "clue_linkman", id].join("/");

        AjaxRequest.get(url, null, function(body) {
            self.setState({
                remarkMsg: body.data,
                remarkLen: body.totalSize
            });
        });

    }, //end 线索备注内容

    //获取线索备注附件
    getRemarkFile: function() {
        let self = this;
        let id = self.state.routeId;
        let url = [CONFIG.APIS.notes_add, "fileRemarkList/clue_linkman", id].join("/");

        AjaxRequest.get(url, null, function(body) {
            self.setState({
                remarkFile: body.data,
                remarkFileLen: body.totalSize
            });
        });

    }, //end 线索备注附件

    renderInfo: function() {
        if (this.state.info.changeId || 0 == 0) {
            return (
                <div className="clueData">
                    <p><b>线索来源</b></p>
                    <p>{this.state.info.sourceTxt}</p>
                    <hr />
                    <p><b>客户地址</b></p>
                    <p>{this.state.info.address.address||"(未填写)"}</p>
                </div>
            )
        } else {
            return (
                <div className="clueData">
                    <p><b>线索来源</b></p>
                    <p>{this.state.info.sourceTxt}</p>
                    <hr />
                    <p><b>商机</b></p>
                    <p><a href={"#/chance/" + this.state.info.chanceId}>{this.state.info.chanceName}</a></p>  
                    <hr />
                    <p><b>客户地址</b></p>
                    <p>{this.state.info.address.address||"(未填写)"}</p>
                </div>
            )
        }

    },
    render: function() {
        var style49 = {
            paddingBottom: 49 + "px"
        }
        var styleNone = {
            display: "none"
        }
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                
                <div className="page-body">
                    <Buttons info={this.state.info}></Buttons>
                    <div className="row otherRow">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <MainInfo lists={this.state.mainInfo} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="col-xs-12">
                                     <div className="dashboard-box">
                                        <div className="box-tabbs">
                                            <div className="tabbable">
                                                <ul className="nav nav-tabs myTab" id="myTab">
                                                    <li className="active">
                                                      <a data-toggle="tab" href="#detail">联系人详情</a>
                                                    </li>
                                                    <li>
                                                      <a data-toggle="tab" href="#moreInfo">其他相关</a>
                                                    </li>
                                                  </ul>
                                                  <div className="tab-content tabs-flat no-padding">
                                                    <div id="detail" className="tab-pane animated fadeInUp active">
                                                        <div className="row otherRow">
                                                            <div className="col-lg-12">
                                                                <DetailList lists={this.state.detailList}/>
                                                            </div>
                                                        </div>
                                                    </div>     
                                                    <div id="moreInfo" className="tab-pane padding-10 animated fadeInUp pdLR20">
                                                        <div className="row">
                                                            <Remark lists={this.state.remarkMsg} type="clue_linkman" clueId={this.props.params.id} linkmanId={this.props.params.linkmanId} typeId={this.state.routeId} remarkLen={this.state.remarkLen}/>
                                                        </div>
                                                        <hr className="wide" />  
                                                        <div className="row">
                                                            <RemarkFile lists={this.state.remarkFile} type="clue_linkman" clueId={this.props.params.id} linkmanId={this.props.params.linkmanId} typeId={this.state.routeId} remarkFileLen={this.state.remarkFileLen}/>
                                                        </div>                                      
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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