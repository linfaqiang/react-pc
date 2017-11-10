import React from 'react';
import Reflux from 'reflux';
import ReactMixin from 'react-mixin';
import SearchGroup from '../SearchBar/SearchGroup';
import NewData from '../SearchBar/NewData';
import {APIS} from '../../common/config';
import UpdatePassword from '../../../login/UpdatePassword';
import UserInfo from '../../common/UserInfo.js';
import Tools from '../../common/tools.js';

module.exports = React.createClass({

    getInitialState: function() {
        return {
            userName: ''
        }
    },

    loginOut: function() {
        var self = this;
        $.ajax({
            "url": APIS.logout,
            "type": 'get',
            "data": '',
            "contentType": "application/json",
            success: function(retData) {
                alert("退出成功！");

                localStorage.removeItem('loginInfo_crm');
                self.setState({
                    userName: ''
                });
                window.location.href = '#login';
            },
            error: function() {
                alert('登录失败!');
            }
        });
    },
    componentDidMount: function() {
        var login_data = localStorage.getItem('loginInfo_crm');
        if (login_data) {
            login_data = JSON.parse(login_data);
        }

        if (login_data && login_data.name) {
            this.setState({
                userName: login_data.name
            })
        }
        Tools.imgLoadError();
    },
    clearInputValue: function() {
        this.refs.updatePassword.clearValue();
    },

    render: function() {
        var userInfo = UserInfo.get();
        var name = "";
        var title = "";
        var headPhotoUrl = "";
        if(userInfo){
            name = userInfo.name;
            title = userInfo.title;
            headPhotoUrl = userInfo.headPhotoUrl;
        }

        return (
            <div>
                <div className="myNav">
                    <div className="left_part">
                        <div className="logoBox">
                            <a href="#"></a>
                        </div>
                        <div id="sidebar-collapse" className="btnBlock">
                            <i className="collapse-icon fa fa-bars"></i>
                        </div>
                        <SearchGroup></SearchGroup>
                    </div>
                    <div className="right_part">
                        <NewData></NewData>
                        <div className="btnBlock">
                            <a href={APIS.crm_mxm} target="view_window">
                                <i className="icon fa pcicon pcicon-setting"></i>
                            </a>
                        </div>
                        <div className="userInfoBox">
                            <div className="dropdown-toggle" data-toggle="dropdown">
                                <div className="user_post">
                                    <span className="databox-header carbon no-margin">{name}</span>
                                    <span className="databox-text lightcarbon no-margin">{title}</span>
                                </div>
                                <div className="headImg">
                                    <img src={headPhotoUrl?headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user_bak.png"} name="headPhoto" style={{width:'40px', height:'40px'}}
                                         className="image-circular bordered-1 bordered-darkgray"/>
                                </div>
                            </div>
                            <ul className="pull-right dropdown-menu dropdown-login-area loginBox">
                                <li>
                                    <a href="javascript:void(0)" onClick={this.clearInputValue} className="pull-right" data-target="#updatePasswordModal" data-toggle="modal">修改密码</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" className="pull-right" onClick={this.loginOut}>退出</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
                <div className="container-fluid text-center">
                <UpdatePassword ref="updatePassword"/>
                </div>
            </div>
        )
    }

})