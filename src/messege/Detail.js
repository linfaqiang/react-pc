import React from 'react'
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition';

module.exports = React.createClass({

    getInitialState: function () {
        return {}
    },

    componentDidMount: function () {

    },
    goBack: function () {
        history.back();
    },

    render: function () {
        var self = this,
            msgContent = JSON.parse(self.props.location.query.messageAll);
        var msgType = msgContent.messageType,
            titile = msgContent.title,
            time = msgContent.createdOn,
            show = msgContent.content;
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params}/>
                <div className="page-body">
                    <div className="row">

                        <div className="tongzhi-sy messegeDetailAll">
                            <div className="dashboard-box">
                                <div className="box-tabbs">
                                    <div className="tabbable position-relative">
                                        <ul className="nav nav-tabs myTab" id="myTab11">
                                            <li>
                                                <a className="btnBack" onClick={this.goBack}></a>
                                            </li>
                                            {/*<li className="btnBack" onClick={this.goBack}>
                                                <i className="glyphicon glyphicon-arrow-left messegeBack"/>
                                            </li>*/}
                                            <li className="active">
                                                <a data-toggle="tab" href="#tongzhi">
                                                    {msgType == 0 ? '消息详情' : '公告详情'}
                                                </a>
                                            </li>

                                        </ul>
                                        <div className="tab-content tabs-flat messegeDetail">
                                            <h2>{titile}</h2>
                                            <p>发送时间:<span>{time}</span></p>
                                            <div className="messegeContent">
                                                <p>{show}</p>
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