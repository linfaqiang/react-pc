import React from 'react'
import AjaxRequest from '../core/common/ajaxRequest';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import {APIS} from '../core/common/config';
import NoticeList from './NoticeList';

module.exports = React.createClass({

    getInitialState: function () {
        return {
            messegeList: {},
            noRead: 0,
            param: {
                q: "",
                type: "",
                pageSize: 10,
                pageNo: 1
            }
        }
    },

    componentDidMount: function () {
        var self = this;
        self.renderNotice(self.state.param);
    },
    goBack: function () {
        history.back();
    },
    renderNotice: function (param) {
        var self = this;

        self.refs.noticeList.beginLoad(param.pageNo);
        AjaxRequest.get(APIS.message_list, param, function (res) {
            // var data = JSON.parse(Base64.decode(res.data));
            // res.data = data;

            var tmp = res;
            var n = 0;
            var list = res.data;
            for(var i=0; i<list.length; i++){
                var remaintime = getRemainTime(list[i].createdOn);
                list[i].remaintime = remaintime;
                if(list[i].isRead == 0){
                    n++;
                }
            }
            tmp.data = list;

            self.state.messegeList=tmp;
            self.setState({noRead: n});
            self.setState(self.state.messegeList);
            self.refs.noticeList.setPagerData(res)

        })

    },

    render: function () {
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params}/>
                <div className="page-body">
                    <div className="tongzhi-sy messegeListAll">
                        <div className="dashboard-box">
                            <div className="box-tabbs">
                                <div className="tabbable position-relative">
                                    <span className="right-fresh"
                                          onClick={this.renderNotice.bind(this,this.state.param)}><span
                                        className="fa fa-refresh"></span></span>
                                    <ul className="nav nav-tabs myTab" id="myTab11">
                                        <li onClick={this.goBack}>
                                            {/*<i className="glyphicon glyphicon-arrow-left messegeBack" />*/}
                                            <a className="btnBack"></a>
                                        </li>
                                        <li className="active">
                                            <a data-toggle="tab" href="#tongzhi">
                                                通知
                                            </a>
                                        </li>
                                        <li style={{minWidth: '20px'}}>
                                            <i className="redPoint">{this.state.noRead}</i>
                                            {/*<span className="noReadNum">{this.state.messegeList.noRead}</span>*/}
                                        </li>

                                    </ul>
                                    <div className="tab-content tabs-flat">
                                        <div id="tongzhi" className="animated fadeInUp tab-pane in active">
                                            <div className="detail-tab3">
                                                <div className="ppLi">
                                                    <NoticeList
                                                        ref="noticeList"
                                                        messegeList={this.state.messegeList}
                                                        getData={this.renderNotice}
                                                        trackData={this.state.param}/>
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
        )
    }
});