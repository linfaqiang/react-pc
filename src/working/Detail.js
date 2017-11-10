import React, {Component} from 'react';
import AddComment from './AddComment';
import request from 'superagent';
import {APIS} from '../core/common/config';
import {Link} from 'react-router';
import AjaxRequest from '../core/common/ajaxRequest.js';
import UserInfo from '../core/common/UserInfo.js';
import Tools from '../core/common/tools';

module.exports = React.createClass({

    getInitialState: function () {
        return {
            param: {
                summary: "",
                plan: "",
                startTime: "",
                endTime: "",
                status: 1,
                acceptorIds: ""
            },
            initParam: {
                "reportType": -1,
                "pageNo": 1,
                "pageSize": 10,
                "isViewMe": 0,
                "endEndTime": "",
                "startStartTime": ""
            },
            hideNoData: true
        }
    },
    //备注
    AddComment: function (val) {
        var self = this,
            id = self.props.detailData.id;
        if (!val) {
            alert('请输入备注内容')
        }

       /* AjaxRequest.post(APIS.work_report_comment.replace('{id}', id), {content: val}, function (body) {
            if (data.code == "200") {
                $('#modal-success').modal();
            } else {
                $('#modal-danger').modal().find('.modal-body').html('操作失败: '+data.msg);
            }
        });*/

        request
            .post(APIS.work_report_comment.replace('{id}', id))
            .send({
                content: val
            })
            .set('Content-Type', 'application/json;charset=utf-8')
            .end(function (err, res) {
                if (res.ok) {
                    if (res.body.code == '200') {
                        toastr.success('新增评论成功!');
                        self.props.clickBack(id);
                    }
                } else {
                    toastr.error('新增评论成功!');
                }
            });
    },
    workEditSumit: function () {
        var self = this,
            detailData = self.props.detailData,
            param = self.state.param;
        param.summary = detailData.summary;
        param.plan = detailData.plan;
        param.startTime = detailData.startTime;
        param.endTime = detailData.endTime;
        var thisData = detailData.acceptorList,
            arr = [];

        for (var i = 0, len = thisData.length; i < len; i++) {
            arr.push(thisData[i].acceptorId)
        }
        param.acceptorIds = arr.join(",");
        AjaxRequest.put(APIS.work_report_add + "/" + self.props.detailData.id, param, function (body) {
            toastr.success("工作报告提交成功!");
            self.props.getData(self.state.initParam);
        });
    },
    workEditDelet: function () {
        var self = this;
        AjaxRequest.delete(APIS.work_report_add + "/" + self.props.detailData.id, null, function (body) {
            toastr.success("工作报告删除成功!");
            self.props.getData();
        });
    },
    componentDidMount: function () {
    },
    componentDidUpdate: function () {
        if (this.props.detailData.acceptorList && this.props.detailData.acceptorList.length > 0) {
            Tools.imgLoadError();
        }
    },

    setNoData: function(bl){
        this.setState({hideNoData: bl});
    },
    render: function () {
        var self = this;
        var lists = self.props.detailData.acceptorList || [],
            listData = self.props.detailData,
            detailStaus = self.props.detailData.status,
            workCommentList = self.props.detailData.commentList || [];
        var hideNoData = this.state.hideNoData;

        var imgs = lists.map(function (qst, key) {
            return <li key={key}>
                <img className="workLeaderImg" name="headPhoto"
                     src={qst.acceptorURL?qst.acceptorURL:APIS.img_path+"/assets/crm/images/default_user_bak.png"}/>
                <span>{qst.acceptor}</span>
            </li>
        }.bind(this));

        var comment = workCommentList.map(function (qst, key) {
            return <li key={key}>
                <img className="workRightCommentImg"
                     src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"}
                     name="defaultPic"/>
                <div className="workRightCommentDiv">
                    <p className="workRightCommentName">{qst.commenter}</p>
                    <span className="workRightCommentTime">{qst.commentDate}</span>
                    <p className="workRightCommentShow">{qst.content}</p>
                </div>
            </li>
        }.bind(this));//minHeight:'640px',

        return (
            <div style={{ border:'solid 1px #dedede', backgroundColor:'#fff', minHeight:'425px', position:'relative'}}>
                <div className="workRight" style={{display: (detailStaus==0 && hideNoData? 'block' : 'none')}}>
                    <div className="workRightOne">
                        <p style={{fontSize:'16px'}}>
                            {listData.reportTypeText}&nbsp;&nbsp;
                            {listData.startTime} ~~ {listData.endTime}
                        </p>
                        {/*<div className="work-btn-group">
                            <a className="workRightOne_a" data-toggle="dropdown" href="javascript:void(0);"><i
                                className="fa fa-angle-down"></i></a>
                            <ul className="dropdown-menu dropdown-inverse workEdit-menu">
                                <li>
                                    <Link to={'/working/add/'+this.props.detailData.id}>
                                        编辑
                                    </Link>
                                </li>
                                <li><a href="javascript:void(0);" onClick={this.workEditSumit}>提交</a></li>
                                <li><a href="javascript:void(0);" onClick={this.workEditDelet}>删除</a></li>
                                <li className="divider"></li>
                            </ul>
                        </div>*/}
                        <span>{listData.createdName}</span>
                    </div>
                    <div className="dashboard-box" style={{marginTop:'-1px'}}>
                        <div className="box-tabbs">
                            <div className="tabbable">
                                <ul className="nav nav-tabs myTab"
                                    style={{borderLeft:'0px', borderRight:'0px'}}>
                                    <li className="active">
                                        <a data-toggle="tab" href="#customer-khxq">
                                            报告详情
                                        </a>
                                    </li>
                                    <div className="btn-group editdelBtn"
                                         style={{display: ((listData.createdBy == UserInfo.staffId()) ? 'block' : 'none'), right:'10px'}}>
                                        <a className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                            编辑 <i className="fa fa-angle-down"></i>
                                        </a>
                                        <ul className="dropdown-menu" style={{marginTop: 5+'px',minWidth: '65px'}}>
                                            <li>
                                                <Link to={'/working/edit/'+this.props.detailData.id}>
                                                    编辑
                                                </Link>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0);" onClick={this.workEditSumit}>提交</a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0);" onClick={this.workEditDelet}>删除</a>
                                            </li>
                                        </ul>
                                    </div>
                                </ul>{/* detail-left animated fadeInUp*/}
                                <div className="tab-content tabs-flat no-border">
                                    <div className="workRightTwo">
                                        <div className="workRightTitle">
                                            本{this.props.detailData.reportType == 0 ? '日' : ''}
                                            {this.props.detailData.reportType == 1 ? '周' : ''}
                                            {this.props.detailData.reportType == 2 ? '月' : ''}报告详情
                                        </div>
                                        <p>{listData.summary}
                                        </p>
                                    </div>
                                    <div className="workRightThree"
                                         style={{display:this.props.detailData.reportType==0 ? 'none':'block'}}>
                                        <div className="workRightTitle">下
                                            {this.props.detailData.reportType == 1 ? '周' : ''}
                                            {this.props.detailData.reportType == 2 ? '月' : ''}工作计划
                                        </div>
                                        <p>{listData.plan}
                                        </p>
                                    </div>
                                    <div className="workRightFour">
                                        <div className="workRightTitle">汇报对象</div>
                                        <ul>
                                            {imgs}
                                        </ul>
                                        <span className="saveTime">保存时间:{listData.createdOn}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="workRight" style={{display:(detailStaus==1 && hideNoData? 'block' : 'none')}}>
                    <div className="workRightOne no-border">
                        <p style={{fontSize:'16px'}}>{listData.reportTypeText}&nbsp;&nbsp;
                            {listData.startTime} ~~ {listData.endTime}</p>
                        <span>{listData.createdName}</span>
                    </div>

                    <div className="dashboard-box">
                        <div className="box-tabbs">
                            <div className="tabbable">
                                <ul className="nav nav-tabs myTab" style={{borderLeft:'0px', borderRight:'0px'}}>
                                    <li className="active">
                                        <a data-toggle="tab" href="#customer-khxq">
                                            报告详情
                                        </a>
                                    </li>
                                    <li>
                                        <a data-toggle="tab" href="#customer-qtxg">
                                            其他相关
                                        </a>
                                    </li>
                                    <li className="sayLi">
                                        <div className="conmmentDiv" style={{right:'10px'}}>
                                            <a href="javascript:void(0)" data-toggle="modal" data-target="#addNoteModal"
                                               className="saySomething">
                                                评论
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                                <div className="tab-content tabs-flat detail-left no-border">
                                    <div id="customer-khxq" className="animated fadeInUp tab-pane in active">

                                        <div className="workRightTwo">
                                            <div className="workRightTitle">
                                                本{this.props.detailData.reportType == 0 ? '日' : ''}
                                                {this.props.detailData.reportType == 1 ? '周' : ''}
                                                {this.props.detailData.reportType == 2 ? '月' : ''}报告详情
                                            </div>
                                            <p>{listData.summary}
                                            </p>
                                        </div>
                                        <div className="workRightThree"
                                             style={{display:this.props.detailData.reportType==0 ? 'none':'block'}}>
                                            <div className="workRightTitle">
                                                下{this.props.detailData.reportType == 1 ? '周' : ''}
                                                {this.props.detailData.reportType == 2 ? '月' : ''}工作计划
                                            </div>
                                            <p>{listData.plan}
                                            </p>
                                        </div>
                                        <div className="workRightFour">
                                            <div className="workRightTitle">汇报对象</div>
                                            <ul>
                                                {imgs}
                                            </ul>
                                            <span className="saveTime">保存时间:{listData.createdOn}</span>
                                        </div>

                                    </div>

                                    <div id="customer-qtxg" className="animated fadeInUp tab-pane">
                                        <div className="detail-tab3">

                                            <ul className="workRightCommentUl">
                                                {comment}
                                            </ul>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div className={this.state.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '31%', marginTop:'-2px', left:'50%', marginLeft:'-15px', position:'absolute'}}><div className='crmNoData'>暂无数据</div></div>
                <div className="container-fluid text-center">
                    <AddComment AddComment={this.AddComment}/>
                </div>
            </div>
        )
    }
});